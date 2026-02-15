import { Order } from '@/lib/types';

export interface FulfillmentProvider {
  createFulfillmentOrder(order: Order): Promise<{ status: string; notes: string }>;
}

class ManualProvider implements FulfillmentProvider {
  async createFulfillmentOrder(order: Order) {
    const lineItems = order.items.map((it) => `- ${it.productId}/${it.variantId} x${it.qty}`).join('\n');
    return {
      status: 'submitted',
      notes: `Packing slip generated.\n${lineItems}\nProduction files: ${order.items
        .map((i) => i.design?.exportPngUrl)
        .filter(Boolean)
        .join(', ')}`
    };
  }
}

class PrintfulProvider implements FulfillmentProvider {
  async createFulfillmentOrder() {
    // TODO: integrate Printful Orders API using PRINTFUL_API_KEY and mapped variant sync IDs.
    return { status: 'pending', notes: 'TODO: Printful provider not configured yet.' };
  }
}

class PrintifyProvider implements FulfillmentProvider {
  async createFulfillmentOrder() {
    // TODO: integrate Printify order creation API using PRINTIFY_API_TOKEN and blueprint mappings.
    return { status: 'pending', notes: 'TODO: Printify provider not configured yet.' };
  }
}

export function getFulfillmentProvider(provider: 'manual' | 'printful' | 'printify'): FulfillmentProvider {
  if (provider === 'printful') return new PrintfulProvider();
  if (provider === 'printify') return new PrintifyProvider();
  return new ManualProvider();
}
