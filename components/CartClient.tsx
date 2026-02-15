'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CartClient() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => setItems(JSON.parse(localStorage.getItem('cart') ?? '[]')), []);

  function updateQty(index: number, qty: number) {
    const next = [...items];
    next[index].qty = qty;
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  }

  function remove(index: number) {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="rounded border border-white/10 p-3">
          <p>{item.productId} / {item.variantId}</p>
          <div className="mt-2 flex gap-2">
            <input type="number" value={item.qty} min={1} onChange={(e) => updateQty(idx, Number(e.target.value))} className="w-20 rounded bg-white/10 p-1" />
            <button onClick={() => remove(idx)} className="text-red-300">Remove</button>
          </div>
        </div>
      ))}
      <Link href="/checkout" className="inline-block rounded bg-inkwave-gradient px-4 py-2 font-semibold text-black">Checkout</Link>
    </div>
  );
}
