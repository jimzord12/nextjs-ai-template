# TODO — Next.js AI Template

This document tracks the remaining work to turn this scaffold into a production-grade Next.js static-site template optimized for AI agent workflows.

> **Decided direction:**
>
> - The starter baseline will target static export (SSG / `output: 'export'`) only. ISR is explicitly out of scope for this phase and should be handled later as a separate variation.
> - Internationalization will use `next-intl` as the default i18n solution.
> - The i18n routing strategy is decided now: all locales are URL-prefixed, including the default locale.
> - Slugs are localized per locale, not shared globally.
> - Fallback behavior should be explicit and limited, not silent global fallback.
> - Content modeling should follow a local-CMS experience inspired by Strapi's mental model and conventions.
> - Local CMS records and reusable component data will be stored as JSON.
> - Media will use a local media library with structured metadata and references, not raw file-path-only content fields.
> - This means content work should favor collection types, single types, components, shared fields, slugs, SEO fields, and locale-aware content structures that feel familiar to Strapi users, even when implemented locally inside the repo.

> **Reading guide:** Tasks within each section are numbered in execution order. Cross-references (`§N`) point to related work in other sections. Heavy-lift sections are marked with ⚡.
>
> **Difficulty scores `[D:N]`** — honest estimate of how hard this task is for an AI agent to complete correctly in one pass, on a 1–5 scale:
>
> | Score | Meaning                                                                                                                      |
> | ----- | ---------------------------------------------------------------------------------------------------------------------------- |
> | **1** | Trivial — mechanical, nearly zero risk of getting wrong                                                                      |
> | **2** | Straightforward — well-documented path, may need one iteration                                                               |
> | **3** | Moderate — requires design decisions, integration knowledge, or careful edge-case handling                                   |
> | **4** | Hard — multiple moving parts, non-obvious constraints, high risk of subtle bugs                                              |
> | **5** | Expert — requires deep domain expertise, significant architectural judgment, or iterative debugging that is hard to automate |

---

## 1. Example Content & Clean-Slate Script

Provide working demo content so developers can see how the template works end-to-end, with a one-command reset to a blank state.

- [ ] 1.0 Define the canonical local content model baseline before example content lands: mirror Strapi-style conventions for collection types, single types, reusable components, SEO fields, slugs, publish-ready content records, and locale-aware entries so all example content follows one predictable shape. This is the source-of-truth design task that §2A implements in code and directory structure `[D:3]`
- [ ] 1.1 Populate the local JSON CMS with example collection records, single types, reusable component data, and media metadata that the example pages will consume `[D:3]`
- [ ] 1.2 Build example shared components (e.g. card grid, CTA section, content sections) under `src/components/` that demonstrate the architecture conventions from `docs/ARCHITECTURE.md` `[D:3]`
- [ ] 1.3 Create example pages under `src/app/(marketing)/` — at minimum: a rich homepage and one detail page demonstrating SSG patterns (`generateMetadata`, `generateStaticParams`), locale-aware routing, localized metadata patterns, and static-safe `next/image` usage for local media `[D:3]`
- [ ] 1.4 Create `scripts/reset-example.sh` (or `.mjs`) that removes all example content and resets the codebase to a minimal blank-slate state — a skeleton homepage, cleared example JSON content records, cleared example media metadata/assets, empty `src/components/` (except `ui/`), and no example content data. The script must leave the architecture, config, and tooling untouched `[D:4]`
- [ ] 1.5 Document the reset script in the README with usage instructions `[D:1]`
- [ ] 1.6 Document the partial-removal story: what a template user should do to opt out of individual tools (e.g. remove Storybook, skip Playwright). Where clean removal isn't feasible, state explicitly "manual removal required" `[D:3]`

---

## 1A. Internationalization Baseline

Install and standardize the i18n approach early so routes, metadata, content, and example pages are all shaped around the same locale model.

- [ ] 1A.1 Install and configure `next-intl` for the App Router with a default locale, locale list, and locale-aware navigation utilities `[D:3]`
- [ ] 1A.2 Implement the chosen locale strategy: every locale is URL-prefixed, including the default locale `[D:3]`
- [ ] 1A.3 Implement localized slug handling so each locale can own its own slug values `[D:3]`
- [ ] 1A.4 Implement explicit fallback rules for messages and content fields; avoid silent global fallback behavior `[D:3]`
- [ ] 1A.5 Create locale-aware navigation, alternate links, and canonical URL helpers that assume the always-prefixed strategy `[D:3]`
- [ ] 1A.6 Ensure the example routes and content from §1 are implemented against the `next-intl` model rather than retrofitted later `[D:3]`
- [ ] 1A.7 Document how template users add a new locale, translation messages, and localized page metadata `[D:2]`

