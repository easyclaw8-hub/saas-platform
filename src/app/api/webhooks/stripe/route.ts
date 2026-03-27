import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Handle both one-time and subscription checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerk_user_id;
    const creditsToAdd = parseInt(session.metadata?.credits || "1000", 10);

    if (clerkUserId) {
      const { data: settings } = await supabase
        .from("user_settings")
        .select("credits, stripe_customer_id")
        .eq("clerk_user_id", clerkUserId)
        .single();

      const currentCredits = settings?.credits || 0;

      await supabase
        .from("user_settings")
        .update({
          credits: currentCredits + creditsToAdd,
          stripe_customer_id: session.customer as string || settings?.stripe_customer_id,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", clerkUserId);

      console.log(`Added ${creditsToAdd} credits to user ${clerkUserId}. Total: ${currentCredits + creditsToAdd}`);
    }
  }

  // Handle recurring invoice payment (monthly subscription renewal)
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    // Only add credits for recurring payments, not the first one (handled by checkout.session.completed)
    if (invoice.billing_reason === "subscription_cycle") {
      const customerId = invoice.customer as string;

      const { data: settings } = await supabase
        .from("user_settings")
        .select("credits, clerk_user_id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (settings) {
        const currentCredits = settings.credits || 0;
        await supabase
          .from("user_settings")
          .update({
            credits: currentCredits + 1000,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        console.log(`Monthly renewal: Added 1000 credits to user ${settings.clerk_user_id}. Total: ${currentCredits + 1000}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
