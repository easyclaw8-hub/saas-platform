import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { getHealth } from "@/lib/video-server";
import { runPipeline } from "@/lib/pipeline";
import { DURATION_CREDITS } from "@/lib/stripe";

export const maxDuration = 300; // 5 minutes max for pipeline

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const body = await req.json();
  const { topics, language, voice, duration } = body;

  // Calculate credits needed
  const creditsNeeded = DURATION_CREDITS[duration as number] || 250;

  // Check video server health
  const health = await getHealth();
  if (health.pipeline_running) {
    return NextResponse.json(
      { error: "影片伺服器正忙，請稍後再試" },
      { status: 503 }
    );
  }

  // Get or create user settings
  let { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (!settings) {
    const { data: newSettings } = await supabase
      .from("user_settings")
      .insert({ clerk_user_id: userId })
      .select()
      .single();
    settings = newSettings;
  }

  // Check credits
  const currentCredits = settings?.credits || 0;
  if (currentCredits < creditsNeeded) {
    return NextResponse.json(
      { error: `Credits 不足！需要 ${creditsNeeded} credits，你剩餘 ${currentCredits} credits。請先購買 credits。` },
      { status: 403 }
    );
  }

  // Create job record
  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      clerk_user_id: userId,
      status: "processing",
      topics,
      language,
      voice,
      duration,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Deduct credits
  await supabase
    .from("user_settings")
    .update({
      credits: currentCredits - creditsNeeded,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId);

  // Run pipeline synchronously (wait for completion)
  try {
    const result = await runPipeline({ topics, language, voice, duration });

    const jobStatus = result.serverResponse.status === "started" ? "processing" : "failed";

    // If failed, refund credits
    if (jobStatus === "failed") {
      await supabase
        .from("user_settings")
        .update({
          credits: currentCredits, // restore original
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId);
    }

    await supabase
      .from("jobs")
      .update({
        status: jobStatus,
        video_title: result.videoTitle,
        description: result.description,
        tags: result.tags,
        timeline: result.timeline,
        error: jobStatus === "failed" ? result.serverResponse.message : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job!.id);

    return NextResponse.json({
      job: { ...job, status: jobStatus },
      videoTitle: result.videoTitle,
      creditsUsed: creditsNeeded,
      creditsRemaining: jobStatus === "failed" ? currentCredits : currentCredits - creditsNeeded,
      message: jobStatus === "processing"
        ? "Pipeline 完成！影片正在 render..."
        : result.serverResponse.message,
    });
  } catch (err) {
    // Refund credits on error
    await supabase
      .from("user_settings")
      .update({
        credits: currentCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_user_id", userId);

    const errorMsg = err instanceof Error ? err.message : "Pipeline 執行失敗";
    await supabase
      .from("jobs")
      .update({
        status: "failed",
        error: errorMsg,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job!.id);

    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also return user credits
  const { data: settings } = await supabase
    .from("user_settings")
    .select("credits")
    .eq("clerk_user_id", userId)
    .single();

  return NextResponse.json({ jobs, credits: settings?.credits || 0 });
}
