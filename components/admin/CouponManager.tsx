'use client';

import { Coupon } from '@/lib/types';
import { useState } from 'react';

export function CouponManager({ initial }: { initial: Coupon[] }) {
  const [coupons, setCoupons] = useState(initial);
  const [json, setJson] = useState(JSON.stringify(initial[0] ?? sampleCoupon(), null, 2));

  async function save() {
    const coupon = JSON.parse(json);
    const res = await fetch('/api/admin/coupons', { method: 'POST', body: JSON.stringify(coupon) });
    if (res.ok) location.reload();
  }

  async function remove(code: string) {
    await fetch(`/api/admin/coupons/${code}`, { method: 'DELETE' });
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <button onClick={() => setJson(JSON.stringify(sampleCoupon(), null, 2))} className="rounded bg-white/10 px-3 py-2">New coupon template</button>
        {coupons.map((c) => (
          <div key={c.code} className="rounded border border-white/10 p-3">
            <button onClick={() => setJson(JSON.stringify(c, null, 2))} className="font-semibold">{c.code}</button>
            <button onClick={() => remove(c.code)} className="ml-3 text-xs text-red-300">Delete</button>
          </div>
        ))}
      </div>
      <div>
        <textarea value={json} onChange={(e) => setJson(e.target.value)} className="h-[420px] w-full rounded bg-black/70 p-3 font-mono text-xs" />
        <button onClick={save} className="mt-2 rounded bg-inkwave-gradient px-3 py-2 font-semibold text-black">Save coupon</button>
      </div>
    </div>
  );
}

function sampleCoupon(): Coupon {
  return { code: 'INKWAVE10', type: 'percent', value: 10, active: true, startsAt: null, endsAt: null, usageLimit: 100, usedCount: 0, minCart: 30 };
}
