# PRD — Tier 1 Marketing Template

## Problem Statement

A solo freelancer delivering static marketing sites reinvents the same infrastructure per project. Every engagement re-wires i18n, content models, SEO, accessibility, theme tokens, component rendering, and QA tooling from scratch — inconsistently and slowly. No reusable starting point exists that ships with a working content model, theme system, component library, and QA pipeline without being bloated with demo content or agency workflows.

The freelancer needs a bare skeleton template they clone per client, populate with content, style with a theme instance, run through a QA pipeline, and deploy — all within a few hours. The template must work under a hard static-export constraint: no server runtime, no API routes, no ISR.

## Solution

A static-export-only Next.js template with five pillars:

1. **Local JSON CMS** — Adapter-driven content model backed by repo-local JSON files. Collection Types (Pages, Testimonials) and Single Types (Site Settings) with Zod-validated Content Loaders. Invalid content fails at build time. The adapter interface (`getPage`, `getGlobalSettings`) is shared — `LocalCmsAdapter` implements it for Tier 1, future `SanityCmsAdapter` for Tier 2.

2. **Slice Renderer** — A 4-stage pipeline from JSON to rendered components: JSON file → Content Loader (Zod) → PageModel (normalized) → SliceRenderer (component registry). Each page has an ordered `slices` array of discriminated-union content components. Adding a slice is a 2-file operation: schema + component.

3. **Theme System** — ~15–20 semantic tokens across four categories (Color, Typography, Spacing, Motion) applied as CSS custom properties on `:root`, mapped to Tailwind utilities. Components reference semantic tokens, never raw values. A theme instance is one JSON/CSS block. The freelancer composes 2–3 instances per client; the client picks one.

4. **Component Library** — 7 components: Navigation + Footer (layout-level, always present) + 5 composable slices (Hero, Features, Testimonials, FAQ, CTA Band). No demo site, no Hotel Example — the template ships as a bare skeleton with empty content directories.

5. **QA Pipeline** — Performance (Lighthouse), accessibility (axe-core), SEO (metadata, sitemap, robots, canonical, hreflang), security (dependency audit), and bundle analysis. A `pnpm qa` umbrella script generates local HTML reports in `.qa/` that the freelancer screenshots into a client-facing summary.

The template targets Cloudflare Pages (unlimited free static sites) as the default deployment target. Each client is a separate Cloudflare Pages project. No CI pipeline — the freelancer runs `pnpm qa` manually before deploying.

## User Stories

### Local CMS Content Model

1. As a Freelancer, I want Pages stored as a Collection Type identified by slug, so that Tier 1 starts with one page (slug "home") and new pages are added by creating JSON files without schema changes.
2. As a Freelancer, I want each Page record to contain an ordered `slices` array where each slice is a discriminated union (`{ type, data }`), so that page composition is flexible and data-driven.
3. As a Freelancer, I want slice schemas defined as Zod Content Components, so that the data shape each slice expects is validated at build time.
4. As a Freelancer, I want Testimonials as a Collection Type, so that the Testimonials slice can render repeatable client quotes without hardcoding.
5. As a Freelancer, I want Site Settings as a Single Type (one record per locale), so that global content — site name, default SEO fallback, contact info, social links, logo — has a predictable home.
6. As a Freelancer, I want content stored as one JSON file per locale per record, so that I can see exactly what content exists per locale and spot missing translations easily.
7. As a Freelancer, I want locale-aware content structures, so that each locale owns its own records and the CMS model works cleanly with the i18n routing.
8. As a Freelancer, I want adding a new slice to be a 2-file operation (Zod schema + React component + registry entry), so that the content model grows without cross-cutting changes.

### CMS Adapter Interface

9. As a Freelancer, I want a shared CMS adapter interface (`getPage(slug, locale)`, `getGlobalSettings(locale)`) that `LocalCmsAdapter` implements, so that the adapter is the sole interface between content and the application — no direct JSON imports anywhere.
10. As a Freelancer, I want the adapter interface to accept locale as a parameter, so that content loading is locale-aware by design.
11. As a Freelancer, I want the adapter interface to be stable enough that a future `SanityCmsAdapter` can implement the same contract, so that the Tier 2 fork plugs in without changing rendering code.

