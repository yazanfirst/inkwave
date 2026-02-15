import { couponRepo } from '@/lib/data/repos';
import { CouponManager } from '@/components/admin/CouponManager';

export default async function AdminCouponsPage() {
  const coupons = await couponRepo.list();
  return <CouponManager initial={coupons} />;
}
