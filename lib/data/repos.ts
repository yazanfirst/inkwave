import { readJsonFile, writeJsonAtomic } from '@/lib/data/store';
import { Coupon, Order, Product, Settings } from '@/lib/types';

export const productRepo = {
  list: () => readJsonFile<Product[]>('products.json', []),
  async saveAll(products: Product[]) {
    await writeJsonAtomic('products.json', products);
  }
};

export const couponRepo = {
  list: () => readJsonFile<Coupon[]>('coupons.json', []),
  async saveAll(coupons: Coupon[]) {
    await writeJsonAtomic('coupons.json', coupons);
  }
};

export const orderRepo = {
  list: () => readJsonFile<Order[]>('orders.json', []),
  async saveAll(orders: Order[]) {
    await writeJsonAtomic('orders.json', orders);
  }
};

export const settingsRepo = {
  get: () =>
    readJsonFile<Settings>('settings.json', {
      storeName: 'InkWave Prints',
      tagline: 'Print on Demand',
      currency: 'USD',
      shipping: { standard: 5, express: 15 },
      checkoutMode: 'manual',
      podProvider: 'manual'
    })
};
