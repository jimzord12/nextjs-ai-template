# PRD — Production-Grade Next.js Static-Site Template

## Problem Statement

Agencies building static marketing sites for clients start every project from scratch — wiring up i18n, content models, SEO, accessibility checks, security headers, QA tooling, and CI pipelines one by one. Each project reinvents the same infrastructure, inconsistently. There is no reusable starting point that ships with a working demo, a one-command reset to a clean slate, and a QA pipeline that produces client-presentable evidence out of the box.

This template solves that by providing a production-grade Next.js starter with a complete Hotel Example (homepage, room listing, room detail, contact form) that demonstrates every architectural convention. The Agency runs a reset script to strip the demo and gets a bare i18n skeleton with empty content directories, ready for their Client's project.

## Solution

Deliver a Vercel-first, static-export-only Next.js template (v1 scope) built around five pillars:

1. **Local CMS** — A Strapi-inspired, repo-local JSON content model stored in `src/content/` with Collection Types (Rooms, Reviews), Single Types (Homepage, Site Settings), reusable Content Components (SEO, Hero Section, CTA Section, Amenities, Rich Text Block), and structured Media Records. Content is consumed through Zod-validated Content Loaders, not direct imports.

2. **Internationalization** — `next-intl` on the App Router with three locales (English default, Greek, German), all URL-prefixed including the default. Content stored as one JSON file per locale per record. Localized slugs, metadata, and explicit fallback rules.

3. **Hotel Example** — A four-page demo (Homepage, Room listing, Room detail, Contact form with Web3Forms) that exercises every convention. The Contact form uses TanStack Form wired to Web3Forms via a configurable `NEXT_PUBLIC_FORM_ENDPOINT`. The Hotel Example is stripped by the reset script, leaving a bare i18n skeleton.

4. **Tooling & QA** — Storybook, Playwright, Unlighthouse, bundle analyzer, Biome, Husky, commitlint, and a CI pipeline. A `pnpm qa` umbrella script generates local HTML reports in `.qa/` covering performance (Unlighthouse), accessibility (axe-core), SEO (placeholder), security (`pnpm audit`), and bundle analysis. The Agency screenshots these into a Client deck.

5. **Documentation** — Updated ARCHITECTURE.md, CONVENTIONS.md, TECH_STACK.md, DEPLOYMENT.md (Vercel for v1), and README reflecting the actual codebase and decisions.

## User Stories

### Local CMS

1. As an Agency, I want Collection Type records stored as JSON files, so that I can add, edit, and version content without a remote CMS dependency.
2. As an Agency, I want Single Type records for unique pages (Homepage, Site Settings), so that global content has a predictable home.
3. As an Agency, I want reusable Content Components (SEO, Hero Section, CTA Section), so that I don't duplicate common content structures across types.
4. As an Agency, I want structured Media Records with localized alt text, dimensions, caption, and focal point, so that media references carry full metadata instead of raw file paths.
5. As an Agency, I want Zod-validated Content Loaders (e.g., `getRoom(slug, locale)`), so that invalid content fails at build time, not in production.
6. As an Agency, I want content schemas that mirror Strapi conventions (collection types, single types, components, relations, SEO fields), so that my team familiar with Strapi can adopt the template immediately.
7. As an Agency, I want locale-aware content structures, so that each locale owns its own records and the CMS model works cleanly with the i18n routing.
8. As an Agency, I want content stored as one JSON file per locale per record, so that I can see exactly what content exists per locale and spot missing translations easily.

### Internationalization

9. As an Agency, I want `next-intl` configured on the App Router, so that locale-aware routing, navigation, and metadata are handled consistently.
10. As an Agency, I want all locales URL-prefixed including the default (`/en/`, `/el/`, `/de/`), so that search engines index every locale variant and hreflang tags are unambiguous.
11. As an Agency, I want localized slugs so that each locale can own its own URL segments (e.g., `/en/rooms/deluxe-suite` vs `/el/rooms/πολυτελής-σουίτα`).
12. As an Agency, I want explicit fallback rules for messages and content fields, so that missing translations are intentional and visible, not silently falling back to English.
13. As an Agency, I want locale-aware navigation and alternate link helpers, so that hreflang, canonical URLs, and language switchers work correctly out of the box.
14. As an Agency, I want a root `/` redirect to the default locale (`/en/`), so that no page is served without a locale prefix.
15. As an Agency, I want clear documentation on adding a new locale, so that I can expand to additional markets without reverse-engineering the setup.

