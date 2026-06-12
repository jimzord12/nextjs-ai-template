Method: scaffold
Status: ready-for-agent
Complexity: 2
BlockedBy: 12

# QA reports + bundle analyzer + responsive viewport tests

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Add the reporting and diagnostic layer on top of the core QA checks from issue 12. These produce client-facing artifacts and catch layout issues.

**QA reports** — Generate local HTML reports in `.qa/` directory. The freelancer screenshots key metrics into a client-facing summary. Reports include: Lighthouse scores, axe-core violations, bundle size.

**Bundle analyzer** — `@next/bundle-analyzer` wired for diagnostic inspection via `ANALYZE=true pnpm build`. Not part of the pass/fail gate — informational only.

**Responsive viewport tests** — Playwright tests verifying layout doesn't break at: 320px, 375px, 768px, 1280px, 1440px. Run against all pages in default locale.

## Acceptance criteria

- [ ] QA runs produce HTML reports in `.qa/` directory
- [ ] Reports include: Lighthouse scores, axe-core violations, bundle size
- [ ] `.qa/` is gitignored
- [ ] `@next/bundle-analyzer` works with `ANALYZE=true pnpm build`
- [ ] Playwright responsive tests cover: 320px, 375px, 768px, 1280px, 1440px
- [ ] Responsive tests run against all pages in default locale
- [ ] No layout breakage at any tested viewport
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `12-qa-core-lighthouse-axe-security` — builds on the core QA infrastructure
