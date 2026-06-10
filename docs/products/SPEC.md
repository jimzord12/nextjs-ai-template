# SPEC.md — Non-Technical Client Web Guide (Enhanced)

## Document Purpose & Audience

A **single self-contained HTML file** (`web-tiers-guide.html`) designed for a non-technical Greek business owner. The goal is to break the "website is a binary thing" mental model and replace it with an intuitive **5-tier quality framework**, anchored to the car analogy as the primary cognitive scaffold. The document is meant to be shared as a link or attachment before or after a sales meeting.

Built from modular TypeScript source files, bundled by Bun into a single distributable HTML file. Uses Web Awesome web components for accessible interactive UI.

**Bilingual:** Greek (primary) and English (required). All content exists in both languages with instant toggling. See §1 for i18n architecture.

---

## Page Architecture

```
[STICKY HEADER]
    └── Logo | Dark/Light Toggle | Language (GR | EN) — REQUIRED

[HERO SECTION]
    └── Car analogy metaphor + headline

[ORIENTATION BAR] ← sticky tier navigator
    └── 5 tier labels as scrollspy tabs

[TIER SECTIONS × 5]
    └── Each tier: SVG illustration → header card → details accordion

[TCO SECTION]
    └── 3-Year cost comparison table (animated stacked bars)

[COMPARISON CHECKLIST] ← NEW
    └── Side-by-side feature matrix across all 5 tiers

[DECISION GUIDE]
    └── "Which tier am I?" interactive card quiz with scoring algorithm

[FOOTER]
    └── Contact CTA + PDF export button + credits
```

---

## Section-by-Section Spec


## 1. i18n Architecture

Bilingual GR/EN is **required**, not optional. Greek is the primary language; English is a professional translation.

### 1.1 Default Language

- **Default:** Greek (`gr`).
- First-time visitors with no stored preference see Greek.
- If `localStorage` or hash contains `en`, English loads immediately before first paint (see §1.4).

### 1.2 Content Storage — Single JS Object

All UI strings live in one `const i18n` object, keyed by language code. Every value is a **flat string** — no nested objects, no HTML. Keys use dot-path names for scannability.

```js
const i18n = {
  gr: {
    "site.title": "Ο Οδηγός της Ιστοσελίδας",
    "hero.eyebrow": "Για επιχειρηματίες που θέλουν να καταλάβουν",
    "hero.headline": "Γιατί μια ιστοσελίδα δεν είναι απλώς… μια ιστοσελίδα.",
    "hero.card.left.bullet1": "Πάει από το Α στο Β",
    // … every visible string on the page
  },
  en: {
    "site.title": "The Website Tiers Guide",
    "hero.eyebrow": "For business owners who want to understand",
    "hero.headline": "Why a website is not just… a website.",
    "hero.card.left.bullet1": "Gets you from A to B",
    // …
  }
};
```

**No third-party i18n library.** The file is self-contained HTML. A `<script>` block at the bottom contains this object and the switching logic.

### 1.3 DOM Switching — `data-i18n` Attributes

Every translatable element carries `data-i18n="key.from.object"`:

```html
<h1 data-i18n="hero.headline"></h1>
<span data-i18n="hero.eyebrow"></span>
```

The switcher function:

```js
function setLang(lang) {
  document.documentElement.setAttribute("data-lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang]?.[key]) el.textContent = i18n[lang][key];
  });
  localStorage.setItem("lang", lang);
  // update hash without scroll jump
  history.replaceState(null, "", `#lang=${lang}`);
  // update toggle active state
  updateToggleUI(lang);
}
```

**Init on DOMContentLoaded:**

```js
const stored = localStorage.getItem("lang");
const hash = new URLSearchParams(location.hash.slice(1)).get("lang");
const lang = hash || stored || "gr";
setLang(lang); // applies before first visible paint if script is in <head> with defer
```

### 1.4 State — `data-lang` on `<html>`, Persisted

- `document.documentElement.setAttribute("data-lang", lang)` — drives CSS font-family switches (see §1.6).
- `localStorage.setItem("lang", lang)` — persists across sessions.
- Both are set by `setLang()` above.

### 1.5 URL — Hash-Based `#lang=en`

- On every lang change: `history.replaceState(null, "", "#lang=" + lang)`.
- On page load, `#lang=en` is checked **before** localStorage, so a shared English link wins.
- Hash is used instead of pathname to keep the single-file architecture simple — no server routing.

### 1.6 Font Considerations — Greek Glyph Coverage

**Problem:** Zodiak (Fontshare serif) does **not** have full Greek glyph coverage. It supports Latin only. Satoshi (Fontshare sans) **does** support Greek.

**Recommendation — Dual Font Strategy:**

| Language | Display / Headlines | Body |
|----------|-------------------|------|
| Greek (`data-lang="gr"`) | **Satoshi Bold** (700) | Satoshi Regular (400) |
| English (`data-lang="en"`) | **Zodiak Bold** (700) | Satoshi Regular (400) |

CSS implementation:

```css
:root {
  --font-display: "Satoshi", sans-serif;
  --font-body: "Satoshi", sans-serif;
}

[data-lang="en"] {
  --font-display: "Zodiak", serif;
}
```

This means:
- Greek pages use Satoshi throughout — clean, modern, fully readable.
- English pages use Zodiak for headlines (editorial, premium feel) and Satoshi for body.
- No fallback surprises. No Greek characters rendered as tofu or system-font overrides.

**Font loading remains unchanged:**

```html
<link
  href="https://api.fontshare.com/v2/css?f[]=zodiak@400,700&f[]=satoshi@400,500,700&display=swap"
  rel="stylesheet"
/>
```

Both families load regardless of language — the file is small and this avoids FOUT on toggle.

### 1.7 Toggle UI — Pill-Style GR | EN

Located in the sticky header, **right of the dark/light toggle**.

```
┌─────────────┐
│  GR  │  EN  │   ← pill container
└─────────────┘
```

- **Container:** `display: inline-flex; border-radius: 999px; border: 1px solid var(--color-border); overflow: hidden;`
- **Each option:** `<button>` with `padding: 4px 12px; font-size: 13px; font-weight: 500; letter-spacing: 0.02em;`
- **Active state:** `background: var(--color-primary); color: white;` (filled).
- **Inactive state:** `background: transparent; color: var(--color-text-muted);`
- **Transition:** `background-color 200ms ease, color 200ms ease`.
- **Accessible:** Both buttons carry `aria-pressed="true/false"` and `aria-label="Ελληνικά / English"`.

### 1.8 Content Strategy

- **Greek is written first.** All copy is authored in Greek, reviewed for tone and clarity.
- **English is a professional human translation**, not machine translation. It preserves the warm, authoritative tone while sounding natural in English.
- No mixed-language UI: when GR is active, every visible string is Greek. When EN is active, every visible string is English.

---

## 2. Sticky Header (Section 1 — Enhanced)

### 2.1 Purpose

Orientation, branding, dark/light mode, and language switching — all accessible from any scroll position.

### 2.2 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ [SVG Logo]  Ο Οδηγός της Ιστοσελίδας    ☀️/🌙    [ GR │ EN ]       │
└──────────────────────────────────────────────────────────────────────┘
```

Left to right:
1. **Inline SVG logo** — wordmark-style, minimal. ~24×24px. Renders in `currentColor`.
2. **Site title** — `data-i18n="site.title"`. GR: "Ο Οδηγός της Ιστοσελίδας" / EN: "The Website Tiers Guide". Font: `var(--font-display)`, 500 weight, `font-size: 15px`.
3. **Spacer** — `flex: 1` pushes toggles right.
4. **Dark/light toggle** — sun/moon icon button.
5. **Language toggle** — GR | EN pill (§1.7).

### 2.3 Dark/Light Toggle

- **Icon:** Inline SVG. Sun for light mode, moon for dark mode.
- **Animation:** `transform: rotate(0) → rotate(360deg)` on toggle, `transition: transform 300ms ease`.
- **State:** Sets `data-theme="light|dark"` on `<html>`. Persists in `localStorage("theme")`.
- **Init:** `localStorage > prefers-color-scheme > "light"`.

### 2.4 Sticky Behavior

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(247, 246, 242, 0.85); /* light surface @ 85% */
  border-bottom: 1px solid var(--color-border);
  transition: background 200ms ease;
}

[data-theme="dark"] .site-header {
  background: rgba(23, 22, 20, 0.85); /* dark surface @ 85% */
}
```

### 2.5 Dimensions

- **Desktop (≥640px):** `height: 56px; padding-inline: var(--space-6);`
- **Mobile (<640px):** `height: 48px; padding-inline: var(--space-4);`

### 2.6 Mobile Behavior

On screens `<640px`:
- Logo shrinks to icon-only (SVG logo stays, site title gets `display: none`).
- Dark/light toggle and language pill remain visible and accessible.
- All toggle buttons maintain `min-height: 44px; min-width: 44px;` touch targets.

```css
@media (max-width: 639px) {
  .site-header__title { display: none; }
  .site-header__logo svg { width: 28px; height: 28px; }
}
```

---

## 3. Hero Section (Section 2 — Enhanced with Bilingual Copy)

### 3.1 Purpose

Deliver the car analogy as the opening reframe. The user must feel understood within 5 seconds. This is the most important section in the entire document.

### 3.2 Layout

Full-viewport height (`100dvh`), centered vertically and horizontally, with a warm subtle radial gradient background emanating from center.

