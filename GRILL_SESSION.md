# Grilling Session State

## Goal

Stress-test the HLD for the Next.js marketing site template before it becomes a PRD — resolve every strategic and template-level design decision with evidence and tradeoff reasoning.

## Topic

Grilling the HLD document (`nextjs-multi-cms-marketing-template-hld.md`) against the current codebase, domain model, and commercial reality of a solo freelancer in Greece delivering static marketing sites.

## Constraints

- Solo freelancer, €15–20/hr rate, starting career
- AI-driven delivery is the core strategy — custom agent skills/workflows to automate coding
- No demo site, no Hotel Example
- Tier 1 is foot-in-the-door pricing (€300–400, <5 hours dev work, 2 revision rounds max)
- Static export (`output: 'export'`) is a hard constraint for Tier 1
- The features-cli issue tracking system under `.scratch/` is critical to the workflow
- One question at a time, with a recommended answer

## Decision Tree

### N1: Scaffolding CLI investment

- **Status:** ✅ Resolved
- **Question:** Should we build the `create-jz-app` CLI for v1, or defer it?
- **Answer:** Deferred. Use GitHub template / `npx degit` / manual checklist. Revisit at 20+ projects/year.
- **Resolved in:** session 1 (strategic layer)
- **ADR:** —
- **Opened branches:** none

### N2: Local CMS identity — is Tier 1 "no CMS" or "local CMS"?

- **Status:** ✅ Resolved
- **Question:** The HLD says Tier 1 has "no CMS." But the repo has a Local JSON CMS with Strapi-inspired content model. Which is it?
- **Answer:** Local CMS survives as Tier 1. The Local JSON CMS is the Tier 1 content source. `LocalCmsAdapter` and (future) `SanityCmsAdapter` share the same interface. Tier 1 is not "no CMS" — it's local-file-based CMS.
- **Resolved in:** session 1 (strategic layer)
- **ADR:** —
- **Opened branches:** none

### N3: One template or two?

- **Status:** ✅ Resolved
- **Question:** Should Tier 1 and Tier 2 live in the same repo with feature flags, or separate repos?
- **Answer:** Two templates. Current repo = Tier 1 template. Tier 2 (Sanity, server runtime, blog, CI) is a separate fork built when the first Tier 2 client appears. Shared package extraction when 3+ projects of each tier exist.
- **Resolved in:** session 1 (strategic layer)
- **ADR:** —
- **Opened branches:** N7

### N4: Static export — hard constraint or soft default?

- **Status:** ✅ Resolved
- **Question:** Is `output: 'export'` a hard constraint for Tier 1, or can we allow opt-in server features?
- **Answer:** Hard constraint. No server features in Tier 1. CTA/contact forms via third-party free-tier service. Tier 2 fork drops this constraint.
- **Resolved in:** session 1 (strategic layer)
- **ADR:** —
- **Opened branches:** N8 (CTA provider)

### N5: Solo freelancer or agency framing?

- **Status:** ✅ Resolved
- **Question:** The HLD uses agency/team language. Should we reframe for a solo freelancer?
- **Answer:** Solo freelancer. CONTEXT.md rewritten — "Freelancer" replaces "Agency", "Theme Instance" says 2-3 instead of 4-5, removed team/multi-person workflow language.
- **Resolved in:** session 1 (strategic layer)
- **ADR:** —
- **Opened branches:** none

### N6: Tier 1 commercial positioning

- **Status:** ✅ Resolved
- **Question:** How should Tier 1 be positioned commercially — as a premium product or a foot-in-the-door?
- **Answer:** Foot-in-the-door. Priced at €300–400, cap revisions at 2 rounds, template makes dev work <5 hours, every delivery includes "when you're ready to grow" upsell conversation.
- **Resolved in:** session 1 (strategic layer)
- **ADR:** —
- **Opened branches:** none

### N7: Repo structure — monorepo or separate repos per tier?

- **Status:** ✅ Resolved
- **Question:** Should we restructure into a monorepo now to prepare for Tier 2, or keep flat and restructure when there's evidence?
- **Answer:** Separate repo per tier (Option A). Stay flat now. When the first Tier 2 client appears, fork this repo. Restructure into a monorepo only when 3+ projects of each tier provide real data on what's actually shared. Zero clients means zero evidence for shared code boundaries — guessing now creates premature abstraction.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N8: Slice inventory for Tier 1

- **Status:** ✅ Resolved
- **Question:** Which specific slices/components ship in the Tier 1 template skeleton? HLD says Hero, Benefits, CTA, FAQ, Footer. ROADMAP M2 says Photo gallery, Carousel, Hero, Feature grids, Testimonial sections, CTA bands, Navigation, Footer, Contact form (8–10 total).
- **Answer:** 7 components: Navigation + Footer (layout-level, always present) + 5 composable slices (Hero, Features, Testimonials, FAQ, CTA Band). Gallery, Carousel, and Contact Form deferred — gallery and carousel are niche for single-page landing sites; contact form is the CTA provider question (N11). The "8-10 components" M2 target is met counting all 7. The slice registry holds 5 composable types.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N9: Theme system design

- **Status:** ✅ Resolved
- **Question:** What does the theme token interface look like? How many tokens, what categories, how are presets structured and applied?
- **Answer:** ~15–20 semantic tokens across 4 categories. Color: primary, secondary, accent, background, surface, text, text-muted, border. Typography: font-heading, font-body, text-base, text-scale (ratio). Spacing: radius, section-gap. Motion: transition-fast, transition-slow. Applied as CSS custom properties on :root, mapped to Tailwind utilities. Theme instance = one JSON/CSS block. No per-component overrides, no color scales, no dark mode, no layout tokens.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N10: Content model shape for Tier 1

