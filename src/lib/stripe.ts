import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

// Plans
export const PLANS = {
  onetime: { name: "單次購買", price: 10, credits: 800 },
  starter: { name: "Starter", price: 20, credits: 2500 },
  business: { name: "Business", price: 50, credits: 7500 },
};

// Welcome bonus
export const WELCOME_CREDITS = 300;
export const REFERRAL_CREDITS = 200;

// Credits per video duration
export const DURATION_CREDITS: Record<number, number> = {
  5: 200,
  10: 250,
  15: 300,
};
