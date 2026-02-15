import { getStripeClient } from '@/lib/payment/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const stripe = getStripeClient();
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
  const { items, successUrl, cancelUrl } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items,
    success_url: successUrl,
    cancel_url: cancelUrl
  });
  return NextResponse.json({ id: session.id, url: session.url });
}