```css
.hero {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-8) var(--space-4);
  background:
    radial-gradient(
      ellipse 80% 60% at 50% 45%,
      rgba(1, 105, 111, 0.06) 0%,   /* Hydra Teal whisper */
      transparent 70%
    ),
    var(--color-surface);
}
```

### 3.3 Bilingual Copy — All Elements

#### Eyebrow Label

| Lang | Copy |
|------|------|
| GR | **Για επιχειρηματίες που θέλουν να καταλάβουν** |
| EN | **For business owners who want to understand** |

Style: `font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted);`

#### Hero Headline

| Lang | Copy |
|------|------|
| GR | **Γιατί μια ιστοσελίδα δεν είναι απλώς… μια ιστοσελίδα.** |
| EN | **Why a website is not just… a website.** |

Style: `font-family: var(--font-display); font-size: clamp(1.75rem, 5vw, 3rem); font-weight: 700; line-height: 1.15; color: var(--color-text); max-width: 720px;`

#### Car Metaphor Cards — Two-Column Block

Two cards side by side (`display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6)`). Each card has: an emoji header, a title, a price, and 3 bullets. Cards have `border: 1px solid var(--color-border); border-radius: 12px; padding: var(--space-6); background: var(--color-surface-offset);`.

**Left Card — City Hatchback (€10k)**

| Element | GR | EN |
|---------|----|----|
| Emoji header | 🚗 | 🚗 |
| Title | Αυτοκίνητο πόλης | City hatchback |
| Price | ~€10.000 | ~€10,000 |
| Bullet 1 | Πάει από το Α στο Β | Gets you from A to B |
| Bullet 2 | Κλιματισμός, ραδιόφωνο, ηλεκτρικά παράθυρα | A/C, radio, power windows |
| Bullet 3 | Δεν εντυπωσιάζει κανέναν | Impresses absolutely no one |

**Right Card — BMW (€40k)**

| Element | GR | EN |
|---------|----|----|
| Emoji header | 🚘 | 🚘 |
| Title | BMW Σειρά 3 | BMW 3 Series |
| Price | ~€40.000 | ~€40,000 |
| Bullet 1 | Άνεση, ασφάλεια, τεχνολογία | Comfort, safety, technology |
| Bullet 2 | Εμπιστοσύνη και κύρος στον δρόμο | Trust and presence on the road |
| Bullet 3 | Σε αντιπροσωπείες και πελάτες | From dealers and clients alike |

#### Bridge Text

| Lang | Copy |
|------|------|
| GR | **Αυτή η λογική ισχύει ακριβώς το ίδιο για τις ιστοσελίδες. Ορίστε τα πέντε επίπεδα.** |
| EN | **This same logic applies exactly to websites. Here are the five tiers.** |

Style: `font-family: var(--font-body); font-size: var(--text-lg); font-weight: 500; color: var(--color-text-muted); max-width: 560px; margin-top: var(--space-8);`

#### Scroll CTA

Animated downward chevron (▼). No text, purely visual.

```css
.hero__scroll-cta {
  margin-top: var(--space-10);
  animation: bounce-chevron 1.4s ease-in-out infinite;
  color: var(--color-text-muted);
  font-size: 24px;
}

@keyframes bounce-chevron {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
```

### 3.4 Animation Spec

All animations gated behind `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .hero__headline,
  .hero__card--left,
  .hero__card--right,
  .hero__scroll-cta {
    animation: none !important;
    transition: opacity 200ms ease !important;
  }
}
```

| Element | Animation | Trigger | Duration / Easing |
|---------|-----------|---------|--------------------|
| Hero headline | `clip-path: inset(0 0 100% 0)` → `inset(0)` | Page load | 700ms, `cubic-bezier(0.16, 1, 0.3, 1)` |
| Left car card | `translateX(-40px); opacity: 0` → `translateX(0); opacity: 1` | Page load, 200ms after headline | 600ms, `cubic-bezier(0.16, 1, 0.3, 1)` |
| Right car card | `translateX(40px); opacity: 0` → `translateX(0); opacity: 1` | Page load, 400ms after headline | 600ms, `cubic-bezier(0.16, 1, 0.3, 1)` |
| Scroll chevron | `translateY(0)` → `translateY(8px)` → `0` | Loop, infinite | 1.4s, `ease-in-out` |

**Clip-path headline reveal:**

```css
.hero__headline {
  clip-path: inset(0 0 100% 0);
  animation: reveal-up 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 200ms;
}

@keyframes reveal-up {
  to { clip-path: inset(0 0 0 0); }
}
```

### 3.5 Mobile Behavior

At `<640px`:

- Car metaphor cards stack vertically: `grid-template-columns: 1fr;`
- Hero headline: `font-size: clamp(1.5rem, 6vw, 2.25rem);`
- Bridge text: `font-size: var(--text-base);`
- Section padding reduces: `padding: var(--space-6) var(--space-4);`

### 3.6 i18n Keys for Hero Section

For reference, the full key set needed in the `i18n` object:

```
hero.eyebrow
hero.headline
hero.card.left.title
hero.card.left.price
hero.card.left.bullet1
hero.card.left.bullet2
hero.card.left.bullet3
hero.card.right.title
hero.card.right.price
hero.card.right.bullet1
hero.card.right.bullet2
hero.card.right.bullet3
hero.bridge
```

Each key has a `gr` and `en` value as specified in §3.3 above.
## Tier 01 — WP Template Flip / Το WordPress Template

### Tier 01 Header Card

- **Badge**: `01` in Muted Amber `#b07a00`
- **Car**: Μεταχειρισμένο από Facebook · Used car from Facebook
- **Name**: **Το WordPress Template** / **WP Template Flip**
- **Price**: €250–€800
- **Verdict**: *"Απλώς κάτι_online — δεν φέρνει πελάτες, αλλά τουλάχιστον υπάρχει."* / *"Just something online — it won't bring customers, but at least it exists."*
- **Chips**: `6–16 ώρες` / `6–16 hrs` · `Lighthouse 35–60` · `Ασφάλεια: Χαμηλή` / `Security: Low`

### Tier 01 Detail Accordion

#### Τι παίρνεις / What you get

- ✅ Λειτουργική ιστοσελίδα 5–7 σελίδων / Functional 5–7 page website
- ✅ Βασική φόρμα επικοινωνίας / Basic contact form
- ✅ SSL πιστοποιητικό (συνήθως Let's Encrypt) / SSL certificate (usually Let's Encrypt)
- ✅ Μερική συμβατότητα με κινητά / Mobile-visible (not optimized)
- ✅ Βασική ανάρτηση σε Google Analytics (ίσως) / Google Analytics installed (maybe)
- ✅ Ένα stock theme με ελάχιστες αλλαγές χρωμάτων / Stock theme with minor color swaps
- ✅ Παράδοση μέσα σε 1–2 εβδομάδες / Delivery within 1–2 weeks

#### Τι ΔΕΝ παίρνεις / What you DON'T get

- ❌ Καμία custom σχεδίαση — είναι template ως έχει / No custom design — template as-is
- ❌ Καμία στρατηγική SEO ή keyword research / No SEO strategy or keyword research
- ❌ Καμία βελτιστοποίηση ταχύτητας / No performance optimization
- ❌ Κανένα child theme — updates σβήνουν αλλαγές / No child theme — updates wipe changes
- ❌ Κανένα documentation ή handoff / No documentation or handoff
- ❌ Κανένα staging environment / No staging environment
- ❌ Κανένα CMS dashboard που να καταλαβαίνει πελάτης / No usable CMS dashboard for the client

#### Πού θα βρεθείς σε 2 χρόνια / Where you'll be in 2 years

Σε δύο χρόνια, τα theme updates θα έχουν σπάσει τη διαμόρφωση τουλάχιστον δύο φορές. Τα plugins θα είναι χωρίς patches, η ταχύτητα θα έχει υποβαθμιστεί αισθητά, και ο προμηθευτής θα είναι αγνοήσιμος. Η ασφάλεια είναι ρίσκο — τα περισσότερα WordPress sites αυτού του tier μολύνονται μέσα στον πρώτο χρόνο αν δεν ενημερώνονται. Το πιο πιθανό σενάριο είναι πλήρης ανακατασκευή από το μηδέν.

In two years, theme updates will have broken the configuration at least twice. Plugins will be unpatched, performance noticeably degraded, and the original vendor unreachable. Security is a real risk — most WordPress sites at this tier get compromised within the first year without maintenance. The most likely outcome is a full rebuild from scratch.

#### Ιδανικό για: / Ideal for:

- Εταιρεία που απλώς θέλει "κάτι online" / Business that just wants "something online"
- Πρώτη επιχείρηση με budget-only mindset / First-time SME with budget-only mindset
- Προσωρινή λύση πριν σοβαρή επένδυση / Temporary stopgap before serious investment

#### TCO Mini-Bar

- **Build midpoint**: ~€525
- **3-Year ongoing midpoint**: ~€4,475
- **Total 3-Year TCO**: €2,500–€7,500

---

## Tier 02 — WP Semi-Custom / Το WordPress Semi-Custom

### Tier 02 Header Card