---

## 2. Tooling & CI — Installation & Configuration

> **Scope:** Install and configure tools only. Thresholds, assertions, and reporting belong in §4.

Add best-practice tools that a professional static-site project should ship with.

- [ ] 2.1 **Storybook** — install and configure for component development and visual documentation `[D:3]`
  - [ ] 2.1.1 Install Storybook, configure for Next.js App Router, add `pnpm storybook` script `[D:3]`
  - [ ] 2.1.2 Create at least one example story alongside the example components from §1 `[D:2]`
- [ ] 2.2 **Playwright** — install `playwright` and add `playwright.config.ts`. Configure with multi-browser projects: Chromium, Firefox, WebKit. Add example smoke tests (homepage loads, navigation works, 404 renders). Do not add thresholds or reporting here — see §4.1 and §4.6 `[D:3]`
- [ ] 2.3 **Lighthouse CI** — install `@lhci/cli` and add a `.lighthouserc.js` config. Add a `pnpm lhci` script. Leave threshold configuration for §4.1 `[D:2]`
- [ ] 2.4 **Bundle Analyzer** — add `@next/bundle-analyzer` to `next.config.ts` behind an `ANALYZE` env var. Add a `pnpm analyze` script. Leave bundle inspection and reporting guidance for §4.5 `[D:2]`
- [ ] 2.5 **npm audit / pnpm audit** — add a `pnpm audit:ci` script that fails on critical/high CVEs. Suitable for CI gates `[D:1]`
- [ ] 2.6 **CI Pipeline** — create `.github/workflows/ci.yml` that runs on PRs: lint (`pnpm lint`), test (`pnpm test`), build (`pnpm build`), and audit (`pnpm audit:ci`). This is the backbone referenced by §4 security tasks `[D:3]`
- [ ] 2.7 **Version Pinning** — audit `package.json` ranges and pin critical deps (Next.js, React, TypeScript, Tailwind) to exact versions. Use `pnpm.overrides` in `package.json` for transitive dependency pinning where needed. Document the pinning rationale in `docs/CONVENTIONS.md` or `docs/TECH_STACK.md` so template users understand the tradeoff `[D:2]`
- [ ] 2.8 **TanStack Form** — install and configure TanStack Form as the default form-state solution. Add at least one example form slice wired to the local schema/validation approach so the stack entry in §3 reflects real usage `[D:3]`
- [ ] 2.9 **neverthrow** — install `neverthrow` and establish a baseline result-handling pattern for expected failures in loaders, actions, or content parsing flows. Document the intended usage in `docs/TECH_STACK.md` once introduced `[D:3]`

---

## 2A. Local CMS Experience

Build a local content authoring model that feels familiar to teams used to Strapi, without introducing a remote CMS as a hard dependency for the starter.

- [ ] 2A.1 Implement the local content directory structure and schemas from §1.0 using Strapi-like concepts: collection types, single types, components, media collections, relations where relevant, and SEO fields `[D:3]`
- [ ] 2A.2 Implement JSON-backed storage for content records and reusable component data, and document why JSON is the default fit for this starter's local-CMS contract `[D:2]`
- [ ] 2A.3 Create a local media library model backed by repo-local files plus structured metadata (for example alt text, dimensions, captions, and focal point where relevant) so content references media records rather than raw file paths `[D:3]`
- [ ] 2A.4 Define the static-export-safe image strategy for the local media library using `next/image`, including the approved loader/unoptimized approach, metadata requirements, and usage rules for export mode `[D:3]`
- [ ] 2A.5 Create baseline content schemas and validation so local content behaves like a lightweight CMS contract rather than loose fixture data `[D:3]`
- [ ] 2A.6 Support locale-aware content structures so the CMS model works cleanly with the `next-intl` decision from §1A `[D:4]`
- [ ] 2A.7 Document the mapping between the local model and Strapi terminology so contributors understand the conventions immediately `[D:2]`

---

## 3. Tech Stack Document

> ⚡ **Note:** This section documents the _planned_ stack. Items marked `[planned]` are not yet installed — the doc should clearly distinguish installed vs. planned so agents and humans don't assume capabilities that don't exist. Update each entry to `[installed]` as §2 progresses.

