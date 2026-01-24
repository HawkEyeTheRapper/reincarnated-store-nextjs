# CODEX DEPLOYMENT INSTRUCTION: REINCARNATED.STORE

**Objective:** Deploy the `reincarnated-store` Next.js application to Cloudflare Pages.

**Project Context:**
*   **Framework:** Next.js 14 (Pages Router)
*   **Styling:** Tailwind CSS
*   **Payments:** Stripe Checkout (Server-side session creation)
*   **Data:** Static CSV (`utils/products.csv`) parsed at build time.
*   **Assets:** Local assets in `public/assets/` + Remote assets from `assets.omniversalmedia.vip`.

**Deployment Target:** Cloudflare Pages

**Environment Variables Required (Set these in Cloudflare Dashboard):**
1.  `NEXT_PUBLIC_SITE_URL`: `https://reincarnated.store`
2.  `STRIPE_SECRET_KEY`: [Your Live Secret Key]
3.  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: [Your Live Publishable Key]
4.  `NODE_VERSION`: `20` (Recommended)

**Build Configuration:**
*   **Build Command:** `npm run build`
*   **Build Output Directory:** `.next` (or `out` if using static export, but we are using server-side API routes for Stripe, so standard Next.js build is preferred if using Cloudflare Next.js adapter, otherwise `next export` requires refactoring API routes to Edge Functions).

**Action Plan for Codex:**

1.  **Initialize Cloudflare Project:**
    *   Login to Cloudflare via Wrangler (if not already).
    *   Create a new Pages project named `reincarnated-store`.

2.  **Configure Build Settings:**
    *   Framework Preset: Next.js (Static HTML Export) OR Next.js (Standard) depending on adapter availability.
    *   *Note:* Since we use `/api/checkout_sessions`, we need a runtime that supports API routes (like Vercel or Cloudflare Pages with Functions).
    *   **Recommendation:** Use `@cloudflare/next-on-pages` to adapt the Next.js API routes to Cloudflare Workers.

3.  **Install Adapter (If needed):**
    *   Run: `npm install -D @cloudflare/next-on-pages`
    *   Update `package.json` build script: `"build": "next-on-pages"`

4.  **Deploy:**
    *   Run: `npx wrangler pages deploy .vercel/output/static --project-name reincarnated-store` (if using next-on-pages) OR standard git integration.

**Specific Instructions for Codex CLI:**

"Codex, please deploy the current directory to Cloudflare Pages.
1. Install `@cloudflare/next-on-pages` as a dev dependency.
2. Update the `build` script in `package.json` to `next-on-pages`.
3. Run `npm run build`.
4. Deploy the output to a new Cloudflare Pages project named 'reincarnated-store'.
5. Remind me to set the `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` in the Cloudflare Dashboard immediately after deployment."
