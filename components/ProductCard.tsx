import Link from 'next/link';
import { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  return (
    <Link href={`/products/${product.id}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1">
      <div className="aspect-square bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase text-white/60">{product.category}</p>
        <h3 className="font-semibold">{product.title}</h3>
        <p className="mt-1 text-sm text-white/70">${variant?.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
