# Roadmap — Web Tiers Guide

## Vision

A single self-contained HTML file (`web-tiers-guide.html`) that teaches non-technical Greek business owners about website quality through a 5-tier framework anchored to a car analogy. Bilingual GR/EN, interactive, printable, built from modular TypeScript with Bun + Web Awesome.

**Project root:** `docs/products/`
**Implementation lives in:** `docs/products/page/`
**Spec:** `docs/products/SPEC.md`
**Data source:** `docs/products/product-tiers.json`
**Research:** `docs/products/tech-stack/research/`

---

## M1 — Scaffold & Verify ✅

> **Status: DONE** — Completed 2026-06-10
>
> Empty project that builds. Confirm Bun + Web Awesome work before writing any UI.

**Scope:**

- `bun init` in `docs/products/page/`
- `package.json` with scripts: `dev`, `build`, `preview`, `lint`, `typecheck`
- `tsconfig.json` (browser-targeted, no `bun` types)
- `bunfig.toml`
- Folder structure: `src/`, `src/styles/`, `public/assets/`, `dist/`
- `src/index.html` — minimal HTML skeleton with `<html class="wa-cloak">`, Fontshare CDN `<link>`, empty `<main>`
- `src/wa.ts` — cherry-picked WA imports from `dist/` (details, radio-group, radio, tooltip)
- `src/main.ts` — entry point with `setBasePath()`, `allDefined()`, `wa-cloak` removal
- Verify `bun dev` serves the page
- Verify `bun build --compile --target=browser --minify` produces a single HTML file in `dist/`

**Done when:**

- [x] `bun dev` serves a blank page with no console errors
- [x] `bun run build` produces a single `dist/web-tiers-guide.html`
- [x] WA custom elements register successfully (verify in DevTools → Elements)
- [x] `bunx tsc --noEmit` passes

---

## M2 — Design Foundation ✅

>
> **Status: DONE** — Completed 2026-06-10

**Scope:**

- `src/styles/tokens.css` — all design tokens as CSS custom properties (`--color-*`, `--space-*`, `--text-*`, `--font-*`)
- `src/styles/tokens.css` — WA token overrides (`--wa-color-brand`, `--wa-font-family-base`, `--wa-border-radius-*`)
- `src/styles/reset.css` — minimal CSS reset
- `src/styles/layout.css` — max-width container, section spacing, fluid clamp values
- `src/styles/main.css` — `@import` chain for all stylesheets
- Dark mode: `[data-theme="dark"]` overrides on `:root` tokens, synced with WA `.wa-dark`
- `src/theme.ts` — toggle logic, `localStorage` persistence, `matchMedia` init
- `src/i18n.ts` — full `i18n` object with all GR/EN strings (initially just header + hero keys; tier keys added in M4)
- `setLang()` with `data-i18n` DOM switching, `localStorage` persistence, `#lang=` hash
- Font loading: Fontshare CDN `<link>` for Satoshi + Zodiak, dual font strategy via `[data-lang]`
- Test page with language toggle and theme toggle working

**Done when:**

- [x] Toggling GR↔EN switches all visible text and font families
- [x] Toggling dark↔light switches colors, persists on reload
- [x] `#lang=en` in URL forces English on load
- [x] CSS tokens produce correct values for both themes

---

## M3 — Header & Hero 🔲

> **Status: TODO**
>
> First visual impression. Sticky header + the car analogy opening.

**Scope:**

- `src/styles/header.css` — sticky, blur backdrop, responsive heights (56px desktop / 48px mobile)
- Sticky header: inline SVG logo, site title, spacer, dark/light toggle (sun/moon icon with rotation), language pill (GR|EN)
- `src/styles/hero.css` — full viewport, radial gradient background, centered layout
- Hero section: eyebrow label, headline with clip-path reveal animation, two car metaphor cards (city hatchback vs BMW), bridge text, scroll chevron
- All hero animations: clip-path headline, slide-in cards, bounce chevron
- `prefers-reduced-motion` fallbacks for all hero animations
- Mobile: cards stack vertically, headline fluid sizing

**Done when:**

- [ ] Header sticks on scroll, blur backdrop visible, mobile shrinks to logo-only
- [ ] Hero fills viewport with correct bilingual copy in both languages
- [ ] Both car cards render with correct data (prices, bullets)
- [ ] All 4 animations fire on page load (headline, left card, right card, chevron)
- [ ] Animations disable with `prefers-reduced-motion: reduce`

---

## M4 — Tier Sections 🔲

> **Status: TODO**
>
> The core content. Five tier cards with accordions, SVG illustrations, and scrollspy navigation.

