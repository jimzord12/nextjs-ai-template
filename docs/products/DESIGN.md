# DESIGN.md — Web Tiers Guide Visual Specification

> **Status: ACTIVE** — This document drives the visual overhaul of the Web Tiers Guide from a 5.5/10 functional prototype to an 8.5+/10 conversion-optimized page.
>
> **Aesthetic Direction:** Mediterranean Prestige
> **Audience:** Greek business owners, €3K–€15K budget range
> **Tech:** Bun + Web Awesome + vanilla TypeScript → single HTML file
>
> **Relationship to SPEC.md:** SPEC.md defines WHAT content exists and HOW it behaves. DESIGN.md defines HOW IT SHOULD LOOK AND FEEL. When they conflict on layout, SPEC.md wins on position; DESIGN.md wins on presentation.
>
> **Audited:** 2026-06-11 | Current score: 5.5/10 | Target: 8.5+/10

---

## 1. Document Purpose & Relationship to SPEC.md

SPEC.md is the content-and-behavior truth. It defines **what** content exists on the page, **how** the 5-tier framework is structured, **what** the quiz asks, **what** the comparison table compares, and **how** bilingual switching works. SPEC.md is not concerned with visual appearance.

DESIGN.md is the **visual specification** that bridges SPEC.md and the current 5.5/10 implementation. It prescribes exactly **how the page should look and feel** to convert Greek business owners at an 8.5+/10 quality level. Every instruction in this document maps to a concrete CSS value, a specific file, and a named selector — no ambiguity, no hand-waving.

The relationship is strict:

- SPEC.md changes → content changes. DESIGN.md does not override content.
- DESIGN.md changes → visual changes. SPEC.md does not prescribe colors, spacing, or motion.
- When they conflict on layout (e.g., CTA placement), SPEC.md wins on position; DESIGN.md wins on presentation.

ROADMAP.md milestones M1–M6 are all **DONE**. The content, structure, bilingual system, print stylesheet, and technical foundation are shipped. This document drives a new **M7 milestone**: a visual overhaul that takes the existing content from functional-to-ugly (5.5/10) to conversion-optimized prestige (8.5+/10), without touching the content architecture.

## 2. Aesthetic Direction: Mediterranean Prestige

The audience is Greek business owners with €3K–€15K budgets deciding whether to trust a web agency. They've seen a hundred generic corporate sites with blue gradients and stock photos. They've also seen playful startup pages that feel beneath them. Mediterranean Prestige occupies the space between: **warm authority** — the feeling of walking into a well-designed boutique hotel lobby in Santorini, where every material is intentional, the lighting is confident, and nothing shouts but everything communicates quality.

The visual signatures are: warm neutrals (cream, stone, charcoal) as the dominant field; rich Mediterranean teal as the primary accent, used sparingly but with conviction; a warm gold/amber accent reserved for CTAs and emphasis moments that need to pulse; generous whitespace that signals editorial confidence rather than emptiness; typographic drama via extreme size contrast between hero headlines and body text; and tactile depth through layered shadows, subtle noise textures, and elevation hierarchies that make cards feel physical.

The target feeling in a visitor's gut: *"These people know what they're talking about, and they respect my intelligence."* Every design decision serves this. The page should feel like a premium print editorial — Monocle magazine meets a Greek island boutique hotel website — where information is presented with clarity and elegance, not decoration for its own sake.

Mediterranean Prestige is **not** brutalist (no raw concrete aesthetics), **not** maximalist (no pattern explosions), **not** playful (no bouncy animations or emoji), and **not** corporate-blue (no trust-me-with-a-stock-photo energy). It is restrained but not cold; warm but not cozy; confident but not arrogant. The restraint is the luxury.

## 3. Token Migration Map

### Existing Tokens — Changes

#### Colors

| Token | Current | New | Rationale |
|---|---|---|---|
| `--color-primary` | `oklch(46% 0.09 192)` | `oklch(42% 0.12 195)` | Deeper, more chroma-rich Mediterranean teal. Warmer hue (192→195) shifts away from generic tech-teal toward an Aegean blue-green. Lower lightness (46→42) adds gravitas. |
| `--color-primary-hover` | `oklch(50% 0.1 192)` | `oklch(48% 0.13 195)` | Matches primary shift. Slightly lighter on hover but richer chroma. |
| `--color-surface` | `#f7f6f2` | `#f7f6f2` (unchanged) | Already an excellent warm cream — quintessentially Mediterranean. |
| `--color-surface-offset` | `#eeedea` | `#eeedea` (unchanged) | Still valid as secondary surface. |
| `--color-text` | `#1a1918` | `#1a1918` (unchanged) | Near-black with warm undertone. Excellent contrast on cream. |
| `--color-text-muted` | `#6b6860` | `#5c5952` | Darkened from ~4.1:1 to ~5.5:1 contrast ratio against `#f7f6f2`. The current value is borderline AA; this fixes it without losing the warm muted character. |
| `--color-border` | `#d8d6d0` | `#cdc9c1` | Warmer and slightly darker. More visible against cream without being harsh. Reads as warm stone. |

#### Tier Accents (unchanged)

| Token | Current | New | Rationale |
|---|---|---|---|
| `--tier-accent-1` | `#b07a00` | `#b07a00` | Warm amber — already Mediterranean. |
| `--tier-accent-2` | `#006494` | `#006494` | Deep ocean blue. |
| `--tier-accent-3` | `#437a22` | `#437a22` | Olive green — Greek landscape. |
| `--tier-accent-4` | `#01696f` | `#01696f` | Aegean teal — close to primary. |
| `--tier-accent-5` | `#7a39bb` | `#7a39bb` | Royal purple — premium capstone. |
| `--tier-build-1` | `#e8af34` | `#e8af34` | Light build accent. |
| `--tier-build-2` | `#5591c7` | `#5591c7` | Light build accent. |
| `--tier-build-3` | `#6daa45` | `#6daa45` | Light build accent. |
| `--tier-build-4` | `#4f98a3` | `#4f98a3` | Light build accent. |
| `--tier-build-5` | `#a86fdf` | `#a86fdf` | Light build accent. |

Tier accents already have a warm, varied palette. They stay. The elevation and presentation changes in Section 3 will make them visible.

#### Typography

| Token | Current | New | Rationale |
|---|---|---|---|
| `--text-xs` | `0.75rem` | `0.75rem` | Unchanged. |
| `--text-sm` | `0.875rem` | `0.875rem` | Unchanged. |
| `--text-base` | `1rem` | `1rem` | Unchanged. |
| `--text-lg` | `1.125rem` | `1.125rem` | Unchanged. |
| `--text-xl` | `1.5rem` | `1.5rem` | Unchanged. |
| `--text-2xl` | `1.75rem` | `1.75rem` | Unchanged. |
| `--text-3xl` | `2rem` | `2rem` | Unchanged. |

#### Spacing

| Token | Current | New | Rationale |
|---|---|---|---|
| `--space-1` through `--space-16` | (all existing) | Unchanged | Existing scale is solid for component-level spacing. |

#### Shadows

| Token | Current | New | Rationale |
|---|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0 0 0 / 0.06)` | `0 1px 2px rgba(0 0 0 / 0.06)` | Unchanged. Subtle baseline. |
| `--shadow-md` | `0 4px 12px rgba(0 0 0 / 0.1)` | `0 4px 16px rgba(0 0 0 / 0.08)` | Wider spread, slightly softer opacity. More depth, less harsh edge. |

#### Transitions

| Token | Current | New | Rationale |
|---|---|---|---|
| `--transition-fast` | `150ms ease` | `150ms ease` | Unchanged. |
| `--transition-normal` | `250ms ease` | `250ms ease` | Unchanged. |

#### Radii (unchanged)

All radius tokens (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`) remain as-is.

#### Dark Mode Updates

| Token | Current Dark | New Dark | Rationale |
|---|---|---|---|
| `--color-primary` | `oklch(60% 0.1 192)` | `oklch(58% 0.13 195)` | Matches hue/chroma shift. Slightly lower lightness to match the deeper primary. |
| `--color-primary-hover` | `oklch(65% 0.11 192)` | `oklch(63% 0.14 195)` | Follows primary. |
| `--color-surface` | `#171614` | `#141310` | Slightly deeper, warmer dark background. |
| `--color-surface-offset` | `#1f1e1c` | `#1c1b18` | Follows surface shift. |
| `--color-text` | `#e8e4df` | `#ece8e3` | Slightly warmer light text on dark. |
| `--color-text-muted` | `#9e9a92` | `#9a968e` | Darker muted in dark mode, but adjusted for new surface. |
| `--color-border` | `#302e28` | `#2a2824` | Warmer dark border. |

### New Tokens

These tokens do not exist in the current `tokens.css` and must be added.

#### New Colors