- **Badge**: `02` in Steel Blue `#006494`
- **Car**: Νέο αυτοκίνητο πόλης · New city car
- **Name**: **Το WordPress Semi-Custom** / **WP Semi-Custom**
- **Price**: €800–€2,500
- **Verdict**: *"Δείχνει επαγγελματικό — αλλά η τεχνολογία από κάτω είναι ακόμα WordPress."* / *"Looks professional — but the tech underneath is still WordPress."*
- **Chips**: `25–50 ώρες` / `25–50 hrs` · `Lighthouse 55–75` · `Ασφάλεια: Μέτρια` / `Security: Fair`

### Tier 02 Detail Accordion

#### Τι παίρνεις / What you get

- ✅ Wireframe/mockup πριν ξεκινήσει το build / Wireframe/mockup sign-off before build
- ✅ Child theme — αλλαγές επιβιώνουν στα updates / Child theme — changes survive updates
- ✅ Yoast SEO ρυθμισμένο με βασικά meta / Yoast SEO configured with basic meta
- ✅ Caching & CDN layer (Cloudflare ή παρόμοιο) / Caching & CDN layer (Cloudflare or similar)
- ✅ Σχεδιασμένη φόρμα επικοινωνίας με validation / Structured contact form with validation
- ✅ Γρηγορότερο φόρτωμα desktop — LCP κάτω από 3s / Faster desktop load — LCP under 3s
- ✅ Google Search Console & Analytics handoff / Google Search Console & Analytics handoff
- ✅ Παράδοση μέσα σε 3–6 εβδομάδες / Delivery within 3–6 weeks

#### Τι ΔΕΝ παίρνεις / What you DON'T get

- ❌ Core Web Vitals στο κινητό παραμένουν κακά / Core Web Vitals on mobile still poor
- ❌ Επιφάνεια ευπάθειας από 15–25 plugins / Plugin vulnerability surface (15–25 plugins)
- ❌ Κανένα CI/CD pipeline ή version control / No CI/CD pipeline or version control
- ❌ Κανένα staging environment / No staging environment
- ❌ Επεξεργασία περιεχομένου παγιδευμένη σε Elementor / Content editing trapped in Elementor page builder
- ❌ Vendor lock-in στον page builder / Vendor lock-in to page builder ecosystem

#### Πού θα βρεθείς σε 2 χρόνια / Where you'll be in 2 years

Τα plugin updates θα έχουν προκαλέσει τουλάχιστον ένα σοβαρό πρόβλημα. Layouts στο Elementor θα σπάσουν όταν ο πελάτης προσπαθήσει να επεξεργαστεί περιεχόμενο. Η απόδοση στο κινητό θα παραμένει προβληματική — τα περισσότερα WordPress semi-custom sites έχουν Lighthouse mobile 40–55. Οι ετήσιες άδειες Elementor, Yoast Premium και hosting θα προσθέτουν €300–€600/έτος. Αν θέλεις σύγχρονο stack, θα χρειαστείς πλήρη ανακατασκευή.

Plugin updates will have caused at least one serious issue. Elementor layouts will break when the client tries to edit content. Mobile performance remains problematic — most WordPress semi-custom sites sit at Lighthouse mobile 40–55. Annual licenses for Elementor, Yoast Premium, and hosting add €300–€600/year. If you want a modern stack, expect a full rebuild.

#### Ιδανικό για: / Ideal for:

- Μικρή επιχείρηση που θέλει βασικό επαγγελματισμό / Small business wanting basic professionalism
- Πρώτη φορά με SEO / First-time SEO efforts
- Επιχείρηση άνετη με οικοσύστημα WordPress / Business comfortable with WordPress ecosystem

#### TCO Mini-Bar

- **Build midpoint**: ~€1,650
- **3-Year ongoing midpoint**: ~€3,350
- **Total 3-Year TCO**: €3,000–€7,000
## Tier 3 — Next.js Quick Delivery / Το Next.js Γρήγορη Παράδοση

### Tier 3 Header Card

- **Badge**: `03` — Slate Green `#437a22`
- **Car**: Καλογυαλισμένο used / Well-polished used car
- **Name**: **Next.js Quick Delivery** / **Το Next.js Γρήγορη Παράδοση**
- **Price**: €800–€2,500
- **Verdict**:
  - *GR: Απίστευτα γρήγορο site — αλλά κάθε αλλαγή περνάει από developer.*
  - *EN: Blazing fast site — but every change goes through a developer.*
- **Chips**: `20–40h build` · `Lighthouse 90–100` · `Security: Δυνατή`

### Tier 3 Accordion

**Τι παίρνεις / What you get**

- ✅ Static HTML που σερβίρεται από CDN — LCP 1–2s σε κινητό / Static HTML served from CDN — LCP 1–2s on mobile
- ✅ Μηδενική επιφάνεια επίθεσης (κανένα plugin, καμία βάση) / Zero attack surface — no plugins, no database
- ✅ Δωρεάν hosting σε Vercel ή Cloudflare / Free hosting on Vercel or Cloudflare
- ✅ 99.9%+ uptime, ανεξάρτητα από traffic / 99.9%+ uptime regardless of traffic
- ✅ Future-proof codebase — αναβαθμίσιμο σε Tier 4 / Future-proof codebase — upgradeable to Tier 4
- ✅ Lighthouse score 90–100 out of the box / Lighthouse score 90–100 out of the box
- ✅ Κανένα database dependency — κανένα σπάσιμο / No database dependency — nothing to break

**Τι ΔΕΝ παίρνεις / What you DON'T get**

- ❌ Κανένα CMS dashboard — δεν μπορείς να αλλάξεις κείμενο μόνος σου / No CMS dashboard — you cannot edit text yourself
- ❌ Κάθε αλλαγή = build + deploy cycle (€50–80 για απλό edit) / Every change = build + deploy cycle (€50–80 for a simple edit)
- ❌ Content hardcoded σε κώδικα / Content hardcoded in source code
- ❌ Κανένα staging environment / No staging environment
- ❌ Κανένα automated test suite / No automated test suite

**Πού θα βρεθείς σε 2 χρόνια / Where you'll be in 2 years**

GR: Το site παραμένει ταχύτατο και ασφαλές, αλλά κάθε αλλαγή κειμένου ή εικόνας απαιτεί developer. Ένα απλό edit κοστίζει €50–80, η προσθήκη σελίδας €200–250. Η εξάρτηση από developer γίνεται απογοητευτική αν το content αλλάζει συχνά.

EN: The site stays fast and secure, but every text or image change needs a developer. A simple edit costs €50–80, adding a page costs €200–250. Developer dependency becomes frustrating if content changes often.

**Ιδανικό για / Ideal for**

- Tech-comfortable client με στατικό content / Tech-comfortable client with static content
- Επιχείρηση με προτεραιότητα την απόδοση / Performance-focused business
- Πελάτης που προετοιμάζεται για Tier 4 / Client being onboarded to Tier 4

**TCO mini-bar**

| | Midpoint |
|---|---|
| Build cost (once) | ~€1,650 |
| Ongoing (3yr) | ~€1,300 |
| **3yr total** | **~€2,950** |

---

## Tier 4 — Next.js + Sanity CMS / Το Next.js + Sanity CMS

### Tier 4 Header Card

- **Badge**: `04` — Hydra Teal `#01696f`
- **Car**: BMW Σειρά 3 / BMW 3 Series
- **Name**: **Next.js + Sanity CMS** / **Το Next.js + Sanity CMS**
- **Price**: €2,500–€6,000
- **Verdict**:
  - *GR: Επαγγελματικό site που το διαχειρίζεσαι μόνος σου — ισορροπία ποιότητας και ανεξαρτησίας.*
  - *EN: Professional site you manage yourself — the sweet spot of quality and independence.*
- **Chips**: `50–90h build` · `Lighthouse 90–100` · `Security: Δυνατή`

### Tier 4 Accordion

**Τι παίρνεις / What you get**

- ✅ Όλα τα χαρακτηριστικά του Tier 3 / Everything in Tier 3
- ✅ Sanity Studio CMS — επεξεργασία κειμένου & εικόνων μόνος σου / Sanity Studio CMS — edit text & images yourself
- ✅ JSON-LD structured data για Google / JSON-LD structured data for Google
- ✅ Πλήρες SEO: sitemap, robots.txt, OG meta tags / Full SEO: sitemap, robots.txt, OG meta tags
- ✅ WCAG AA προσβασιμότητα / WCAG AA accessibility
- ✅ Feature-based αρχιτεκτονική — επαναχρησιμοποιήσιμα components / Feature-based architecture — reusable components
- ✅ Client training session + organized handoff / Client training session + organized handoff
- ✅ Κώδικας που μπορεί να διατηρήσει οποιοσδήποτε React developer / Codebase maintainable by any React developer

**Τι ΔΕΝ παίρνεις / What you DON'T get**

- ❌ Κανένα automated test suite / No automated test suite
- ❌ Κανένα CI/CD pipeline / No CI/CD pipeline
- ❌ Κανένα staging environment (προαιρετικό add-on) / No staging environment (optional add-on)
- ❌ Security headers πέρα από τα βασικά / No security headers beyond basics

**Πού θα βρεθείς σε 2 χρόνια / Where you'll be in 2 years**

GR: Το content ενημερώνεται ανεξάρτητα μέσω Sanity Studio — δεν χρειάζεσαι developer για αλλαγές κειμένου ή εικόνων. Το site αποδίδει εξαιρετικά, το SEO κατατάσσεται. Κώδικας που μπορεί να αναλάβει οποιοσδήποτε React developer. Αξιόλογη επένδυση με απόδοση.

