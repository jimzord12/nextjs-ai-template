Status: done
Method: scaffold
Complexity: 3

# i18n Routing + Skeleton Page

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Install and configure `next-intl` for the App Router with three locales (English default, Greek, German). Implement the URL-prefixed routing strategy: every locale is URL-prefixed including the default (`/en/`, `/el/`, `/de/`). Root `/` redirects to `/en/`. Restructure the existing `src/app/(marketing)/` route group into `src/app/[locale]/(marketing)/`. Create per-locale message files for UI strings. Build locale-aware navigation helpers (Link, useRouter, getPathname). Implement explicit fallback rules — missing translations produce a visible signal (build warning or dev-time console), not a silent fallback. Leave a skeleton `[locale]/(marketing)/page.tsx` with "Welcome." content that renders in all three locales.

This is the routing foundation that all subsequent page slices depend on.

## Acceptance criteria

- [x] `next-intl` installed and configured for App Router
- [x] Three locales configured: `en` (default), `el`, `de`
- [x] All locales URL-prefixed including default: `/en/`, `/el/`, `/de/`
- [x] Root `/` redirects to `/en/`
- [x] Route structure is `src/app/[locale]/(marketing)/...`
- [x] Per-locale message files created for UI strings
- [x] Locale-aware Link, useRouter, and getPathname helpers available
- [x] Explicit fallback: missing translation key produces a visible warning, not silent English fallback
- [x] Skeleton `(marketing)/page.tsx` renders "Welcome." in all three locales
- [x] Language switching works: clicking a locale link changes URL and renders content in that locale
- [x] `next build` succeeds and produces static pages for all locales
- [x] Existing header/footer/layout components still render correctly in the new structure

## Blocked by

- `01-fix-configuration-aliases` — config must be correct before restructuring routes