**Scope:**

- `src/styles/tiers.css` — tier header cards, accordion styling, tier nav
- Orientation bar — sticky tier navigator with 5 scrollspy pills
- `src/scroll-spy.ts` — `IntersectionObserver` for nav highlight + section reveal
- 5 tier header cards: badge, car analogy, name, price, verdict, chips — all bilingual
- `<wa-details>` accordions per tier: What you get, What you don't get, 2-year outlook, Ideal for, TCO mini-bar
- Full bilingual content for all 5 tiers (copy from SPEC §4)
- TCO mini-bars per tier (small inline bar, pure CSS)
- SVG illustrations per tier (inline SVG with CSS animations) — or emoji badge fallback
- Tier accent colors via `--tier-accent` per section
- `src/i18n.ts` — add all tier content keys (~100+ keys per language)

**Done when:**

- [ ] All 5 tier sections render with complete bilingual content
- [ ] `<wa-details>` accordions expand/collapse with keyboard support
- [ ] Scrollspy highlights the current tier in the orientation bar
- [ ] Tier accent colors apply correctly to badges, borders, chips, bars
- [ ] SVG illustrations display (or emoji fallback) with animations

---

## M5 — Interactive Features 🔲

> **Status: TODO**
>
> TCO chart, decision quiz, and comparison table — the "justify your price" tools.

**Scope:**

- `src/styles/tco.css` — stacked horizontal bar chart, tooltips, labels
- TCO comparison section: 5 stacked bars with build/ongoing segments, animated on scroll
- `<wa-tooltip>` for TCO bar hover breakdowns
- `src/tco-bars.ts` — `IntersectionObserver` trigger for bar-width animations, stagger
- `src/styles/quiz.css` — quiz card, options, progress bar, result card
- Decision quiz: 4 questions, `<wa-radio-group>` options, weighted scoring algorithm, result card with per-tier justifications
- `src/quiz.ts` — state machine, scoring, tiebreaker, auto-advance
- Quiz transitions: card slide, answer press, progress bar
- `src/styles/comparison.css` — feature matrix, sticky column, row animations
- Comparison checklist: 14-row feature matrix with ✅/🔶/❌ across 5 tiers, sticky first column on mobile
- Row-by-row fade-in animation on scroll
- Conversion copy below TCO chart

**Done when:**

- [ ] TCO bars animate on scroll with correct widths and colors
- [ ] TCO tooltips show breakdown on hover
- [ ] Quiz produces correct tier recommendation for all answer combinations
- [ ] Quiz card slide transitions work smoothly
- [ ] Comparison table scrolls horizontally on mobile with sticky first column
- [ ] All features work in both GR and EN

---

## M6 — Polish & Production 🔲

> **Status: TODO**
>
> Print, accessibility audit, performance verification, final build.

**Scope:**

- `src/styles/print.css` — `@media print` rules: force light theme, hide interactive elements, expand accordions, page breaks, A4 margins
- `src/print.ts` — `window.print()` handler
- Accessibility audit:
  - Skip link as first focusable element
  - All WA components have ARIA (built-in)
  - Custom elements: `aria-pressed` on toggles, `role="img"` on TCO bars, `role="form"` on quiz
  - Keyboard: Tab order logical, all interactive elements reachable
  - Focus visible: outline on every interactive element
  - Color contrast: WCAG AA in both themes
- Performance verification:
  - `bun run build` produces single file < 400KB (excl. fonts)
  - Lighthouse: 95+ Performance, 100 Accessibility, 100 SEO
- `dist/web-tiers-guide.html` — the final deliverable, verified standalone
- Footer: contact CTA, PDF export button, credits

**Done when:**

- [ ] `Print` dialog produces a clean, formatted PDF with all content
- [ ] Keyboard-only navigation reaches every interactive element
- [ ] Lighthouse scores meet targets on the built single-file output
- [ ] Single HTML file opens correctly in Chrome, Firefox, Safari, Edge
- [ ] File size < 400KB (uncompressed, excluding external Fontshare CDN)

---

## File Reference

| File | Purpose |
|------|---------|
| `SPEC.md` | Full specification (1675 lines) — the source of truth |
| `ROADMAP.md` | This file — implementation milestones |
| `content/product-tiers.json` | Structured tier data (pricing, TCO, hours, pros/cons) |
| `content/Greek Web Development Market *.md` | Market research — the pricing & quality source for all tier data |
| `tech-stack/research/` | Bun + Web Awesome research documents |
| `page/` | Implementation directory (Bun project root) |
