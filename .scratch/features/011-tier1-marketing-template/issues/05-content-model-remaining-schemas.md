Method: tdd
Status: ready-for-agent
Complexity: 2
BlockedBy: 2

# Content model: all remaining schemas + Site Settings + Testimonials

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Complete the content model by adding all remaining Zod schemas and Collection/Single Types that were deferred from issue 02 (which only defined Page + Hero slice). This issue fills in the full data model so that subsequent component issues have type-safe schemas to consume.

**Slice schemas (Zod Content Components):**
- Features — array of items: icon, title, description
- Testimonials — references Testimonials Collection Type records
- FAQ — array of question-answer pairs
- CTA Band — headline, description, form fields config

**Collection Types:**
- Testimonials Collection Type — repeatable records: quote, author, role, company, avatar?

**Single Types:**
- Site Settings — one record per locale: siteName, defaultSeo (title template, og image), contactInfo, socialLinks, logo, footerText

**Adapter completion:**
- `getGlobalSettings(locale)` implementation in LocalCmsAdapter (was stub in issue 02)
- Loader for Site Settings
- Loader for Testimonials Collection Type

**Seed content** — Minimal seed JSON files for Site Settings (per locale) and Testimonials (per locale) with placeholder data.

## Acceptance criteria

- [ ] Features slice Zod schema: array of { icon, title, description }
- [ ] Testimonials slice Zod schema: references to Collection Type records
- [ ] FAQ slice Zod schema: array of { question, answer }
- [ ] CTA Band slice Zod schema: headline, description, formConfig
- [ ] Testimonials Collection Type schema: quote, author, role, company, avatar?
- [ ] Site Settings Single Type schema: siteName, defaultSeo, contactInfo, socialLinks, logo, footerText
- [ ] `getGlobalSettings(locale)` fully implemented in LocalCmsAdapter
- [ ] Content Loaders for Site Settings and Testimonials with Zod validation
- [ ] Seed JSON files for Site Settings (all locales) and Testimonials (all locales)
- [ ] All new Content Loader tests pass (valid, invalid, missing locale)
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `02-cms-adapter-schemas-loader` — builds on the adapter interface and Page schema foundation
