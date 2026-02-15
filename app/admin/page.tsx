import { couponRepo, orderRepo, productRepo } from '@/lib/data/repos';

export default async function AdminDashboard() {
  const [products, coupons, orders] = await Promise.all([productRepo.list(), couponRepo.list(), orderRepo.list()]);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Stat title="Products" value={products.length} />
      <Stat title="Coupons" value={coupons.length} />
      <Stat title="Orders" value={orders.length} />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-6"><p className="text-white/70">{title}</p><p className="text-3xl font-black">{value}</p></div>;
}