- [ ] 3.1 Create `docs/TECH_STACK.md` with the following sections: `[D:2]`
  - **Core** — TypeScript (strict), Next.js 16 (App Router, static export mode for the starter baseline, no SSR-only features) `[installed]`
  - **Styling** — Tailwind CSS v4, shadcn/ui (base-nova style) `[installed]`
  - **Internationalization** — `next-intl` (App Router i18n, locale-aware routing, localized metadata/messages) `[planned, see §1A]`
  - **Validation** — Zod (schemas for forms, API boundaries, env vars, local CMS content schemas) `[installed]`
  - **Forms** — TanStack Form (reactive, type-safe form state) `[planned, see §2.8]`
  - **Error Handling** — neverthrow (Result monad, no thrown exceptions for expected failures) `[planned, see §2.9]`
  - **Content / Local CMS** — Strapi-inspired local content model and conventions with JSON-backed records/components and a local media library `[planned]`
  - **Linting & Formatting** — Biome (replaces ESLint + Prettier) `[installed]`, Husky + lint-staged (pre-commit hooks) `[installed]`, commitlint (conventional commits) `[installed]`
  - **Testing** — Vitest (unit/integration) `[installed]`, React Testing Library (component tests) `[installed]`, Playwright (E2E) `[planned, see §2.2]`
  - **Component Dev** — Storybook `[planned, see §2.1]`
  - **AI Agents** — `.agents/skills/` (project skills), `AGENTS.md` (agent instructions) `[installed]`
  - **Deployment** — hosting-agnostic static export for the starter baseline (Vercel, Netlify, Cloudflare Pages, GitHub Pages); ISR should be documented later as a separate variation, not assumed here
- [ ] 3.2 For each entry, include: what it is, why we chose it, and a link to its docs `[D:2]`
- [ ] 3.3 Cross-reference `docs/CONVENTIONS.md` where applicable `[D:1]`

---

## 4. Quality Assurance Framework — Thresholds, Assertions & Reporting ⚡

> **This is the heaviest section — roughly 60% of the total effort.** It depends on tools installed in §2 but owns the thresholds and reporting logic exclusively.

> **Execution gates:** Break QA delivery into four reviewable phases so the section does not become one monolithic blob of work.
>
> - **Gate 1 — Performance + Accessibility:** Complete §4.1 and §4.2 first. The starter should meet baseline performance and automated WCAG checks before SEO tuning or cross-browser polish begins.
> - **Gate 2 — SEO:** Complete §4.3 after Gate 1. Metadata, structured data, sitemap, and `hreflang` work should build on the stabilized route/content model.
> - **Gate 3 — Security + Bundle:** Complete §4.4 and §4.5 after Gate 2. CI-enforced security checks and bundle inspection should happen only after the template surface is reasonably stable.
> - **Gate 4 — Cross-Browser + Reporting:** Complete §4.6 and §4.7 last. Multi-browser validation and client-facing report packaging should be the final QA confirmation layer.

Implement a repeatable QA process based on the Next.js Quality Assurance Guide (`docs/in-progress/Nextjs-Quality-Assurance-Guide.pdf`). The goal is to produce third-party-verified, client-presentable evidence for every delivery.

### 4.1 Performance

> Uses Lighthouse CI from §2.3.

- [ ] 4.1.1 Configure Lighthouse CI thresholds: Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 `[D:2]`
- [ ] 4.1.2 Add `pnpm qa:performance` script that runs Lighthouse against the production build and outputs an HTML report `[D:2]`
- [ ] 4.1.3 Document how to run PageSpeed Insights and WebPageTest for client reports `[D:2]`

### 4.2 Accessibility

- [ ] 4.2.1 Integrate `axe-core` with Playwright (from §2.2) — automated a11y assertions in E2E tests `[D:3]`
- [ ] 4.2.2 Add `pnpm qa:a11y` script that runs axe against all static pages `[D:2]`
- [ ] 4.2.3 Ensure example content (from §1) passes WCAG 2.2 AA automated checks (0 critical/serious violations) `[D:4]`
- [ ] 4.2.4 Document manual testing checklist: keyboard navigation, focus rings, contrast checker, screen reader basics `[D:2]`

### 4.3 SEO

- [ ] 4.3.1 Ensure the root layout and example pages (from §1) have correct `generateMetadata` patterns (title templates, descriptions, open graph, twitter cards) `[D:2]`
- [ ] 4.3.2 Add `robots.ts` and `sitemap.ts` route handlers (Next.js convention) that generate correct static files `[D:2]`
- [ ] 4.3.3 Add JSON-LD structured data examples (Organization, WebSite, BreadcrumbList) in the example pages `[D:3]`
- [ ] 4.3.4 Add `hreflang` support and localized canonical/alternate URL patterns consistent with `next-intl` routing `[D:3]`
- [ ] 4.3.5 Add `pnpm qa:seo` script — Lighthouse SEO audit targeting score 100 `[D:2]`

### 4.4 Security

> Uses `pnpm audit:ci` from §2.5 and CI pipeline from §2.6.

