import { isAdminAuthenticated } from '@/lib/auth/admin';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) redirect('/admin/login');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/coupons">Coupons</Link>
          <Link href="/admin/orders">Orders</Link>
          <form action="/api/admin/logout" method="post">
            <button className="text-red-300">Logout</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
