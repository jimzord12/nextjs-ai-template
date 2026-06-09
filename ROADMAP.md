# Roadmap — Next.js AI Template

## Vision

The fastest path from content model to publishable marketing site for agencies and their AI agents.

V1 delivers: 3 CMS adapters (Local JSON, Sanity, Payload), a library of custom components with unique character, strong documentation, and well-defined developer+AI workflows.

---

## V1

### M1 — Foundation

> The architecture, conventions, and tooling that everything else builds on.

**Scope:**

- Next.js 16 App Router with static export baseline
- i18n via `next-intl` — URL-prefixed locales, localized slugs, explicit fallbacks
- CMS adapter interface (`getPageBySlug`, `getGlobalData`) — the contract every adapter implements
- Local JSON content model — Strapi-inspired collection types, single types, components, media records, SEO fields, locale-aware records
- Zod-validated content loaders — invalid content fails at build time
- Slice renderer — the pipeline from CMS adapter → normalized PageModel → component registry
- Hybrid routing — catch-all `[[...slug]]` for CMS pages + explicit routes for custom logic
- Theme system — semantic design tokens mapped to Tailwind via CSS custom properties
- Base tooling — Biome, Husky, lint-staged, commitlint, Vitest, TypeScript strict mode
- Hotel Example demo content that validates the full stack end-to-end
- Reset script — one command to strip demo content to a bare skeleton

**Done when:**

- [ ] Hotel Example renders on all 3 locales with local JSON content
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
  - Contact form slice (TanStack Form + Zod validation)
- Each component:
  - Has a Storybook story with controls
  - Uses semantic theme tokens (never raw Tailwind values)
  - Is responsive and accessible (WCAG 2.2 AA)
  - Has Vitest unit tests covering meaningful behavior
- Theme presets — 2-3 distinct theme instances agencies can present to clients
- Motion system — CSS-only animations/transitions in V1 (GSAP deferred to post-V1)

**Done when:**

- [ ] At least 8-10 custom slices/components ship with the template
- [ ] Each component has a Storybook story and passing tests
- [ ] Theme presets produce visually distinct results when applied
- [ ] Components feel custom and intentional — not copy-pasted from a UI kit

---

### M3 — CMS Adapters: Sanity & Payload

> Prove the adapter pattern by shipping two external CMS backends.

**Scope:**

- Sanity adapter — implements the CMS adapter interface against Sanity's API
  - GROQ queries, content mapping to normalized PageModel
  - Image handling via Sanity's image CDN
  - Draft/preview mode support
- Payload adapter — implements the CMS adapter interface against Payload CMS
  - REST/GraphQL queries, content mapping to normalized PageModel
  - Media handling via Payload's upload system
  - Draft/preview mode support
- Init script (`pnpm init`) — asks CMS choice, project name, locale config, and wires the right adapter
- Hosting model logic: local JSON → static export, external CMS → serverless
- Adapter-specific documentation — setup, configuration, content modeling guide

**Done when:**

- [ ] Hotel Example renders identically across all 3 CMS backends
- [ ] Init script produces a working project for each CMS choice
- [ ] Swapping adapters is a config change, not a code rewrite
- [ ] Each adapter has its own setup guide in docs/

---

### M4 — Quality Pipeline

> Structural quality gates that run on every delivery — not optional cleanup.

**Scope:**

- Performance — Lighthouse CI with thresholds (Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)
- Accessibility — axe-core integrated with Playwright, 0 critical/serious WCAG 2.2 AA violations
- SEO — `generateMetadata` patterns, robots, sitemap, JSON-LD, hreflang, canonical URLs
- Security — OWASP security headers per hosting platform, `pnpm audit:ci` gate, CSP template
- Bundle — `@next/bundle-analyzer` wired, documented inspection workflow
- Cross-browser — Playwright multi-browser projects (Chromium, Firefox, WebKit), responsive viewport tests
- CI pipeline — GitHub Actions workflow running lint → test → build → audit
- QA reports — `pnpm qa` umbrella script, HTML reports in `.qa/`, client-presentable format

**Done when:**

- [ ] `pnpm qa` passes across all 3 CMS backends
- [ ] CI pipeline is green on a clean PR
- [ ] QA reports can be screenshotted into a client deck without explanation

---

### M5 — Documentation & AI Workflows

> The project explains itself — to humans and to AI agents.

**Scope:**

- Documentation:
  - README.md — project overview, quickstart, available scripts, reset workflow
  - ARCHITECTURE.md — full system diagram, adapter pipeline, routing strategy, content model
  - TECH_STACK.md — every dependency: what, why, version rationale, link to docs
  - CONVENTIONS.md — file naming, import ordering, component patterns, feature modules
  - ROUTINES.md — including QA routines and the feature delivery pipeline
  - DEPLOYMENT.md — per-platform static export guide with security headers
  - Per-adapter setup guides (Local JSON, Sanity, Payload)
  - Component catalog with usage examples
- AI Workflows:
  - `AGENTS.md` — agent instructions reflecting final V1 architecture
  - `.agents/skills/` — project skills calibrated for V1 capabilities
  - Feature delivery workflow documented end-to-end: grill-with-docs → to-prd → to-issues → do-issue → review-feature → sign-off
  - Context files (`CONTEXT.md`, `docs/adr/`) updated to reflect V1 decisions
  - Workflow test: an AI agent can pick up a fresh issue and deliver it without human clarification

**Done when:**

- [ ] Every doc section is accurate for the current codebase (no stale references)
- [ ] A new developer (or AI agent) can go from clone to working site by reading docs only
- [ ] The feature delivery pipeline has been exercised end-to-end at least once
- [ ] No `TODO`, `FIXME`, or `[planned]` markers remain in documentation

---

### What V1 Is NOT

- A headless CMS — it consumes content, doesn't store/manage it
- A component library — components serve the template, not the other way around
- A SaaS product — private template agencies clone and customize
- A general-purpose Next.js starter — specifically for CMS-driven marketing sites
- A dynamic web app framework — V1 is static-export for local CMS, serverless for external CMS

### Post-V1 (Explicitly Deferred)

- GSAP motion system
- Dev theme tool (visual token editor)
- Code generators (slices, adapters, content types)
- ISR variation for external CMS adapters
- Analytics integration templates

---

## V2

> Making the template self-generating and visually expressive.

- GSAP motion system
- Dev theme tool (visual token editor)
- Code generators (slices, adapters, content types)
- ISR variation for external CMS adapters
- Analytics integration templates