| Token | Light Value | Dark Value | Rationale |
|---|---|---|---|
| `--color-accent` | `oklch(72% 0.15 75)` | `oklch(75% 0.14 75)` | Warm gold/amber for CTAs, badges, and emphasis moments. Distinct from primary teal — creates a two-tone accent system (teal = trust/authority, gold = action/value). |
| `--color-accent-hover` | `oklch(76% 0.16 75)` | `oklch(79% 0.15 75)` | Slightly brighter on hover. |
| `--color-surface-elevated` | `#ffffff` | `#1e1d1a` | White cards on cream background create clear elevation hierarchy. Dark mode uses a lifted dark surface. |
| `--color-surface-deep` | `#e8e6e1` | `#0f0e0c` | Contrasting section backgrounds for visual rhythm. Warm stone in light mode; near-black in dark mode. |

#### New Typography Scale

| Token | Value | Rationale |
|---|---|---|
| `--text-4xl` | `2.5rem` | Section headlines that command attention. |
| `--text-5xl` | `3.5rem` | Large section openers, feature callouts. |
| `--text-hero` | `clamp(2.5rem, 7vw, 4.5rem)` | Hero headline. Responsive: 40px on mobile, scales to 72px on desktop. The `7vw` ramp creates smooth growth. |

#### New Spacing Scale

| Token | Value | Rationale |
|---|---|---|
| `--space-20` | `5rem` (80px) | Generous section top padding. Current `--space-16` (64px) is uniform everywhere — this breaks the monotony. |
| `--space-24` | `6rem` (96px) | Hero-to-content gap, major section separators. |
| `--space-32` | `8rem` (128px) | Maximum breathing room. Used between the last tier and footer CTA, or before the hero. |

#### New Shadow Scale

| Token | Value | Rationale |
|---|---|---|
| `--shadow-lg` | `0 8px 32px rgba(0 0 0 / 0.12)` | Elevated cards, recommended tier. Visible but soft. |
| `--shadow-xl` | `0 16px 48px rgba(0 0 0 / 0.16)` | Floating CTA, modal overlays. Dramatic depth. |
| `--shadow-glow` | `0 0 24px oklch(72% 0.15 75 / 0.3)` | CTA button glow using the accent gold. Draws the eye to conversion elements. Creates a warm halo effect. |

#### New Transitions

| Token | Value | Rationale |
|---|---|---|
| `--transition-reveal` | `600ms cubic-bezier(0.16, 1, 0.3, 1)` | Scroll-reveal entrance. The `0.16, 1` curve creates a fast-start, slow-settle motion that feels authoritative — not bouncy, not sluggish. Matches the existing tier-header reveal timing. |
| `--transition-spring` | `400ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Hover interactions (cards, buttons). Subtle overshoot (1.56) creates a tactile "press" feeling without playfulness. |

### Implementation Notes

All new tokens go into `src/styles/tokens.css`. Dark mode variants go into the existing `[data-theme="dark"]` block. The `[data-lang="en"]` font override (`--font-display: "Zodiak", serif`) is unchanged.

No token is removed — only modified or added. This ensures no existing selector breaks during migration.


---

## 4. Typography Overhaul

**Current problem:** Satoshi-only in both GR and EN modes, zero personality. Hero headline peaks at `clamp(1.75rem, 5vw, 3rem)` = 48px — nowhere near enough for a conversion-critical hero moment. Section titles at `--text-3xl` (2rem) feel like body text. No typographic rhythm — everything the same weight, same family, same voice.

### 4.1 New Type Scale

**Target:** `src/styles/tokens.css` → `:root` font-size block (lines 32–39)

Add three new sizes above `--text-3xl`:

```css
/* ADD after --text-3xl: 2rem */
--text-3xl: 2rem;        /* 32px — section titles */
--text-4xl: 2.5rem;      /* 40px — sub-hero emphasis */
--text-5xl: 3rem;        /* 48px — large display */
--text-hero: clamp(2.5rem, 7vw, 4.5rem);  /* 40–72px — hero only */
```

The `--text-hero` token uses `clamp()` for fluid scaling. At 320px viewport: 40px. At 640px+: 44.8px. At 1024px+: caps at 72px. No media-query jumps — the type breathes with the viewport.

Remove the old `--text-3xl: 2rem` value — it stays the same but now sits in context of a full scale with three sizes above it.

### 4.2 Headline Treatment

**Target:** `src/styles/hero.css` → `.hero__headline` (line 32)

| Property | Current | New |
|---|---|---|
| `font-size` | `clamp(1.75rem, 5vw, 3rem)` | `var(--text-hero)` → `clamp(2.5rem, 7vw, 4.5rem)` |
| `line-height` | `1.15` | `1.08` |
| `letter-spacing` | *(none)* | `-0.02em` |
| `max-width` | `720px` | `680px` (tighter measure for large text) |

The 4.5:1 size ratio (72px hero vs 16px body) is the typographic "hero moment" this page lacks. Line-height 1.08 keeps the headline visually tight — large text needs less leading. The negative letter-spacing (-0.02em) adds typographic authority in GR mode (Satoshi).

**EN override** — add to `[data-lang="en"]` block in `tokens.css`:

```css
[data-lang="en"] {
  --font-display: "Zodiak", serif;
  --letter-spacing-display: -0.01em;  /* Zodiak needs less tightening */
}
```

Then in `hero.css`, add:

```css
[data-lang="en"] .hero__headline {
  letter-spacing: var(--letter-spacing-display);
}
```

**Eyebrow breathing room** — `src/styles/hero.css` → `.hero__eyebrow` (line 29):

```css
/* Current */
margin-bottom: var(--space-4);   /* 16px */

/* New */
margin-bottom: var(--space-6);   /* 24px — 50% more air between eyebrow and headline */
```

### 4.3 Greek vs English Strategy

The bilingual font strategy creates two distinct typographic systems. Here's exactly which selectors get which treatment:

**GR mode (`[data-lang="gr"]` or default):** Satoshi-only. Typographic contrast comes from:

1. **Weight contrast:** 700 (headlines) vs 400 (body) — a 3-step weight jump
2. **Size contrast:** `--text-hero` (72px) vs `--text-base` (16px) = 4.5:1 ratio
3. **Letter-spacing variation:** `-0.02em` on headlines, `0` on body
4. **No font-family switching** — all Satoshi, all the time. Greek glyphs are covered.

**EN mode (`[data-lang="en"]`):** Zodiak + Satoshi. Natural serif/sans contrast — "free" typographic richness.

| Category | Selectors | GR font | EN font |
|---|---|---|---|
| **Display** | `.hero__headline`, `.site-footer__heading`, `.quiz-result__tier-name` | `var(--font-display)` → Satoshi | `var(--font-display)` → Zodiak |
| **Section titles** | `.tco-section__title`, `.comparison-section__title`, `.quiz-section__title` | Satoshi 700 | Zodiak 700 |
| **Tier names** | `.tier-header__name` | Satoshi 700 | Zodiak 700 |
| **Body text** | `.hero__eyebrow`, `.tier-header__verdict`, `.tier-header__price`, `.tco-conversion`, `.quiz-result__body`, `.site-footer__body` | `var(--font-body)` → Satoshi | `var(--font-body)` → Satoshi |
| **UI elements** | `.tier-header__chip`, `.tier-nav__pill`, `.quiz-result__cta`, `.site-footer__contact-btn`, `.tco-amount`, `.tco-label` | Satoshi 500–600 | Satoshi 500–600 |
| **Accordion headers** | `.tier-body wa-details::part(header)` | Satoshi 600 | Satoshi 600 |

The key insight: in EN mode, section titles and tier names get Zodiak serif automatically via `var(--font-display)`. In GR mode, those same elements use Satoshi but compensate with tighter tracking and bolder weight. No selector branching needed — the `[data-lang="en"]` token override handles it.

### 4.4 Section Titles

**Target:** `src/styles/tco.css` → `.tco-section__title`, `src/styles/comparison.css` → `.comparison-section__title`, `src/styles/quiz.css` → `.quiz-section__title`

All section titles get unified treatment:

```css
/* Apply to all three section title selectors */
font-family: var(--font-display);
font-size: var(--text-3xl);      /* 2rem — stays same value but now in proper scale context */
font-weight: 700;
letter-spacing: -0.01em;
color: var(--color-text);
```

**Tier names inside cards** — `src/styles/tiers.css` → `.tier-header__name` (line 148):

```css
/* Current */
font-size: var(--text-2xl);      /* 1.75rem = 28px */
line-height: 1.2;

/* New */
font-size: var(--text-3xl);      /* 2rem = 32px — one step up */
line-height: 1.15;               /* tighter for display */
```

### 4.5 Body & UI Text

**Body line-height increase** — this is a global readability fix. Add to `:root` in `tokens.css`:

```css
--line-height-body: 1.6;  /* was 1.5 implicit in various places */
```

Specific selectors that need the update:

**Tier verdict** — `src/styles/tiers.css` → `.tier-header__verdict` (line 165):

```css
/* Current */
font-style: italic;
font-size: var(--text-base);
color: var(--color-text-muted);
line-height: 1.5;

/* New — add letter-spacing for editorial feel */
font-style: italic;
font-size: var(--text-base);
color: var(--color-text-muted);
line-height: 1.6;              /* increased */
letter-spacing: 0.01em;        /* NEW — editorial rhythm */
```

**Chips** — `src/styles/tiers.css` → `.tier-header__chip` (line 180):

```css
/* Current padding */
padding: 2px var(--space-2);

