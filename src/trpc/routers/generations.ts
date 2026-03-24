import * as Sentry from "@sentry/node";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { chatterbox } from "@/lib/chatterbox-client";
import { prisma } from "@/lib/db";
import { uploadAudio } from "@/lib/r2";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { createTRPCRouter, orgProcedure } from "../init";
import { polar } from "@/lib/polar";

export const generationsRouter = createTRPCRouter({

    //omit
    // 1. 🔐 Security
    // Hide private fields (orgId, storage keys, tokens)
    // 2. 🚀 Cleaner API response
    // Only send what frontend needs
    // 3. 📉 Reduce data transfer
    // Smaller payload
    getById: orgProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const generation = await prisma.generation.findUnique({
                where: {
                    id: input.id,
                    orgId: ctx.orgId
                },
                omit: {
                    orgId: true,
                    r2objectKey: true
                }
            })
            if (!generation) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            return {
                ...generation,
                audioUrl: `/api/audio/${generation.id}`
            }
        }),
    getAll: orgProcedure.query(async ({ ctx }) => {
        const generation = await prisma.generation.findMany({
            where: {
                orgId: ctx.orgId
            },
            orderBy: { createdAt: "desc" },
            omit: {
                orgId: true,
                r2objectKey: true
            }
        })
        return generation
    }),

    create: orgProcedure
        .input(
            z.object({
                text: z.string().min(1).max(TEXT_MAX_LENGTH),
                voiceId: z.string().min(1),
                temperature: z.number().min(0).max(2).default(0.8),
                topP: z.number().min(0).max(1).default(0.95),
                topK: z.number().min(1).max(10000).default(1000),
                repetitionPenalty: z.number().min(1).max(2).default(1.2),
            })
        )
        .mutation(async ({ input, ctx }) => {

            try {
                const customerState = await polar.customers.getStateExternal({
                    externalId: ctx.orgId,
                })

                const hasActiveSubscription = (customerState.activeSubscriptions ?? []).length > 0;
                if (!hasActiveSubscription) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "SUBSCRIPTION_REQUIRED"
                    })
                }
            } catch (err) {
                if (err instanceof TRPCError) throw err;
                // customer dont exist in polar
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "SUBSCRIPTION_REQUIRED"
                })
            }
            const voice = await prisma.voice.findUnique({
                where: {
                    id: input.voiceId,
                    OR: [
                        { variant: "SYSTEM" },
                        { variant: "CUSTOM", orgId: ctx.orgId }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    r2ObjectKey: true
                }
            })

            if (!voice) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Voice not found",
                });
            }

            if (!voice.r2ObjectKey) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "Voice audio not available",
                });
            }

            const { data, error, response } = await chatterbox.POST("/generate", {
                body: {
                    prompt: input.text,
                    voice_key: voice.r2ObjectKey,
                    temperature: input.temperature,
                    top_p: input.topP,
                    top_k: input.topK,
                    repetition_penalty: input.repetitionPenalty,
                    norm_loudness: true
                },
                // we expect an array buffer back from chatterbox, which we will then upload to R2
                parseAs: "arrayBuffer"
            })

            Sentry.logger.info("Generation started", {
                orgId: ctx.orgId,
                voiceId: input.voiceId,
                textLength: input.text.length,
            })

            if (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate audio",
                });
            }

            const contentType = response.headers.get("content-type") ?? "";
            if (!contentType.toLowerCase().includes("audio/wav")) {
                let details = `Unexpected content-type from TTS service: ${contentType || "<missing>"}`;
                if (data instanceof ArrayBuffer) {
                    const preview = Buffer.from(data).toString("utf-8", 0, 200).trim();
                    if (preview) {
                        details += `. Response preview: ${preview}`;
                    }
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: details,
                });
            }

            // validate that data is an array buffer
            if (!(data instanceof ArrayBuffer)) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Invalid audio response",
                });
            }


            // convert array buffer to buffer because that's what R2 client expects
            const buffer = Buffer.from(data);
            // generate a unique id for this generation because we need to reference it in the database and for the audio url
            let generationId: string | null = null;
            let r2ObjectKey: string | null = null;

            try {
                // create a database record for this generation so we have an id to reference in the audio url and R2 object key
                const generation = await prisma.generation.create({
                    data: {
                        orgId: ctx.orgId,
                        voiceName: voice.name,
                        voiceId: voice.id,
                        text: input.text,
                        temperature: input.temperature,
                        topP: input.topP,
                        topK: input.topK,
                        repetitionPenalty: input.repetitionPenalty,
                    },
                    select: {
                        id: true
                    }
                })

                generationId = generation.id;
                r2ObjectKey = `generations/orgs/${ctx.orgId}/${generation.id}`;

                // upload the audio to R2 with the generated id as the key so we can reference it later when we want to play the audio or delete it
                await uploadAudio({
                    buffer,
                    key: r2ObjectKey,
                    contentType: "audio/wav",
                });

                await prisma.generation.update({
                    where: {
                        id: generation.id
                    },
                    data: {
                        r2objectKey: r2ObjectKey
                    }
                })

                Sentry.logger.info("Audio generated", {
                    orgId: ctx.orgId,
                    generationId: generation.id
                })
            } catch {
                if (generationId) {
                    await prisma.generation
                        .delete({
                            where: {
                                id: generationId,
                            },
                        })
                        .catch(() => { });
                }
                Sentry.logger.error("Failed to store generated audio", {
                    orgId: ctx.orgId,
                    voiceId: input.voiceId,
                })
            }

            if (!generationId || !r2ObjectKey) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to store generated audio",
                });
            }
            polar.events
                .ingest({
                    events: [
                    {
                        name: "tts_generations",
                        externalCustomerId: ctx.orgId,
                        metadata: { characters: input.text.length },
                        timestamp: new Date(),
                    }
                ]
            })
                .catch(() => { });



            return {
                id: generationId,
            }
        })

})