# Tech Stack Handbook: Bun + Web Awesome (2026)

> Compressed reference for building vanilla websites with Bun as the toolchain and Web Awesome as the component library.

---

## Architecture at a Glance

| Layer | Tool | Role |
|-------|------|------|
| Runtime / Bundler / Package Manager | **Bun** | Dev server, production builds, TS transpilation, CSS bundling |
| UI Components | **Web Awesome** (`@awesome.me/webawesome`) | Accessible custom elements for complex interactive UI |
| Lint / Format | **Biome** | Single binary replacing ESLint + Prettier |
| Testing | `bun:test` + `happy-dom` | Jest-compatible test runner with DOM environment |
| Optional CSS | `bun-plugin-tailwind` | Utility CSS via Bun-native plugin |

**When Bun alone is enough:** Landing pages, marketing sites (5–20 pages), small-to-medium SPAs, vanilla dashboards.

**When to look elsewhere:** Large SPAs needing advanced code splitting with per-chunk CSS (known Bun bug), projects needing Vite's 800+ plugin ecosystem, or 50+ page content sites (pair with Eleventy instead).

---

## Quick Start

```bash
bun init -y
bun add @awesome.me/webawesome
bun add -D @biomejs/biome @types/bun @happy-dom/global-registrator
```

```bash
# Dev (starts in ~7ms)
bun ./src/index.html

# Production build
bun build ./src/index.html --minify --outdir=dist --env=PUBLIC_*

# Multi-page
bun ./src/**/*.html
bun build ./src/**/*.html --minify --outdir=dist
```

**package.json scripts:**

```json
{
  "dev": "bun ./src/index.html --console",
  "build": "bun build ./src/index.html --minify --outdir=dist --env=PUBLIC_*",
  "preview": "bunx serve dist",
  "test": "bun test",
  "lint": "bunx biome check --apply ."
}
```

---

## Folder Structure

```
project-root/
├── src/
│   ├── index.html              # Primary HTML entrypoint
│   ├── about.html              # Additional pages (MPA)
│   ├── main.ts                 # WA init, setBasePath, allDefined
│   ├── wa.ts                   # All WA component imports (single file)
│   ├── pages/                  # Per-page JS modules
│   ├── components/             # Your vanilla TS / Web Components
│   └── styles/
│       ├── main.css            # Root CSS with @import chain
│       ├── reset.css
│       └── tokens.css          # --wa-* overrides for brand
├── public/                     # Copied verbatim (favicon, robots.txt)
├── dist/                       # Production output (gitignored)
├── bunfig.toml
├── tsconfig.json
├── biome.json
└── package.json
```

---

## TypeScript Configuration

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
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Critical:** Do NOT include `"types": ["bun"]` in tsconfig for browser-targeted projects — it overrides `lib: ["DOM"]` and breaks `document`, `window`, etc. Use `.js` extensions in import paths even for `.ts` files (ESM convention with `moduleResolution: "bundler"`).

---

## Web Awesome Integration

### Setup (src/main.ts)

```typescript
import { setBasePath, allDefined } from '@awesome.me/webawesome/dist/webawesome.js';
import './wa.js';

// Required: tells WA where to find icon/asset files
setBasePath('/assets/webawesome');

// Wait for all wa-* elements to register before binding logic
await allDefined();
```

### Centralize Imports (src/wa.ts)

```typescript
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/select/select.js';
// ... add only what you use
```

### Import Rules

| Rule | Why |
|------|-----|
| Always import from `dist/` (never `dist-cdn/`) | `dist-cdn/` bundles Lit into each component, duplicating runtime |
| Always cherry-pick per-component paths | Barrel imports include the entire library |
| Never self-close custom elements (`<wa-input />`) | Invalid HTML for custom elements |
| Await registration before imperative calls | Methods fail silently before `customElements.whenDefined()` |

### HTML Entrypoint

```html
<!doctype html>
<html class="wa-cloak">
  <head>
    <link rel="stylesheet" href="./src/styles/main.css" />
    <script type="module" src="./src/main.ts"></script>
  </head>
  <body>
    <wa-button variant="brand">Click me</wa-button>
  </body>
</html>
```

### Typed Element References

```typescript
import type { WaDialog } from '@awesome.me/webawesome/dist/components/dialog/dialog.js';

const dialog = document.querySelector<WaDialog>('wa-dialog')!;
dialog.open = true;                   // ✅ typed
await dialog.updateComplete;          // ✅ wait for Lit render
```

### Editor Support

**VS Code** — `.vscode/settings.json`:
```json
{ "html.customData": ["./node_modules/@awesome.me/webawesome/dist/vscode.html-custom-data.json"] }
```

**JetBrains** — add to `package.json`:
```json
{ "web-types": "./node_modules/@awesome.me/webawesome/web-types.json" }
```

---

## Styling & Theming

### Three-Layer Customization

