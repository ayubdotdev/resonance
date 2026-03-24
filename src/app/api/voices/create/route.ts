import { auth } from "@clerk/nextjs/server";
import { parseBuffer } from "music-metadata";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { uploadAudio } from "@/lib/r2";
import { VOICE_CATEGORIES } from "@/features/voices/data/voice-categories";
import type { VoiceCategory } from "@/generated/prisma/client";
import { polar } from "@/lib/polar";

const createVoiceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.enum(VOICE_CATEGORIES as [VoiceCategory, ...VoiceCategory[]]),
    description: z.string().nullish(),
    language: z.string().min(1, "Language is required"),
})

const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MIN_AUDIO_DURATION_SECONDS = 10;


export async function POST(request: Request) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const customerState = await polar.customers.getStateExternal({
            externalId: orgId,
        });
        const hasActiveSubscription =
            (customerState.activeSubscriptions ?? []).length > 0;
        if (!hasActiveSubscription) {
            return Response.json({ error: "SUBSCRIPTION_REQUIRED" }, { status: 403 });
        }
    } catch {
        // Customer doesn't exist in Polar yet -> no subscription
        return Response.json({ error: "SUBSCRIPTION_REQUIRED" }, { status: 403 });
    }


    const url = new URL(request.url);

    const validation = createVoiceSchema.safeParse({
        name: url.searchParams.get("name"),
        category: url.searchParams.get("category"),
        description: url.searchParams.get("description"),
        language: url.searchParams.get("language"),
    })

    if (!validation.success) {
        return Response.json({
            error: "Invalid input",
        },
            {
                status: 400
            });
    }

    const { name, category, description, language } = validation.data;

    // buffer 
    const fileBuffer = await request.arrayBuffer();
    if (!fileBuffer.byteLength) {
        return Response.json({
            error: "No file uploaded"
        }, {
            status: 400
        })
    }
    if (fileBuffer.byteLength > MAX_UPLOAD_SIZE_BYTES) {
        return Response.json({
            error: "File size exceeds the maximum limit of 20 MB"
        }, {
            status: 400
        })
    }


    const contentType = request.headers.get("content-type");

    if (!contentType) {
        return Response.json(
            { error: "Missing Content-Type header" },
            { status: 400 },
        );
    }

    const normalizedContentType =
        contentType.split(";")[0]?.trim() || "audio/wav";

    // Validate audio format and duration
    let duration: number;
    try {
        const metadata = await parseBuffer(
            new Uint8Array(fileBuffer),
            { mimeType: normalizedContentType },
            { duration: true },
        );
        duration = metadata.format.duration ?? 0;
    } catch {
        return Response.json(
            { error: "File is not a valid audio file" },
            { status: 422 },
        );
    }

    if (duration < MIN_AUDIO_DURATION_SECONDS) {
        return Response.json(
            {
                error: `Audio too short (${duration.toFixed(1)}s). Minimum duration is ${MIN_AUDIO_DURATION_SECONDS} seconds.`,
            },
            { status: 422 },
        );
    }
    let createdVoiceId: string | null = null;
    try {
        const voice = await prisma.voice.create({
            data: {
                name,
                category,
                description,
                language,
                orgId,
                variant: "CUSTOM"
            },
            select: {
                id: true
            }
        })
        createdVoiceId = voice.id;
        const r2ObjectKey = `voices/orgs/${orgId}/${voice.id}`;

        await uploadAudio({
            buffer: Buffer.from(fileBuffer),
            key: r2ObjectKey,
            contentType: normalizedContentType,
        });

        await prisma.voice.update({
            where: {
                id: voice.id
            },
            data: {
                r2ObjectKey
            }
        })

    } catch {
        if (createdVoiceId) {
            await prisma.voice.delete({
                where: {
                    id: createdVoiceId
                }
            })
                .catch(() => { })
        }
        return Response.json({
            error: "Failed to create voice. Please try again."
        }, {
            status: 500
        })
    }

    polar.events
        .ingest({
            events:[
                {
                    name: "voice_creation",
                    externalCustomerId: orgId,
                    metadata:{},
                    timestamp: new Date(),
                }
            ]
        })
        .catch(() => { });
    return Response.json({ name, message: "Voice created successfully", }, { status: 201 }
    )
}