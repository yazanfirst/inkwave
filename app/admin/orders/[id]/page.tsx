import { orderRepo } from '@/lib/data/repos';
import { notFound } from 'next/navigation';

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const orders = await orderRepo.list();
  const order = orders.find((o) => o.id === params.id);
  if (!order) notFound();
  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-bold">Order {order.id}</h2>
      <pre className="overflow-auto text-xs text-white/80">{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}