### Hotel Example Content

16. As an Agency, I want a rich Homepage that consumes Single Type content (hero, featured rooms, CTA), so that I can see how the Local CMS feeds a complex page.
17. As an Agency, I want a Room listing page that iterates over all Room Collection Type records, so that I can see how collection rendering works.
18. As an Agency, I want a Room detail page with `generateStaticParams` and localized slugs, so that I can see how dynamic SSG routes work with the content model.
19. As an Agency, I want a Contact page with a working form (TanStack Form + Web3Forms), so that I can see how forms integrate in static-export mode.
20. As an Agency, I want every example page to have correct `generateMetadata` patterns (title templates, descriptions, open graph, twitter cards), so that SEO is demonstrated, not just documented.
21. As an Agency, I want example pages to use `next/image` with Vercel's built-in optimizer and structured Media Record metadata, so that the image workflow is realistic.
22. As an Agency, I want the Hotel Example to pass WCAG 2.2 AA automated checks (0 critical/serious violations), so that the template sets the accessibility bar from day one.
23. As an Agency, I want example shared components (card grid, CTA section, content sections) that demonstrate the architecture conventions, so that I know how to build my own.

### Reset Script

24. As an Agency, I want a `scripts/reset-example.sh` that strips all Hotel Example content, pages, and components, so that I can start a clean Client project.
25. As an Agency, I want the reset to preserve the i18n infrastructure (`[locale]` routing, `next-intl` config, message files), so that I don't lose baseline localization after reset.
26. As an Agency, I want the reset to preserve shadcn components, shared utilities, and all config/tooling, so that the architecture stays intact.
27. As an Agency, I want the reset to leave a skeleton `[locale]/page.tsx` with "Welcome." content, so that the app still runs immediately after reset.
28. As an Agency, I want the reset to empty (not delete) the `src/content/` directory structure, so that the CMS skeleton is ready for new content.
29. As an Agency, I want the reset script documented in the README, so that I know how to use it without reading the source.

### Forms

30. As an Agency, I want TanStack Form installed and configured, so that form state management is type-safe and reactive.
31. As an Agency, I want an example contact form with Zod validation, so that I can see the full validation pattern (schema → form → error display).
32. As an Agency, I want the contact form wired to Web3Forms via `NEXT_PUBLIC_FORM_ENDPOINT`, so that it submits to a real backend in static-export mode.
33. As an Agency, I want form success and error states handled gracefully, so that the Client's users get clear feedback.

### Tooling

34. As an Agency, I want Storybook configured for Next.js App Router, so that I can develop and document components in isolation.
35. As an Agency, I want at least one example Story alongside the Hotel Example components, so that I can see the Storybook convention.
36. As an Agency, I want Playwright configured with multi-browser projects (Chromium, Firefox, WebKit), so that cross-browser E2E tests are ready from day one.
37. As an Agency, I want Unlighthouse configured with a performance budget target (Performance ≥ 90), so that performance regressions are caught automatically.
38. As an Agency, I want `@next/bundle-analyzer` wired behind an `ANALYZE` env var, so that I can inspect bundle output on demand.
39. As an Agency, I want `pnpm audit:ci` that fails on critical/high CVEs, so that security vulnerabilities are caught in CI.
40. As an Agency, I want a CI pipeline (`.github/workflows/ci.yml`) that runs lint, test, build, and audit on every PR, so that broken changes never reach main.
41. As an Agency, I want critical dependencies (Next.js, React, TypeScript, Tailwind) pinned to exact versions, so that builds are reproducible.
42. As an Agency, I want version pinning rationale documented, so that I understand the tradeoff and can relax pins when needed.

### Quality Assurance

