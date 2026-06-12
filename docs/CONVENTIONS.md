# Conventions

## Version Pinning

Critical dependencies — Next.js, React, React DOM, TypeScript, Tailwind CSS, and `@tailwindcss/postcss` — are pinned to exact versions in `package.json`. Transitive copies of React and TypeScript are forced to the same version via `pnpm.overrides`.

**Why exact pins:** This template is the starting point for each client project. A caret-range upgrade mid-project can silently break builds or change rendering behaviour. Exact pins guarantee that `pnpm install` today produces the same result as `pnpm install` six months from now.

**Security auditing:** `pnpm audit:ci` runs `pnpm audit --audit-level high` and exits non-zero if critical or high-severity CVEs are found. This is the CI gate — it does not block `pnpm install` locally, but it will fail the pipeline. Resolve CVEs by updating the affected package to a patched version (which may require relaxing a pin).

## Pull Requests

Always follow the structure in `.github/PULL_REQUEST_TEMPLATE.md` when opening a PR — both from the browser and from the terminal. Agents must read the template and use it as the body when running `gh pr create`.

## Purpose

- Preserve context that would otherwise be lost between work sessions.
- Make decisions and trade-offs traceable.
- Help future contributors understand not only what changed, but why.

---

## Local CMS Conventions

### Content Directory Structure

Content lives under `src/content/` and follows a Strapi-inspired on-disk layout:

```
src/content/
├── collection-types/           # Repeatable entities (many records)
│   └── <type-name>/
│       ├── schema.ts           # Zod schema for this type
│       ├── en/
│       │   ├── <slug>.json     # One file per record
│       │   └── ...
│       ├── el/
│       └── de/
├── single-types/               # Singleton documents (one record)
│   └── <type-name>/
│       ├── schema.ts           # Zod schema
│       ├── en/
│       │   └── index.json      # Exactly one file
│       ├── el/
│       └── de/
├── components/                 # Reusable JSON fragments
│   └── <component-name>.ts     # Zod schema for the fragment
└── media/
    ├── files/                  # Actual media assets (images, etc.)
    └── records/                # JSON metadata per media file
        └── <filename>.json     # alt, dimensions, caption, focal point
```

### JSON File Naming

- Collection Type records: `<slug>.json` (e.g. `deluxe-suite.json`, `standard-room.json`).
- Single Type records: always `index.json` — there is exactly one per locale.
- Media Records: match the media filename without extension (e.g. `hero-bg.jpg` → `hero-bg.json`).

### Zod Schemas

Each Collection Type and Single Type directory contains a `schema.ts` file defining the Zod schema for that content. Schemas live **alongside the content** they validate — not in a separate schemas directory. Content Components (reusable fragments) also define their own Zod schemas.

### Content Loaders

Content Loaders are typed functions that read JSON from disk, validate it through the corresponding Zod schema, and return a typed object. They are the **API contract** between the Local CMS and the rest of the application.

```ts
// Example Content Loader pattern
import { readFileSync } from "node:fs";
import { homepageSchema } from "./schema";

export function loadHomepage(locale: string) {
  const raw = readFileSync(`src/content/single-types/homepage/${locale}/index.json`, "utf-8");
  return homepageSchema.parse(JSON.parse(raw));
}
```

Pages and features import from Content Loaders — never read content JSON directly.

---

## next-intl Patterns

### Message File Structure

Translation messages live in `src/messages/<locale>.json`. Each file is a flat or nested JSON object where top-level keys serve as **namespaces**:

```json
{
  "Skeleton": {
    "welcome": "Welcome."
  }
}
```

Add new namespaces as top-level keys. Keep message keys in English (`en.json`) as the source of truth — other locales translate from there.

### Locale-Aware Routing

Locale routing is configured in `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ["en", "el", "de"],
  defaultLocale: "en",
});
```

All locales are URL-prefixed including the default (`/en`, `/el`, `/de`). The middleware in `src/proxy.ts` handles locale detection and redirection.

### `setRequestLocale` Usage

Every page and layout inside `[locale]/` must call `setRequestLocale(locale)` before using any `next-intl` server functions. This enables static rendering by telling next-intl which locale to use for the current request:

```tsx
export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);  // Required before getTranslations, getMessages, etc.
  const t = await getTranslations({ locale, namespace: "Skeleton" });
  // ...
}
```

Pages must also export `generateStaticParams` to produce all locale variants at build time:

```tsx
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

### Translation Namespaces

Use namespaces to scope translations to features or pages. Access them via the `namespace` parameter:

```ts
const t = await getTranslations({ locale, namespace: "ContactForm" });
```

This keeps message files organized and avoids key collisions between features.

---

## Scaffold Baselines Audit

The following infrastructure exists in the skeleton state (after Reset or fresh clone):

### Environment Validation

`src/env.ts` uses Zod to validate environment variables at build time. Invalid configuration throws immediately with a descriptive error message. Currently validates `NODE_ENV` and `NEXT_PUBLIC_SITE_URL`.

### Root Layout and Fonts

`src/app/layout.tsx` is the root layout — a pass-through that wraps children. Actual font loading, metadata, and HTML shell are handled by `src/app/[locale]/layout.tsx`, which:

- Loads the Inter font via `next/font/google` with CSS variable `--font-sans`
- Sets metadata with `metadataBase`, title template, and canonical URL
- Validates the locale parameter and calls `notFound()` for invalid locales
- Wraps children in `IntlErrorHandlingProvider` for next-intl error handling

### Design Tokens

`src/app/globals.css` defines the design token system:

- Imports Tailwind CSS v4, `tw-animate-css`, and `shadcn/tailwind.css`
- Defines CSS custom properties for all shadcn theme colors (light and dark modes) using OKLCH color space
- Sets up radius scale (`--radius-sm` through `--radius-4xl`)
- Configures `@theme inline` block for Tailwind integration
- Base layer sets border, body background, heading fonts, and selection color

The theme is based on shadcn's **base-nova** preset with custom warm tones.

### Error and Not-Found Patterns

`src/app/not-found.tsx` is a root-level 404 page that renders its own `<html>` and `<body>` tags (required for root error pages in Next.js). It includes:

- A "404" label, "Page not found" heading, and descriptive message
- A "Back to home" link using shadcn's `buttonVariants`
- No locale dependency — works for all routes

### Testing Setup

**Vitest** (`vitest.config.ts`):

- Environment: `jsdom`
- Globals enabled
- Setup file: `src/test/setup.ts` (imports `@testing-library/jest-dom/vitest`)
- Path alias: `@` → `./src`
- Coverage: V8 provider, excludes shadcn/ui components and test files
- Also includes `.agents/skills/do-issue/scripts/` in test discovery

**Example test** (`src/test/button.test.tsx`): smoke test that renders the shadcn Button and asserts it appears in the document.

**Test fixtures**: `src/test/fixtures/` exists for test data. Populated per project as needed.
