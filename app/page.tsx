import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { productRepo } from '@/lib/data/repos';

export default async function HomePage() {
  const products = await productRepo.list();
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-black p-10 shadow-glow">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -right-10 top-10 h-56 w-56 rounded-full bg-cyan-400/30 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">PRINT ON DEMAND</p>
        <h1 className="mt-3 text-5xl font-black leading-tight md:text-7xl">INKWAVE PRINTS</h1>
        <p className="mt-5 max-w-xl text-white/80">Premium custom apparel with vibrant ink-wave energy. Design your own pieces and ship worldwide.</p>
        <Link href="/products" className="mt-6 inline-block rounded bg-inkwave-gradient px-6 py-3 font-bold text-black">Shop Collection</Link>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Featured Prints</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