EN: Content is updated independently via Sanity Studio — no developer needed for text or image changes. Site performs well, SEO ranks. Codebase is maintainable by any React developer. A solid investment that pays for itself.

**Ιδανικό για / Ideal for**

- ΜΜΕ με σχέσεις ανάπτυξης / SME with growth plans
- Επιχείρηση που θέλει ανεξαρτησία content / Business wanting content independence
- Ορίζοντας 3+ ετών, τακτική επεξεργασία content / 3+ year horizon, client who edits content regularly

**TCO mini-bar**

| | Midpoint |
|---|---|
| Build cost (once) | ~€4,250 |
| Ongoing (3yr) | ~€1,900 |
| **3yr total** | **~€6,150** |

---

## Tier 5 — Enterprise-Grade / Enterprise-Grade

### Tier 5 Header Card

- **Badge**: `05` — Deep Plum `#7a39bb`
- **Car**: Mercedes S-Class / Mercedes S-Class
- **Name**: **Enterprise-Grade** / **Enterprise-Grade**
- **Price**: €5,000–€12,000
- **Verdict**:
  - *GR: Το site που μεγαλώνει μαζί με την επιχείρηση — zero compromises.*
  - *EN: The site that scales with your business — zero compromises.*
- **Chips**: `70–130h build` · `Lighthouse 95–100 (CI-enforced)` · `Security: Οχυρωμένο`

### Tier 5 Accordion

**Τι παίρνεις / What you get**

- ✅ Όλα τα χαρακτηριστικά του Tier 4 / Everything in Tier 4
- ✅ Playwright E2E tests — regressions πριν το deploy / Playwright E2E tests — regressions caught before deploy
- ✅ Vitest unit tests — code quality enforced / Vitest unit tests — code quality enforced
- ✅ GitHub Actions CI/CD pipeline / GitHub Actions CI/CD pipeline
- ✅ Security headers: CSP, HSTS, X-Frame-Options / Security headers: CSP, HSTS, X-Frame-Options
- ✅ Staging environment — δοκιμή πριν το production / Staging environment — test before production
- ✅ Πλήρης τεκμηρίωση + client handoff guide / Full documentation + client handoff guide
- ✅ Performance budget enforced in CI — Lighthouse δεν πέφτει ποτέ / Performance budget enforced in CI — Lighthouse never drops

**Τι ΔΕΝ παίρνεις / What you DON'T get**

- ❌ Τίποτα λείπει — είναι πλήρης επαγγελματική παράδοση / Nothing missing — this is full professional output
- ❌ Μόνη επιφύλαξη: υψηλότερο upfront κόστος και μεγαλύτερος χρόνος παράδοσης / Only caveat: higher upfront cost and longer timeline

**Πού θα βρεθείς σε 2 χρόνια / Where you'll be in 2 years**

GR: Βράχος. Το CI πιάνει regressions πριν φτάσουν στο production. Η τεκμηρίωση επιτρέπει team handoff χωρίς απώλεια γνώσης. Security posture enterprise-grade. Το site που μεγαλώνει με την επιχείρηση, χωρίς εκπλήξεις.

EN: Rock-solid. CI catches regressions before deploy. Documentation enables team handoff with zero knowledge loss. Security posture is enterprise-grade. The site that scales with the business — no surprises.

**Ιδανικό για / Ideal for**

- Ρυθμιζόμενος κλάδος (νομικά, ιατρικά, οικονομικά) / Regulated industry (legal, medical, financial)
- SEO-critical launch / SEO-critical launch
- Πολλαπλοί stakeholders, ορίζοντας 5+ ετών / Multiple stakeholders, 5+ year horizon

**TCO mini-bar**

| | Midpoint |
|---|---|
| Build cost (once) | ~€9,000 |
| Ongoing (3yr) | ~€650 |
| **3yr total** | **~€9,650** |
## 3-Year Total Cost Comparison

### Heading
- **GR:** Το πραγματικό κόστος σε 3 χρόνια
- **EN:** The Real 3-Year Cost

### Subtitle
- **GR:** Συμπεριλαμβάνει κατασκευή, φιλοξενία, ασφάλεια, επισκευές, ανακατασκευή.
- **EN:** Includes build, hosting, security, repairs, and rebuild.

---

### Chart: Stacked Horizontal Bar (Pure CSS)

Five bars, one per tier. Max width (100%) = €9,650 (Tier 5 TCO midpoint).

| Tier | Label GR | Total Width | Build % | Ongoing % | Build Color (light) | Ongoing Color (dark) | Build € | Ongoing € | Total € |
|------|----------|-------------|---------|-----------|---------------------|----------------------|---------|-----------|---------|
| 1 | FB Template | 51.8% | 5.4% | 46.4% | #e8af34 | #b07a00 | €525 | €4,475 | €5,000 |
| 2 | WP Semi | 51.8% | 17.1% | 34.7% | #5591c7 | #006494 | €1,650 | €3,350 | €5,000 |
| 3 | Next.js Quick | 30.6% | 17.1% | 13.5% | #6daa45 | #437a22 | €1,650 | €1,300 | €2,950 |
| 4 | Next.js CMS | 53.4% | 44.0% | 9.3% | #4f98a3 | #01696f | €4,250 | €900 | €5,150 |
| 5 | Enterprise | 100% | 88.1% | 11.9% | #a86fdf | #7a39bb | €8,500 | €1,150 | €9,650 |

#### Bar structure (each bar)
```
<div class="tco-bar-row">
  <span class="tco-label">Tier name</span>
  <div class="tco-bar" style="--total: X%; --build: Y%;">
    <div class="tco-segment tco-build"></div>
    <div class="tco-segment tco-ongoing"></div>
  </div>
  <span class="tco-amount">€X,XXX</span>
</div>
```
- `.tco-bar` width = `var(--total)` of container
- `.tco-build` width = `var(--build)` relative to container
- `.tco-ongoing` fills the remainder (flex-grow or calc)
- Each segment uses its tier's light/dark color as background

#### Layout
- Max-width: 960px, centered
- Bar height: 36px, border-radius: 4px
- Gap between bars: 8px
- Label: 140px fixed left column, right-aligned
- Amount: right-aligned after bar, min 90px
- Mobile (<640px): label collapses to "T1"–"T5", amount stays; bar shrinks proportionally

#### Hover tooltip
On `.tco-bar-row:hover`, show a positioned tooltip with:
```
Κατασκευή €X + Φιλοξενία €X/yr × 3 + Άδειες + Συντήρηση + Κίνδυνος ασφαλείας + Κίνδυνος ανακατασκευής = Σύνολο €X
```
English: `Build €X + Hosting €X/yr × 3 + Licenses + Maintenance + Security incident risk + Rebuild risk = Total €X`
Use same tooltip pattern as rest of page (`data-tooltip` + CSS `::after`).

#### Tooltip breakdown values (midpoint-based)

| Tier | Hosting/yr | Licences/yr | Maintenance/yr | Security Risk | Rebuild Risk |
|------|-----------|-------------|----------------|---------------|--------------|
| 1 | €60 | €0 | €200 | €800 | €2,275 |
| 2 | €80 | €100 | €150 | €400 | €1,720 |
| 3 | €30 | €0 | €100 | €0 | €270 |
| 4 | €40 | €50 | €100 | €0 | €0 |
| 5 | €60 | €80 | €120 | €0 | €0 |

Values derived: ongoing = hosting×3 + licences×3 + maintenance×3 + security risk + rebuild risk (approximate; adjust to sum to ongoing column).

---