### Content Loaders

12. As a Freelancer, I want Zod-validated Content Loaders that read JSON files, parse them through schemas, and return typed objects, so that invalid content fails at build time with a descriptive error — not in production.
13. As a Freelancer, I want Content Loaders to be the sole interface between CMS data and the application, so that no component or route ever imports a JSON file directly.
14. As a Freelancer, I want missing locale files to produce explicit errors (not silent fallback to the default locale), so that incomplete translations are visible immediately.
15. As a Freelancer, I want each loader to accept a slug and locale parameter, so that page-level and record-level lookups are explicit and type-safe.

### Slice Renderer

16. As a Freelancer, I want a 4-stage rendering pipeline (JSON → Content Loader → PageModel → SliceRenderer), so that content flows through validation, normalization, and rendering in a predictable sequence.
17. As a Freelancer, I want the PageModel to contain `slug`, `seo`, and an ordered `slices` array, so that the route has everything it needs to render a page.
18. As a Freelancer, I want a slice registry that maps type strings to React components, so that the SliceRenderer iterates slices and renders the correct component for each.
19. As a Freelancer, I want no lazy loading and no per-slice error boundaries, so that the rendering pipeline stays simple — Zod catches bad data at build time, and a slice failure is a build failure.

### Theme System

20. As a Freelancer, I want ~15–20 semantic tokens across Color, Typography, Spacing, and Motion categories, so that every component references meaningful names (primary, surface, text-muted) instead of raw Tailwind values.
21. As a Freelancer, I want tokens applied as CSS custom properties on `:root` and mapped to Tailwind utilities, so that theme changes are CSS-level swaps with no component code changes.
22. As a Freelancer, I want a theme instance to be a single JSON/CSS block that fills all semantic tokens, so that composing 2–3 theme instances per client is straightforward.
23. As a Freelancer, I want no dark mode, no per-component theme overrides, and no color scales, so that the theme system stays simple and every site has a consistent, harmonious look.
24. As a Freelancer, I want theme tokens to cover: Color (primary, secondary, accent, background, surface, text, text-muted, border), Typography (font-heading, font-body, text-base, text-scale), Spacing (radius, section-gap), Motion (transition-fast, transition-slow), so that the token set is complete for marketing site styling.

### Components

25. As a Freelancer, I want a Navigation component that renders site name/logo and locale-aware links, so that visitors can navigate and switch languages.
26. As a Freelancer, I want a Footer component that renders site info, social links, and legal text from Site Settings, so that the footer is always data-driven.
27. As a Freelancer, I want a Hero slice that renders a headline, subheadline, background media, and optional CTA button, so that every landing page has an impactful top section.
28. As a Freelancer, I want a Features slice that renders a grid of feature items (icon, title, description), so that client services or product features are presented clearly.
29. As a Freelancer, I want a Testimonials slice that iterates over the Testimonials Collection Type and renders client quotes, so that social proof is data-driven and easily updated.
30. As a Freelancer, I want a FAQ slice that renders expandable question-answer pairs, so that common client questions are addressed without custom coding.
31. As a Freelancer, I want a CTA Band slice that renders a call-to-action section with an inline contact form, so that lead capture is built into the page flow.
32. As a Freelancer, I want all 7 components to reference semantic theme tokens exclusively, so that applying a new theme instance changes the entire visual identity with zero component edits.

### CTA / Contact

