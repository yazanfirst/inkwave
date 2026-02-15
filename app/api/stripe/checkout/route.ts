import { couponRepo, productRepo, settingsRepo } from '@/lib/data/repos';
import { buildCheckoutDetails, createCheckoutDigest, type CheckoutInputItem } from '@/lib/checkout';
import { getStripeClient } from '@/lib/payment/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const stripe = getStripeClient();
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
  const { items, shippingMethod, couponCode, successUrl, cancelUrl } = await req.json();

  const [products, settings, coupons] = await Promise.all([productRepo.list(), settingsRepo.get(), couponRepo.list()]);
  const checkout = buildCheckoutDetails({
    items: Array.isArray(items) ? (items as CheckoutInputItem[]) : [],
    shippingMethod,
    couponCode,
    products,
    settings,
    coupons
  });

  if (!checkout) return NextResponse.json({ error: 'No valid items' }, { status: 400 });

  const orderDigest = createCheckoutDigest({
    items: checkout.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      qty: item.qty,
      unitPrice: item.unitPrice
    })),
    shipping: checkout.shipping,
    couponCode,
    total: checkout.total
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: checkout.items.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: 'usd',
        product_data: { name: `${item.productTitle} (${item.variantLabel})` },
        unit_amount: Math.round(item.unitPrice * 100)
      }
    })),
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { orderDigest }
  });
  return NextResponse.json({ id: session.id, url: session.url });
}
