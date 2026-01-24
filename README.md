# Reincarnated Store (Next.js)

Next.js 14/15 Pages Router storefront with Stripe Checkout and static CSV product data.

## Local development

```bash
npm install
npm run dev
```

## Cloudflare Pages deployment (OpenNext)

This project is configured to deploy via Cloudflare Pages using the OpenNext adapter.

Recommended Pages settings:
- Build command: `npx @opennextjs/cloudflare build`
- Build output directory: `.open-next`
- Compatibility flags: `nodejs_compat`
- Node version: `20`

Required environment variables:
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Notes
- Product data is sourced from `utils/products.csv` and/or `utils/products.json`.
- Large media assets are sourced externally and should not be committed.
