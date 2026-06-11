# UI/UX Audit Report — Web Tiers Guide

**Date:** 2026-06-11
**Page:** `web-tiers-guide.html` (built dist)
**Auditor:** frontend-design skill (strict conversion-page lens)
**Overall Score: 5.5 / 10**

> Functional, well-structured, but far from "stunning conversion page." This reads like a well-coded prototype, not a page that closes deals.

---

## 1. Typography — 5/10

**Problems:**

- **Satoshi everywhere.** The page uses one font family (Satoshi) for everything — display, body, UI elements. Even in English mode where Zodiak is defined as `--font-display`, it's barely differentiated because Zodiak only loads for `data-lang="en"`. For the primary Greek audience, there is **zero typographic contrast** — no serif/sans interplay, no display vs body differentiation.
- **No typographic hierarchy drama.** Headlines are `48px/700`, body is `16px/400`. That's a 3:1 ratio, which is adequate but not commanding. Conversion pages need a **hero moment** — a headline so large and weighted it's impossible to ignore.
- **Generic font choice.** Satoshi is a clean sans-serif but it's not memorable. For a page that must convince business owners to spend €3,000–€15,000, the typography should feel authoritative and premium — not like a SaaS dashboard.
- **No letter-spacing or optical sizing on display text.** The hero headline at 48px bold needs tighter tracking to look polished. Currently `letter-spacing` is unset at the headline level.

**Verdict:** A clean, neutral foundation, but zero personality. This is the typography of a documentation page, not a persuasion page.

---

## 2. Color & Theme — 5/10

**Problems:**

- **Muted palette lacks conviction.** The primary color is `oklch(46% 0.09 192)` — a mid-dark teal. On the warm neutral background (`#f7f6f2`), it's pleasant but **forgettable**. There's no "pop." No visual surprise.
- **Tier accent colors are too subtle.** Amber, Steel Blue, Slate Green, Hydra Teal, Deep Plum — these are reasonable choices but they appear as `border-left: 4px` strips and tiny chips. The accents don't own the space. They whisper when they should speak.
- **No contrast drama.** Every surface is a warm off-white or off-black. Cards use `--color-surface-offset` (slightly darker) with `1px solid` borders. There is **no elevation, no depth, no visual layering** — the entire page looks flat.
- **Dark mode is functional but bland.** `#171614` with muted text `#e8e4df` — it's a dark theme checkbox, not a design statement. No glow effects, no accent color luminance boost for dark mode.

**Verdict:** Safe and consistent, but utterly without visual tension. A conversion page needs color to guide the eye and create emotional response.

---

## 3. Spatial Composition & Layout — 4/10

**Problems:**

- **Monotonous vertical rhythm.** Every tier section has identical `padding: 64px top / bottom`. Every section is `max-width: 720px`, centered. The entire ~6,000px page is a **single-column river of cards** with no visual variation.
- **No asymmetry, no grid-breaking, no spatial surprise.** The hero is centered. The tier headers are centered. The TCO chart is centered. The quiz is centered. Everything. Is. Centered. This is the layout of a blog post, not a premium sales document.
- **Cards have zero elevation.** `box-shadow: none` on every card. No hover shadow lift. A card with `background: surface-offset` and `1px border` on a `surface` background is nearly invisible — the contrast is ~3% luminance difference.
- **No generous negative space moments.** The spacing system goes up to `64px` (space-16). For a page this long, you need breathing room of `120px+` between major sections, with sections that use negative space as a design element.
- **Footer feels like an afterthought.** A border, some text, a button. No visual weight. No urgency.

**Verdict:** The layout is competent but crushingly monotonous. A conversion page needs rhythm — alternating tension and release, wide-open spaces and dense content blocks.

---

## 4. Motion & Micro-Interactions — 4/10

**Problems:**

