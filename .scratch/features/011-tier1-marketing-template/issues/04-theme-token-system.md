Method: tdd
Status: ready-for-agent
Complexity: 3
BlockedBy: none

# Theme token system

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Implement the semantic token theme system — ~15–20 tokens across four categories applied as CSS custom properties on `:root` and mapped to Tailwind utilities. Components reference semantic tokens exclusively, never raw values.

**Token categories and tokens:**
- Color: primary, secondary, accent, background, surface, text, text-muted, border
- Typography: font-heading, font-body, text-base, text-scale (ratio)
- Spacing: radius, section-gap
- Motion: transition-fast, transition-slow

**Implementation:**
- CSS custom properties on `:root` with sensible defaults in `globals.css`
- Tailwind config maps semantic tokens to utilities (e.g., `bg-primary`, `text-text-muted`, `font-heading`)
- A theme instance is one JSON/CSS block that fills all tokens — the freelancer composes 2–3 per client

**Constraints:**
- No dark mode
- No per-component theme overrides
- No color scales — tokens are single values, not palette arrays
- No layout tokens

The system is ready for components to consume immediately. Existing components (Hero from issue 03) should be updated to use semantic tokens once this issue lands.

## Acceptance criteria

- [ ] ~15–20 semantic tokens defined as CSS custom properties on `:root` in `globals.css`
- [ ] Tailwind config maps all semantic tokens to utilities
- [ ] Token categories complete: Color (8), Typography (4), Spacing (2), Motion (2)
- [ ] Theme instance format documented: a JSON/CSS block that fills all tokens
- [ ] No dark mode, no color scales, no per-component overrides
- [ ] Default theme instance present with sensible values (neutral/professional)
- [ ] Components can use tokens via Tailwind utilities (`bg-primary`, `text-text-muted`, `font-heading`)
- [ ] `pnpm build` succeeds with token system active
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

None — can start immediately. Parallel with issues 02 and 03.
