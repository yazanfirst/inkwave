import { couponRepo, orderRepo, productRepo, settingsRepo } from '@/lib/data/repos';
import { getFulfillmentProvider } from '@/lib/fulfillment/providers';
import { buildCheckoutDetails, createCheckoutDigest, type CheckoutInputItem } from '@/lib/checkout';
import { getStripeClient } from '@/lib/payment/stripe';
import { money, uid } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const [products, settings, coupons] = await Promise.all([productRepo.list(), settingsRepo.get(), couponRepo.list()]);

  const checkout = buildCheckoutDetails({
    items: Array.isArray(body.items) ? (body.items as CheckoutInputItem[]) : [],
    shippingMethod: body.shippingMethod,
    couponCode: body.couponCode,
    products,
    settings,
    coupons
  });

  if (!checkout) return NextResponse.json({ error: 'No valid items' }, { status: 400 });

  const paymentStatus = settings.checkoutMode === 'manual' ? 'unpaid' : 'paid';
  if (settings.checkoutMode === 'stripe') {
    if (!body.stripeSessionId || typeof body.stripeSessionId !== 'string') {
      return NextResponse.json({ error: 'Missing Stripe session id' }, { status: 400 });
    }
    const stripe = getStripeClient();
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(body.stripeSessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Stripe payment is not complete' }, { status: 400 });
    }

    const digest = createCheckoutDigest({
      items: checkout.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        qty: item.qty,
        unitPrice: item.unitPrice
      })),
      shipping: checkout.shipping,
      couponCode: body.couponCode,
      total: checkout.total
    });

    if (session.metadata?.orderDigest !== digest) {
      return NextResponse.json({ error: 'Checkout data does not match Stripe session' }, { status: 400 });
    }
  }

  if (checkout.coupon && checkout.discount > 0) {
    checkout.coupon.usedCount += 1;
    await couponRepo.saveAll(coupons);
  }

  const order = {
    id: uid('ord'),
    createdAt: new Date().toISOString(),
    customer: body.customer,
    items: checkout.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      qty: item.qty,
      unitPrice: item.unitPrice,
      design: item.design
    })),
    coupon: checkout.coupon && checkout.discount > 0 ? { code: checkout.coupon.code, discount: checkout.discount } : undefined,
    shipping: { method: checkout.shipping, cost: checkout.shippingCost },
    totals: {
      subtotal: checkout.subtotal,
      discount: checkout.discount,
      shipping: checkout.shippingCost,
      total: money(checkout.total)
    },
    payment: {
      mode: settings.checkoutMode,
      stripeSessionId: body.stripeSessionId,
      status: paymentStatus
    },
    fulfillment: { provider: settings.podProvider, status: 'pending', notes: '' }
  } as const;

  const provider = getFulfillmentProvider(settings.podProvider);
  if (order.payment.status === 'paid' || settings.checkoutMode === 'manual') {
    const result = await provider.createFulfillmentOrder(order as any);
    (order as any).fulfillment = { ...order.fulfillment, status: result.status, notes: result.notes };
  }

  const orders = await orderRepo.list();
  orders.unshift(order as any);
  await orderRepo.saveAll(orders as any);

  return NextResponse.json({ ok: true, orderId: order.id });
}
