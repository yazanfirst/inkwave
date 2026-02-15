import { ProductCard } from '@/components/ProductCard';
import { productRepo } from '@/lib/data/repos';

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const products = await productRepo.list();
  const q = (searchParams.q ?? '').toLowerCase();
  const category = searchParams.category ?? '';
  const categories = [...new Set(products.map((p) => p.category))];
  const filtered = products.filter((p) => (!q || `${p.title} ${p.description}`.toLowerCase().includes(q)) && (!category || p.category === category));

  return (
    <div className="space-y-5">
      <form className="glass flex flex-col gap-2 rounded-2xl p-4 md:flex-row">
        <input name="q" placeholder="Search designs" className="flex-1 rounded bg-white/10 p-2" defaultValue={searchParams.q} />
        <select name="category" defaultValue={category} className="rounded bg-white/10 p-2">
          <option value="">All categories</option>
          {categories.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
        <button className="rounded bg-white/15 px-4">Filter</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
