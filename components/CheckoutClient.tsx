'use client';

import { useEffect, useState } from 'react';

const STRIPE_PENDING_KEY = 'inkwave_pending_checkout';

export function CheckoutClient({ checkoutMode, shipping }: { checkoutMode: 'stripe' | 'manual'; shipping: { standard: number; express: number } }) {
  const [status, setStatus] = useState('');
  const [processingStripeSuccess, setProcessingStripeSuccess] = useState(false);

  useEffect(() => {
    if (checkoutMode !== 'stripe') return;

    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === '1';
    const sessionId = params.get('session_id');
    if (!isSuccess || !sessionId) return;

    const rawPayload = sessionStorage.getItem(STRIPE_PENDING_KEY);
    if (!rawPayload) {
      setStatus('Missing checkout data for Stripe confirmation. Please try again.');
      return;
    }

    setProcessingStripeSuccess(true);
    const payload = JSON.parse(rawPayload);
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, stripeSessionId: sessionId })
    })
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (ok) {
          localStorage.removeItem('cart');
          sessionStorage.removeItem(STRIPE_PENDING_KEY);
          setStatus(`Order placed: ${data.orderId}`);
          window.history.replaceState({}, '', '/checkout');
        } else {
          setStatus(data.error || 'Checkout failed');
        }
      })
      .finally(() => setProcessingStripeSuccess(false));
  }, [checkoutMode]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const payload: any = {
      customer: {
        name: form.get('name'),
        email: form.get('email'),
        address: {
          line1: form.get('line1'),
          city: form.get('city'),
          state: form.get('state'),
          postalCode: form.get('postalCode'),
          country: form.get('country')
        }
      },
      shippingMethod: form.get('shippingMethod'),
      couponCode: form.get('couponCode'),
      items: cart
    };

    if (checkoutMode === 'stripe') {
      const stripe = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${location.origin}/checkout?success=1&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${location.origin}/checkout?cancel=1`,
          shippingMethod: payload.shippingMethod,
          couponCode: payload.couponCode,
          items: payload.items
        })
      }).then((r) => r.json());

      if (stripe.url) {
        sessionStorage.setItem(STRIPE_PENDING_KEY, JSON.stringify(payload));
        location.href = stripe.url;
        return;
      }
      setStatus(stripe.error || 'Failed to start Stripe checkout');
      return;
    }

    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (res.ok) {
      localStorage.removeItem('cart');
      setStatus(`Order placed: ${data.orderId}`);
    } else setStatus(data.error || 'Checkout failed');
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-bold">Checkout</h2>
      <input name="name" required placeholder="Full name" className="w-full rounded bg-white/10 p-2" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded bg-white/10 p-2" />
      <input name="line1" required placeholder="Address" className="w-full rounded bg-white/10 p-2" />
      <div className="grid grid-cols-2 gap-2">
        <input name="city" required placeholder="City" className="rounded bg-white/10 p-2" />
        <input name="state" required placeholder="State" className="rounded bg-white/10 p-2" />
        <input name="postalCode" required placeholder="Postal Code" className="rounded bg-white/10 p-2" />
        <input name="country" required placeholder="Country" className="rounded bg-white/10 p-2" defaultValue="US" />
      </div>
      <select name="shippingMethod" className="w-full rounded bg-white/10 p-2">
        <option>Standard</option>
        <option>Express</option>
      </select>
      <p className="text-xs text-white/60">Shipping: Standard ${shipping.standard}, Express ${shipping.express}</p>
      <input name="couponCode" placeholder="Coupon code" className="w-full rounded bg-white/10 p-2" />
      <button className="rounded bg-inkwave-gradient px-4 py-2 font-semibold text-black">{checkoutMode === 'stripe' ? 'Pay with Stripe' : 'Place Order'}</button>
      {processingStripeSuccess && <p className="text-sm text-white/70">Finalizing Stripe payment…</p>}
      {status && <p className="text-sm text-emerald-300">{status}</p>}
    </form>
  );
}
