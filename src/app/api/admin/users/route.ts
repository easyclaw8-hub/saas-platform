import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["easyclaw8@gmail.com"];

async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress || "";
  return ADMIN_EMAILS.includes(email);
}

// GET all users
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getServiceSupabase();
  const { data: users, error } = await supabase
    .from("user_settings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich with Clerk emails for users missing email
  const clerk = await clerkClient();
  for (const u of users || []) {
    if (!u.email && u.clerk_user_id) {
      try {
        const clerkUser = await clerk.users.getUser(u.clerk_user_id);
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
        if (email) {
          u.email = email;
          // Save email to Supabase for next time
          await supabase
            .from("user_settings")
            .update({ email })
            .eq("clerk_user_id", u.clerk_user_id);
        }
      } catch {
        // ignore - user may not exist in Clerk
      }
    }
  }

  // Also get job counts per user
  const { data: jobs } = await supabase
    .from("jobs")
    .select("clerk_user_id, status");

  const jobCounts: Record<string, { total: number; completed: number }> = {};
  for (const job of jobs || []) {
    if (!jobCounts[job.clerk_user_id]) {
      jobCounts[job.clerk_user_id] = { total: 0, completed: 0 };
    }
    jobCounts[job.clerk_user_id].total++;
    if (job.status === "completed") jobCounts[job.clerk_user_id].completed++;
  }

  return NextResponse.json({ users, jobCounts });
}

// PATCH update user credits/plan
export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { clerkUserId, credits, plan, addCredits } = body;

  if (!clerkUserId) {
    return NextResponse.json({ error: "Missing clerkUserId" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  if (addCredits !== undefined) {
    // Add/subtract credits
    const { data: current } = await supabase
      .from("user_settings")
      .select("credits")
      .eq("clerk_user_id", clerkUserId)
      .single();

    const newCredits = Math.max(0, (current?.credits || 0) + addCredits);
    await supabase
      .from("user_settings")
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq("clerk_user_id", clerkUserId);

    return NextResponse.json({ success: true, credits: newCredits });
  }

  // Update specific fields
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (credits !== undefined) updates.credits = credits;
  if (plan !== undefined) updates.plan = plan;

  await supabase
    .from("user_settings")
    .update(updates)
    .eq("clerk_user_id", clerkUserId);

  return NextResponse.json({ success: true });
}
