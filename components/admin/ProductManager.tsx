'use client';

import { Product } from '@/lib/types';
import { uid } from '@/lib/utils';
import { useState } from 'react';

export function ProductManager({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [json, setJson] = useState(JSON.stringify(initial[0] ?? sampleProduct(), null, 2));

  async function save() {
    const product = JSON.parse(json);
    product.updatedAt = new Date().toISOString();
    if (!product.createdAt) product.createdAt = product.updatedAt;
    const res = await fetch('/api/admin/products', { method: 'POST', body: JSON.stringify(product) });
    if (res.ok) location.reload();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts((p) => p.filter((item) => item.id !== id));
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <button onClick={() => setJson(JSON.stringify(sampleProduct(), null, 2))} className="rounded bg-white/10 px-3 py-2">New product template</button>
        {products.map((p) => (
          <div key={p.id} className="rounded border border-white/10 p-3">
            <button onClick={() => setJson(JSON.stringify(p, null, 2))} className="font-semibold">{p.title}</button>
            <button onClick={() => remove(p.id)} className="ml-3 text-xs text-red-300">Delete</button>
          </div>
        ))}
      </div>
      <div>
        <textarea value={json} onChange={(e) => setJson(e.target.value)} className="h-[520px] w-full rounded bg-black/70 p-3 font-mono text-xs" />
        <button onClick={save} className="mt-2 rounded bg-inkwave-gradient px-3 py-2 font-semibold text-black">Save product</button>
      </div>
    </div>
  );
}

function sampleProduct() {
  const id = uid('prod');
  const variant = uid('var');
  const now = new Date().toISOString();
  return {
    id,
    title: 'InkWave Spectrum Tee',
    description: 'Premium cotton tee with luminous wave artwork.',
    category: 'T-Shirts',
    tags: ['spectrum', 'wave'],
    images: ['/uploads/sample-tee.png'],
    variants: [{ id: variant, size: 'M', color: 'Black', sku: 'INK-TS-BLK-M', baseCost: 12, price: 29.99, inStock: true }],
    designer: { enabled: true, printAreas: [{ view: 'front', x: 0.28, y: 0.22, w: 0.44, h: 0.5 }], export: { width: 4500, height: 5400 } },
    createdAt: now,
    updatedAt: now
  };
}
