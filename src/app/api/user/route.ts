import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "VM-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// GET or create user settings (called on dashboard load)
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const url = new URL(req.url);
  const refCode = url.searchParams.get("ref");

  let { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (!settings) {
    // New user! Get email from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";

    // Generate unique referral code
    const referralCode = generateReferralCode();

    // Start with 300 welcome credits
    let welcomeCredits = 300;

    // Check referral code
    let referredBy: string | null = null;
    if (refCode) {
      const { data: referrer } = await supabase
        .from("user_settings")
        .select("clerk_user_id, credits")
        .eq("referral_code", refCode)
        .single();

      if (referrer) {
        referredBy = refCode;
        welcomeCredits += 200; // Extra 200 for using referral

        // Give referrer 200 credits too
        await supabase
          .from("user_settings")
          .update({
            credits: (referrer.credits || 0) + 200,
            updated_at: new Date().toISOString(),
          })
          .eq("clerk_user_id", referrer.clerk_user_id);
      }
    }

    const { data: newSettings } = await supabase
      .from("user_settings")
      .insert({
        clerk_user_id: userId,
        email,
        credits: welcomeCredits,
        referral_code: referralCode,
        referred_by: referredBy,
      })
      .select()
      .single();

    settings = newSettings;
  }

  return NextResponse.json({ settings });
}
