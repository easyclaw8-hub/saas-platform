import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { readFileSync, statSync, existsSync, openSync, readSync, closeSync } from "fs";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data: job } = await supabase
    .from("jobs")
    .select("video_path, clerk_user_id")
    .eq("id", jobId)
    .single();

  if (!job || job.clerk_user_id !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!job.video_path || !existsSync(job.video_path)) {
    return NextResponse.json({ error: "影片檔案未找到" }, { status: 404 });
  }

  const stat = statSync(job.video_path);
  const fileSize = stat.size;
  const range = req.headers.get("range");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const buffer = Buffer.alloc(chunkSize);
    const fd = openSync(job.video_path, "r");
    readSync(fd, buffer, 0, chunkSize, start);
    closeSync(fd);

    return new Response(buffer, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunkSize),
        "Content-Type": "video/mp4",
      },
    });
  }

  const buffer = readFileSync(job.video_path);
  return new Response(buffer, {
    headers: {
      "Content-Length": String(fileSize),
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="video.mp4"`,
    },
  });
}