### Animation
- Bars animate `width: 0 → var(--total)` on scroll into view via `IntersectionObserver`
- Duration: 800ms ease-out
- Stagger: 100ms delay between each bar (bar 1 = 0ms, bar 5 = 400ms)
- Must respect `prefers-reduced-motion`: set `animation-duration: 0ms` (instant)

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.setProperty('--animate', '1');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
```

CSS transition: `width 800ms ease-out calc(var(--i, 0) * 100ms)`.
Reduced motion: `@media (prefers-reduced-motion: reduce) { .tco-bar { transition: none; } }`

---

### Conversion copy below chart

- **GR:** Το Tier 3 κοστίζει λιγότερο και στην κατασκευή και στην συντήρηση — με Lighthouse σκορ 90+.
- **EN:** Tier 3 costs less to build *and* less to maintain — with 90+ Lighthouse scores.
## 6. Decision Guide Quiz (enhanced with scoring algorithm)

A 4-question card quiz that recommends the best tier for the visitor. One card visible at a time, horizontal slide transitions.

### Bilingual Content

**Question 1 — Content change frequency**

| | Greek | English |
|---|---|---|
| **Question** | Πόσο συχνά χρειάζεστε να αλλάζετε περιεχόμενο στη σελίδα; | How often do you need to update your website content? |
| **Option A** | Σπάνια — το φτιάχνουμε και το ξεχνάμε | Rarely — set it and forget it |
| **Option B** | Λίγες φορές τον χρόνο | A few times a year |
| **Option C** | Κάθε εβδομάδα ή συχνότερα | Every week or more |

**Question 2 — Site role**

| | Greek | English |
|---|---|---|
| **Question** | Τι ρόλο παίζει η ιστοσελίδα στην επιχείρησή σας; | What role does the website play in your business? |
| **Option A** | Απλά υπάρχει — δεν φέρνει πελάτες | Just exists — doesn't bring clients |
| **Option B** | Φέρνει κάποιους πελάτες, αλλά όχι κύρια πηγή | Brings some clients, but not the main source |
| **Option C** | Είναι το κύριο κανάλι πωλήσεων | Primary sales channel |

**Question 3 — SEO importance**

| | Greek | English |
|---|---|---|
| **Question** | Πόσο σημαντικό είναι να εμφανίζεστε στην Google; | How important is appearing on Google? |
| **Option A** | Καθόλου — οι πελάτες έρχονται με παραπομπές | Not at all — clients come via referrals |
| **Option B** | Αρκετά σημαντικό | Fairly important |
| **Option C** | Πολύ σημαντικό — χωρίς Google δεν υπάρχει επιχείρηση | Very important — without Google there is no business |

**Question 4 — Reliability & security**

| | Greek | English |
|---|---|---|
| **Question** | Πόσο σημαντική είναι η αξιοπιστία και η ασφάλεια; | How important are reliability and security? |
| **Option A** | Δεν με νοιάζει — αρκεί να υπάρχει κάτι | Don't care — anything online is fine |
| **Option B** | Πρέπει να δουλεύει πάντα | Must work always |
| **Option C** | Κρίσιμο για την επιχείρηση — downtime = χαμένες πωλήσεις | Critical for business — downtime = lost sales |

### Scoring Algorithm

Each answer maps to a raw tier score. The question weight determines how heavily that score pulls the final result.

**Weights**

| Question | Weight | Rationale |
|---|---|---|
| Q1 — Content frequency | ×1.0 | Indicates CMS need but not exclusive |
| Q2 — Site role | ×1.5 | Core business criticality; strongest signal |
| Q3 — SEO importance | ×1.3 | SEO directly requires performance + structured data (Tier 3+) |
| Q4 — Reliability | ×1.2 | Reliability favors static/SSG (Tier 3–5) over WP (Tier 1–2) |

**Score Mapping Table**

| Question | Option A → Tier | Option B → Tier | Option C → Tier |
|---|---|---|---|
| Q1 — Content frequency | 1 | 2 | 4 |
| Q2 — Site role | 1 | 3 | 5 |
| Q3 — SEO importance | 1 | 3 | 4 |
| Q4 — Reliability | 1 | 3 | 5 |

**Calculation**

```
weightedScore = Σ (optionTierScore × questionWeight)
recommendedTier = Math.round(weightedScore / Σ weights)

where Σ weights = 1.0 + 1.5 + 1.3 + 1.2 = 5.0
```

Minimum possible score: `(1×1.0 + 1×1.5 + 1×1.3 + 1×1.2) / 5.0 = 1.0` → **Tier 1**
Maximum possible score: `(4×1.0 + 5×1.5 + 4×1.3 + 5×1.2) / 5.0 = 4.66` → rounds to **Tier 5**

**Tiebreaker Logic**

If `recommendedTier` lands exactly on `.5` (e.g., 3.5):
- Check Q2 (site role). If Q2 answered B or C, round **up** (business-critical sites should not be undersold).
- Otherwise round **down** (frugal preference).

After rounding, clamp to range `[1, 5]`.

### Result Card

After the 4th answer, replace the quiz area with the result card:

**Structure:**
- Tier badge circle with tier accent color background, tier number in white
- Tier name (GR + EN) in Zodiak bold
- Car analogy label underneath
- 3-line explanation (bilingual):

**Greek explanation template:**
```
Βάσει των απαντήσεών σας, το {tierName} ταιριάζει καλύτερα στις ανάγκες σας.
{tierSpecificJustification}
Επικοινωνήστε μαζί μας για μια προσφορά κομμένη και ραμμένη στα μέτρα σας.
```

**English explanation template:**
```
Based on your answers, {tierName} is the best fit for your needs.
{tierSpecificJustification}
Get in touch for a tailored quote.
```

**Per-tier justifications:**

| Tier | GR justification | EN justification |
|---|---|---|
| 1 | Μια απλή σελίδα αρκεί για να υπάρχετε online. | A simple page is enough to exist online. |
| 2 | Χρειάζεστε κάτι πιο επαγγελματικό με ευελιξία. | You need something more professional with flexibility. |
| 3 | Η ταχύτητα και η εμφάνιση στη Google είναι προτεραιότητα. | Speed and Google visibility are priorities. |
| 4 | Χρειάζεστε επαγγελματική εμφάνιση και ανεξαρτησία περιεχομένου. | You need professional presence and content independence. |
| 5 | Η σελίδα σας είναι κρίσιμο κεφάλαιο — αξίζει κορυφαία ποιότητα. | Your site is a critical asset — it deserves top-tier quality. |

- **CTA button:** `Δείτε το {tierName} / See {tierName}` — scrolls to that tier's section via `document.getElementById('tier-{n}').scrollIntoView({ behavior: 'smooth' })`
- **Retake link:** «Ξανακάντε το τεστ / Retake quiz» — resets quiz to Q1

### Transitions & Animations

**Card slide (question swap):**
```css
.quiz-card {
  transition: transform 350ms ease-in-out, opacity 350ms ease-in-out;
}
.quiz-card--exit-left  { transform: translateX(-100%); opacity: 0; }
.quiz-card--enter-right { transform: translateX(100%); opacity: 0; }
.quiz-card--active      { transform: translateX(0);    opacity: 1; }
```
- Outgoing card slides left, incoming slides in from right.
- On "previous" navigation, reverse direction.

**Answer press:**
```css
.quiz-option:active {
  transform: scale(0.97);
  transition: transform 100ms ease-out;
}
.quiz-option {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}
```
On `pointerdown`: `scale(0.97)`. On `pointerup`: `scale(1)` with a subtle shadow bump.

**Progress bar:**
- Full-width bar above the quiz cards, height 4px.
- Background: `var(--surface-muted)` (light gray).
- Fill: current tier accent color gradient, width = `(currentQuestion / totalQuestions) × 100%`.
- Transition on width: `300ms ease-out`.

### Accessibility

```html
<div role="form" aria-label="Decision guide quiz / Οδηγός επιλογής">
  <div aria-live="polite" aria-atomic="true">
    <!-- Current question card -->
  </div>
