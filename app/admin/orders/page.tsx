import Link from 'next/link';
import { orderRepo } from '@/lib/data/repos';

export default async function AdminOrdersPage() {
  const orders = await orderRepo.list();
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link key={order.id} href={`/admin/orders/${order.id}`} className="block rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">{order.id}</p>
          <p className="text-sm text-white/70">{order.customer.email} • ${order.totals.total}</p>
        </Link>
      ))}
    </div>
  );
}
