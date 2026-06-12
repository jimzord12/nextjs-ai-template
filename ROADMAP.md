# Roadmap — Next.js AI Template

## Vision

The fastest path from content model to publishable marketing site — for a solo freelancer using AI-driven delivery.

This repo delivers Tier 1: a static-export marketing site template powered by a Local JSON CMS, with theme system, i18n, and a full QA pipeline. Tier 2 (Sanity, server runtime, blog, CI, analytics) is a separate fork built when the first Tier 2 client appears.

---

## Tier 1

### M1 — Foundation

> The architecture, conventions, and tooling that everything else builds on.

**Scope:**

- Next.js 16 App Router with static export (`output: 'export'`)
- i18n via `next-intl` — URL-prefixed locales, explicit fallbacks, single-language support
- Local JSON CMS — Strapi-inspired collection types, single types, components, media records, SEO fields, locale-aware records
- Zod-validated content loaders — invalid content fails at build time
- Slice renderer — pipeline from content loaders → normalized PageModel → component registry
- Explicit static routing — page-level routes inside `[locale]/(marketing)/`, no catch-all
- Theme system — semantic design tokens mapped to Tailwind via CSS custom properties
- Base tooling — Biome, Husky, lint-staged, commitlint, Vitest, TypeScript strict mode
- Reset script — one command to strip content and return to a bare skeleton

**Done when:**

- [ ] Skeleton builds and renders on configured locales with local JSON content
- [ ] Adding a new slice type is a 2-file operation (schema + component)
- [ ] Reset script produces a clean, buildable skeleton
- [ ] All existing tooling passes (`pnpm lint`, `pnpm test`, `pnpm build`)

---

### M2 — Component Library

> A curated set of marketing components that feel distinctive, not generic.

**Scope:**

- Custom marketing components with unique interaction design:
  - Photo gallery with non-obvious layout/treatment
  - Carousel with character (not a standard slider)
  - Hero sections with visual personality
  - Feature grids, testimonial sections, CTA bands
  - Navigation and footer components
  - Contact form slice (TanStack Form + Zod validation, third-party submission)
- Each component:
  - Has a Storybook story with controls
  - Uses semantic theme tokens (never raw Tailwind values)
  - Is responsive and accessible (WCAG 2.2 AA)
  - Has Vitest unit tests covering meaningful behavior
- Theme presets — 2-3 distinct theme instances you can present to clients
- Motion system — CSS-only animations/transitions in Tier 1 (GSAP deferred)

**Done when:**

- [ ] At least 8-10 custom slices/components ship with the template
- [ ] Each component has a Storybook story and passing tests
- [ ] Theme presets produce visually distinct results when applied
- [ ] Components feel custom and intentional — not copy-pasted from a UI kit

---

### M3 — QA Pipeline

> Quality scripts that run on every delivery — your quality assurance before client handoff.

**Scope:**

- Performance — Lighthouse CI with thresholds (Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)
- Accessibility — axe-core integrated with Playwright, 0 critical/serious WCAG 2.2 AA violations
- SEO — `generateMetadata` patterns, robots, sitemap, JSON-LD, hreflang, canonical URLs
- Security — `pnpm audit:ci` gate, dependency audit for high+ CVEs
- Bundle — `@next/bundle-analyzer` wired, documented inspection workflow
- Cross-browser — Playwright multi-browser projects (Chromium, Firefox, WebKit), responsive viewport tests
- QA reports — `pnpm qa` umbrella script, HTML reports in `.qa/`, client-presentable format
- Manual cross-browser testing checklist

**Done when:**

- [ ] `pnpm qa` passes against the production build
- [ ] QA reports can be screenshotted into a client summary without explanation
- [ ] Cross-browser checklist covers Chrome, Safari, Firefox, Edge, iOS Safari, Chrome Android

---

### M4 — Documentation & AI Workflows

> The project explains itself — to humans and to AI agents.

**Scope:**

- Documentation:
  - README.md — project overview, quickstart, available scripts, reset workflow
  - ARCHITECTURE.md — system diagram, content model, routing strategy, dependency flow
  - TECH_STACK.md — every dependency: what, why, version rationale, link to docs
  - CONVENTIONS.md — file naming, import ordering, component patterns, feature modules
  - ROUTINES.md — QA routines and the feature delivery pipeline
  - DEPLOYMENT.md — static export deployment guide (Vercel + alternatives)
  - Local CMS setup guide — content modeling, adding types, media management
  - Component catalog with usage examples
- AI Workflows:
  - `AGENTS.md` — agent instructions reflecting current architecture
  - `.agents/skills/` — project skills calibrated for Tier 1 capabilities
  - Feature delivery workflow documented end-to-end: grill-with-docs → to-prd → to-issues → do-issue → review-feature → sign-off
  - Context files (`CONTEXT.md`, `docs/adr/`) kept current
  - Workflow test: an AI agent can pick up a fresh issue and deliver it without human clarification

**Done when:**

- [ ] Every doc section is accurate for the current codebase (no stale references)
- [ ] A fresh AI agent can go from clone to working site by reading docs only
- [ ] The feature delivery pipeline has been exercised end-to-end at least once
- [ ] No `TODO`, `FIXME`, or `[planned]` markers remain in documentation

---

### What Tier 1 Is NOT

- A headless CMS — it consumes content from local JSON, doesn't store/manage it externally
- A component library — components serve the template, not the other way around
- A SaaS product — private template you clone and customize per client
- A general-purpose Next.js starter — specifically for static marketing sites
- A dynamic web app framework — strictly static export, no server runtime

### Post-Tier 1 (Explicitly Deferred)

- GSAP motion system
- Dev theme tool (visual token editor)
- Code generators (slices, content types)
- Scaffolding CLI (`create-jz-app`)
- CTA/analytics integration templates

---

## Tier 2 Roadmap (Separate Fork)

> When the first Tier 2 client appears, fork this repo and add:

- Sanity CMS adapter implementing the CMS adapter interface
- Server runtime (drop static export requirement)
- Blog infrastructure (post listing, detail, RSS)
- Basic CI pipeline (lint, typecheck, test, build)
- Basic analytics integration
- Newsletter capture
- On-demand revalidation / preview flows
- Payload CMS adapter (Tier 3 scope, designed but not implemented)

The Tier 2 fork shares no code dependency with this repo. Common patterns (components, theme, utilities) may be extracted into a shared package when 3+ projects of each tier exist.
