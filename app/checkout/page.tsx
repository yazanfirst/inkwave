import { CheckoutClient } from '@/components/CheckoutClient';
import { settingsRepo } from '@/lib/data/repos';

export default async function CheckoutPage() {
  const settings = await settingsRepo.get();
  return <CheckoutClient checkoutMode={settings.checkoutMode} shipping={settings.shipping} />;
}