33. As a Freelancer, I want the CTA Band slice to render an inline `<form>` that POSTs to a third-party provider, so that form submissions work under the static-export constraint.
34. As a Freelancer, I want Formspree as the default CTA provider (50 submissions/month free, dashboard, submission history), so that most clients get a working contact form at zero cost.
35. As a Freelancer, I want Web3Forms as a fallback CTA provider (250 submissions/month free, no dashboard), so that higher-volume clients have a free-tier option.
36. As a Freelancer, I want both providers to implement a `CtaProvider` interface, so that switching providers is a configuration change, not a code change.
37. As a Freelancer, I want the CTA provider key configured via `.env.local`, so that secrets never enter the repository.

### SEO

38. As a Freelancer, I want each Page record to include an SEO Content Component (title, description, OG image, noindex flag), so that every page has metadata wired to `generateMetadata`.
39. As a Freelancer, I want Site Settings to include a default OG image and title template, so that pages without explicit SEO fields still produce valid metadata.
40. As a Freelancer, I want a static `sitemap.xml` generated from content loaders × locales at build time, so that search engines discover every page and locale variant.
41. As a Freelancer, I want a static `robots.txt` allowing all crawlers, so that no page is accidentally blocked.
42. As a Freelancer, I want canonical URLs generated per page via `generateMetadata`, so that search engines index the correct canonical.
43. As a Freelancer, I want hreflang tags generated for all locale variants of each page, so that search engines serve the correct language to users.

### Internationalization

44. As a Freelancer, I want `next-intl` configured on the App Router with URL-prefixed locales including the default (`/en/`, `/el/`, `/de/`), so that search engines index every locale variant and hreflang tags are unambiguous.
45. As a Freelancer, I want explicit fallback rules for messages and content fields, so that missing translations are intentional and visible — not silently falling back to English.
46. As a Freelancer, I want locale-aware navigation and alternate link helpers, so that hreflang, canonical URLs, and language switchers work correctly out of the box.
47. As a Freelancer, I want a root `/` redirect to the default locale (`/en/`), so that no page is served without a locale prefix.
48. As a Freelancer, I want single-language sites to configure one locale, so that i18n infrastructure does not add overhead for clients who only need one language.

### Deployment

49. As a Freelancer, I want Cloudflare Pages as the default deployment target (unlimited free static sites), so that per-client hosting costs are zero.
50. As a Freelancer, I want deployment via `npx wrangler pages deploy out/` or Git-connected auto-deploy, so that the deploy workflow matches my preference.
51. As a Freelancer, I want no CI pipeline — just manual `pnpm qa` before deploy, so that the workflow stays simple for a solo freelancer.
52. As a Freelancer, I want per-client configuration (locales, theme tokens, CTA provider key, site name, content JSON) to live in the repo and `.env.local`, so that each client project is self-contained.
53. As a Freelancer, I want each client to be a separate Cloudflare Pages project, so that client sites are isolated and independently managed.

### QA Pipeline

54. As a Freelancer, I want a `pnpm qa` umbrella script that runs all QA checks and exits non-zero on any failure, so that quality verification is a single command before deploy.
55. As a Freelancer, I want Lighthouse performance checks with thresholds (Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1), so that performance regressions are caught before client delivery.
56. As a Freelancer, I want axe-core integrated with Playwright for automated WCAG 2.2 AA accessibility assertions, so that critical/serious violations never reach a client site.
57. As a Freelancer, I want a `pnpm qa:security` script that fails on critical/high CVEs, so that dependency vulnerabilities are caught.
58. As a Freelancer, I want `@next/bundle-analyzer` wired for diagnostic inspection, so that I can investigate bundle bloat when needed.
59. As a Freelancer, I want QA reports generated as local HTML files in `.qa/`, so that I can screenshot key metrics into a client-facing summary.

### Reset Script

60. As a Freelancer, I want a reset script that strips all content and pages, leaving a bare i18n skeleton with empty content directories, so that I can start a clean client project from the template.
61. As a Freelancer, I want the reset to preserve i18n infrastructure, theme system, component library, and all config/tooling, so that the architecture stays intact after reset.
62. As a Freelancer, I want the post-reset app to build and render a skeleton page in all configured locales, so that the template is immediately usable after reset.

## Implementation Decisions

### Static Export — Hard Constraint

