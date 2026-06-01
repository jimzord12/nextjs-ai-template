Status: ready-for-agent

# Reset Script

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Create `scripts/reset-example.sh` (or `.mjs`) that strips all Hotel Example content and resets the codebase to a bare i18n skeleton. The reset is aggressive — it removes all hotel-specific pages, components, content records, features, media files, and example stories/tests. It preserves: root layout, `[locale]/page.tsx` skeleton, `globals.css`, shadcn components (`src/components/ui/`), shared utilities (`src/shared/`), env validation, all config files, tooling configs, i18n infrastructure (`[locale]` routing, `next-intl` config, message files, empty content directories). After reset, the app must still run — a skeleton `[locale]/page.tsx` shows "Welcome." in all three locales.

## Acceptance criteria

- [ ] `scripts/reset-example.sh` (or `.mjs`) exists and is executable
- [ ] Running the script removes: `(marketing)/` route group (hotel pages), `src/components/layout/`, `src/components/shared/`, all JSON content records (directories preserved, files removed), `src/features/`, media files, example Storybook stories, example E2E tests
- [ ] Running the script preserves: root layout, `[locale]/page.tsx` skeleton, `globals.css`, shadcn components, shared utilities, env validation, config files, tooling configs, i18n infrastructure
- [ ] Content directories exist but are empty after reset
- [ ] Message files for all three locales survive reset
- [ ] After reset, `next build` succeeds
- [ ] After reset, `/en`, `/el`, `/de` render "Welcome." skeleton page
- [ ] After reset, `pnpm test` passes (no broken test references)
- [ ] Script is idempotent — running it twice produces the same result

## Blocked by

- `06-hotel-homepage` — needs hotel content to strip
- `07-hotel-rooms` — needs hotel content to strip
- `05-contact-form` — needs contact page to strip
- `08-seo-routes` — needs SEO routes to evaluate which survive reset
