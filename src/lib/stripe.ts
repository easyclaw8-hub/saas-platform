import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

// Credits system
export const CREDITS_PRICE = 10; // $10 USD
export const CREDITS_AMOUNT = 1000; // per purchase

export const DURATION_CREDITS: Record<number, number> = {
  5: 200,
  10: 250,
  15: 300,
};