/* New — better touch targets */
padding: var(--space-1) var(--space-3);  /* 4px 12px instead of 2px 8px */
```

Chip font-size stays `--text-xs` (0.75rem) — the increase is in padding only.

### 4.6 Number Treatment

Numbers (prices, TCO amounts) need tabular alignment and authoritative weight.

**TCO amounts** — `src/styles/tco.css` → `.tco-amount` (line 115):

```css
/* Current */
font-size: var(--text-sm);
font-weight: 600;

/* New */
font-size: var(--text-sm);
font-weight: 700;
font-variant-numeric: tabular-nums;    /* NEW — aligned digits */
letter-spacing: -0.02em;               /* NEW — tighter for numbers */
```

**Tier prices** — `src/styles/tiers.css` → `.tier-header__price` (line 157):

```css
/* Current */
font-size: var(--text-lg);      /* 1.125rem = 18px */
font-weight: 500;

/* New */
font-size: var(--text-xl);      /* 1.5rem = 24px — significant bump */
font-weight: 700;
font-variant-numeric: tabular-nums;
letter-spacing: -0.02em;
color: var(--color-text);       /* promoted from muted — prices deserve full contrast */
```

**TCO labels** — `src/styles/tco.css` → `.tco-label`:

```css
/* Add to existing */
font-variant-numeric: tabular-nums;
letter-spacing: -0.02em;
font-weight: 700;              /* bump from 600 */
```

---

## 5. Color & Theme Transformation

**Current problem:** Primary `oklch(46% 0.09 192)` is a muted teal — technically correct but forgettable. Tier accents (#b07a00, #006494, etc.) are good color choices applied as invisible 4px border-left whispers. Surfaces are flat and indistinguishable. Dark mode is a mechanical inversion, not a design statement.

### 5.1 New Primary Palette

**Target:** `src/styles/tokens.css` → `:root`

| Token | Current | New | Rationale |
|---|---|---|---|
| `--color-primary` | `oklch(46% 0.09 192)` | `oklch(48% 0.11 195)` | More chroma (0.09→0.11) = richer teal. Slightly warmer hue (192→195) = Mediterranean warmth. Higher lightness (46→48) = more presence on warm bg. |
| `--color-primary-hover` | `oklch(50% 0.1 192)` | `oklch(52% 0.13 195)` | Mirrors primary shift with more chroma on hover for tactile feedback |

The shift from 192 to 195 in hue is subtle but deliberate — it pulls the teal toward the green-gold axis of Mediterranean palette (think Aegean sea against sunlit stone). The chroma increase from 0.09 to 0.11 gives the color authority without becoming garish.

Dark mode primary gets a corresponding boost — see §5.5.

### 5.2 Accent Color for Conversion

**Target:** `src/styles/tokens.css` → `:root` and `[data-theme="dark"]`

```css
/* Light mode */
--color-accent: oklch(76% 0.15 75);          /* warm gold — Mediterranean sunlight */
--color-accent-hover: oklch(72% 0.17 70);    /* deeper amber on hover */

/* Dark mode */
--color-accent: oklch(78% 0.16 80);          /* shifted warmer — see §5.5 */
--color-accent-hover: oklch(75% 0.18 75);
```

This is NOT a decorative color. It appears ONLY on:

| Element | Selector | File |
|---|---|---|
| Footer CTA button | `.site-footer__contact-btn` | `footer.css` |
| Quiz result CTA | `.quiz-result__cta` | `quiz.css` |
| Recommended tier badge | `.tier-section--4 .tier-header__badge` + new ribbon | `tiers.css` |
| Sticky floating CTA | `.sticky-cta__button` | `cta.css` (new) |
| Hero scroll CTA (optional) | `.hero__scroll-cta` | `hero.css` |

**Never on:** tier chips, section titles, tooltips, decorative borders, body text, or informational elements. The accent is a conversion signal — its power comes from scarcity.

### 5.3 Surface System

**Target:** `src/styles/tokens.css` → `:root` and `[data-theme="dark"]`

Three-tier surface system creates depth without heavy shadows:

```css
/* Light mode */
--color-surface: #f7f6f2;              /* page background — warm parchment (UNCHANGED) */
--color-surface-elevated: #ffffff;      /* cards that pop off the page (NEW) */
--color-surface-deep: #eeedea;         /* contrasting sections — renamed from surface-offset */

/* Dark mode */
--color-surface: #171614;              /* deep warm black (UNCHANGED) */
--color-surface-elevated: #252320;     /* cards that glow off dark bg (NEW — see §5.5) */
--color-surface-deep: #1f1e1c;         /* subtle section contrast */
```

Section assignment:

| Surface | Sections | Effect |
|---|---|---|
| `--color-surface` | Hero, TCO, Quiz | Default page canvas |
| `--color-surface-elevated` | `.tier-header` cards, `.quiz-result__card`, `.comparison-table thead` | Cards that visually lift off the page |
| `--color-surface-deep` | Footer, alternating tier sections (odd), comparison wrapper bg | Contrasting zones that break the scroll monotony |

**Rename note:** The old `--color-surface-offset` becomes `--color-surface-deep`. A new `--color-surface-elevated` is added for cards. This three-tier system replaces the current two-surface flatness.

### 5.4 Tier Accent Escalation

Current tier accents are applied as a 4px `border-left` on `.tier-header` — invisible at scroll speed. The colors themselves are fine; the application is the problem.

**Escalation strategy:** Progressive visual weight from Tier 1 (minimal) to Tier 5 (premium glow).

**Tiers 1–3: Subtle accent presence** — `src/styles/tiers.css`:

```css
/* Tier 1 — minimal accent */
.tier-section--1 .tier-header {
  border-left: 4px solid var(--tier-accent-1);
  background: linear-gradient(135deg, color-mix(in srgb, var(--tier-accent-1) 5%, transparent) 0%, transparent 25%);
}

/* Tier 2 — slightly more visible */
.tier-section--2 .tier-header {
  border-left: 4px solid var(--tier-accent-2);
  background: linear-gradient(135deg, color-mix(in srgb, var(--tier-accent-2) 6%, transparent) 0%, transparent 28%);
}

/* Tier 3 — moderate */
.tier-section--3 .tier-header {
  border-left: 4px solid var(--tier-accent-3);
  background: linear-gradient(135deg, color-mix(in srgb, var(--tier-accent-3) 7%, transparent) 0%, transparent 30%);
}
```

**Tier 4 (Recommended): Full visual dominance** — this is the conversion tier:

```css
.tier-section--4 .tier-header {
  border-left: 6px solid var(--tier-accent-4);                    /* thicker border */
  background: linear-gradient(135deg, color-mix(in srgb, var(--tier-accent-4) 8%, transparent) 0%, transparent 35%);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--tier-accent-4) 25%, transparent),
    var(--shadow-md);
  position: relative;
}

/* Recommended ribbon — positioned on the card */
.tier-section--4 .tier-header::before {
  content: attr(data-recommended-text);   /* "Προτεινόμενο" / "Recommended" — set via i18n */
  position: absolute;
  top: var(--space-4);
  right: calc(-1 * var(--space-2));
  padding: var(--space-1) var(--space-4);
  background: var(--color-accent);
  color: #1a1918;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  box-shadow: var(--shadow-sm);
}
```

Note: The `data-recommended-text` attribute must be set on `.tier-header` via the i18n system. The ribbon is pure CSS — no extra HTML needed beyond the attribute.

**Tier 5: Premium glow** — the "above and beyond" tier:

```css
.tier-section--5 .tier-header {
  border-left: 6px solid var(--tier-accent-5);
  background: linear-gradient(135deg, color-mix(in srgb, var(--tier-accent-5) 8%, transparent) 0%, transparent 40%);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--tier-accent-5) 20%, transparent),
    0 4px 20px color-mix(in srgb, var(--tier-accent-5) 12%, transparent);
}
```

### 5.5 Dark Mode as a Design Statement

Dark mode is not "light mode inverted." It's a luxury evening menu — rich, warm, sophisticated. The palette shifts intentionally.

**Target:** `src/styles/tokens.css` → `[data-theme="dark"]`

```css
[data-theme="dark"] {
  /* Primary — boosted lightness for dark bg visibility */
  --color-primary: oklch(65% 0.12 195);          /* was oklch(60% 0.1 192) */
  --color-primary-hover: oklch(70% 0.13 195);    /* was oklch(65% 0.11 192) */

  /* Accent — shifted warmer in dark mode (like candlelight vs sunlight) */
  --color-accent: oklch(78% 0.16 80);
  --color-accent-hover: oklch(75% 0.18 75);

  /* Surfaces — three-tier system */
  --color-surface: #171614;                       /* deep warm black — UNCHANGED */
  --color-surface-elevated: #252320;              /* cards — lighter than bg for elevation */
  --color-surface-deep: #1f1e1c;                  /* section contrast — renamed */

  /* Text */
  --color-text: #e8e4df;                          /* UNCHANGED */
  --color-text-muted: #9e9a92;                    /* UNCHANGED */
  --color-border: #302e28;                        /* UNCHANGED */

  /* New shadows for dark mode */
  --shadow-glow: 0 0 32px oklch(65% 0.12 195 / 0.25);         /* primary glow for CTAs */
  --shadow-glow-accent: 0 0 24px oklch(78% 0.16 80 / 0.2);    /* accent glow for conversion */

  /* Tier build colors — boosted lightness for dark bg */
  --tier-build-1: #f0c050;     /* was #e8af34 — lighter gold */
  --tier-build-2: #6aa3d6;     /* was #5591c7 — brighter steel */
  --tier-build-3: #82c058;     /* was #6daa45 — lighter green */
  --tier-build-4: #68b0bc;     /* was #4f98a3 — brighter teal */
  --tier-build-5: #bc90ef;     /* was #a86fdf — brighter plum */
}
```

**Dark mode CTA glow** — apply to conversion elements:

```css
/* Footer CTA */
[data-theme="dark"] .site-footer__contact-btn {
  box-shadow: var(--shadow-glow);
}