43. As an Agency, I want a `pnpm qa:performance` script that runs Unlighthouse against the production build and outputs an HTML report, so that performance is measurable.
44. As an Agency, I want axe-core integrated with Playwright for automated accessibility assertions, so that WCAG violations are caught in E2E tests.
45. As an Agency, I want a `pnpm qa:a11y` script that runs axe against all static pages, so that accessibility is independently verifiable.
46. As an Agency, I want a manual testing checklist for keyboard navigation, focus rings, contrast, and screen reader basics, so that accessibility beyond automated checks is documented.
47. As an Agency, I want JSON-LD structured data examples (Organization, WebSite, BreadcrumbList) in the Hotel Example pages, so that rich search results are demonstrated.
48. As an Agency, I want `robots.ts` and `sitemap.ts` that generate correct static files, so that search engine crawling is configured out of the box.
49. As an Agency, I want hreflang support consistent with `next-intl` routing, so that search engines serve the correct locale to users.
50. As an Agency, I want a `pnpm qa:seo` script targeting Lighthouse SEO score 100, so that SEO quality is measurable.
51. As an Agency, I want OWASP-recommended security headers in `vercel.json` for v1, so that Client sites ship with a strong security posture on Vercel.
52. As an Agency, I want a CSP template with instructions to relax per-project (analytics, fonts, embeds), so that I can adapt security without starting from scratch.
53. As an Agency, I want a `pnpm qa:security` script that runs `pnpm audit` and checks for critical/high CVEs, so that security is independently verifiable.
54. As an Agency, I want responsive viewport smoke tests at 320px, 375px, 768px, 1280px, and 1440px, so that layout breakage is caught across device sizes.
55. As an Agency, I want a `pnpm qa:cross-browser` script that runs the full Playwright suite across all browser projects, so that cross-browser compatibility is verified.
56. As an Agency, I want a `pnpm qa` umbrella script that runs all `qa:*` scripts and exits non-zero on any failure, so that QA is a single CI gate.
57. As an Agency, I want a `scripts/qa-report.sh` that collects all reports into a `.qa/` directory, so that I can screenshot them into a Client deck.
58. As an Agency, I want the QA delivery package format documented (what to capture, how to present, shareable conventions), so that QA handoff is consistent across projects.

### Documentation

59. As an Agency, I want a `docs/TECH_STACK.md` that lists every dependency with what it is, why we chose it, and a link to its docs, so that I can understand the stack at a glance.
60. As an Agency, I want `TECH_STACK.md` to clearly distinguish `[installed]` vs `[planned]` entries, so that I don't assume capabilities that don't exist yet.
61. As an Agency, I want `ARCHITECTURE.md` updated to reflect the actual file structure and v1 scope (Vercel-first, marketing-only, no `(app)` group), so that documentation matches the codebase.
62. As an Agency, I want `CONVENTIONS.md` updated with the Local CMS conventions, `next-intl` patterns, and scaffold baselines, so that conventions are discoverable.
63. As an Agency, I want `ROUTINES.md` updated with QA routines, so that running quality checks is a documented part of the workflow.
64. As an Agency, I want `DEPLOYMENT.md` with Vercel as the primary platform for v1, including `vercel.json` security headers and a note that other platforms are deferred to v2, so that deployment is straightforward.
65. As an Agency, I want `README.md` updated with template-specific content: what this is, how to use it, available scripts, the reset workflow, and links to `docs/`, so that onboarding is immediate.
66. As an Agency, I want existing scaffold baselines audited and documented (env validation, root metadata, font loading, design tokens, error/not-found patterns, test setup), so that the TODO reflects reality before more features are layered on.
67. As an Agency, I want a partial-removal guide for individual tools (e.g., remove Storybook, skip Playwright), so that I can opt out of tooling I don't need.

### Configuration Fixes

68. As an Agency, I want `components.json` aliases updated to match the actual file structure (`src/components/ui/`), so that shadcn CLI adds components to the correct directory.
69. As an Agency, I want the architecture doc's example diagram updated to match the actual file structure (SSOT codebase), so that documentation and code are consistent.

## Implementation Decisions

### V1 Scope

- **Vercel-first** — v1 targets Vercel's free tier exclusively. `next/image` uses Vercel's built-in optimizer (no `unoptimized` flag). Security headers only for `vercel.json`. Other hosting platforms (Netlify, Cloudflare Pages, GitHub Pages) deferred to v2 along with a custom static image loader.
- **Static-export-only** — `output: 'export'` in `next.config.ts`. No SSR-only features, no server actions, no API routes.
- **Marketing-only** — Only a `(marketing)` route group inside `[locale]`. No `(app)` route group, no auth, no dashboard in v1. The architecture doc documents the `(app)` pattern but marks it as v2.
- **neverthrow dropped** — No `Result` monad in the static baseline. Zod validation + build-time failure is sufficient. Template users can add it when graduating to SSR.