</div>
```

- Each option button: `role="radio"` within `role="radiogroup"`, `aria-checked` toggled.
- Keyboard: arrow keys navigate options, Enter/Space selects.
- After selection, auto-advance after 400ms (cancelable with Escape for accessibility).
- Result card: `role="status"`, `aria-live="assertive"` to announce the recommendation.
- All text content in both GR and EN, toggled by the language switch.

---

## 7. Comparison Checklist (NEW feature)

Side-by-side feature comparison across all 5 tiers. Dense but scannable — the "justify your price" table.

### Section Heading

- **GR:** Σύγκριση με μια ματιά
- **EN:** Comparison at a Glance

### Feature Rows

Each row: feature name (bilingual) + status per tier.

Legend:
- ✅ — Included / full support
- 🔶 — Partial / basic only
- ❌ — Not included

| # | Feature (GR) | Feature (EN) | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 |
|---|---|---|---|---|---|---|---|
| 1 | Προσαρμοσμένο design | Custom design | ❌ | 🔶 | ✅ | ✅ | ✅ |
| 2 | Φιλικό σε κινητά | Mobile responsive | 🔶 | ✅ | ✅ | ✅ | ✅ |
| 3 | Βασικό SEO | SEO setup | ❌ | 🔶 | ✅ | ✅ | ✅ |
| 4 | CMS (αυτόνομη επεξεργασία) | CMS (self-editing) | ❌ | ❌ | ❌ | ✅ | ✅ |
| 5 | SSL / Ασφάλεια | SSL / Security | 🔶 | 🔶 | ✅ | ✅ | ✅ |
| 6 | Lighthouse > 90 | Lighthouse > 90 | ❌ | ❌ | ✅ | ✅ | ✅ |
| 7 | Συντήρηση (maintenance) | Ongoing maintenance | ❌ | ❌ | ❌ | 🔶 | ✅ |
| 8 | Ανεξαρτησία περιεχομένου | Content editing independence | ❌ | ❌ | ❌ | ✅ | ✅ |
| 9 | Δομημένα δεδομένα (JSON-LD) | Structured data (JSON-LD) | ❌ | ❌ | ✅ | ✅ | ✅ |
| 10 | Βελτιστοποίηση ταχύτητας | Performance optimization | ❌ | 🔶 | ✅ | ✅ | ✅ |
| 11 | Έλεγχος εκδόσεων (Git) | Version control | ❌ | ❌ | ✅ | ✅ | ✅ |
| 12 | Αυτοματοποιημένα tests | Automated testing | ❌ | ❌ | ❌ | 🔶 | ✅ |
| 13 | Τεκμηρίωση / Εγχειρίδιο | Documentation | ❌ | ❌ | ❌ | ✅ | ✅ |
| 14 | Αντοχή 3 ετών | 3-year durability | ❌ | 🔶 | ✅ | ✅ | ✅ |

### Column Header Styling

Each tier column header gets its accent color as a bottom border (3px solid) and the tier name in the respective accent. Tier number badge is a small circle with accent background, white number.

### Mobile Behavior

- Table scrolls horizontally with `-webkit-overflow-scrolling: touch`.
- First column (feature name) is sticky: `position: sticky; left: 0; z-index: 2; background: var(--surface);`.
- A subtle inset shadow on the right edge indicates scrollability.
- Minimum column width: 90px per tier.

### Animation

- Intersection Observer triggers row-by-row fade-in.
- Each row: `opacity: 0; transform: translateY(8px)` → `opacity: 1; transform: translateY(0)`.
- Stagger: 50ms between rows.
- Duration: 300ms ease-out per row.
- Respects `prefers-reduced-motion`: instant appearance, no transform.

---

## 8. PDF Export (NEW feature)

Allow visitors to save the full guide as a formatted PDF document.

### Button Placement

- In the page footer, alongside the language toggle.
- **GR label:** Αποθήκευση ως PDF
- **EN label:** Save as PDF
- Icon: a simple download icon (inline SVG, ~200 bytes).
- On click: triggers the print/PDF flow.

### Recommended Approach: `window.print()` + `@media print`

This is the preferred approach. No external library, zero JS bundle cost, works on all modern browsers, produces native PDF via the browser's print dialog.

**`@media print` stylesheet rules:**

```css
@media print {
  /* Force light theme */
  :root { color-scheme: light only; }
  body { background: #fff; color: #1a1a1a; }

  /* Hide interactive-only elements */
  .quiz-section,
  .sticky-header,
  .lang-toggle,
  .theme-toggle,
  .scroll-top-btn,
  .pdf-export-btn,
  nav { display: none !important; }

  /* Expand all accordion content */
  .accordion-content { max-height: none !important; overflow: visible !important; }
  .accordion-toggle::after { display: none; } /* hide chevron */

  /* Page breaks between tier sections */
  .tier-section { page-break-before: always; break-before: page; }
  .tier-section:first-of-type { page-break-before: avoid; }

  /* Avoid breaking inside feature rows */
  .comparison-table tr { page-break-inside: avoid; }

  /* Expand comparison table — no horizontal scroll */
  .comparison-wrapper { overflow: visible !important; }
  .comparison-table { width: 100% !important; font-size: 9pt; }

  /* Simplify footer */
  footer { border-top: 1px solid #ccc; padding: 1rem; }
  footer .social-links { display: none; }

  /* Ensure tier accent colors print (override any filter) */
  .tier-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  /* Remove shadows (printers hate them) */
  * { box-shadow: none !important; text-shadow: none !important; }

  /* Print header */
  @page {
    size: A4;
    margin: 15mm 12mm;
    @bottom-center { content: "web-tiers-guide.gr"; font-size: 8pt; color: #999; }
  }
}
```

### Alternative: html2canvas + jsPDF (NOT recommended, documented for completeness)

**Tradeoff:**
| | `window.print()` | html2canvas + jsPDF |
|---|---|---|
| Bundle cost | 0 KB | ~80 KB gzipped combined |
| Output quality | Vector text, crisp at any zoom | Raster screenshot, blurry when zoomed |
| Layout control | Browser handles pagination | Manual, fragile |
| Maintenance | CSS-only | JS library version drift |
| Accessibility | Native | Lost (rasterized) |

**Verdict:** Use `window.print()`. The 80 KB library cost exceeds the 50 KB budget, and the output quality is worse. The `@media print` stylesheet gives sufficient control over what appears and how pages break.

### Print Content Scope

**Included in PDF:**
- Hero section (title + subtitle, no animation)
- All 5 tier sections, fully expanded (accordion open)
- TCO cost comparison chart (as a static table, not animated)
- Comparison checklist table (Section 7)
- Footer with contact info

**Excluded from PDF:**
- Decision guide quiz (interactive only)
- Language toggle (print in current language)
- Sticky navigation
- All animations and transitions

---

## 9. Animated SVG Illustrations (NEW feature)

Each tier gets an inline animated SVG illustration that reinforces the car analogy. Line-art style, minimal detail, warm stroke colors matching each tier's accent.

### Style Guide

- **Stroke only, no fill** (transparent background for dark/light theme compatibility).
- **Stroke width:** 2px on a 64×64 viewBox, scaled to render at ~120px display width.
- **Stroke color:** tier accent (dark variant for light theme, light variant for dark theme — toggled via CSS custom property).
- **Line cap / join:** `round`.
- **File size target:** each SVG < 3 KB inline.
- **Animations:** CSS `@keyframes` preferred (better browser support than SMIL, respects `prefers-reduced-motion`).

### Illustration Descriptions

**Tier 1 — "Μεταχειρισμένο από Facebook" (Used car from Facebook)**
- A boxy, slightly dented car silhouette. One headlight slightly askew.
- **Animation:** Exhaust puff from the rear — a small circle that fades and drifts right, looping every 3s.
- **Accent:** Muted Amber `#b07a00` / `#e8af34`

**Tier 2 — "Νέο αυτοκίνητο πόλης" (New city car)**
- A clean, compact hatchback shape. Rounded proportions.
- **Animation:** Gentle bounce on the suspension — the body translates Y by ±2px over 2s.
- **Accent:** Steel Blue `#006494` / `#5591c7`

**Tier 3 — "Καλογυαλισμένο used" (Well-polished used car)**
- A sleek sedan silhouette with a subtle shine line.
- **Animation:** A highlight streak sweeps across the windshield left-to-right, 4s loop.
- **Accent:** Slate Green `#437a22` / `#6daa45`

**Tier 4 — "BMW Σειρά 3" (BMW 3 Series)**
- A sporty sedan with angular details and dual exhausts.
- **Animation:** Wheels spin (rotate on center) continuously, 2s per revolution.
- **Accent:** Hydra Teal `#01696f` / `#4f98a3`

**Tier 5 — "Mercedes S-Class" (Mercedes S-Class)**
- A long, elegant luxury sedan with prominent grille.
- **Animation:** Subtle road lines passing beneath (translateX loop on dashed lines), 3s cycle.
- **Accent:** Deep Plum `#7a39bb` / `#a86fdf`

### Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  .tier-svg * {
    animation: none !important;
  }
}
```

SVGs render static in their default pose — the illustration still communicates the car analogy without motion.

### Positioning

- Each SVG sits above its tier header card, centered, with `margin-bottom: 1rem`.
- On mobile (< 640px), SVG scales to 80px wide and sits to the left of the tier name (inline layout).

### Emoji Fallback

If SVG complexity exceeds the 3 KB budget or manual SVG creation is impractical, use emoji-based tier badges as a lighter alternative:

| Tier | Emoji | Label |
|---|---|---|
| 1 | 🚗 | Used car |
| 2 | 🚙 | City car |
| 3 | 🚐 | Polished used |
| 4 | 🏎️ | BMW 3 Series |
| 5 | 🚘 | Mercedes S-Class |

Emoji badges render inside a 48px circle with the tier accent as background, white emoji centered. No animation needed — the accent color alone carries the tier identity.
## Technical Implementation

### 1. Project Architecture

- **Runtime:** Bun — dev server (`bun ./src/index.html`) and production bundler (`bun build --compile --target=browser --minify`)
- **UI Components:** Web Awesome (`@awesome.me/webawesome`) — cherry-picked web components for interactive elements
- **Language:** TypeScript — modular source files in `src/`, compiled away by Bun's bundler
- **Output:** Single self-contained HTML file (`dist/web-tiers-guide.html`) — same distribution model as before
- **No runtime dependencies in output:** Bun inlines everything; the only external resource is Fontshare CDN for fonts

### 2. Project Structure

```
web-tiers-guide/
├── src/
│   ├── index.html          ← HTML entrypoint (Bun serves/bundles from this)
│   ├── main.ts             ← App entry, WA init, setBasePath, allDefined
│   ├── wa.ts               ← Centralized WA component imports (cherry-picked)
│   ├── i18n.ts             ← i18n content object + setLang()
│   ├── theme.ts            ← Dark/light toggle logic
│   ├── quiz.ts             ← Quiz scoring algorithm
│   ├── scroll-spy.ts       ← IntersectionObserver for nav + section reveals
│   ├── tco-bars.ts         ← TCO bar animation triggers
│   ├── print.ts            ← window.print() handler
│   └── styles/
│       ├── main.css        ← @import chain (single entry for bundler)
│       ├── reset.css
│       ├── tokens.css      ← CSS custom properties + WA token overrides
│       ├── layout.css
│       ├── header.css
│       ├── hero.css
│       ├── tiers.css
│       ├── tco.css
│       ├── quiz.css
│       ├── comparison.css
│       └── print.css       ← @media print rules
├── public/
│   └── assets/             ← SVGs, images
├── bunfig.toml
├── tsconfig.json
├── biome.json
├── package.json
└── dist/                   ← Production output (gitignored)
    └── web-tiers-guide.html  ← THE deliverable
```

### 3. Build Pipeline

```json
{
  "scripts": {
    "dev": "bun ./src/index.html --console",
    "build": "bun build --compile --target=browser --minify ./src/index.html --outdir=dist",
    "preview": "bunx serve dist",
    "lint": "bunx biome check --apply .",
    "typecheck": "bunx tsc --noEmit"
  }
}
```

- `dev`: Bun's built-in dev server with HMR — edit TS/CSS/HTML and see changes instantly
- `build`: Produces a single self-contained HTML file with all JS/CSS inlined and minified
- `preview`: Serves `dist/` for local verification of the production build
- No postbuild step needed — Bun inlines everything into one file

### 4. Web Awesome Integration

**Install:**

```bash
bun add @awesome.me/webawesome
```

**Cherry-pick imports** — import individual components from `dist/` (NOT `dist-cdn/`, which is for CDN usage):

```ts
// src/wa.ts
import '@awesome.me/webawesome/dist/components/details/details.js';
import '@awesome.me/webawesome/dist/components/radio-group/radio-group.js';
import '@awesome.me/webawesome/dist/components/radio/radio.js';
import '@awesome.me/webawesome/dist/components/tooltip/tooltip.js';
```

**Centralize all WA imports in `src/wa.ts`.** Other modules import from `./wa.ts` — never import WA directly from consumer modules.

**Initialization in `src/main.ts`:**

```ts
import { setBasePath, allDefined } from '@awesome.me/webawesome/dist/utilities.js';
import './wa.ts';
import { initI18n } from './i18n.ts';
import { initTheme } from './theme.ts';
import { initQuiz } from './quiz.ts';
import { initScrollSpy } from './scroll-spy.ts';
import { initTcoBars } from './tco-bars.ts';
import { initPrint } from './print.ts';

// WA asset path — needed for icons/internal resources
setBasePath('/assets/webawesome');

// Wait for all WA custom elements to be defined before binding app logic
await allDefined();

// Initialize app modules
initI18n();
initTheme();
initQuiz();
initScrollSpy();
initTcoBars();
initPrint();
```

**FOUCE prevention:** Add `wa-cloak` class to `<html>`:

```html
<html lang="el" class="wa-cloak" data-lang="gr" data-theme="light">
```

The `wa-cloak` class hides the page until WA components are defined. Remove it in `main.ts` after `allDefined()` resolves:

```ts
document.documentElement.classList.remove('wa-cloak');
```

**Components used:**

| WA Component | Usage |
|---|---|
| `<wa-details>` | Tier detail accordions — ARIA compliant, keyboard navigation built-in |
| `<wa-radio-group>` + `<wa-radio>` | Quiz answer options — native form semantics |
| `<wa-tooltip>` | TCO bar hover tooltips — viewport-aware positioning |

**Components that stay custom** (Web Awesome has no equivalent):

- TCO stacked bars — pure CSS
- Language toggle (GR|EN pill) — custom button UI
- Dark/light toggle — custom (syncs with WA `.wa-dark`)
- ScrollSpy navigation — IntersectionObserver
- SVG illustrations — inline SVG
- i18n system — `data-i18n` DOM switching
- Print export — `window.print()`

**Styling WA components:** Use `::part()` pseudo-element to style WA component internals. WA design tokens are overridden in `tokens.css` to match the project's design language (see §5 CSS Architecture for the full token mapping).

### 5. CSS Architecture

**Token system** — `src/styles/tokens.css` defines all design tokens as CSS custom properties on `:root`:

- Color tokens: `--color-{semantic}` (primary, surface, border, text, tier accents)
- Spacing scale: `--space-{1-12}` using `clamp()` for fluid responsive
- Typography: `--text-{xs|sm|base|lg|xl|2xl|3xl}` with fluid sizes
- Font role: `--font-display`, `--font-body`
- Tier accent: `--tier-accent` set per `<section>` (same as before)

**WA token overrides** — mapped in `tokens.css` so WA components adopt the project's design language:

```css
:root {
  --wa-color-brand: var(--color-primary);
  --wa-color-brand-hover: var(--color-primary-hover);
  --wa-font-family-base: var(--font-body);
  --wa-border-radius-medium: 8px;
}
```

**Dark mode** — unified approach using WA's `.wa-dark` class synced with existing `data-theme` attribute:

```ts
// theme.ts — sets BOTH attributes in sync
document.documentElement.classList.toggle('wa-dark', theme === 'dark');
document.documentElement.setAttribute('data-theme', theme);
```

- Light: `data-theme="light"`, no `.wa-dark` class
- Dark: `data-theme="dark"`, `.wa-dark` class present
- WA components automatically respond to `.wa-dark`
- Custom CSS uses `[data-theme="dark"]` overrides (same as before)

**Language font switch** — unchanged:

```css
:root { --font-display: "Satoshi", sans-serif; }
[data-lang="en"] { --font-display: "Zodiak", serif; }
```

**Responsive strategy:** Fluid spacing with `clamp()`, single breakpoint at `640px` (`@media (max-width: 639px)`).

**CSS entry** — `src/styles/main.css` uses `@import` to chain all partials:

```css
@import 'reset.css';
@import 'tokens.css';
@import 'layout.css';
@import 'header.css';
@import 'hero.css';
@import 'tiers.css';
@import 'tco.css';
@import 'quiz.css';
@import 'comparison.css';
@import 'print.css';
```

Bun's bundler resolves and inlines all `@import`s into a single `<style>` block in the output HTML.

### 6. JS Architecture (TypeScript Modules)

Each concern is a separate `.ts` file in `src/`. All modules export init functions called from `main.ts`:

| Module | Responsibility | Exports |
|---|---|---|
| `wa.ts` | WA component imports | (side-effects only) |
| `i18n.ts` | Content object, `setLang()`, DOM text switching | `initI18n()` |
| `theme.ts` | Dark/light toggle, `localStorage` persistence, WA `.wa-dark` sync | `initTheme()` |
| `scroll-spy.ts` | `IntersectionObserver` for tier nav highlight + section reveals | `initScrollSpy()` |
| `quiz.ts` | 4-question state machine with weighted scoring | `initQuiz()` |
| `tco-bars.ts` | `IntersectionObserver` trigger for bar-width animations | `initTcoBars()` |
| `print.ts` | `window.print()` handler | `initPrint()` |

**Patterns:**

- `main.ts` is the single entry point: imports WA, calls `allDefined()`, then initializes all modules
- Event delegation on `document.body` for all click handlers
- Shared `IntersectionObserver` instance where observer overlap exists (scroll-spy + tco-bars)
- No external JS dependencies beyond Web Awesome

**i18n module (`src/i18n.ts`) pattern:**

```ts
export const i18n: Record<string, Record<string, string>> = {
  gr: { "hero.headline": "...", /* ... */ },
  en: { "hero.headline": "...", /* ... */ },
};

export function setLang(lang: string): void {
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang]?.[key]) el.textContent = i18n[lang][key];
  });
  localStorage.setItem('lang', lang);
  history.replaceState(null, '', `#lang=${lang}`);
}

