import { prisma } from "@/lib/db";
import { getSignedAudioUrl } from "@/lib/r2";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ voiceId: string }> }
) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { voiceId } = await params;

    const voice = await prisma.voice.findUnique({
        where: {
            id: voiceId
        },
        select: {
            variant: true,
            orgId: true,
            r2ObjectKey: true
        }
    })

    if (!voice) {
        return new Response("Voice not found", { status: 404 });
    }
    if (voice.variant === "CUSTOM" && voice.orgId !== orgId) {
        return new Response("Not found", { status: 404 });
    }
    if (!voice.r2ObjectKey) {
        return new Response("Voice audio not found", { status: 404 });
    }
    // now we can return the signed url for the voice audio
    const signedUrl = await getSignedAudioUrl(voice.r2ObjectKey);
    const audioResponse = await fetch(signedUrl);
    if (!audioResponse.ok) {
        return new Response("Failed to fetch voice audio", { status: 500 });
    }

    const contentType =
        audioResponse.headers.get("content-type") || "audio/wav";

    return new Response(audioResponse.body, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control":
                voice.variant === "SYSTEM"
                    ? "public, max-age=86400"
                    : "private, max-age=3600",
        },
    });
};