import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { getStorageBucketName, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function errorResponse(step: string, key: string, message: string, status = 500) {
  return NextResponse.json(
    {
      ok: false,
      provider: "supabase-storage",
      bucket: getStorageBucketName(),
      key,
      step,
      error: message,
    },
    { status },
  );
}

export async function GET() {
  const bucket = getStorageBucketName();
  const key = `healthchecks/${randomUUID()}.txt`;
  const payload = `supabase-storage-ok:${new Date().toISOString()}`;

  const uploadResult = await supabaseAdmin.storage.from(bucket).upload(
    key,
    Buffer.from(payload, "utf8"),
    {
      contentType: "text/plain; charset=utf-8",
      upsert: true,
    },
  );

  if (uploadResult.error) {
    return errorResponse("upload", key, uploadResult.error.message);
  }

  const signedUrlResult = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(key, 60);

  if (signedUrlResult.error || !signedUrlResult.data?.signedUrl) {
    await supabaseAdmin.storage.from(bucket).remove([key]);

    return errorResponse(
      "createSignedUrl",
      key,
      signedUrlResult.error?.message ?? "Signed URL was not returned",
    );
  }

  const downloadResult = await supabaseAdmin.storage.from(bucket).download(key);

  if (downloadResult.error || !downloadResult.data) {
    await supabaseAdmin.storage.from(bucket).remove([key]);

    return errorResponse(
      "download",
      key,
      downloadResult.error?.message ?? "Download payload was not returned",
    );
  }

  const downloadedPayload = Buffer.from(
    await downloadResult.data.arrayBuffer(),
  ).toString("utf8");

  if (downloadedPayload !== payload) {
    await supabaseAdmin.storage.from(bucket).remove([key]);

    return errorResponse(
      "verify",
      key,
      "Downloaded payload did not match the uploaded payload",
    );
  }

  const deleteResult = await supabaseAdmin.storage.from(bucket).remove([key]);

  if (deleteResult.error) {
    return errorResponse("delete", key, deleteResult.error.message);
  }

  return NextResponse.json({
    ok: true,
    provider: "supabase-storage",
    bucket,
    key,
    checks: {
      upload: true,
      signedUrl: true,
      download: true,
      delete: true,
    },
    testedAt: new Date().toISOString(),
  });
}