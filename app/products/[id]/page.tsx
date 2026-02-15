import { notFound } from 'next/navigation';
import { productRepo } from '@/lib/data/repos';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductDesigner } from '@/components/ProductDesigner';

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const products = await productRepo.list();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  const variant = product.variants[0];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.title} className="aspect-square w-full rounded object-cover" />
      </div>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">{product.category}</p>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-white/80">{product.description}</p>
        <p className="text-2xl font-black">${variant.price.toFixed(2)}</p>
        <AddToCartButton product={product} variantId={variant.id} />
        {product.designer.enabled && <ProductDesigner product={product} />}
      </div>
    </div>
  );
}