`output: 'export'` in `next.config.ts`. No server features in Tier 1: no SSR, no server actions, no API routes, no ISR. CTA/contact forms handled via third-party free-tier services (Formspree/Web3Forms). The Tier 2 fork drops this constraint.

### Adapter-Driven Content Model

Pages are a Collection Type identified by slug — not a special Homepage Single Type. Tier 1 starts with one page record: slug `"home"`. Each Page record contains an ordered `slices` array where each slice is a discriminated union (`{ type, data }`). Slice schemas are defined as Zod Content Components. Collection Types are added for any repeatable entity (e.g., Testimonials). Site Settings remains a Single Type for `getGlobalSettings()`.

The adapter interface is the source of truth:
- `getPage(slug, locale)` → returns `PageModel` or throws
- `getGlobalSettings(locale)` → returns typed global settings

`LocalCmsAdapter` implements this interface by reading JSON files through Content Loaders. Future adapters (Sanity) implement the same contract. Adding a page = JSON file. Adding a slice = Zod schema + React component + registry entry.

### Slice Renderer Pipeline

4-stage pipeline: JSON file → Content Loader (Zod validation) → PageModel (normalized) → SliceRenderer (component registry).

PageModel shape:
```
{
  slug: string
  seo: { title, description, ogImage?, noindex? }
  slices: Array<{ type: string, data: unknown }>
}
```

The slice registry maps type strings to React components. `SliceRenderer` iterates the `slices` array, looks up each type in the registry, and renders the corresponding component with validated data. No lazy loading, no per-slice error boundaries, no runtime validation — Zod catches bad content at build time.

Route handler calls `cmsAdapter.getPage(slug, locale)` and passes the result to `SliceRenderer`.

### Component Inventory

7 components total:

- **Navigation** — Layout-level, always present. Renders site name/logo and locale-aware links.
- **Footer** — Layout-level, always present. Renders site info, social links, legal text from Site Settings.
- **Hero** — Composable slice. Headline, subheadline, background media, optional CTA button.
- **Features** — Composable slice. Grid of feature items (icon, title, description).
- **Testimonials** — Composable slice. Iterates Testimonials Collection Type records.
- **FAQ** — Composable slice. Expandable question-answer pairs.
- **CTA Band** — Composable slice. Call-to-action with inline contact form.

Gallery, Carousel, and standalone Contact Form are deferred — not justified for single-page landing sites.

### Theme System

~15–20 semantic tokens across 4 categories:

| Category | Tokens |
|----------|--------|
| Color | primary, secondary, accent, background, surface, text, text-muted, border |
| Typography | font-heading, font-body, text-base, text-scale (ratio) |
| Spacing | radius, section-gap |
| Motion | transition-fast, transition-slow |

Applied as CSS custom properties on `:root`, mapped to Tailwind utilities. Components reference semantic tokens exclusively — never raw Tailwind values. A theme instance is one JSON/CSS block filling all tokens.

No dark mode, no per-component theme overrides, no color scales, no layout tokens.

### CTA Providers

Formspree (default): 50 submissions/month free, dashboard, submission history.
Web3Forms (fallback): 250 submissions/month free, no dashboard.

Both implement a `CtaProvider` interface. The CTA Band slice renders an inline `<form>` that POSTs directly to the configured provider — no redirect to an external page. Provider key configured via `.env.local`. Switching providers is a configuration change, not a code change.

### SEO

5 items in scope:
1. Page metadata — title, description, OG image per page via `generateMetadata`
2. `sitemap.xml` — static generation from content loaders × locales at build time
3. `robots.txt` — static allow-all
4. Canonical URLs — generated per page via `generateMetadata`
5. `hreflang` tags — locale variants via `generateMetadata`

Site Settings holds default OG image and title template for pages without explicit SEO fields.

Deferred: JSON-LD structured data, advanced OG/Twitter cards, SEO scoring/auditing.

### Deployment

