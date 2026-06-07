# Deployment

Vercel is the primary deployment platform for v1. The template is configured for static export (`output: 'export'`) targeting Vercel's free tier.

Other platforms (Netlify, Cloudflare Pages, AWS S3 + CloudFront) are deferred to v2.

---

## Deploy to Vercel

### 1. Connect the repository

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your Git repository (GitHub, GitLab, or Bitbucket).
3. Vercel auto-detects Next.js — no framework preset changes needed.

### 2. Configure environment variables

Add the following in **Project Settings → Environment Variables**:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL (e.g. `https://example.com`). Used for metadata and sitemap generation. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | No | Web3Forms API endpoint URL. Required if the contact form is active. |

No other environment variables are needed. The template validates these at build time via `src/env.ts` using Zod.

### 3. Deploy

Push to `main` — Vercel builds and deploys automatically. PRs get preview deployments.

The build command (`pnpm build`) runs `next build`, which produces a static export in the `out/` directory.

---

## Security Headers

The template ships with OWASP-recommended security headers in `vercel.json`. These are applied automatically on deploy:

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years, includes subdomains |
| `X-Frame-Options` | `DENY` | Prevents clickjacking via iframes |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer data on cross-origin requests |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |
| `Content-Security-Policy` | (see `vercel.json`) | Restricts resource loading to same-origin by default |

### Relaxing CSP for third-party services

The default CSP is strict. You'll need to relax it when adding:

- **Analytics** (Plausible, GA): Add the analytics domain to `script-src` and `connect-src`.
- **Font CDNs**: Add to `font-src`.
- **Storybook embeds**: Add to `frame-src` or `frame-ancestors`.

See the `_docs.csp_template_notes` section in `vercel.json` for per-directive guidance.

### Verifying headers

After deployment, verify your headers score:

- [securityheaders.com](https://securityheaders.com) — aim for A or A+
- [Mozilla Observatory](https://observatory.mozilla.org) — aim for A or higher
- Browser DevTools → Network tab → check response headers on any document request

---

## Build Pipeline

Vercel runs the build automatically. Locally, you can reproduce it:

```bash
pnpm build
```

This produces a static export. The build configuration in `next.config.ts` includes the bundle analyzer (enabled via `ANALYZE=true`) and the next-intl plugin.

---

## Partial Removal Guide

The template ships with several optional tools. If your project doesn't need one, remove it here.

### Remove Storybook

1. Uninstall dependencies:
   ```bash
   pnpm remove storybook @storybook/react @storybook/react-vite
   ```
2. Delete Storybook config (if present): `rm -rf .storybook`
3. Remove scripts from `package.json`: `storybook`, `build-storybook`

### Remove Playwright / E2E tests

1. Uninstall dependencies:
   ```bash
   pnpm remove @playwright/test @axe-core/playwright
   ```
2. Delete E2E directory: `rm -rf e2e`
3. Delete Playwright config (if present): `rm -f playwright.config.ts`
4. Remove scripts from `package.json`: `test:e2e`, `qa:a11y`, `qa:cross-browser`
5. Adjust `pnpm qa` and `pnpm qa:full` scripts to skip E2E-based categories

### Remove Unlighthouse

1. Uninstall dependencies:
   ```bash
   pnpm remove @unlighthouse/cli lighthouse chrome-launcher
   ```
2. Remove scripts from `package.json`: `qa:performance`
3. Adjust `pnpm qa` and `pnpm qa:full` scripts to skip the performance category

### Remove the bundle analyzer

1. Uninstall dependencies:
   ```bash
   pnpm remove @next/bundle-analyzer
   ```
2. Remove the `withBundleAnalyzer` wrapper from `next.config.ts`
3. Remove scripts from `package.json`: `analyze`, `qa:bundle`

### Remove Husky / commitlint

1. Uninstall dependencies:
   ```bash
   pnpm remove husky lint-staged @commitlint/cli @commitlint/config-conventional
   ```
2. Delete Husky directory: `rm -rf .husky`
3. Delete commitlint config (if present): `rm -f commitlint.config.*`
4. Remove `prepare` script from `package.json`
5. Remove the `lint-staged` block from `package.json` (if present)

### Remove react-doctor

1. Uninstall dependencies:
   ```bash
   pnpm remove react-doctor
   ```
2. Delete config: `rm -f doctor.config.json`
3. Remove scripts from `package.json`: `doctor`, `qa:doctor`
4. Adjust `pnpm qa` and `pnpm qa:full` scripts to skip the doctor category

### Remove fallow

1. Uninstall dependencies:
   ```bash
   pnpm remove fallow
   ```
2. Remove scripts from `package.json`: `fallow`, `fallow:audit`

### Tools that require manual removal

The following are deeply integrated and cannot be cleanly removed with a few commands:

- **next-intl** — Required for i18n routing. Removal requires rewriting all route segments under `src/app/[locale]/`, message files, and the i18n configuration in `src/i18n/`. Manual removal required.
- **shadcn / UI components** — Individual components can be deleted from `src/components/ui/`, but the `cn()` utility and base styling in `globals.css` are shared. Manual removal required.
- **Biome** — The sole linter/formatter. Replacing it means adding an alternative (ESLint + Prettier) and updating `package.json` scripts, `lint-staged` config, and CI configuration. Manual removal required.
- **Tailwind CSS** — The entire styling layer. Removal requires rewriting all component styles and globals. Manual removal required.