- **Only 4 keyframe animations total.** `reveal-up`, `slide-from-left`, `slide-from-right`, `bounce-chevron` — all in the hero. The remaining ~5,000px of page has **zero motion** except a simple opacity+translateY fade-in via IntersectionObserver.
- **No hover micro-interactions on cards.** Hero cards, tier headers, quiz result cards — all have `box-shadow: none` and no hover transform. A user hovering over a tier card gets **zero feedback**.
- **CTA button has no animation.** The footer contact button does `background-color` change on hover — that's it. No scale, no shadow lift, no ripple, no glow. For the **primary conversion element** this is unacceptable.
- **No scroll-triggered number counters.** The TCO section shows cost numbers — these should animate from 0 to their final value on scroll. Currently they're static text.
- **No staggered reveals.** Tier sections all reveal at once (header + body). There's no choreography — the tier header badge should appear first, then the name, then the price, then the chips, with deliberate delays.
- **Quiz card transitions exist but are basic.** `translateX` slide in/out — functional but not delightful.

**Verdict:** The page feels static. For a conversion page, motion is a persuasion tool — it creates engagement, guides attention, and makes the experience feel premium.

---

## 5. Visual Depth & Atmosphere — 3/10

**Problems:**

- **No textures, patterns, or atmospheric effects.** The hero has a subtle radial gradient — that's it. No noise texture, no grain overlay, no geometric patterns, no gradient meshes.
- **No background variation between sections.** The entire page alternates between `surface` and transparent. The TCO, quiz, and comparison sections all have `rgba(0,0,0,0)` background — they're invisible.
- **No decorative elements.** No SVG illustrations for tiers (despite the spec mentioning "SVG illustration → header card"). The tier badges are just numbered circles — `48px` with the tier number. No car illustrations, no visual metaphors, no icon system.
- **No gradient or glow on the primary CTA.** A flat solid-color pill button for the main conversion action. No `box-shadow` glow, no gradient overlay, nothing that says "click me."
- **No visual differentiation between the 5 tiers.** Each tier looks identical except for the `border-left: 4px solid` accent color and the badge circle. There's no visual escalation — Tier 5 should **feel** more premium than Tier 1.

**Verdict:** The page is visually sterile. A conversion page targeting business owners needs to **feel** premium, not just be technically correct.

---

## 6. Conversion Elements — 3/10

**Problems:**

- **Single CTA, buried at the footer.** One "Contact us" button at the very bottom of a 6,000px page. No sticky CTA, no floating action button, no inline CTAs between tiers.
- **No urgency or scarcity language.** The page is purely informational — "here are 5 tiers." There's no "most popular" badge, no social proof, no testimonial section, no "limited availability" signal.
- **No visual emphasis on recommended tier.** All 5 tiers look identical in visual weight. Conversion best practice is to highlight the "best value" tier (typically Tier 3 or 4).
- **Footer CTA is weak.** A button with `padding: 12px 48px` and no shadow, no glow, no gradient. It's the least visually interesting element on the page despite being the most important.
- **No trust signals.** No logos, no testimonials, no case study references, no "as seen in" section. For business owners, trust is the primary barrier.

**Verdict:** This is the critical failure. The page is structured as an educational document, not a conversion funnel. It informs but doesn't persuade.

---

## 7. Responsive Design — 6/10

**Adequate:**

- Mobile breakpoint at `639px` covers the basics: stacked hero cards, hidden header title, adjusted padding.
- Touch targets appear reasonable (`min-height: 44px` mentioned in spec).
- Horizontal scroll on comparison table is handled.

**Problems:**

- **No tablet breakpoint** (640px–1024px). The page jumps directly from mobile to desktop.
- **No responsive typography scaling beyond the hero.** Tier names stay at `28px` regardless of viewport. Section titles are fixed.
- **Tier nav pills scroll horizontally on mobile** but have no scroll indicators or fade-out edge hints.

---

## 8. Accessibility — 7/10

**Good:**

