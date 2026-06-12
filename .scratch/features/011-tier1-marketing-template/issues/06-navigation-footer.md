Method: tdd
Status: ready-for-agent
Complexity: 2
BlockedBy: 3, 4, 5

# Navigation + Footer layout components

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Build the two layout-level components that are always present on every page. Both consume data from Site Settings via the CMS adapter and use semantic theme tokens.

**Navigation** — Renders site name/logo and locale-aware navigation links. Reads from `getGlobalSettings(locale)` for site name and logo. Includes a language switcher for all configured locales. Responsive: collapses to hamburger menu on mobile. Uses semantic theme tokens exclusively.

**Footer** — Renders site info, social links, and legal text from Site Settings. Reads from `getGlobalSettings(locale)` for contact info, social links, footer text. Uses semantic theme tokens exclusively.

Both components are wired into the layout (not per-page). They sit outside the SliceRenderer — they are layout-level, not slice-level.

## Acceptance criteria

- [ ] Navigation renders site name from Site Settings
- [ ] Navigation includes locale-aware links (language switcher)
- [ ] Navigation responsive: hamburger menu on mobile viewports
- [ ] Footer renders site info, social links, legal text from Site Settings
- [ ] Both components use semantic theme tokens exclusively (no raw values)
- [ ] Both components render in all configured locales
- [ ] Layout wraps page content with Navigation (top) and Footer (bottom)
- [ ] Component tests verify rendering with mock Site Settings data
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `03-slice-renderer-home-page` — needs rendering pipeline and layout structure
- `04-theme-token-system` — components must use semantic tokens
- `05-content-model-remaining-schemas` — needs Site Settings schema and adapter method