### Local CMS Architecture

- **Content directory** — `src/content/` with subdirectories: `collection-types/`, `single-types/`, `components/`, `media/files/`, `media/records/`. Matches the architecture doc.
- **Locale structure** — One JSON file per locale per record. Collection types: `src/content/collection-types/rooms/en/deluxe-suite.json`, `src/content/collection-types/rooms/el/deluxe-suite.json`, `src/content/collection-types/rooms/de/deluxe-suite.json`. Single types follow the same pattern: `src/content/single-types/homepage/en.json`.
- **Content Components** — Not stored as independent files. They are sub-objects within their parent Collection Type or Single Type records (e.g., the `seo` field inside a room record is a Content Component).
- **Media Records** — Stored in `src/content/media/records/` as JSON files with fields: `id`, `alt` (per locale), `width`, `height`, `caption` (per locale), `focalPoint`, `file` (relative path to `src/content/media/files/`).
- **Zod schemas** — One Zod schema per content type, defining the full shape including nested Content Components. Schemas live alongside their content type directory (e.g., `src/content/collection-types/rooms/schema.ts`).
- **Content Loaders** — Typed async functions that read a JSON file, parse it through the corresponding Zod schema, and return a typed object. Each loader accepts a slug and locale. Loaders are the sole interface between the CMS and the rest of the application — no direct JSON imports.

### Content Model (Hotel Example)

- **Collection Types**: Rooms (title, slug, description, price, amenities, gallery media relations, featured image, availability status, SEO component), Reviews (author, rating, body, room relation, date, locale).
- **Single Types**: Homepage (hero component, featured rooms relations, CTA component, SEO component), Site Settings (site name, default SEO fallback, contact info, social links, logo media relation).
- **Content Components**: SEO (meta title, description, open graph image, noindex flag), Amenities (list of named amenities with icons), Hero Section (headline, subheadline, background image, CTA text + link), CTA Section (headline, body, button text + link), Rich Text Block (heading, body, optional media).

### Internationalization

- **Library** — `next-intl` on the App Router.
- **Locales** — `en` (default), `el`, `de`. All URL-prefixed including default.
- **Route structure** — `[locale]/(marketing)/...` pattern. Root `/` redirects to `/en/`.
- **Fallback** — Explicit, not silent. Missing locale content produces a visible signal (build warning or dev-time console), not a silent fallback to English.
- **Navigation helpers** — Locale-aware `Link`, `useRouter`, `getPathname` utilities. Alternate link generation for hreflang.
- **Message files** — Per-locale JSON message files for UI strings (not content — content lives in the Local CMS).

### Forms

- **Library** — TanStack Form for form state management.
- **Validation** — Zod schemas for form validation, shared pattern with CMS content validation.
- **Backend** — Web3Forms as the default third-party form service. Configurable via `NEXT_PUBLIC_FORM_ENDPOINT` env var. The template ships working with a Web3Forms access key.
- **Contact form fields** — Name, email, message. Success and error states with user-facing feedback (toast/inline).

### Component Directory Structure

- The **current file structure is the source of truth** (SSOT). The architecture doc and `components.json` must be updated to match the codebase, not the other way around.
- `src/components/ui/` — shadcn components (not `src/shared/components/ui/`).
- `src/components/layout/` — Layout components (Header, Footer). Hotel Example content — stripped by reset.
- `src/components/shared/` — Shared example components. Hotel Example content — stripped by reset.
- `src/shared/hooks/` — Generic hooks.
- `src/shared/lib/` — Utilities (`cn()`, formatters).
- `src/features/` — Feature modules with barrel exports (hotel features — stripped by reset).
- `components.json` aliases must be corrected to point to actual locations.

### Tooling

- **Storybook** — Configured for Next.js App Router. At least one example story for a Hotel Example component.
- **Playwright** — Multi-browser projects (Chromium, Firefox, WebKit). Example smoke tests (homepage loads, navigation, 404). Extended later for accessibility, SEO, cross-browser, responsive.
- **Unlighthouse** — `@unlighthouse/cli` with `unlighthouse-ci` command. Baseline threshold: Performance budget ≥ 90.
- **Bundle Analyzer** — `@next/bundle-analyzer` behind `ANALYZE` env var. No hard bundle budgets in v1 — diagnostic use only.
- **Security** — `pnpm audit:ci` failing on critical/high CVEs. OWASP headers in `vercel.json` only for v1. CSP template with relaxation instructions (not drop-in).
- **Version Pinning** — Exact versions for Next.js, React, TypeScript, Tailwind. `pnpm.overrides` for transitive deps where needed.
- **CI** — `.github/workflows/ci.yml` running lint, test, build, audit on PRs.