export function initI18n(): void {
  const hash = new URLSearchParams(location.hash.slice(1)).get('lang');
  const stored = localStorage.getItem('lang');
  const lang = hash || stored || 'gr';
  setLang(lang);
}
```

### 7. Performance Budget (UPDATED)

| Asset | Target |
|---|---|
| Total output file | < 400 KB (uncompressed, excl. fonts) |
| JS (incl. WA + Lit runtime) | ~120–180 KB |
| CSS (incl. WA theme) | ~35 KB |
| HTML | ~50 KB |
| SVG illustrations | < 15 KB (5 × 3 KB) |
| i18n strings | ~30 KB (GR + EN) |

**Lighthouse targets:** 95+ Performance, 100 Accessibility, 100 SEO

**Notes:**

- WA components + Lit runtime (~6 KB gzipped) add meaningful JS weight compared to the previous vanilla approach
- The file is still a single HTML distributable — the budget accounts for all inlined assets
- Fontshare CDN fonts are excluded from the budget (external, not inlined)
- Despite increased size, the single-file distribution model is preserved — no deployment complexity

### 8. Accessibility Checklist

- Skip link as first focusable element
- Accordions: `<wa-details>` provides built-in `<button>` + `aria-expanded` + `aria-controls` + keyboard navigation
- Quiz: `role="form"`, `aria-live="polite"`, `<wa-radio-group>` provides native radio semantics
- Tier nav: `role="navigation"`, `aria-label`
- TCO bars: `role="img"` with `aria-label`, `<wa-tooltip>` for accessible hover content
- Language toggle: `aria-pressed` on each button
- Color contrast: WCAG AA in both themes
- Keyboard: logical Tab order, Enter/Space activates all buttons
- Focus visible: `outline` on every interactive element
- Reduced motion: `prefers-reduced-motion` → opacity-only transitions

**Web Awesome accessibility benefits:** All WA components provide built-in ARIA roles, keyboard navigation, focus management/trapping, and high-contrast mode support out of the box. No manual ARIA attributes needed for WA component internals.

### 9. Browser Support

- Modern evergreen: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- No IE11
- `backdrop-filter`: graceful fallback to solid background
- CSS custom properties: required, no fallback
- `IntersectionObserver`: required, no fallback

### 10. `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

Note: Do NOT include `"types": ["bun"]` — this project targets the browser, not the Bun runtime. Type checking is for editor support only; Bun's bundler handles the actual compilation.

### 11. Print Stylesheet

- Force light theme
- Hide: `<header>`, `<nav>`, toggles, quiz, scroll CTAs
- Expand all accordions (set `<wa-details>` open attribute)
- Page breaks between tier sections
- Tier accent colors preserved with `print-color-adjust: exact`
- `@page`: A4, margins 15 mm 12 mm

---

# DESIGN.md — Visual Identity & Art Direction

## Concept & Tone

**Audience:** A 40-year-old Greek SME owner — a travel agency, law office, or restaurant. Not technical. Values clarity over cleverness. Slightly skeptical. Has been burned before by cheap websites. Wants to feel respected, not sold to.

