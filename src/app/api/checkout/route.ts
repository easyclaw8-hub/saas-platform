import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  const supabase = getServiceSupabase();

  // Get or create user settings
  const { data: settings } = await supabase
    .from("user_settings")
    .select("stripe_customer_id")
    .eq("clerk_user_id", userId)
    .single();

  let customerId = settings?.stripe_customer_id;

  // Create Stripe customer if needed
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { clerk_user_id: userId },
    });
    customerId = customer.id;

    if (settings) {
      await supabase
        .from("user_settings")
        .update({ stripe_customer_id: customerId })
        .eq("clerk_user_id", userId);
    } else {
      await supabase
        .from("user_settings")
        .insert({ clerk_user_id: userId, stripe_customer_id: customerId });
    }
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price: process.env.STRIPE_CREDITS_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      clerk_user_id: userId,
      credits: "1000",
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?purchased=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