- Skip link present and functional.
- `aria-pressed` on toggle buttons.
- `data-i18n` system for bilingual content.
- Focus-visible outlines defined.
- `prefers-reduced-motion` respected.
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`).

**Issues:**

- Emoji used as the only visual indicator in hero cards — `aria-hidden="true"` is correct, but there's no text alternative for the visual metaphor.
- Color contrast on muted text (`#6b6860` on `#f7f6f2`) is approximately 4.1:1 — passes AA for normal text but is borderline.

---

## 9. Technical Execution — 7/10

**Good:**

- Clean CSS architecture with well-organized files.
- Proper design token system.
- Web Awesome component integration.
- FOUCE prevention with `.wa-cloak`.
- Print stylesheet exists.
- Bun bundling works cleanly.

**Issues:**

- Zodiak font is loaded but unloaded in the current state — wasted HTTP request for Greek mode.
- No lazy loading or intersection-based asset loading.
- No `will-change` hints on animated elements.

---

## Summary Scorecard

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Typography | 5/10 | 15% | 0.75 |
| Color & Theme | 5/10 | 15% | 0.75 |
| Spatial Composition | 4/10 | 15% | 0.60 |
| Motion & Micro-interactions | 4/10 | 15% | 0.60 |
| Visual Depth & Atmosphere | 3/10 | 15% | 0.45 |
| Conversion Elements | 3/10 | 20% | 0.60 |
| Responsive Design | 6/10 | 5% | 0.30 |
| Accessibility | 7/10 | — | Pass |
| Technical Execution | 7/10 | — | Pass |

**Weighted Total: 5.5 / 10 — Not conversion-ready.**

---

## Top 10 Priority Fixes (Ordered by Conversion Impact)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | **Add a sticky/floating CTA** — simple "Talk to us" pill, bottom-right, always visible | Critical | Low |
| 2 | **Give the recommended tier visual dominance** — larger card, "Recommended" badge, subtle glow/shadow | High | Medium |
| 3 | **Dramatic hero headline** — increase to `clamp(2.5rem, 7vw, 4.5rem)`, tighter tracking, consider text gradient or accent underline | High | Low |
| 4 | **Card elevation and hover states** — `box-shadow` on cards, lift on hover with `translateY(-2px)` and shadow increase | High | Low |
| 5 | **CTA button glow** — gradient background + subtle `box-shadow` glow matching primary color | High | Low |
| 6 | **Visual tier escalation** — each tier progressively feels more premium (larger badge, bolder accent, subtle gradient overlay) | Medium | Medium |
| 7 | **Background variation** — alternating section backgrounds, subtle noise texture, mesh gradient in hero | Medium | Medium |
| 8 | **Staggered scroll reveals** — tier elements appear with choreography, not all at once | Medium | Medium |
| 9 | **TCO number animation** — count-up on scroll for cost figures | Medium | Medium |
| 10 | **Inline quiz CTA between tiers 3–4** — nudge to the quiz mid-page, not just at the end | Medium | Low |

---

## Files Reviewed

- `web/src/index.html` — page structure
- `web/src/styles/tokens.css` — design tokens
- `web/src/styles/reset.css` — base reset
- `web/src/styles/layout.css` — containers and sections
- `web/src/styles/header.css` — sticky header
- `web/src/styles/hero.css` — hero section
- `web/src/styles/tiers.css` — tier sections + nav + accordion
- `web/src/styles/tco.css` — TCO comparison chart
- `web/src/styles/comparison.css` — feature matrix
- `web/src/styles/quiz.css` — decision quiz
- `web/src/styles/footer.css` — footer + CTA
- `web/src/styles/print.css` — print stylesheet
- `web/src/main.ts` — entry point
- `web/src/theme.ts` — theme toggle
- `web/src/i18n.ts` — bilingual strings
- `SPEC.md` — design specification reference

---

*Report generated using the frontend-design skill with strict conversion-page criteria.*