**Tone keywords:** _Authoritative without being cold. Warm but not folksy. Clear, structured, honest._

**Art direction:** Think premium financial brochure crossed with a well-designed product explainer. The visual language should say "this is serious, professional work" — not "cool startup vibes."

**Anti-AI commitment:** No gradient orbs. No 3-column icon grids. No purple/indigo glow. No centered everything. No generic hero copy.

---

## Color System

### Base Palette

Use the **Nexus Design System** as the foundation — warm beige surfaces (`#f7f6f2` light, `#171614` dark), Sylph Gray text, Hydra Teal primary. This warm-neutral base feels premium and trustworthy.

### Tier Accent Colors

Each tier gets its own accent color, used for: number badge, pill border, card left-edge glow (subtle, 2px), chip backgrounds, bar chart color, and SVG illustration stroke.

| Tier   | Color Name  | Light hex | Dark hex  | Semantic                    |
| ------ | ----------- | --------- | --------- | --------------------------- |
| Tier 1 | Muted Amber | `#b07a00` | `#e8af34` | Warning — budget            |
| Tier 2 | Steel Blue  | `#006494` | `#5591c7` | Reliable but limited        |
| Tier 3 | Slate Green | `#437a22` | `#6daa45` | Fast, clean, but incomplete |
| Tier 4 | Hydra Teal  | `#01696f` | `#4f98a3` | The recommended sweet spot  |
| Tier 5 | Deep Plum   | `#7a39bb` | `#a86fdf` | Premium, rare, enterprise   |

These map directly to the Nexus semantic tokens (`--color-gold`, `--color-blue`, `--color-success`, `--color-primary`, `--color-purple`) — no custom tokens needed. Each tier's color communicates its position intuitively without being explained.

---

## Typography

### Fonts

**Display:** `Zodiak` (Fontshare) — a refined, slightly editorial serif with personality. Used for hero headline and tier names **in English only** (Latin glyphs).

**Body:** `Satoshi` (Fontshare) — a clean, modern geometric sans-serif with **full Greek glyph support**. Used for all body text and as the display font for Greek content.

### Dual Font Strategy (Bilingual)

| Language | Display / Headlines | Body |
|----------|-------------------|------|
| Greek (`data-lang="gr"`) | **Satoshi Bold** (700) | Satoshi Regular (400) |
| English (`data-lang="en"`) | **Zodiak Bold** (700) | Satoshi Regular (400) |

This ensures Greek text renders perfectly with Satoshi, while English headlines get the editorial serif feel from Zodiak.

**Loading:**

```html
<link
  href="https://api.fontshare.com/v2/css?f[]=zodiak@400,700&f[]=satoshi@400,500,700&display=swap"
  rel="stylesheet"
/>
```

### Scale Usage

| Element          | Token                        | Font                                   |
| ---------------- | ---------------------------- | -------------------------------------- |
| Hero headline    | `--text-2xl` to `--text-3xl` | Zodiak bold (EN) / Satoshi bold (GR)   |
| Tier name        | `--text-xl`                  | Zodiak bold (EN) / Satoshi bold (GR)   |
| Section heading  | `--text-lg`                  | Satoshi, bold                          |
| Body / accordion | `--text-base`                | Satoshi, regular                       |
| Chips / badges   | `--text-xs`                  | Satoshi, 500 weight, uppercase tracked |
| Nav pills        | `--text-sm`                  | Satoshi, 500                           |

---

## Motion Spec

All animations respect `prefers-reduced-motion` — if set, all transitions reduce to instant opacity fade only.

| Element               | Animation                                     | Trigger                  | Duration / Easing                   |
| --------------------- | --------------------------------------------- | ------------------------ | ----------------------------------- |
| Hero headline         | `clip-path: inset(0 0 100% 0)` → `inset(0)`   | Page load                | 700ms, `cubic-bezier(0.16,1,0.3,1)` |
| Car metaphor cards    | `translateX(-40px)` → `0` + `opacity`         | Page load, 200ms stagger | 600ms, same easing                  |
| Tier cards (scroll)   | `translateY(24px)` + `opacity: 0` → natural   | `IntersectionObserver`   | 500ms, `ease-out`                   |
| Accordion open        | `max-height: 0` → computed height + `opacity` | Click                    | 400ms, spring easing                |
| TCO bars              | `width: 0` → final width                      | `IntersectionObserver`   | 800ms, staggered 100ms, `ease-out`  |
| Comparison rows       | `translateY(8px)` + `opacity: 0` → natural    | `IntersectionObserver`   | 300ms, staggered 50ms, `ease-out`   |
| Quiz slide            | `translateX(60px) opacity:0` → 0              | Button click             | 350ms, `ease-in-out`                |
| Tier nav active       | background-color transition                   | ScrollSpy                | 200ms, `ease`                       |
| Dark mode toggle      | `rotate(0)` → `rotate(360deg)` on icon        | Click                    | 300ms                               |
| Language toggle       | `background-color` + `color` transition       | Click                    | 200ms, `ease`                       |
| Scroll chevron (hero) | `translateY(0)` → `translateY(8px)` → back    | Loop                     | 1.4s, `ease-in-out`, infinite       |
| SVG illustrations     | Per-tier: exhaust puff, bounce, shine, wheels, road lines | Continuous loop  | 2–4s per cycle, `ease-in-out`       |

---

## Spacing & Layout

- **Max content width:** `960px` (`--content-default`), centered with `margin-inline: auto`, `padding-inline: clamp(var(--space-4), 5vw, var(--space-12))`
- **Section padding:** `clamp(var(--space-12), 8vw, var(--space-24))`
- **Tier card padding:** `var(--space-8)` desktop, `var(--space-6)` mobile
- **Accordion body padding:** `var(--space-6)` all sides
- **Tier nav height:** `52px` with `backdrop-filter: blur(10px)` on stick
- **Comparison table cell padding:** `var(--space-3)` desktop, `var(--space-2)` mobile

---

## Mobile Behavior

- Tier nav pills: horizontal scroll, `scroll-snap-type: x mandatory`, pills are `scroll-snap-align: center`
- Car metaphor cards: stack vertically at `< 640px`
- TCO bars: remain horizontal but with abbreviated labels ("T1"–"T5")
- Comparison table: horizontal scroll with sticky first column
- Quiz: full-width card, large touch targets (`min-height: 52px` for answer buttons)
- Accordion: chevron icon rotates 180° on open
- SVG illustrations: scale to 80px, positioned inline left of tier name
- All font sizes: fluid via `clamp()`, no text below 12px

---

## Accessibility Commitments

- Every accordion trigger is a `<button>` with `aria-expanded` and `aria-controls`
- Every tier section has an `id` for scroll targets and `aria-label`
- Tier nav has `role="navigation"` and `aria-label="Tier navigation"`
- Quiz uses `role="form"`, question cards use `aria-live="polite"` for screen reader announcements
- Comparison table: proper `<th>` headers, `scope` attributes
- TCO bars have `role="img"` with descriptive `aria-label` values
- Language toggle: `aria-pressed` on each button
- WCAG AA contrast on all text — verified across both themes and both languages
- Skip link: first focusable element on page
- Focus visible: `outline` on every interactive element
- Keyboard: logical Tab order, Enter/Space activates all interactive elements

---

## Component Inventory

| Component | Implementation | Why |
| --- | --- | --- |
| Sticky header | CSS `position: sticky; top: 0` + `backdrop-filter: blur(12px)` | Persistent orientation |
| Language toggle | JS `setLang()` + `data-i18n` DOM switching + `localStorage` | Required bilingual support |
| Tier nav pills | Flexbox row + `IntersectionObserver` ScrollSpy | Non-intrusive quick navigation |
| Tier header card | CSS Grid, tier accent CSS variable | Scannable tier summary |
| Detail accordion | **`<wa-details>`** (Web Awesome) — ARIA compliant, keyboard nav, animated | Accessible progressive disclosure, zero manual a11y |
| Car metaphor cards | CSS Grid 2-col, surface elevation | Anchors mental model |
| Quick-stat chips | Inline flex spans with `--color-surface-offset` bg | Data-dense but readable |
| TCO stacked bars | Pure CSS `<div>` + width transition on `IntersectionObserver` | No library weight, full control |
| TCO tooltips | **`<wa-tooltip>`** (Web Awesome) — viewport-aware positioning | Accessible hover info without manual positioning |
| Comparison checklist | HTML `<table>` + sticky column + row stagger animation | Side-by-side tier justification |
| Decision quiz options | **`<wa-radio-group>`** + **`<wa-radio>`** (Web Awesome) | Accessible radio selection with keyboard nav |
| Quiz scoring + state | Custom TS module — weighted algorithm with tiebreaker | Business logic unique to this guide |
| Quiz slide animation | CSS `translateX` transition on card swap | Smooth UX |
| SVG illustrations | Inline SVG with CSS `@keyframes` animations | Reinforces car analogy per tier |
| PDF export | `window.print()` + `@media print` stylesheet | Zero-cost, accessible output |
| Scroll reveal | `IntersectionObserver` + `opacity`/`translateY` transition | Modern, performant, accessible |
| Dark/light toggle | `data-theme` on `<html>` synced with WA `.wa-dark` + `matchMedia` | Unified dark mode across custom + WA components |
| FOUCE prevention | `<html class="wa-cloak">` + `allDefined()` | No flash of unstyled custom elements |
