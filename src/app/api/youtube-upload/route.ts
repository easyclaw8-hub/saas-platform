import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { existsSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

const PIPELINE_BASE = "/Users/claweasy/hk-news-pipeline";
const VENV_PYTHON = join(PIPELINE_BASE, "venv/bin/python3");
const UPLOAD_SCRIPT = join(PIPELINE_BASE, "scripts/yt_upload.py");

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { jobId, privacy = "public" } = body;

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (!job || job.clerk_user_id !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (job.status !== "completed") {
    return NextResponse.json({ error: "影片未完成生成" }, { status: 400 });
  }

  if (!job.video_path || !existsSync(job.video_path)) {
    return NextResponse.json({ error: "影片檔案未找到" }, { status: 404 });
  }

  // Build meta.json for yt_upload.py
  const meta = {
    title: job.video_title || job.topics?.join(" | ") || "News",
    videoTitle: job.video_title || job.topics?.join(" | ") || "News",
    description: job.description || "",
    tags: job.tags || "",
    thumbnail: job.thumbnail_path || "",
    srt_path: job.srt_path || "",
    timeline: job.timeline || "",
  };

  const metaPath = join(PIPELINE_BASE, "temp", `saas_upload_${jobId}.json`);
  writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");

  try {
    const result = execSync(
      `${VENV_PYTHON} "${UPLOAD_SCRIPT}" "${job.video_path}" "${metaPath}" "${privacy}"`,
      {
        cwd: PIPELINE_BASE,
        timeout: 300000, // 5 min
        encoding: "utf-8",
        env: { ...process.env, HOME: "/Users/claweasy" },
      }
    );

    // Check if upload succeeded
    const videoIdMatch = result.match(/Done!\s*\((\w+)\)/);
    const uploaded = result.includes("Done!");

    if (uploaded) {
      await supabase
        .from("jobs")
        .update({
          youtube_url: "uploaded",
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);

      return NextResponse.json({
        success: true,
        message: "影片已上傳到 YouTube！",
        privacy,
        output: result.substring(0, 500),
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "上傳失敗",
        output: result.substring(0, 500),
      }, { status: 500 });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "YouTube 上傳失敗";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