**Layer 1 — Global tokens (`:root`):**
```css
:root {
  --wa-color-brand: oklch(60% 0.22 250);
  --wa-font-family-base: 'Inter Variable', sans-serif;
  --wa-border-radius-medium: 0.5rem;
}
```

**Layer 2 — Component-scoped properties:**
```css
wa-button {
  --border-width: 2px;
  --height: 2.75rem;
}
```

**Layer 3 — CSS parts (`::part()`):**
```css
wa-button.brand-cta::part(base) {
  background: linear-gradient(135deg, var(--wa-color-brand), oklch(50% 0.25 300));
  font-weight: 700;
}
```

### Dark Mode

Apply `.wa-dark` to `<html>` or `<body>`. CSS custom properties cascade through shadow roots automatically.

### CSS Organization

```css
/* styles/main.css */
@import "./reset.css";
@import "./tokens.css";
@import "./components/button.css";
@import "./components/nav.css";
```

Bun's CSS parser (LightningCSS port) handles nesting, `color-mix()`, OKLCH, `light-dark()`, and media query ranges natively. No preprocessor needed.

---

## FOUCE Prevention

FOUCE = Flash of Undefined Custom Elements. Happens when HTML renders `<wa-*>` tags before JS registers them.

**Solution:**
1. Add `<html class="wa-cloak">` — hides all `wa-*` elements until registered
2. Autoloader removes `wa-cloak` automatically (2s timeout safety)
3. Cherry-picked bundled imports → single network round-trip → minimal FOUCE window
4. For Turbo/SPA navigation: `import { preventTurboFouce } from '@awesome.me/webawesome/dist/webawesome.js'`

---

## Component Selection Guide

### Use (genuinely hard to build from scratch)

| Component | Why |
|-----------|-----|
| `wa-dialog` | Focus trapping, Escape key, backdrop dismiss, ARIA role="dialog" |
| `wa-drawer` | Same as dialog for side panels |
| `wa-select` | Custom listbox with keyboard nav, multi-select, search |
| `wa-tab-group` | ARIA-correct tablist, keyboard nav, animated indicator |
| `wa-tooltip` | Viewport-aware positioning, delay management |
| `wa-dropdown` | Smart popup positioning, submenus, keyboard nav |
| `wa-popover` | Anchored floating content without setup overhead |
| `wa-color-picker` | Full sRGB/HSL picker — thousands of lines if DIY |
| `wa-carousel` | Lazy slides, touch support, accessible prev/next |

### Consider (strong native alternatives exist)

| Component | Consideration |
|-----------|---------------|
| `wa-button` | Consistent styling is main value; native `<button>` + CSS works |
| `wa-input` | Nice label/error slots, but native `<input>` + CSS viable |
| `wa-card` | A `<div>` with slots — useful for consistency, not functionality |
| `wa-badge`, `wa-tag` | Convenience styling; trivial to replicate |

### Skip (unnecessary overhead)

| Component | Reason |
|-----------|--------|
| `wa-avatar` | A styled `<img>` or initials `<div>` |
| `wa-format-date`, `wa-relative-time` | Use `Intl.DateTimeFormat` directly |
| `wa-icon` alone | Only justified with Font Awesome kit; use SVG otherwise |

**Rule of thumb:** Use WA for behavior complexity that exceeds what CSS alone can deliver. Use native HTML for layout (`<main>`, `<section>`, `<nav>`) and text elements.

---

## Performance & SEO

### Bundle Size Reality

- ~6 KB gzipped shared Lit runtime
- ~5–25 KB gzipped per component
- 10 cherry-picked components ≈ 80–180 KB gzipped
- Marginal cost decreases per additional component (shared Lit runtime)

### Core Web Vitals Targets

| Metric | Target | How |
|--------|--------|-----|
| **LCP** | ≤ 2.5s | Preload hero image + font, self-host fonts, CDN |
| **INP** | ≤ 200ms | Avoid long sync tasks, use `scheduler.yield()` |
| **CLS** | ≤ 0.1 | Always set `width`/`height` on `<img>`, use `wa-cloak` |

### Image Strategy

Bun has no native image optimization. Use `sharp` or `bun-image-turbo` in a build script:

```html
<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w">
  <source type="image/webp" srcset="hero-800.webp 800w, hero-1600.webp 1600w">
  <img src="hero-800.jpg" width="800" height="600" alt="..." loading="lazy">
</picture>
```

LCP hero image: `loading="eager"` + `<link rel="preload">` in `<head>`.

### SEO

- **MPA > SPA** for content sites — non-Google crawlers (Bing, social scrapers) often don't execute JS
- Add Open Graph, Twitter cards, JSON-LD directly in `<head>`
- Keep SEO-critical text in light DOM (slots), not shadow DOM internals

### JS Budgets

- Small site: < 100 KB gzipped JS
- SPA dashboard: < 250 KB gzipped JS

---

## Build & Deployment

### Build Output

