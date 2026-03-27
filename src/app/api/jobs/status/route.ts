import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getStatus } from "@/lib/video-server";
import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = "/Users/claweasy/hk-news-pipeline/output/youtube";
const THUMB_DIR = "/Users/claweasy/hk-news-pipeline/thumbnails";
const PROD_DIR = "/Users/claweasy/hk-news-pipeline/productions";

// Find the latest video file created after a given timestamp
function findLatestVideo(afterTime: Date): string | null {
  if (!existsSync(OUTPUT_DIR)) return null;
  const files = readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .map((f) => ({ name: f, path: join(OUTPUT_DIR, f), mtime: statSync(join(OUTPUT_DIR, f)).mtime }))
    .filter((f) => f.mtime > afterTime)
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  return files.length > 0 ? files[0].path : null;
}

// Find the latest thumbnail created after a given timestamp
function findLatestThumbnail(afterTime: Date): string | null {
  if (!existsSync(THUMB_DIR)) return null;
  const files = readdirSync(THUMB_DIR)
    .filter((f) => f.endsWith("_thumb.jpg"))
    .map((f) => ({ name: f, path: join(THUMB_DIR, f), mtime: statSync(join(THUMB_DIR, f)).mtime }))
    .filter((f) => f.mtime > afterTime)
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  return files.length > 0 ? files[0].path : null;
}

// Find the latest SRT file
function findLatestSRT(afterTime: Date): string | null {
  if (!existsSync(PROD_DIR)) return null;
  try {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const todayDir = join(PROD_DIR, today);
    if (!existsSync(todayDir)) return null;

    const subDirs = readdirSync(todayDir)
      .map((d) => join(todayDir, d))
      .filter((d) => statSync(d).isDirectory())
      .sort((a, b) => statSync(b).mtime.getTime() - statSync(a).mtime.getTime());

    for (const dir of subDirs) {
      const tempDir = join(dir, "temp");
      if (!existsSync(tempDir)) continue;
      const srts = readdirSync(tempDir)
        .filter((f) => f.endsWith(".srt"))
        .map((f) => join(tempDir, f))
        .filter((f) => statSync(f).mtime > afterTime);
      if (srts.length > 0) return srts[0];
    }
  } catch { /* ignore */ }
  return null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("clerk_user_id", userId)
    .eq("status", "processing")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!job) {
    return NextResponse.json({ status: "no_active_job" });
  }

  const serverStatus = await getStatus();
  const jobCreatedAt = new Date(job.created_at);

  if (serverStatus.complete) {
    // Find files created AFTER this job was submitted
    const videoPath = findLatestVideo(jobCreatedAt);
    const thumbnailPath = findLatestThumbnail(jobCreatedAt);
    const srtPath = findLatestSRT(jobCreatedAt);

    await supabase
      .from("jobs")
      .update({
        status: "completed",
        video_path: videoPath,
        thumbnail_path: thumbnailPath,
        srt_path: srtPath,
        youtube_url: serverStatus.youtube_uploaded ? "uploaded" : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    return NextResponse.json({
      status: "completed",
      job: { ...job, status: "completed", video_path: videoPath },
      serverStatus,
    });
  }

  if (!serverStatus.pipeline_running && !serverStatus.complete) {
    await supabase
      .from("jobs")
      .update({
        status: "failed",
        error: serverStatus.tail || "Pipeline stopped unexpectedly",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    return NextResponse.json({
      status: "failed",
      job: { ...job, status: "failed" },
      serverStatus,
    });
  }

  return NextResponse.json({
    status: "processing",
    job,
    serverStatus,
  });
}
