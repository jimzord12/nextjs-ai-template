Method: chore
Status: ready-for-agent
Complexity: 2
BlockedBy: 13

# Reset script

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

A reset script that strips all content and pages, leaving a bare i18n skeleton with empty content directories. The freelancer runs this when starting a new client project from the template.

**What gets reset:**
- All content JSON files in `src/content/` (pages, testimonials, site settings)
- Content directories are emptied but preserved (structure stays)

**What is preserved:**
- i18n infrastructure (routing, messages, locale config)
- Theme system (tokens, CSS, Tailwind config)
- Component library (all 7 components, registry, SliceRenderer)
- CMS adapter interface and LocalCmsAdapter (reads from empty dirs)
- Config/tooling (biome, vitest, playwright, etc.)
- QA pipeline scripts

**Post-reset state:**
- App builds and renders a skeleton page in all configured locales
- Content directories exist but are empty (no JSON files)
- The skeleton page shows a minimal "no content" state or empty layout

A shell script at `scripts/reset-template.sh` (or `.ts` via tsx).

## Acceptance criteria

- [ ] Reset script exists at `scripts/reset-template.sh` (or equivalent)
- [ ] Running the script strips all content JSON files
- [ ] Content directories are preserved but empty
- [ ] i18n infrastructure intact after reset
- [ ] Theme system intact after reset
- [ ] Component library intact after reset
- [ ] CMS adapter intact after reset
- [ ] Post-reset app builds successfully (`pnpm build`)
- [ ] Post-reset app renders skeleton page in all configured locales
- [ ] `pnpm typecheck` and `pnpm lint` pass post-reset
- [ ] `pnpm test` passes post-reset

## Blocked by

- `13-qa-reports-bundle-responsive` — needs full template complete before testing reset