Cloudflare Pages as Tier 1 default (unlimited free static sites). Vercel for Tier 2 (needs server runtime). The template is static-export — works on any static host, but Cloudflare is the documented default.

Deploy via `npx wrangler pages deploy out/` or Git-connected auto-deploy. No CI pipeline — manual `pnpm qa` before deploy. Per-client configuration: locales, theme tokens, CTA provider key (`.env.local`), site name, content JSON. Each client = separate Cloudflare Pages project.

### Project Setup

No scaffolding CLI. Use GitHub template, `npx degit`, or a manual checklist. Revisit a CLI tool when volume reaches 20+ projects/year.

Two templates in separate repos. Current repo = Tier 1. Tier 2 is a separate fork created when the first Tier 2 client appears. Shared package extraction when 3+ projects of each tier exist.

### AI Delivery Workflow

5-phase per-client delivery workflow, each AI-assisted:

1. **Intake** — AI extracts structured requirements from the client brief.
2. **Content Modeling** — AI writes Local CMS JSON files from the structured brief.
3. **Theme Selection** — AI generates 2–3 theme instances from client constraints; client picks one.
4. **Build & QA** — AI runs `pnpm build` → `pnpm qa`, reads reports, fixes failures.
5. **Deploy & Deliver** — AI deploys to Cloudflare Pages, screenshots QA, sends client summary with upsell note.

Two new custom skills: `client-intake` (brief → structured requirements) and `theme-composer` (constraints → theme instances). These are specific applications of existing skill patterns, not a new pipeline.

## Testing Decisions

### What makes a good test

Tests assert external behavior, not implementation details. A Content Loader test verifies that given valid JSON, the loader returns a correctly typed object — not that it uses `fs.readFileSync` internally. A component test verifies that a Hero renders the headline and CTA — not that it calls a specific prop name. A reset script test verifies post-reset file system state — not which `rm` commands were used.

### Test seams (highest to lowest value)

**S1 — Build (`next build`)**: The ultimate integration test. Invalid content fails Zod validation during `generateStaticParams` → build fails with a clear error. Locale routing, static params, and metadata generation are all verified transitively.

**S2 — E2E (Playwright)**: Verifies pages render in all configured locales, navigation works, i18n switching produces correct content and URLs, CTA form submits, responsive viewports (320px, 375px, 768px, 1280px, 1440px) don't break layout. axe-core integration runs accessibility assertions against all pages. Multi-browser projects cover Chromium, Firefox, WebKit.

**S3 — Content Loader (Vitest)**: Tests each Content Loader in isolation. Validates: valid JSON → typed output matching Zod schema; invalid JSON → Zod error with descriptive message; missing locale file → explicit error; missing slug → not-found result. This is the highest-value new seam — it tests the entire CMS pipeline (JSON → Zod → typed output) without a browser.

**S4 — Component (Vitest + React Testing Library)**: Tests slice components render correctly given mock Content Loader output. CTA Band renders form and submits to provider. Components reference correct semantic tokens.

**S5 — Reset script (shell)**: Runs the reset script and asserts post-reset file system state: content files gone, skeleton page present, i18n infrastructure intact, theme system intact, component library intact, config intact, content directories present but empty.

### Test prioritization

Content Loader tests (S3) are written first — they validate the CMS contract everything depends on. Component tests (S4) follow once loaders are stable. E2E tests (S2) are written after pages exist. Build verification (S1) runs as part of the development cycle. Reset script tests (S5) are written alongside the reset script.

## Out of Scope

The following are explicitly excluded from Tier 1:

- **Scaffolding CLI** — GitHub template / `npx degit` / manual checklist is sufficient. Revisit at 20+ projects/year.
- **Server runtime** — No SSR, no server actions, no API routes. Static export is a hard constraint.
- **ISR (Incremental Static Regeneration)** — Not compatible with static export.
- **Dark mode** — Theme system is light-only for Tier 1.
- **Per-component theme overrides** — Theme applies globally, not per component.
- **Color scales** — Tokens are single values, not palette scales.
- **Lazy loading slices** — All slices render synchronously.
- **Per-slice error boundaries** — Build-time Zod validation makes runtime slice errors unnecessary.
- **Runtime validation** — Zod runs at build time only.
- **JSON-LD structured data** — Deferred to Tier 2 or future enhancement.
- **Advanced OG/Twitter cards** — Basic OG image and title only.
- **SEO scoring/auditing** — No automated SEO scoring tool.
- **CI pipeline** — Manual `pnpm qa` before deploy.
- **Analytics** — No analytics integration in Tier 1.
- **Blog** — Tier 2 scope.
- **External CMS (Sanity, Payload)** — Tier 2 scope.
- **Demo site / Hotel Example** — The template ships as a bare skeleton with empty content directories.
- **Monorepo restructuring** — Happens only when 3+ projects of each tier provide evidence for shared code boundaries.
- **Multi-platform hosting configs** — Cloudflare Pages is the default. Other platforms work (it's static export) but are not documented targets.

## Further Notes

### Commercial positioning

Tier 1 is foot-in-the-door pricing: €300–400 per site, capped at 2 revision rounds. The template makes dev work <5 hours. Every delivery includes a "when you're ready to grow" upsell conversation for Tier 2 services (blog, Sanity, analytics, CI).

### Execution order

Implementation follows this dependency chain:

1. **CMS adapter interface + content model schemas** — Define the adapter contract and Zod schemas. These are the foundation everything depends on.
2. **Content loaders** — Implement typed loaders reading JSON through Zod. Highest-value test seam.
3. **Theme system** — Semantic tokens, CSS custom properties, Tailwind utilities, theme instance format.
4. **Slice renderer** — 4-stage pipeline, component registry, 5 composable slices + Navigation + Footer.
5. **Hybrid routing** — Explicit static routes in `[locale]/(marketing)/`, generateMetadata for SEO, sitemap, robots.
6. **CTA integration** — Formspree/Web3Forms provider interface, CTA Band slice with inline form.
7. **QA pipeline** — Wire Lighthouse, axe-core, security audit, bundle analyzer, responsive tests.
8. **Reset script** — Strip to bare skeleton, verify post-reset state.
9. **AI skills** — `client-intake` and `theme-composer` skills for the delivery workflow.

### Tier 2 transition

When the first Tier 2 client appears: fork this repo into a separate repository. Add Sanity adapter (implementing the shared CMS adapter interface), server runtime (drop static export), blog infrastructure, CI pipeline, and analytics. The Tier 2 fork shares no code dependency with this repo. Common patterns may be extracted into a shared package when 3+ projects of each tier exist.

### Feature Registry

| Name | Type | Phase | Dependencies | Description |
|------|------|-------|-------------|-------------|
| `cms-adapter-interface` | horizontal | 1 | none | Shared CMS adapter contract (`getPage`, `getGlobalSettings`) that `LocalCmsAdapter` implements |
| `content-model-schemas` | horizontal | 1 | `cms-adapter-interface` | Zod schemas for pages, slices, testimonials, site settings, SEO Content Component |
| `content-loaders` | horizontal | 1 | `content-model-schemas` | Zod-validated loaders reading JSON → typed objects, build-time failure on bad content |
| `theme-completion` | horizontal | 1 | none | Semantic token system (~15-20 tokens), CSS custom properties, Tailwind utilities, theme instance format |
| `slice-renderer` | vertical | 2 | `content-loaders`, `theme-completion` | 4-stage pipeline (JSON → Zod → PageModel → Component registry), 5 composable slices + Navigation + Footer |
| `hybrid-routing` | vertical | 2 | `slice-renderer` | Explicit static routes in `[locale]/(marketing)/`, `generateMetadata` for SEO, sitemap, robots |

Note: `hotel-example` (id 9 in features-status.json) is superseded by this feature. No demo site ships with Tier 1. The `hotel-example` feature should be archived.

### Triage

Status: ready-for-agent