[data-theme="dark"] .site-footer__contact-btn:hover {
  box-shadow: var(--shadow-glow-accent), var(--shadow-md);
  transform: translateY(-1px);
}

/* Quiz CTA */
[data-theme="dark"] .quiz-result__cta {
  box-shadow: var(--shadow-glow);
}

/* Tier 4 recommended glow in dark */
[data-theme="dark"] .tier-section--4 .tier-header {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--tier-accent-4) 30%, transparent),
    0 4px 24px color-mix(in srgb, var(--tier-accent-4) 15%, transparent);
}

/* Tier 5 premium glow in dark */
[data-theme="dark"] .tier-section--5 .tier-header {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--tier-accent-5) 25%, transparent),
    0 4px 28px color-mix(in srgb, var(--tier-accent-5) 15%, transparent);
}
```

### 5.6 Tier Chip Enhancement

**Target:** `src/styles/tiers.css` → `.tier-header__chip` (line 180)

Current chips: `border: 1px solid var(--tier-accent); color: var(--tier-accent)` — ghost-style, barely visible.

**New baseline** — all chips:

```css
.tier-header__chip {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: var(--space-1) var(--space-3);         /* was 2px var(--space-2) — better touch targets */
  border-radius: var(--radius-full);
  border: 1px solid var(--tier-accent);
  color: var(--tier-accent);
  background: transparent;
  white-space: nowrap;
  transition: background var(--transition-fast);   /* NEW — for hover */
}

/* Hover for all chips */
.tier-header__chip:hover {
  background: color-mix(in srgb, var(--tier-accent) 20%, transparent);
}
```

**Tier 4+ chips get filled treatment** — premium tiers deserve more visual weight:

```css
/* Tier 4 chips — recommended tier gets filled accent */
.tier-section--4 .tier-header__chip {
  background: color-mix(in srgb, var(--tier-accent-4) 12%, transparent);
  border-color: color-mix(in srgb, var(--tier-accent-4) 30%, transparent);
}

.tier-section--4 .tier-header__chip:hover {
  background: color-mix(in srgb, var(--tier-accent-4) 25%, transparent);
}

/* Tier 5 chips — premium gets filled accent */
.tier-section--5 .tier-header__chip {
  background: color-mix(in srgb, var(--tier-accent-5) 12%, transparent);
  border-color: color-mix(in srgb, var(--tier-accent-5) 30%, transparent);
}

.tier-section--5 .tier-header__chip:hover {
  background: color-mix(in srgb, var(--tier-accent-5) 25%, transparent);
}
```

**Dark mode chip overrides** — `src/styles/tiers.css` → `[data-theme="dark"] .tier-header__chip`:

```css
[data-theme="dark"] .tier-header__chip {
  border-color: color-mix(in srgb, var(--tier-accent) 40%, transparent);
  color: var(--tier-build);    /* use lighter build variant for readability on dark bg */
}

[data-theme="dark"] .tier-header__chip:hover {
  background: color-mix(in srgb, var(--tier-accent) 25%, transparent);
}

/* Tier 4+ dark mode — stronger fill */
[data-theme="dark"] .tier-section--4 .tier-header__chip {
  background: color-mix(in srgb, var(--tier-accent-4) 18%, transparent);
}

[data-theme="dark"] .tier-section--5 .tier-header__chip {
  background: color-mix(in srgb, var(--tier-accent-5) 18%, transparent);
}
```

### Summary: Files Changed

| File | Changes |
|---|---|
| `src/styles/tokens.css` | New type scale (`--text-4xl`, `--text-5xl`, `--text-hero`), new primary colors, `--color-accent` tokens, `--color-surface-elevated`, three-tier surface system, dark mode overrides with glow shadows, `--letter-spacing-display` for EN, `--line-height-body`, tier build color boosts in dark, `--shadow-glow` / `--shadow-glow-accent` |
| `src/styles/hero.css` | `.hero__headline` font-size/line-height/letter-spacing/max-width, `.hero__eyebrow` margin-bottom, `[data-lang="en"]` headline override |
| `src/styles/tiers.css` | `.tier-header__name` size bump to `--text-3xl`, `.tier-header__price` size/weight/variant-numeric, `.tier-header__verdict` line-height/letter-spacing, `.tier-header__chip` padding/hover/filled variants, tier 1–5 `.tier-header` accent escalation with gradients, `.tier-section--4` ribbon via `::before`, dark mode tier 4–5 glow overrides, dark mode chip overrides |
| `src/styles/tco.css` | `.tco-amount` font-weight/font-variant-numeric/letter-spacing, `.tco-label` font-variant-numeric/letter-spacing/weight |
| `src/styles/comparison.css` | `.comparison-section__title` font-family/letter-spacing |
| `src/styles/quiz.css` | `.quiz-section__title` font-family/letter-spacing, `.quiz-result__cta` accent color, `.quiz-result__tier-name` size to `--text-3xl`, dark mode glow overrides |
| `src/styles/footer.css` | `.site-footer__heading` font-family confirmed, `.site-footer__contact-btn` accent color + glow shadow + hover transform, `.site-footer` background to `--color-surface-deep` |
| `src/styles/cta.css` (new) | Sticky floating CTA — `--color-accent` background, `--shadow-glow` in dark, fixed positioning |


---

## 6. Spatial Composition Revolution

**Current problem:** Every section is 720px-wide centered column with uniform 64px padding. Cards have zero elevation (box-shadow: none). No asymmetry, no spatial surprise. The 6000px page is a monotonous single-column river.

### 6.1 Section Rhythm

**Target:** `src/styles/layout.css` + per-section overrides

Current: every `.section` uses `padding-block: var(--space-16)` (64px). Prescribe varied rhythm:

| Section | Current Padding | New Padding | Rationale |
|---|---|---|---|
| Hero | 100dvh (inherent) | Keep | Already correct |
| Tier sections (1–5) | 64px | `var(--space-20)` (80px) | Slightly more generous |
| TCO section | 64px | `var(--space-32)` (128px) | Major breath before "justify your price" |
| Comparison section | 64px | `var(--space-24)` (96px) | Medium rest |
| Quiz section | 64px | `var(--space-32)` (128px) | Another major break |
| Footer | 48px | `var(--space-20)` (80px) | More presence |

**Implementation** — `src/styles/layout.css`:

```css
/* Keep default but update value */
.section {
  padding-block: var(--space-20);    /* was var(--space-16) */
}

/* TCO and Quiz get extra breathing room */
.tco-section,
.quiz-section {
  padding-block: var(--space-32);
}

.comparison-section {
  padding-block: var(--space-24);
}
```

### 6.2 Content Width Variation

**Target:** `src/styles/tiers.css`, `src/styles/quiz.css`, `src/styles/footer.css`

| Element | Current Width | New Width | Rationale |
|---|---|---|---|
| `.tier-header` | 720px | 800px | More generous card |
| `.tier-section--4 .tier-header` | 720px | 840px | Recommended tier is wider — visual dominance |
| `.quiz-container` | (inherits) | 640px | Intentionally narrower for quiz focus |
| `.site-footer__inner` | 960px | 960px (keep) | Already good |
| `.tco-chart` | (full width) | Keep | Full width is correct for chart |

```css
/* tiers.css — update .tier-header */
.tier-header {
  max-width: 800px;     /* was 720px */
}

.tier-section--4 .tier-header {
  max-width: 840px;     /* wider — recommended dominance */
}

/* quiz.css — add max-width to container */
.quiz-container {
  max-width: 640px;
  margin-inline: auto;
}
```

### 6.3 Card Elevation System

**Target:** `src/styles/tiers.css`, `src/styles/quiz.css`, `src/styles/hero.css`

Current: all cards have `box-shadow: none`. Three-tier system:

| Level | Shadow | Use Case |
|---|---|---|
| Rest | `var(--shadow-sm)` | All tier headers, quiz result card |
| Hover | `var(--shadow-md)` + `translateY(-2px)` | Tier headers, quiz result |
| Recommended | `var(--shadow-lg)` at rest, `var(--shadow-xl)` on hover + `translateY(-4px)` | Tier 4 only |

```css
/* tiers.css — .tier-header */
.tier-header {
  /* ADD to existing: */
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal),
              transform var(--transition-normal),
              opacity 600ms cubic-bezier(0.16, 1, 0.3, 1);  /* keep existing reveal */
}

