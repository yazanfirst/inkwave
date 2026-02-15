'use client';

import { useState } from 'react';

export function CheckoutClient({ checkoutMode, shipping }: { checkoutMode: 'stripe' | 'manual'; shipping: { standard: number; express: number } }) {
  const [status, setStatus] = useState('');

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
          successUrl: `${location.origin}/checkout?success=1`,
          cancelUrl: `${location.origin}/checkout?cancel=1`,
          items: [{ quantity: 1, price_data: { currency: 'usd', product_data: { name: 'InkWave Order' }, unit_amount: 1000 } }]
        })
      }).then((r) => r.json());
      payload.stripeSessionId = stripe.id;
      payload.paid = true;
      if (stripe.url) location.href = stripe.url;
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
      {status && <p className="text-sm text-emerald-300">{status}</p>}
    </form>
  );
}
