# Theme Completion

**Type**: horizontal
**Phase**: 1
**Dependencies**: none

## Scope

Complete the existing theme system so dark mode works end-to-end and all fonts load correctly.

The CSS token system already exists (oklch values in `globals.css`, Tailwind v4 `@theme inline`, semantic custom properties). Three gaps remain:

1. **`next-themes` provider** — wire `ThemeProvider` into the layout so `class="dark"` toggles. Must work with static export (SSG-safe, no flash). Use `next-themes` with `attribute="class"` and `defaultTheme="light"`.
2. **Heading font** — the current `--font-heading` has a circular reference (defined in `@theme inline` referencing itself). Fix by defining the heading font via `@font-face` or Next.js `next/font/google` and mapping it into the CSS variable chain.
3. **Mono font** — `--font-geist-mono` is referenced in `@theme inline` but never loaded. Wire it via `next/font/google` or `next/font/local` in the root layout.

## Acceptance Criteria

- [ ] `next-themes` ThemeProvider wraps the app in the appropriate layout
- [ ] Toggling dark/light mode changes all semantic tokens correctly
- [ ] No flash of incorrect theme on page load (SSG-compatible strategy)
- [ ] Heading font loads and renders correctly (no circular reference)
- [ ] Mono font loads and is available for `<code>`, `<pre>`, and utility classes
- [ ] Dark mode CSS custom properties are defined and harmonious (not just inverted)
- [ ] `pnpm build` passes with static export

## Out of Scope

- Theme presets / theme instances (M2)
- Visual theme editor (post-V1)
- New color tokens or design changes
- GSAP motion system (post-V1)

## Notes

The existing theme is well-architected — 3-tier CSS custom properties → `@theme inline` → Tailwind utilities. This feature just closes the open gaps. Keep the existing token values; don't redesign. The dark mode palette should be intentional, not a naive inversion.