/* Desktop hover only */
@media (hover: hover) {
  .tier-header:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .tier-section--4 .tier-header:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-4px);
  }
}

/* Tier 4 — elevated at rest */
.tier-section--4 .tier-header {
  box-shadow: var(--shadow-lg);
}

/* quiz.css — quiz result card */
.quiz-result__card {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}

@media (hover: hover) {
  .quiz-result__card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

/* hero.css — hero cards */
@media (hover: hover) {
  .hero__card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}
```

### 6.4 Asymmetric Moments

**Target:** `src/styles/tco.css`, `src/styles/footer.css`

Two asymmetric breaks from the centered monotony (desktop only):

**TCO section title** — left-align on desktop:

```css
/* tco.css */
.tco-section__title {
  text-align: center;     /* default: centered */
}

@media (min-width: 1024px) {
  .tco-section__title {
    text-align: left;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

**Footer heading** — left-align on desktop with CTA below:

```css
/* footer.css */
@media (min-width: 640px) {
  .site-footer__inner {
    text-align: left;
    max-width: 560px;
    margin-inline: auto;
  }
}

@media (max-width: 639px) {
  .site-footer__inner {
    text-align: center;    /* mobile: centered */
  }
}
```

### 6.5 Tablet Breakpoint

**Target:** `src/styles/tiers.css`, `src/styles/hero.css`

```css
/* Tablet: 640px–1024px */
@media (min-width: 640px) and (max-width: 1024px) {
  .tier-header {
    max-width: 680px;
    padding: var(--space-8);
  }

  .tier-section--4 .tier-header {
    max-width: 720px;
  }

  .hero__headline {
    font-size: clamp(2rem, 6vw, 3.5rem);
  }

  .tier-header__name {
    font-size: clamp(1.5rem, 4vw, var(--text-3xl));
  }
}
```

### 6.6 Section Background Alternation

**Target:** `src/styles/tiers.css`, `src/styles/tco.css`, `src/styles/quiz.css`, `src/styles/footer.css`

| Section | Background | How |
|---|---|---|
| Hero | `var(--color-surface)` + mesh gradient | hero.css (see §7.2) |
| Tier 1 | `var(--color-surface)` | default |
| Tier 2 | `var(--color-surface-deep)` | alternating |
| Tier 3 | `var(--color-surface)` | default |
| Tier 4 | `var(--color-surface-deep)` + accent glow | alternating + recommended |
| Tier 5 | `var(--color-surface)` | default |
| TCO | `var(--color-surface-deep)` | distinctive break |
| Comparison | `var(--color-surface)` | default |
| Quiz | `var(--color-surface-deep)` | another break |
| Footer | `var(--color-surface-deep)` | weighted closer |

```css
/* tiers.css */
.tier-section--2,
.tier-section--4 {
  background: var(--color-surface-deep);
}

/* tco.css */
.tco-section {
  background: var(--color-surface-deep);
}

/* quiz.css */
.quiz-section {
  background: var(--color-surface-deep);
}

/* footer.css */
.site-footer {
  background: var(--color-surface-deep);    /* was var(--color-surface-offset) */
}
```

---

## 7. Visual Depth & Atmosphere

**Current problem:** No textures, no patterns, no atmospheric effects beyond one subtle radial gradient in the hero. Everything is flat solid color.

### 7.1 Noise Texture Overlay

**Target:** `src/styles/tokens.css` (token), `src/styles/layout.css` (pseudo-element)

Add a subtle grain texture via inline SVG data URI (works in single-file HTML):

```css
/* tokens.css — new token in :root */
--noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
```

```css
/* layout.css — global overlay */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  background: var(--noise);
  opacity: 0.025;
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 9999;
}

[data-theme="dark"] body::after {
  opacity: 0.015;    /* even more subtle in dark */
}
```

### 7.2 Hero Mesh Gradient

**Target:** `src/styles/hero.css` → `.hero`

Replace single radial gradient with layered mesh:

```css
.hero {
  background:
    radial-gradient(ellipse 60% 50% at 20% 30%, oklch(42% 0.12 195 / 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 60%, oklch(76% 0.15 75 / 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 80% 60% at 50% 50%, oklch(42% 0.12 195 / 0.03) 0%, transparent 80%),
    var(--color-surface);
}

[data-theme="dark"] .hero {
  background:
    radial-gradient(ellipse 60% 50% at 20% 30%, oklch(58% 0.13 195 / 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 60%, oklch(78% 0.16 80 / 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 80% 60% at 50% 50%, oklch(58% 0.13 195 / 0.05) 0%, transparent 80%),
    var(--color-surface);
}
```

### 7.3 Section Gradient Accents

**Target:** `src/styles/tiers.css`

Alternating sections get a barely-perceptible warm tint:

```css
.tier-section--2 {
  background:
    linear-gradient(180deg, var(--color-surface-deep) 0%, color-mix(in srgb, var(--color-surface-deep) 95%, var(--tier-accent-2)) 100%);
}

.tier-section--4 {
  background:
    linear-gradient(180deg, var(--color-surface-deep) 0%, color-mix(in srgb, var(--color-surface-deep) 95%, var(--tier-accent-4)) 100%);
}
```

### 7.4 Recommended Tier Glow

**Target:** `src/styles/tiers.css` → `.tier-section--4 .tier-header`

Tier 4 gets a distinctive warm gold halo (replaces §6.3 shadow):

```css
.tier-section--4 .tier-header {
  border-left: 6px solid var(--tier-accent-4);
  box-shadow:
    0 0 0 1px oklch(76% 0.15 75 / 0.15),
    0 0 32px oklch(76% 0.15 75 / 0.06),
    var(--shadow-lg);
}

[data-theme="dark"] .tier-section--4 .tier-header {
  box-shadow:
    0 0 0 1px oklch(78% 0.16 80 / 0.2),
    0 0 40px oklch(78% 0.16 80 / 0.08),
    0 8px 32px rgba(0 0 0 / 0.3);
}
```

### 7.5 CTA Button Glow

**Target:** `src/styles/footer.css` → `.site-footer__contact-btn`

```css
.site-footer__contact-btn {
  display: inline-block;
  padding: var(--space-4) var(--space-12);        /* was space-3 space-8 — bigger */
  background: linear-gradient(135deg, var(--color-accent) 0%, oklch(68% 0.17 70) 100%);
  color: #1a1918;                                  /* dark text on gold */
  border-radius: var(--radius-full);
  text-decoration: none;
  font-weight: 700;                                /* was 500 — bolder */
  font-size: var(--text-base);                     /* explicit */
  box-shadow: 0 4px 16px oklch(76% 0.15 75 / 0.3);
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}

.site-footer__contact-btn:hover {
  box-shadow: 0 6px 24px oklch(76% 0.15 75 / 0.4);
  transform: translateY(-1px);
}

[data-theme="dark"] .site-footer__contact-btn {
  color: #1a1918;                                  /* stays dark on gold */
  box-shadow: 0 4px 20px oklch(78% 0.16 80 / 0.25);
}

[data-theme="dark"] .site-footer__contact-btn:hover {
  box-shadow: 0 6px 28px oklch(78% 0.16 80 / 0.35);
}
```

### 7.6 Tier Badge Enhancement

**Target:** `src/styles/tiers.css`

Progressive badge sizing:

```css
/* Default (Tiers 1–3) — keep existing 48px */
.tier-header__badge {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--tier-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-lg);
  margin-bottom: var(--space-4);
  flex-shrink: 0;
  box-shadow: inset 0 2px 4px rgba(0 0 0 / 0.15);  /* NEW — inner depth */
}

/* Tier 4 — larger + gold ring */
.tier-section--4 .tier-header__badge {
  width: 56px;
  height: 56px;
  box-shadow:
    0 0 0 3px var(--color-surface-elevated),
    0 0 0 5px var(--color-accent),
    inset 0 2px 4px rgba(0 0 0 / 0.15);
}

/* Tier 5 — larger + gradient */
.tier-section--5 .tier-header__badge {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--tier-accent-5), oklch(40% 0.2 310));
  box-shadow: inset 0 2px 4px rgba(0 0 0 / 0.2);
}
```

### 7.7 Print Considerations

**Target:** `src/styles/print.css`

All new effects must be stripped for clean print output:

```css
@media print {
  body::after { display: none !important; }
  .hero { background: white !important; }
  .tier-header { box-shadow: none !important; }
  .tier-section--4 .tier-header { box-shadow: none !important; }
  .tier-section--5 .tier-header { box-shadow: none !important; }
  .site-footer__contact-btn { box-shadow: none !important; background: #666 !important; }
  .tier-section--2,
  .tier-section--4,
  .tco-section,
  .quiz-section { background: white !important; }
}
```


---

## 8. Motion & Interaction Choreography

**Current problem:** 4 keyframes total (hero only). No hover states on cards. No scroll choreography. No number animations. No staggered reveals. The 5000px of page after the hero is motionless.

### 8.1 Design Principles for Motion

- Motion is **persuasion**, not decoration. Every animation guides attention or communicates quality.
- `prefers-reduced-motion: reduce` MUST disable all transforms — instant appearance only.
- Use `will-change: opacity, transform` on animated elements to prevent paint thrashing.
- Keep all animations under 600ms.
- **Reveal easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, gentle settle. Authoritative.
- **Hover easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — subtle overshoot. Tactile.

### 8.2 Page Load Sequence

**Target:** `src/styles/hero.css`

Choreographed load (0ms = DOM ready):

| Time | Element | Animation |
|---|---|---|
| 0–200ms | Nothing | Prevent flash |
| 200ms | `.hero__eyebrow` | `opacity 0→1, translateY 8px→0, 400ms` |
| 400ms | `.hero__headline` | Existing clip-path reveal (keep) |
| 600ms | `.hero__card--left` | Existing slide-from-left (keep) |
| 600ms | `.hero__card--right` | Existing slide-from-right (keep) |
| 800ms | `.hero__scroll-cta` | Existing bounce (keep) |

New eyebrow animation:

```css
/* hero.css — add new keyframe */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* hero.css — add initial state + animation to .hero__eyebrow */
.hero__eyebrow {
  /* existing styles... */
  opacity: 0;
  animation: fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 200ms;
}
```

### 8.3 Scroll-Triggered Staggered Reveals

**Target:** `src/styles/tiers.css`, `src/styles/tco.css`, `src/styles/comparison.css`

**Tier header children** — stagger 80ms between elements:

```css
/* tiers.css — children of tier-header start hidden */
.tier-section:not(.is-visible) .tier-header__badge,
.tier-section:not(.is-visible) .tier-header__car,
.tier-section:not(.is-visible) .tier-header__name,
.tier-section:not(.is-visible) .tier-header__price,
.tier-section:not(.is-visible) .tier-header__verdict,
.tier-section:not(.is-visible) .tier-header__chips {
  opacity: 0;
  transform: translateY(12px);
}

/* Stagger delays via nth-child on direct children */
.tier-header > :nth-child(1) { --stagger: 0ms; }
.tier-header > :nth-child(2) { --stagger: 80ms; }
.tier-header > :nth-child(3) { --stagger: 160ms; }
.tier-header > :nth-child(4) { --stagger: 240ms; }
.tier-header > :nth-child(5) { --stagger: 320ms; }
.tier-header > :nth-child(6) { --stagger: 400ms; }

/* Reveal when parent section is visible */
.tier-section.is-visible .tier-header > * {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger, 0ms);
}
```

**TCO bar rows** — stagger 100ms between bars:

```css
/* tco.css */
.tco-bar-row:nth-child(1) { --stagger: 0ms; }
.tco-bar-row:nth-child(2) { --stagger: 100ms; }
.tco-bar-row:nth-child(3) { --stagger: 200ms; }
.tco-bar-row:nth-child(4) { --stagger: 300ms; }
.tco-bar-row:nth-child(5) { --stagger: 400ms; }

.tco-bar-row {
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger, 0ms);
}

.tco-bar-row.is-animated {
  opacity: 1;
  transform: translateX(0);
}
```

**Comparison table rows** — stagger 50ms:

```css
/* comparison.css — enhance existing row animation */
.comparison-table tbody tr:nth-child(1)  { --stagger: 0ms; }
.comparison-table tbody tr:nth-child(2)  { --stagger: 50ms; }
.comparison-table tbody tr:nth-child(3)  { --stagger: 100ms; }
.comparison-table tbody tr:nth-child(4)  { --stagger: 150ms; }
.comparison-table tbody tr:nth-child(5)  { --stagger: 200ms; }
.comparison-table tbody tr:nth-child(6)  { --stagger: 250ms; }
.comparison-table tbody tr:nth-child(7)  { --stagger: 300ms; }
.comparison-table tbody tr:nth-child(8)  { --stagger: 350ms; }
.comparison-table tbody tr:nth-child(9)  { --stagger: 400ms; }
.comparison-table tbody tr:nth-child(10) { --stagger: 450ms; }
.comparison-table tbody tr:nth-child(11) { --stagger: 500ms; }
.comparison-table tbody tr:nth-child(12) { --stagger: 550ms; }
.comparison-table tbody tr:nth-child(13) { --stagger: 600ms; }
.comparison-table tbody tr:nth-child(14) { --stagger: 650ms; }

.comparison-table tbody tr {
  transition-delay: var(--stagger, 0ms);
}
```

### 8.4 Hover Micro-Interactions

**Target:** `src/styles/tiers.css`, `src/styles/quiz.css`, `src/styles/hero.css`

All hovers wrapped in `@media (hover: hover)` for touch safety:

```css
/* tiers.css — tier nav pills */
@media (hover: hover) {
  .tier-nav__pill:hover {
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    color: var(--color-primary);
  }

  /* Chips — already defined in §5.6 */
  .tier-header__chip:hover {
    background: color-mix(in srgb, var(--tier-accent) 20%, transparent);
  }
}
```

### 8.5 TCO Number Count-Up

**Target:** `src/tco-bars.ts`

When a TCO bar row enters viewport, animate the amount number from €0 to final value.

**JS logic outline:**

```typescript
function animateCounter(element: HTMLElement, target: number, duration = 1200) {
  const start = performance.now();
  const format = (n: number) => `€${n.toLocaleString('el-GR')}`;

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out: 1 - (1 - t)^3
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    element.textContent = format(current);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
```

- Only triggers once per element (flag with `data-counted="true"`)
- `prefers-reduced-motion`: show final value immediately, no animation
- Duration: 1200ms

### 8.6 Comparison Row Highlight

**Target:** `src/styles/comparison.css`

```css
.comparison-table tbody:hover tr:not(:hover) {
  opacity: 0.5;
  transition: opacity var(--transition-fast);
}

.comparison-table tbody:hover tr:hover {
  opacity: 1;
}
```

---

## 9. Conversion Element Design

**Current problem:** Single footer CTA buried at bottom of 6000px page. No sticky CTA. No recommended tier emphasis. No trust signals. No urgency. The page informs but doesn't persuade.

### 9.1 Sticky Floating CTA

**Target:** New file `src/styles/cta.css`, new file `src/sticky-cta.ts`, HTML element in `src/index.html`

**HTML** — add before `</body>` in index.html:

```html
<div class="sticky-cta" id="sticky-cta" hidden>
  <a href="#footer" class="sticky-cta__button" data-i18n="cta.sticky">
    Μιλήστε μαζί μας
  </a>
</div>
```

**CSS** — `src/styles/cta.css`:

```css
.sticky-cta {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 90;
  transform: translateY(calc(100% + 24px));    /* hidden below viewport */
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.sticky-cta[hidden] {
  display: block;      /* override hidden — we use transform */
  visibility: hidden;
}

.sticky-cta.is-visible {
  transform: translateY(0);
  visibility: visible;
}

.sticky-cta__button {
  display: inline-block;
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--color-accent) 0%, oklch(68% 0.17 70) 100%);
  color: #1a1918;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-sm);
  text-decoration: none;
  box-shadow:
    0 4px 20px oklch(76% 0.15 75 / 0.3),
    0 0 0 1px oklch(76% 0.15 75 / 0.1);
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}

.sticky-cta__button:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 28px oklch(76% 0.15 75 / 0.4),
    0 0 0 1px oklch(76% 0.15 75 / 0.15);
}

/* Dark mode */
[data-theme="dark"] .sticky-cta__button {
  box-shadow:
    0 4px 24px oklch(78% 0.16 80 / 0.25),
    0 0 0 1px oklch(78% 0.16 80 / 0.15);
}

/* Mobile — full-width bottom strip */
@media (max-width: 639px) {
  .sticky-cta {
    bottom: 0;
    right: 0;
    left: 0;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    transform: translateY(100%);
  }

  .sticky-cta.is-visible {
    transform: translateY(0);
  }

  .sticky-cta__button {
    display: block;
    text-align: center;
    padding: var(--space-3);
  }
}

/* Print */
@media print {
  .sticky-cta { display: none !important; }
}
```

**JS logic outline** — `src/sticky-cta.ts`:

```typescript
// Two IntersectionObservers:
// 1. Hero exits viewport → show sticky CTA
// 2. Footer enters viewport → hide sticky CTA

const hero = document.querySelector('.hero');
const footer = document.querySelector('.site-footer');
const stickyCta = document.getElementById('sticky-cta');

const heroObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) stickyCta?.classList.add('is-visible');
  else stickyCta?.classList.remove('is-visible');
}, { threshold: 0 });

const footerObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) stickyCta?.classList.remove('is-visible');
  else if (hero && !hero.getBoundingClientRect().bottom > 0) {
    stickyCta?.classList.add('is-visible');
  }
}, { threshold: 0 });
```

**i18n keys** — add to `src/i18n.ts`:

```typescript
"cta.sticky": { gr: "Μιλήστε μαζί μας", en: "Talk to us" }
```

### 9.2 Recommended Tier (Tier 4) Dominance

**Target:** `src/styles/tiers.css`

Tier 4 is the "recommended" tier. Visual dominance via multiple signals:

**"Recommended" ribbon** — CSS-only using `data-*` attribute:

```css
.tier-section--4 .tier-header {
  position: relative;
}

/* Ribbon positioned top-right */
.tier-section--4 .tier-header::after {
  content: attr(data-recommended);
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  padding: var(--space-1) var(--space-4);
  background: var(--color-accent);
  color: #1a1918;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}
```

**HTML requirement** — Tier 4 `.tier-header` needs `data-recommended` attribute set via i18n:

```html
<div class="tier-header" data-recommended="Προτεινόμενο">
```

The i18n system must update this attribute on language switch:
- GR: `"Προτεινόμενο"` | EN: `"Recommended"`

**Combined tier 4 treatment** (merging §5.4, §6.3, §7.4):

```css
.tier-section--4 .tier-header {
  max-width: 840px;
  border-left: 6px solid var(--tier-accent-4);
  background: linear-gradient(135deg, color-mix(in srgb, var(--tier-accent-4) 8%, transparent) 0%, transparent 35%),
              var(--color-surface-elevated);
  box-shadow:
    0 0 0 1px oklch(76% 0.15 75 / 0.15),
    0 0 32px oklch(76% 0.15 75 / 0.06),
    var(--shadow-lg);
  position: relative;
}
```

### 9.3 Footer as Conversion Closer

**Target:** `src/styles/footer.css`, `src/index.html`, `src/i18n.ts`

Redesign from afterthought to conversion closer:

```css
.site-footer {
  padding-block: var(--space-20);
  background: var(--color-surface-deep);      /* was surface-offset */
  border-top: 1px solid var(--color-border);
}

.site-footer__heading {
  font-family: var(--font-display);
  font-size: var(--text-3xl);                 /* was --text-xl — 3x bigger */
  font-weight: 700;
  margin-bottom: var(--space-4);
  letter-spacing: -0.01em;
}

.site-footer__body {
  color: var(--color-text-muted);
  max-width: 480px;
  margin-inline: auto;
  margin-bottom: var(--space-8);              /* was space-6 — more air */
  line-height: 1.6;
}

/* CTA button — inherits glow from §7.5 */

/* Secondary link — quiz */
.site-footer__quiz-link {
  display: inline-block;
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color var(--transition-fast);
}

.site-footer__quiz-link:hover {
  color: var(--color-primary);
}

/* Trust signal line */
.site-footer__trust {
  margin-top: var(--space-6);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  opacity: 0.8;
}

/* Desktop: left-align */
@media (min-width: 640px) {
  .site-footer__inner {
    max-width: 560px;
    text-align: left;
  }

  .site-footer__body {
    margin-inline: 0;
  }
}
```

**New HTML elements** in footer:

```html
<footer class="site-footer" id="footer">
  <div class="container site-footer__inner">
    <div class="site-footer__cta">
      <h2 class="site-footer__heading" data-i18n="footer.heading">...</h2>
      <p class="site-footer__body" data-i18n="footer.body">...</p>
      <a href="mailto:..." class="site-footer__contact-btn" data-i18n="footer.cta">...</a>
      <a href="#quiz" class="site-footer__quiz-link" data-i18n="footer.quiz-link">...</a>
    </div>
    <p class="site-footer__trust" data-i18n="footer.trust">...</p>
    <div class="site-footer__actions">
      <button class="site-footer__print-btn" ...>...</button>
    </div>
    <p class="site-footer__credits" ...>...</p>
  </div>
</footer>
```

**New i18n keys:**

```typescript
"footer.heading":    { gr: "...", en: "..." },
"footer.body":       { gr: "...", en: "..." },
"footer.cta":        { gr: "...", en: "..." },
"footer.quiz-link":  { gr: "→ Ξεκινήστε το Quiz", en: "→ Take the Quiz" },
"footer.trust":      { gr: "50+ επιχειρήσεις εμπιστεύονται τον οδηγό μας", en: "50+ businesses trust our guide" }
```

### 9.4 Inline Quiz CTA

**Target:** `src/index.html` (between tier-3 and tier-4), `src/styles/tiers.css`, `src/i18n.ts`

Banner between tiers 3 and 4 nudging users to the quiz:

**HTML:**

```html
<!-- Between tier-3 and tier-4 sections -->
<div class="inline-cta container">
  <p class="inline-cta__text">
    <span data-i18n="inline-cta.text"></span>
    <a href="#quiz" class="inline-cta__link" data-i18n="inline-cta.link"></a>
  </p>
</div>
```

**CSS:**

```css
.inline-cta {
  max-width: 720px;
  margin-inline: auto;
  padding: var(--space-8) var(--space-6);
  background: color-mix(in srgb, var(--color-accent) 6%, var(--color-surface));
  border-radius: var(--radius-lg);
  text-align: center;
  margin-block: var(--space-12);
}

.inline-cta__text {
  font-size: var(--text-base);
  color: var(--color-text);
  margin: 0;
}

.inline-cta__link {
  color: var(--color-accent);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color var(--transition-fast);
}

.inline-cta__link:hover {
  color: var(--color-accent-hover);
}
```

**i18n keys:**

```typescript
"inline-cta.text": { gr: "Ανακαλύψτε γρήγορα ποιο επίπεδο σας ταιριάζει — ", en: "Quickly find which tier fits you — " },
"inline-cta.link": { gr: "→ Ξεκινήστε το Quiz", en: "→ Take the Quiz" }
```

### 9.5 Conversion Flow Summary

The complete conversion path through the page:

1. **Hero** — car analogy reframes the problem. User is hooked.
2. **Tier 1–3** — educational content builds understanding. Staggered reveals maintain engagement.
3. **Inline quiz CTA** (between T3/T4) — first conversion nudge. "Find your tier."
4. **Tier 4 (Recommended)** — visual dominance signals "this is the answer." Gold glow, wider card, "Recommended" ribbon.
5. **Tier 5** — premium capstone for those who want the best.
6. **Sticky CTA** — always visible from hero exit onward. Low-friction "Talk to us."
7. **TCO section** — rational justification with animated numbers.
8. **Comparison table** — feature-by-feature proof.
9. **Quiz** — personalized recommendation drives commitment.
10. **Footer** — conversion closer with primary CTA, quiz link, and trust signal.

### Summary: Files Changed (Sections 8–9)

| File | Changes |
|---|---|
| `src/styles/hero.css` | `.hero__eyebrow` fade-up animation, hover on hero cards |
| `src/styles/tiers.css` | Staggered child reveals with `--stagger`, inline-cta styles, tier-4 ribbon `::after`, nav pill hover |
| `src/styles/tco.css` | Staggered bar row reveals, `.tco-bar-row` initial hidden state |
| `src/styles/comparison.css` | Row stagger delays, row hover dimming |
| `src/styles/cta.css` (new) | Sticky floating CTA — full CSS for fixed pill, mobile strip, print |
| `src/styles/footer.css` | Redesigned footer: bigger heading, left-aligned (desktop), quiz link, trust line |
| `src/styles/print.css` | Strip all new effects |
| `src/sticky-cta.ts` (new) | IntersectionObserver logic for sticky CTA visibility |
| `src/tco-bars.ts` | `animateCounter()` function for number count-up |
| `src/index.html` | Sticky CTA div, inline-cta banner between T3/T4, footer quiz-link and trust elements, tier-4 `data-recommended` attr |
| `src/i18n.ts` | New keys: `cta.sticky`, `footer.quiz-link`, `footer.trust`, `inline-cta.text`, `inline-cta.link`, tier-4 recommended text |


---

## 10. Implementation Phases

The design overhaul is implemented in 4 phases, ordered by conversion impact. Each phase is independently deployable and testable.

### Phase 1: Quick Wins

**Goal:** Fix the most impactful visual and conversion failures with minimal effort.

**Estimated effort:** 1 focused session.

| # | Change | File | Target |
|---|---|---|---|
| 1 | Hero headline: `font-size: var(--text-hero)`, `line-height: 1.08`, `letter-spacing: -0.02em` | `hero.css` | `.hero__headline` |
| 2 | Card elevation: add `box-shadow: var(--shadow-sm)`, hover lift `translateY(-2px)` + `var(--shadow-md)` | `tiers.css` | `.tier-header`, `.tier-header:hover` |
| 3 | CTA button glow: gradient bg + shadow glow + hover lift | `footer.css` | `.site-footer__contact-btn` |
| 4 | Hero eyebrow animation: `opacity 0→1, translateY(8px→0)`, 400ms, delay 200ms | `hero.css` | `.hero__eyebrow` |
| 5 | New tokens: `--text-hero`, `--text-4xl`, `--text-5xl`, `--space-20/24/32`, `--shadow-lg/xl/glow`, `--color-accent`, `--color-surface-elevated/deep`, `--transition-reveal/spring` + dark variants | `tokens.css` | `:root`, `[data-theme="dark"]` |
| 6 | Section padding variation: tier=80px, TCO/quiz=128px, comparison=96px | `layout.css` | `.section`, per-section overrides |
| 7 | Tier price bump: `font-size: var(--text-xl)`, `font-weight: 700`, `font-variant-numeric: tabular-nums` | `tiers.css` | `.tier-header__price` |
| 8 | Tier name bump: `font-size: var(--text-3xl)`, `line-height: 1.15` | `tiers.css` | `.tier-header__name` |
| 9 | Primary color shift: `oklch(48% 0.11 195)` + hover, dark mode boost | `tokens.css` | `--color-primary` |
| 10 | Text-muted contrast fix: `#5c5952` (from `#6b6860`) | `tokens.css` | `--color-text-muted` |

**Acceptance criteria:**
- [ ] Hero headline is visually dominant at all viewport sizes (40px mobile → 72px desktop)
- [ ] Tier cards have visible shadow at rest, lift on hover (desktop only)
- [ ] Footer CTA has visible glow/shadow, uses gold accent color
- [ ] New tokens exist in tokens.css with dark mode variants
- [ ] Section padding varies — no two adjacent sections have the same gap
- [ ] Tier prices are noticeably larger than before
- [ ] `bun run build` produces single file < 400KB
- [ ] Dark mode works with all new tokens
- [ ] Print stylesheet unaffected

### Phase 2: Conversion Architecture

**Goal:** Add all conversion-specific elements — sticky CTA, recommended tier, inline nudge, footer redesign.

**Estimated effort:** 1 focused session.

| # | Change | File | Target |
|---|---|---|---|
| 1 | Sticky floating CTA: new CSS file + TS logic + HTML element | `cta.css` (new), `sticky-cta.ts` (new), `index.html` | `.sticky-cta` |
| 2 | Recommended tier dominance: wider card, gold glow, thicker border, "Recommended" ribbon | `tiers.css` | `.tier-section--4 .tier-header` |
| 3 | Tier 4 `data-recommended` attribute + i18n update | `index.html`, `i18n.ts` | Tier 4 header |
| 4 | Inline quiz CTA banner between T3/T4 | `index.html`, `tiers.css`, `i18n.ts` | `.inline-cta` |
| 5 | Footer redesign: larger heading, left-aligned (desktop), quiz link, trust line | `footer.css`, `index.html`, `i18n.ts` | `.site-footer` |
| 6 | Section background alternation: surface/deep/surface/deep pattern | `tiers.css`, `tco.css`, `quiz.css`, `footer.css` | Section wrappers |
| 7 | Surface-elevated on tier header cards (replacing surface-offset) | `tiers.css` | `.tier-header` |

**Acceptance criteria:**
- [ ] Sticky CTA visible when scrolling past hero, hidden when footer is in viewport
- [ ] Sticky CTA slides up with animation, not pops in
- [ ] Tier 4 visually dominates all other tiers — gold glow, wider card, "Recommended" ribbon visible
- [ ] Inline quiz CTA renders between tiers 3 and 4 with correct GR/EN text
- [ ] Footer heading is `--text-3xl`, left-aligned on desktop
- [ ] Footer has quiz link and trust signal line
- [ ] Section backgrounds alternate visually
- [ ] All new elements have i18n keys for both GR and EN
- [ ] Mobile: sticky CTA becomes full-width bottom strip
- [ ] No layout shifts, z-index conflicts, or scroll jumps
- [ ] Print: sticky CTA hidden, all section backgrounds white

### Phase 3: Motion & Polish

**Goal:** Add choreographed motion, staggered reveals, micro-interactions, and atmospheric textures.

**Estimated effort:** 1 focused session.

| # | Change | File | Target |
|---|---|---|---|
| 1 | Tier header staggered reveals: children appear sequentially, 80ms delays | `tiers.css` | `.tier-header > *` |
| 2 | TCO bar row stagger: 100ms delays, slide-from-left | `tco.css` | `.tco-bar-row` |
| 3 | Comparison row stagger: 50ms delays | `comparison.css` | `tbody tr` |
| 4 | TCO number count-up: 0→final, 1200ms ease-out | `tco-bars.ts` | `.tco-amount` |
| 5 | Comparison row hover dimming: siblings fade to 0.5 opacity | `comparison.css` | `tbody:hover tr:not(:hover)` |
| 6 | Hover micro-interactions: tier pills, chips, quiz result, hero cards | `tiers.css`, `quiz.css`, `hero.css` | Various |
| 7 | Noise texture overlay: body::after with SVG data URI, 2.5% opacity | `tokens.css`, `layout.css` | `body::after` |
| 8 | Hero mesh gradient: 3-layer radial replacing single | `hero.css` | `.hero` |
| 9 | Section gradient accents: subtle warm tint on alternating sections | `tiers.css` | `.tier-section--2, --4` |
| 10 | Tier badge progressive enhancement: T4 gold ring, T5 gradient | `tiers.css` | `.tier-header__badge` |
| 11 | Tier chip enhancement: filled bg on T4+, hover states | `tiers.css` | `.tier-header__chip` |
| 12 | `will-change` hints on animated elements | `tiers.css`, `tco.css`, `comparison.css` | Animated selectors |

**Acceptance criteria:**
- [ ] Tier elements appear with visible stagger (badge → name → price → verdict → chips)
- [ ] TCO numbers count from 0 to final value on scroll
- [ ] Comparison rows appear sequentially, not all at once
- [ ] Hover effects work on desktop only (no effect on touch devices)
- [ ] Noise texture is visible on close inspection but not distracting
- [ ] Hero background has visible multi-layer depth (not flat)
- [ ] All motion disabled with `prefers-reduced-motion: reduce` — instant appearance, no transforms
- [ ] No performance regression — smooth 60fps scrolling
- [ ] `will-change` applied to animated elements, removed after animation completes (or kept for recurring)

### Phase 4: Visual Depth & Refinement

**Goal:** Final polish — dark mode refinement, tablet breakpoint, responsive type, print cleanup, token cleanup.

**Estimated effort:** 1 focused session.

| # | Change | File | Target |
|---|---|---|---|
| 1 | Dark mode refinement: boosted primary/accent, elevated surface, glow adjustments | `tokens.css` | `[data-theme="dark"]` |
| 2 | Dark mode tier build colors: boosted lightness for visibility | `tokens.css` | `--tier-build-*` dark variants |
| 3 | Tablet breakpoint: 640–1024px rules for tier headers, hero headline | `tiers.css`, `hero.css` | `@media (min-width: 640px) and (max-width: 1024px)` |
| 4 | Responsive type scaling: `clamp()` for tier names, section titles | `tiers.css` | `.tier-header__name` |
| 5 | Asymmetric moments: TCO title left-align (desktop), footer left-align (desktop) | `tco.css`, `footer.css` | Desktop overrides |
| 6 | Print cleanup: strip all textures, gradients, glows, shadows | `print.css` | `@media print` |
| 7 | Token cleanup: remove unused old `--color-surface-offset` references (replaced by `--color-surface-deep`), ensure all new tokens have dark mode variants | `tokens.css`, all CSS files | Global |
| 8 | Tier 4 recommended ribbon `::after` with `data-recommended` attribute | `tiers.css` | `.tier-section--4 .tier-header::after` |
| 9 | Tier 5 premium glow shadow | `tiers.css` | `.tier-section--5 .tier-header` |
| 10 | Final QA: both themes, both languages, print, reduced-motion, mobile, tablet, desktop | All files | All |

**Acceptance criteria:**
- [ ] Dark mode feels intentional — rich, warm, sophisticated. Not inverted.
- [ ] Tier 5 card feels noticeably more premium than Tier 1
- [ ] Tier 4 card has visible gold glow and "Recommended" ribbon
- [ ] Tablet layout looks correct (not just mobile stretched)
- [ ] Print output is clean: white backgrounds, no shadows, no textures, no glows
- [ ] All new tokens used, no dead variables
- [ ] `--color-surface-offset` fully migrated to `--color-surface-deep` everywhere
- [ ] `bun run build` produces file < 400KB
- [ ] Both GR and EN render correctly with appropriate fonts
- [ ] `prefers-reduced-motion: reduce` disables all animation

---

## 11. Success Metrics

Verify the design overhaul achieved its goals:

| Metric | Target | How to Verify |
|---|---|---|
| **Visual quality** | 8.5+/10 weighted score | Re-run the UI/UX audit checklist. No category below 6/10 |
| **Conversion readiness** | All 10 audit fixes addressed | Walk through the top-10 list. Each fix has visible, working implementation |
| **Performance** | Lighthouse 95+ Performance, 100 Accessibility | Run Lighthouse on built `dist/web-tiers-guide.html` |
| **Bundle size** | < 400KB uncompressed | `bun run build`, check file size |
| **Cross-theme** | Both light and dark feel intentional | Toggle theme at every scroll position. No jarring inconsistencies |
| **Bilingual** | All new elements have GR/EN strings | Toggle language. No mixed-language UI, no missing strings |
| **Print** | Clean output with all effects stripped | Print to PDF. Verify white bg, no shadows, no noise, all content readable |
| **Motion** | All animations respect prefers-reduced-motion | Enable reduced motion in OS settings. Page shows everything instantly |
| **Responsive** | Mobile, tablet, desktop all look correct | Test at 375px, 768px, 1280px, 1920px |
| **Accessibility** | WCAG AA contrast in both themes | Check all text color combinations. No border-line contrast ratios |