- [ ] 4.4.1 Create security headers configs for supported hosting platforms `[D:4]`
  - [ ] 4.4.1.1 `vercel.json` (Vercel) — full OWASP-recommended set `[D:3]`
  - [ ] 4.4.1.2 `_headers` (Netlify) — full OWASP-recommended set `[D:3]`
  - [ ] 4.4.1.3 `_headers` (Cloudflare Pages) — full OWASP-recommended set `[D:3]`
  - [ ] 4.4.1.4 GitHub Pages — document that custom headers are not supported; list what is and isn't achievable (HSTS via HSTS preload, no CSP, no X-Frame-Options) `[D:3]`
  - [ ] 4.4.1.5 CSP template with clear instructions to relax per-project (analytics, fonts, Storybook embeds). Do not present it as a drop-in config `[D:4]`
- [ ] 4.4.2 Add `pnpm qa:security` script that runs `pnpm audit` and checks for critical/high CVEs `[D:2]`
- [ ] 4.4.3 Document how to verify headers via securityheaders.com and Mozilla Observatory for client reports `[D:2]`

### 4.5 Bundle & Build

> Uses bundle analyzer from §2.4.

- [ ] 4.5.1 Wire `@next/bundle-analyzer` and add `pnpm qa:bundle` script `[D:2]`
- [ ] 4.5.2 Document how to inspect bundle output and route diagnostics during template work without enforcing hard budget thresholds yet `[D:2]`

### 4.6 Cross-Browser & Responsive

> Uses Playwright from §2.2 (already configured with multi-browser projects).

- [ ] 4.6.1 Add responsive viewport smoke tests at 320px, 375px, 768px, 1280px, 1440px `[D:3]`
- [ ] 4.6.2 Add `pnpm qa:cross-browser` script that runs the full Playwright suite across all browser projects `[D:2]`
- [ ] 4.6.3 Document manual cross-browser testing checklist (Chrome, Safari, Firefox, Edge, Samsung Internet) `[D:2]`

### 4.7 QA Reporting & Umbrella Script

- [ ] 4.7.1 Add `pnpm qa` umbrella script that runs all `qa:*` scripts and exits non-zero on any failure — suitable as a CI gate `[D:2]`
- [ ] 4.7.2 Create `scripts/qa-report.sh` that runs all QA categories sequentially and collects reports into a `.qa/` directory `[D:3]`
- [ ] 4.7.3 Document the QA delivery package format — what to capture, how to present to a client, shareable URL conventions `[D:3]`

---

## 5. Documentation Cleanup

> Depends on §1 (example content), §2 (tooling), and §4 (QA) being substantially complete.

- [ ] 5.0 Audit and document the scaffold baselines that already exist in code so the TODO reflects reality before more features are layered on top: env validation (`src/env.ts`), root metadata and font loading (`src/app/layout.tsx`), design tokens and shadcn base-nova baseline (`src/app/globals.css`, `components.json`), error/not-found patterns (`src/app/not-found.tsx`, `src/app/(marketing)/error.tsx`), and the current unit/component testing setup `[D:2]`
- [ ] 5.1 Update `README.md` — replace the default Next.js boilerplate with template-specific content: what this is, how to use it, available scripts, the reset workflow, and links to `docs/` `[D:2]`
- [ ] 5.2 Move `docs/in-progress/Nextjs-Quality-Assurance-Guide.pdf` to `docs/Nextjs-Quality-Assurance-Guide.pdf` once QA framework (§4) is implemented `[D:1]`
- [ ] 5.3 Review and update `docs/ARCHITECTURE.md` to reflect the current (post-cleanup) project structure `[D:2]`
- [ ] 5.4 Review and update `docs/CONVENTIONS.md` to reflect the tech stack from §3, including `next-intl` as the default i18n layer, the Strapi-inspired local CMS conventions, and any scaffold baselines from §5.0 that are intended to remain part of the starter `[D:2]`
- [ ] 5.5 Review and update `docs/ROUTINES.md` to include QA routines from §4 `[D:2]`
- [ ] 5.6 Create `docs/DEPLOYMENT.md` — hosting-agnostic static export guide with per-platform sections: Vercel (`vercel.json`), Netlify (`_headers`, `_redirects`, `netlify.toml`), Cloudflare Pages (`wrangler.toml`, `_headers`), GitHub Pages (GitHub Actions workflow, limitations from §4.4.1). Include security headers config per platform and note that ISR belongs to a future variation rather than this starter baseline `[D:4]`

---

## Execution Order

```
§1A (i18n baseline) → §2A (local CMS baseline) → §1 (Example Content) → §2 (Tooling & CI) → §4 (QA Framework) → §3 + §5 (Documentation)
                              ↗                        ↗
                            §2 installs tools         §4 sets thresholds
```

`§1A` and `§2A` should happen first so routes, content shape, slugs, media handling, and metadata all grow from one stable baseline. `§3` and `§5` should wait until the codebase reflects what they describe.
