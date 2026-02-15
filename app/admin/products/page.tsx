import { productRepo } from '@/lib/data/repos';
import { ProductManager } from '@/components/admin/ProductManager';

export default async function AdminProductsPage() {
  const products = await productRepo.list();
  return <ProductManager initial={products} />;
}
