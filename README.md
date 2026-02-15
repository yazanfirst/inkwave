# INKWAVE PRINTS — Print on Demand

Production-ready, file-based POD ecommerce built with **Next.js App Router + TypeScript + TailwindCSS**.

## Features
- Dark premium storefront with ink-wave gradient branding.
- Product catalog, search, category filtering, product detail.
- Fabric.js product designer (text, image upload, move/resize/rotate, export PNG).
- Cart + checkout with coupon support and configurable shipping.
- Admin panel for products, coupons, and order review.
- Stripe checkout route (optional) or manual checkout mode.
- POD fulfillment provider abstraction with manual provider + Printful/Printify TODO placeholders.
- No database. JSON storage with atomic writes.

## Environment variables
Create `.env.local`:

```bash
ADMIN_USER=admin
ADMIN_PASS=change-me
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PRINTFUL_API_KEY=
PRINTIFY_API_TOKEN=
```

## Run
```bash
npm install
npm run dev
```

Build/serve:
```bash
npm run build
npm run start
```

## File-based storage
Data lives in `/data`:
- `products.json`
- `coupons.json`
- `orders.json`
- `settings.json`

Atomic writes are implemented in `lib/data/store.ts` using write temp file + rename.

## Checkout mode
`data/settings.json` controls:
- `checkoutMode`: `manual` or `stripe`
- `shipping.standard` and `shipping.express`
- `podProvider`: `manual`, `printful`, `printify`

## Uploads
User/admin uploads are validated (type + max 5MB) and saved under:
- `public/uploads`
- `public/uploads/designs`

## Extend POD providers
Use `lib/fulfillment/providers.ts` and implement:
```ts
createFulfillmentOrder(order)
```
Add API calls + mapping for Printful/Printify and switch via `settings.json`.