### Quality Assurance

- **QA reports** — Local HTML files in `.qa/` directory. No hosted reports. The Agency screenshots them into a Client deck.
- **QA umbrella** — `pnpm qa` runs all `qa:*` scripts, exits non-zero on failure. Suitable as CI gate.
- **QA report script** — `scripts/qa-report.sh` runs all QA categories sequentially and collects into `.qa/`.
- **Execution gates** — (1) Performance + Accessibility first, (2) SEO, (3) Security + Bundle, (4) Cross-Browser + Reporting.

### Reset Script

- **Aggressive reset** — Strips to bare skeleton.
- **Survives reset**: Root layout, `[locale]/page.tsx` skeleton, `globals.css`, shadcn (`src/components/ui/`), shared utilities (`src/shared/`), env validation, all config files, tooling configs, documentation, i18n infrastructure (next-intl config, `[locale]` routing, message files, empty content directories).
- **Stripped by reset**: `(marketing)/` route group (hotel pages), `src/components/layout/`, `src/components/shared/`, `src/content/` records (directories kept, files removed), `src/features/`, media files, example stories, example E2E tests.
- **Post-reset state**: App runs with a skeleton `[locale]/page.tsx` showing "Welcome." in all three locales. Content directories are empty. i18n routing works.

## Testing Decisions

### What makes a good test

Tests assert **external behavior**, not implementation details. A content loader test verifies that given a valid JSON file, the loader returns a correctly typed object — not that it uses `fs.readFileSync` internally. A component test verifies that a room card renders the room title and price — not that it calls a specific prop name. A reset script test verifies the post-reset file system state — not which `rm` commands were used.

### Test seams (highest to lowest)

**S1 — Build (`next build`)**: The ultimate integration test. Invalid content fails Zod validation during `generateStaticParams` → build fails with a clear error. Locale routing, static params, and metadata generation are all verified transitively. No new test infrastructure needed — the build itself is the assertion.

**S2 — E2E (Playwright)**: Verifies pages render in all 3 locales, navigation works between rooms, i18n switching produces correct content and URLs, contact form submits successfully, 404 renders correctly, and responsive viewports don't break layout. axe-core integration runs accessibility assertions against all pages. Multi-browser projects cover Chromium, Firefox, WebKit. Prior art: Playwright is a new addition (§2.2), so no existing E2E tests.

**S3 — Content Loader (Vitest)**: Tests each Content Loader function in isolation. Validates: valid JSON → typed output matching Zod schema; invalid JSON → Zod error with descriptive message; missing locale file → explicit error (not silent fallback); missing slug → not-found result. This is the highest-value new seam because it tests the entire CMS pipeline (JSON file → Zod parse → typed output) without needing a browser. Prior art: `src/test/button.test.tsx` establishes the Vitest + `src/test/` pattern.

**S4 — Component (Vitest + React Testing Library)**: Tests page components and shared components render correctly given mock Content Loader output. Contact form validates inputs, shows errors on invalid submission, and calls the submission endpoint on valid input. Prior art: `src/test/button.test.tsx` uses this exact pattern (Vitest + RTL + `@testing-library/jest-dom`).

**S5 — Reset script (shell)**: Runs `scripts/reset-example.sh` and asserts the post-reset file system state matches the spec: hotel content files gone, `[locale]/page.tsx` skeleton present, i18n infrastructure intact, shadcn intact, config intact, content directories present but empty. This is a one-time verification test, not a continuous suite.

### Test prioritization

Content Loader tests (S3) should be written first because they validate the CMS contract that everything else depends on. Component tests (S4) follow once loaders are stable. E2E tests (S2) are written after example pages exist. Build verification (S1) runs as part of CI. Reset script tests (S5) are written alongside the reset script itself.

## Out of Scope

The following are explicitly excluded from v1:

