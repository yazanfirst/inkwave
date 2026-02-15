export type Variant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  baseCost: number;
  price: number;
  inStock: boolean;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  variants: Variant[];
  designer: {
    enabled: boolean;
    printAreas: Array<{ view: 'front' | 'back'; x: number; y: number; w: number; h: number }>;
    export: { width: number; height: number };
  };
  createdAt: string;
  updatedAt: string;
};

export type Coupon = {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  usageLimit: number;
  usedCount: number;
  minCart: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    address: { line1: string; line2?: string; city: string; state: string; postalCode: string; country: string };
  };
  items: Array<{
    productId: string;
    variantId: string;
    qty: number;
    unitPrice: number;
    design?: { editorState: Record<string, unknown>; exportPngUrl: string };
  }>;
  coupon?: { code: string; discount: number };
  shipping: { method: 'Standard' | 'Express'; cost: number };
  totals: { subtotal: number; discount: number; shipping: number; total: number };
  payment: { mode: 'stripe' | 'manual'; stripeSessionId?: string; status: 'paid' | 'unpaid' };
  fulfillment: { provider: 'manual' | 'printful' | 'printify'; status: 'pending' | 'submitted' | 'shipped'; notes: string };
};

export type Settings = {
  storeName: string;
  tagline: string;
  currency: string;
  shipping: { standard: number; express: number };
  checkoutMode: 'stripe' | 'manual';
  podProvider: 'manual' | 'printful' | 'printify';
};
