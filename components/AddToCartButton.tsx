'use client';

import { Product } from '@/lib/types';

export function AddToCartButton({ product, variantId, design }: { product: Product; variantId: string; design?: any }) {
  return (
    <button
      onClick={() => {
        const raw = localStorage.getItem('cart') ?? '[]';
        const cart = JSON.parse(raw);
        cart.push({ productId: product.id, variantId, qty: 1, design });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart');
      }}
      className="rounded bg-inkwave-gradient px-4 py-2 font-semibold text-black"
    >
      Add to cart
    </button>
  );
}