- **`neverthrow` / Result monad** — Zod + build-time failure is sufficient for static-export. Template users can add it when graduating to SSR.
- **`(app)` route group** — No authenticated pages, no dashboard, no auth flow in v1. The architecture doc documents the pattern for v2.
- **Multi-platform hosting configs** — No `netlify.toml`, Cloudflare `_headers`, or GitHub Pages workflow in v1. Only `vercel.json` with security headers. Other platforms deferred to v2.
- **Custom static image loader** — v1 uses Vercel's built-in optimizer. Build-time image pipeline (sharp/squoosh) deferred to v2.
- **ISR (Incremental Static Regeneration)** — The starter baseline is `output: 'export'` only. ISR is a separate variation, not a baseline feature.
- **Server actions / API routes** — Not compatible with static export. The contact form uses Web3Forms (third-party) instead.
- **Remote CMS integration** — The Local CMS is the content source. Adapters for Strapi, Contentful, Sanity etc. are future work.
- **CMS admin UI** — Content is authored by editing JSON files directly. No visual editor or admin dashboard.
- **Bundle size budgets** — The bundle analyzer is wired for diagnostics only. No hard thresholds in v1.
- **Webhook / automation integrations** — Web3Forms free tier handles form submissions. No CRM, Slack, or Zapier integrations.
- **Performance monitoring / RUM** — No Real User Monitoring, Web Vitals tracking, or analytics beyond Unlighthouse QA checks.
- **A/B testing / feature flags** — Not part of a static marketing site template.
- **Database / ORM** — No database layer. Content is JSON files.

## Further Notes

### Execution order

Implementation follows this dependency chain:

1. **Configuration fixes** — Correct `components.json` aliases to match actual file structure. Update `ARCHITECTURE.md` to match SSOT codebase. These are prerequisites that prevent confusion during all subsequent work.
2. **i18n baseline (§1A)** — Install `next-intl`, configure `[locale]` routing, implement URL-prefixed strategy for en/el/de, set up message files and navigation helpers. Everything else grows from this stable routing base.
3. **Local CMS baseline (§2A)** — Implement content directory structure, Zod schemas, Content Loaders, Media Record model. The content model must be stable before example pages are built against it.
4. **Hotel Example content (§1)** — Populate JSON records, build example components, create the four pages, wire the contact form. Content loaders feed the pages.
5. **Tooling (§2)** — Install and configure Storybook, Playwright, Unlighthouse, bundle analyzer, audit script, CI pipeline, version pinning, TanStack Form. These tools test and validate the work from steps 2–4.
6. **QA Framework (§4)** — Configure thresholds, wire axe-core, add SEO routes, security headers, responsive tests, QA umbrella script. Follows the four execution gates (Performance + Accessibility → SEO → Security + Bundle → Cross-Browser + Reporting).
7. **Documentation (§3 + §5)** — Write TECH_STACK.md, update README, ARCHITECTURE.md, CONVENTIONS.md, ROUTINES.md, create DEPLOYMENT.md. Documentation waits until the codebase reflects what it describes.

### Pre-existing issues to fix early

- `components.json` aliases point to `src/shared/components/ui/` but actual files are in `src/components/ui/`. Must be corrected before adding any new shadcn components.
- `src/shared/components/ui/` is empty (`.gitkeep` only). Either remove it or keep as a reminder that the config is wrong.
- `ARCHITECTURE.md` example diagram shows `src/components/ui/` AND `src/shared/` as separate top-level directories, conflicting with its own Layer 2 section. Must be reconciled with the SSOT codebase.
- Existing `src/app/(marketing)/` route group will be restructured into `src/app/[locale]/(marketing)/` as part of the i18n baseline.

### Decisions captured in CONTEXT.md

All domain vocabulary and architectural decisions from the grilling session have been captured in `CONTEXT.md` at the repo root. Future agents and contributors should read it before working on this template.

### v2 transition notes

When the template graduates beyond v1:

- Add multi-platform security headers (Netlify, Cloudflare Pages, GitHub Pages).
- Build a custom static image loader with build-time optimization (sharp/squoosh).
- Consider adding an `(app)` route group with auth if a Server-side rendering mode is introduced.
- Re-evaluate `neverthrow` if server actions or API routes are added.
- Add remote CMS adapters if the Local CMS needs to sync with Strapi/Contentful/Sanity.

### Triage

Status: ready-for-agent