Bun rewrites all asset paths with content hashes. Output is static HTML/CSS/JS — no Bun runtime needed in production.

```bash
bun build ./src/index.html --minify --outdir=dist
```

### Post-Build: Copy WA Assets

```json
{
  "build": "bun build ./src/index.html --minify --outdir=dist",
  "postbuild": "cp -r node_modules/@awesome.me/webawesome/dist/assets dist/assets/webawesome"
}
```

### Standalone Single-File HTML

```bash
bun build --compile --target=browser --minify ./src/index.html --outdir=dist
```

Use for: offline tools, email templates, `file://` usage. Tradeoff: +33% base64 overhead, no code splitting, impractical over ~2 MB.

### Caching Headers

- `index.html` → `Cache-Control: no-cache`
- Hashed assets (`app-[hash].js`) → `Cache-Control: public, max-age=31536000, immutable`

### Static Hosting

| Host | Free Tier | Notes |
|------|-----------|-------|
| **Cloudflare Pages** (recommended) | Unlimited | Global edge, zero cold starts |
| Netlify | 100 GB/mo | Mature CI/CD, form handling |
| Vercel | Yes | Full Bun support, set framework to "Other" |
| GitHub Pages | Yes | Push `dist/` via CI |

### Bun Server (when you need APIs/SSR)

**Railway** recommended (Railpack auto-detects Bun). Use Docker (`oven/bun:1`) for self-hosted VPS.

### Deployment Decision

```
Purely static? → Cloudflare Pages
  Need single portable file? → Standalone HTML (--compile)
Need APIs/SSR? → Railway (PaaS) or Docker + Fly.io
Edge serverless? → Cloudflare Pages Functions / Vercel Edge
```

---

## Known Gotchas & Workarounds

| Issue | Impact | Workaround |
|-------|--------|------------|
| `--splitting` + CSS imports → MIME type errors | Medium | Avoid `--splitting`; keep CSS in main entry or split pure-JS only |
| `dist-cdn/` with bundler → duplicated Lit runtime | Medium | Always use `dist/` imports |
| Barrel imports → entire library in bundle | High | Cherry-pick from `dist/components/X/X.js` |
| Calling WA methods before registration → silent failure | High | Gate behind `await allDefined()` or `customElements.whenDefined()` |
| Property mutation → stale reflected attribute | Low | Await `element.updateComplete` before reading |
| `bun-types` overrides DOM types in tsconfig | Medium | Omit `"types": ["bun"]` for browser-targeted projects |
| CSS Modules lack TS types | Low | Add a `css.d.ts` declaration file |
| `bunfig.toml` only runs first plugin | Low | Chain plugins via `Bun.build()` API |
| No native image optimization | Medium | Use `sharp` or `bun-image-turbo` in build script |

---

## Ecosystem Quick Reference

| Category | Tool | Setup |
|----------|------|-------|
| Image optimization | `sharp` | `bun add -D sharp` + build script |
| SVG optimization | `svgo` | `bunx svgo` in CI |
| TailwindCSS | `bun-plugin-tailwind` | `bun add -D bun-plugin-tailwind` + bunfig.toml |
| DOM testing | `happy-dom` | `bun add -D @happy-dom/global-registrator` + preload in bunfig.toml |
| Web Vitals | `web-vitals` | `bun add web-vitals` |
| Sitemap | Custom script | `scripts/generate-sitemap.ts` using Bun file APIs |
| Analytics | Plausible / Fathom | Script tag, no package needed |

---

## Testing Setup

```typescript
// happydom.ts (preload)
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();
```

```toml
# bunfig.toml
[test]
preload = ["./happydom.ts"]
```

```bash
bun test              # run once
bun test --watch      # watch mode
bun test --coverage   # with coverage
```

---

## Accessibility Checklist

Web Awesome provides built-in ARIA roles, keyboard navigation, focus management, and screen reader support. Your responsibilities:

- Always set `label` on form controls: `<wa-input label="Email">`
- Label icon-only buttons: `<wa-button label="Close">`
- Label dialogs: `<wa-dialog label="Confirm Action">`
- Group related controls in `<fieldset>` + `<legend>`
- Don't manipulate `tabindex` around WA components — they manage focus internally
- Content in slots is your responsibility (decorative images need `alt=""`)

---

## Project Type → Recommendation

| Project Type | Recommendation |
|-------------|----------------|
| Small landing page (< 3 interactive elements) | Bun-only, no WA. Native HTML/CSS. Deploy standalone or dist/. |
| Marketing site (5–20 pages) | Bun + Biome + MPA. WA for dialogs/selects only. Cloudflare Pages. |
| Vanilla SPA / dashboard | Bun + Biome + Lit (~6 KB) for custom components. WA for complex UI (dialogs, selects, tabs). |
| Accessible admin / back-office | Bun + WA broadly. 10+ interactive views justifies the JS cost. |
| 50+ page content site | Bun + Eleventy for templating. WA for interactive regions only. |
