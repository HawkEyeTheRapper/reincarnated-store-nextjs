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

## Handoff report (Jan 24, 2026)

Current state:
- Repo is wired for **OpenNext on Cloudflare Pages**.
- Pages project name: `reincarnated-store` (Git-integrated).
- Custom domain: `reincarnated.store` attached.
- Pages build settings:
  - Build command: `npx @opennextjs/cloudflare build`
  - Output dir: `.open-next`
  - Compatibility flag: `nodejs_compat`
  - Node version: `20`
- Required env vars set in Pages: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`.

Key fixes applied:
- Added `open-next.config.ts` and set `useWorkerdCondition: false` to avoid Stripe bundle errors.
- Added `wrangler.jsonc` for OpenNext build.
- Updated `.gitignore` to ignore `.next` and `.open-next` artifacts.

Known pitfalls / things to avoid:
- **Do not commit** `.next/` or `.open-next/` build output.
- OpenNext will fail if `open-next.config.ts` or `wrangler.jsonc` are missing.
- Stripe bundling can fail unless `useWorkerdCondition: false` is set.
- Cloudflare Pages build failures should be checked in deployment logs for the latest build ID.

Next steps to verify:
- Confirm the latest Git deployment succeeded after the OpenNext config commit.
- If build still fails, review the Pages deployment logs for the specific error and adjust OpenNext config accordingly.