- **Status:** ✅ Resolved
- **Question:** What collection types and single types exist for Tier 1's Local CMS? What does the Homepage single type look like — which fields, which content components?
- **Answer:** Generic adapter-driven model. Pages are a collection type (identified by slug, not a special Homepage single type). Tier 1 has one page record: slug "home". Each page has an ordered `slices` array where each slice is a discriminated union (`{ type, data }`). Slice schemas defined as Zod content components. Collection types added for any repeatable entity (e.g., testimonials). Site Settings stays as a single type for `getGlobalSettings()`. The adapter interface (`getPage`, `getGlobalSettings`) is the source of truth — LocalCmsAdapter and SanityAdapter both satisfy it. Adding a page = JSON file. Adding a slice = schema + component.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N11: CTA provider choice

- **Status:** ✅ Resolved
- **Question:** Which third-party free-tier service handles contact/lead capture forms for Tier 1's static-export constraint?
- **Answer:** Formspree (default) + Web3Forms (fallback). Both are free-tier, static-compatible, client-side POST. Formspree for clients who want dashboard + submission history (50/month free). Web3Forms for higher volume (250/month free, no dashboard). Both implement the CtaProvider interface. CTA Band slice renders an inline form that POSTs to the configured provider — no redirect to external page.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N12: Slice renderer pipeline

- **Status:** ✅ Resolved
- **Question:** How does the pipeline work end-to-end: content loader → PageModel → component registry → rendered page? What does the PageModel look like?
- **Answer:** 4-stage pipeline: JSON file → Content Loader (Zod) → PageModel (normalized) → SliceRenderer (registry). PageModel has slug, seo, slices array. Each slice is a discriminated union (type + data). Slice registry maps type string → React component. SliceRenderer iterates and renders. Adding a slice = schema + component + registry entry. No lazy loading, no per-slice error boundaries, no runtime validation — Zod catches bad data at build time. Route calls `cmsAdapter.getPage(slug, locale)` and passes result to SliceRenderer.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N13: SEO scope for Tier 1

- **Status:** ✅ Resolved
- **Question:** What SEO is included in Tier 1 vs deferred? The HLD says "basic metadata, sitemap, robots, page-level SEO fields in local config." What does "basic" actually mean?
- **Answer:** 5 items in: page metadata (title, description, OG), sitemap.xml (static from content loaders × locales), robots.txt (static allow-all), canonical URLs (via generateMetadata), hreflang tags (locale variants via generateMetadata). Each page record has an SEO content component. Site Settings has default OG image and title template. Deferred: JSON-LD structured data, advanced OG/Twitter cards, SEO scoring/auditing, blog metadata.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N14: Deployment flow

- **Status:** ✅ Resolved
- **Question:** How does a Tier 1 project go from content to live? Vercel setup, environment variables, per-client config, the deploy command.
- **Answer:** Cloudflare Pages as Tier 1 default (unlimited free static sites). Vercel for Tier 2 (needs server runtime). Template doesn't change between targets — static export works on both. Tier 1 deploy: `npx wrangler pages deploy out/` (CLI) or Git-connected auto-deploy. No CI — manual `pnpm qa` before deploy. Per-client config: locales, theme tokens, CTA provider key (.env.local), site name, content JSON. Each client = separate Cloudflare Pages project. Deployment guide documents both targets.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

### N15: AI skills/workflows for delivery

- **Status:** ✅ Resolved
- **Question:** What do the custom AI agent skills/workflows look like for Tier 1 delivery? How does the AI go from client brief to finished site?
- **Answer:** 5-phase per-client delivery workflow, each AI-assisted. Phase 1 Intake: AI extracts structured requirements from client brief. Phase 2 Content modeling: AI writes Local CMS JSON files from structured brief. Phase 3 Theme selection: AI generates 2–3 theme instances from client constraints, client picks one. Phase 4 Build & QA: AI runs `pnpm build` → `pnpm qa`, reads reports, fixes failures. Phase 5 Deploy & deliver: AI deploys to Cloudflare Pages, screenshots QA, sends client summary with upsell note. Two new custom skills needed: `client-intake` (brief → structured requirements) and `theme-composer` (constraints → theme instances). Not a new pipeline — specific applications of existing skills. AI works for the freelancer, not the client. Human-in-the-loop at every phase.
- **Resolved in:** session 2 (template-level layer)
- **ADR:** —
- **Opened branches:** none

## Open Leaves

None. All branches resolved.

## Notes

- The strategic layer (N1–N6) was resolved in session 1. All CONTEXT.md glossary entries and cross-cutting docs (ARCHITECTURE.md, CONVENTIONS.md, ROUTINES.md, ROADMAP.md) were updated. Published as draft PR #25 on branch `chore/grilling-session-tier1-scope`.
- N7 (repo structure) was resolved in session 2. No code changes — pure design decision recorded here.
- Pre-existing features-cli test failures (8 tests on Windows) are unrelated to grilling changes and should be addressed separately.

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Resolved |
| 🟡 | In progress |
| 🔴 | Blocked |
| ⬚ | Not started |

## Usage Rules

- One node per design question. Numbered sequentially: N1, N2, N3…
- **Opened branches** lists child nodes this answer created.
- A new AI session reads **Open Leaves** to know where to resume.
- When a node is resolved, move it out of **Open Leaves** and fill in the answer fields.
- If a resolved node has a detailed writeup, store it separately using the `GRILLING-SESSION-RESPONSE` template and link it from the answer field.
