import "server-only";

import { getStorageBucketName, supabaseAdmin } from "./supabase";

type UploadAudioOptions = {
    buffer: Buffer,
    key: string,
    contentType?: string
}

function getStorageErrorMessage(action: string, key: string, message: string) {
    return `Failed to ${action} storage object \"${key}\": ${message}`;
}

export async function uploadAudio({
    buffer,
    key,
    contentType
}: UploadAudioOptions): Promise<void> {
    const { error } = await supabaseAdmin.storage
        .from(getStorageBucketName())
        .upload(key, buffer, {
            contentType,
            upsert: true,
        });

    if (error) {
        throw new Error(getStorageErrorMessage("upload", key, error.message));
    }
}

export async function deleteAudio(key: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
        .from(getStorageBucketName())
        .remove([key]);

    if (error) {
        throw new Error(getStorageErrorMessage("delete", key, error.message));
    }
}

export async function getSignedAudioUrl(key: string): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
        .from(getStorageBucketName())
        .createSignedUrl(key, 3600);

    if (error || !data?.signedUrl) {
        throw new Error(
            getStorageErrorMessage(
                "create a signed URL for",
                key,
                error?.message ?? "Signed URL was not returned",
            ),
        );
    }

    return data.signedUrl;
};