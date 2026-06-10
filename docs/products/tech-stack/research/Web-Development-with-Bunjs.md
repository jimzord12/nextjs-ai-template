# Building a Modern Vanilla Website with Bun: A Senior Engineer's Field Guide (2026)

***

## 1. Executive Recommendation

**Bun alone is enough for most vanilla website projects today.** The `bun ./index.html` workflow — where a single HTML file is the entrypoint for the dev server and the production bundler — is now the canonical way to build a Bun-first static or single-page site. It handles TypeScript, CSS bundling and minification, asset hashing, and HMR out of the box, without any `vite.config.ts`, `webpack.config.js`, or similar ceremony.[^1][^2]

**Where Bun-only remains true:** Landing pages, polished marketing sites, small-to-medium SPAs, and vanilla dashboards with a moderate number of JS/TS modules. The threshold starts to blur when you need advanced code splitting across many async routes (Bun's CSS + splitting interaction still has a known bug), a rich plugin ecosystem (Vite's 800+ plugins vs. Bun's handful), or image optimization at build time (not yet native).[^3][^4][^5][^6][^7]

**Concise opinionated setup:**

```bash
bun init          # scaffolds tsconfig.json, package.json
# write src/index.html, src/app.ts, src/styles.css
bun ./src/index.html                            # dev server, ready in ~7ms
bun build ./src/index.html --minify --outdir=dist  # production build
```

That is the entire toolchain. No config files unless you want TailwindCSS or environment variable prefixing.

***

## 2. Bun-First Architecture

### The HTML Entrypoint Model

Bun's bundler has first-class HTML support. The HTML file is both the dev server entry and the production build entry. Bun scans `<script src>`, `>`, `<img>`, and other asset references, bundles everything, and rewrites paths. This is not a plugin — it is native bundler behaviour built in Zig.[^1]

```html
<!-- src/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    /styles/main.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="./scripts/main.ts" type="module"></script>
  </body>
</html>
```

Note `type="module"` — Bun requires it for scripts that should be transpiled as ES modules.

### Recommended Folder Tree

```
project-root/
├── src/
│   ├── index.html            ← primary entrypoint
│   ├── about.html            ← secondary page (MPA)
│   ├── scripts/
│   │   ├── main.ts           ← app entry
│   │   ├── router.ts         ← client-side routing if SPA
│   │   ├── components/       ← Web Component definitions or plain TS modules
│   │   │   ├── nav.ts
│   │   │   └── modal.ts
│   │   └── utils/
│   │       └── dom.ts
│   ├── styles/
│   │   ├── main.css          ← root CSS, uses @import
│   │   ├── reset.css
│   │   ├── tokens.css        ← CSS custom properties / design tokens
│   │   └── components/
│   │       └── button.css
│   └── assets/
│       ├── images/
│       └── fonts/
├── public/                   ← files copied verbatim (favicon, robots.txt)
├── dist/                     ← production output (gitignored)
├── tests/
│   └── *.test.ts
├── bunfig.toml
├── tsconfig.json
├── biome.json
└── package.json
```

### Structural Decisions

- **ES modules everywhere.** Use `import`/`export` in all `.ts` files. Bun's bundler resolves ESM and CJS automatically, but native ESM is cleaner and tree-shakeable.[^1]
- **TypeScript by default.** Bun strips types at runtime with zero configuration. For a browser build, Bun transpiles TS via its native transpiler — no `tsc`, no Babel.[^2]
- **Bun owns both dev and production.** The `bun ./index.html` dev server and `bun build ./index.html` production command use the same underlying HTML parser and bundler, so what you see in dev is what you get in prod.[^2][^1]
- **MPA is first-class.** Multiple HTML entry points are handled natively: `bun ./index.html ./about.html` or `bun ./**/*.html`.[^1]

***

## 3. Development Workflow

### Starting a Project

```bash
mkdir my-site && cd my-site
bun init -y           # generates tsconfig.json, package.json, index.ts
# delete index.ts, create src/index.html manually
bun add -D @types/bun biome   # type declarations + linter/formatter
```

`bun init` generates a sensible `tsconfig.json`. You will need to adjust it for browser targets (see §5).[^8]

### Dependency Management

`bun install` is ~17× faster than pnpm from cache and ~30× faster than yarn. The lockfile is `bun.lock`. Use `bun add <pkg>` and `bun remove <pkg>` as you would npm.[^9]

### Local Development

```bash
bun ./src/index.html
# or MPA:
bun ./src/**/*.html
```

The dev server starts in ~7ms. Features included:[^1]

- **Automatic HMR / hot reload** — file system watching via `kqueue`/`inotify`[^2]
- **Browser console bridged to terminal** via `bun ./src/index.html --console`[^1]
- **Chrome DevTools Workspace integration** — edits in DevTools save back to disk[^1]
- **Fallback routing for SPAs** — all routes serve the single HTML when one entrypoint is given[^1]

Keyboard shortcuts while the server runs: `o + Enter` (open browser), `c + Enter` (clear console), `q + Enter` (quit).[^1]

### CSS Handling

Bun's CSS parser is a Zig port of LightningCSS. It supports:[^10]

- CSS nesting, `color-mix()`, OKLCH, `light-dark()`, media query ranges — all transpiled to browser-compatible equivalents[^10]
- `@import` chains — multiple CSS files are flattened at build time[^1]
- CSS Modules (`.module.css`) with scoped class names and `composes`[^11]
- Asset URL rewriting with content hashes[^1]
- TailwindCSS via `bun-plugin-tailwind` (single `bun add -D bun-plugin-tailwind` + one line in `bunfig.toml`)[^1]

**Recommended scalable CSS approach for vanilla:**

```css
/* styles/main.css */
@import "./reset.css";
@import "./tokens.css";      /* CSS custom properties */
@import "./components/button.css";
@import "./components/nav.css";
```

No preprocessor needed. Bun's CSS transpiler handles nesting, modern colours, and logical properties natively.

### Linting and Formatting

**Biome** is the recommended choice for a Bun-first stack. It replaces both ESLint and Prettier with a single binary, is written in Rust, and runs format + lint in one command:[^12][^13]

```bash
bun add -D @biomejs/biome
bunx biome init           # generates biome.json
bunx biome check --apply . # format + lint + fix
```

Biome is actively maintained and broadly compatible with ESLint rule coverage as of 2025. Add it as a pre-commit hook or CI step.[^14]

**Tools matrix:**

| Tool | Category | Status |
|------|----------|--------|
| Biome | Lint + Format | **Essential** |
| `bun:test` | Testing | **Essential** |
| `@types/bun` | TS types for Bun APIs | **Essential** |
| TailwindCSS (`bun-plugin-tailwind`) | Utility CSS | Optional |
| `happy-dom` | DOM testing | Optional (needed for tests) |
| `sharp` / `bun-image-turbo` | Image optimisation | Optional (build script) |

***

## 4. Bundling and Output Strategy

### Standard `dist/` Build

```bash
bun build ./src/index.html --minify --outdir=dist
```

What this produces:

- HTML with updated `<script>` and `>` paths pointing to hashed filenames
- Bundled and minified JS (e.g. `app-[HASH].js`)
- Bundled and minified CSS (e.g. `styles-[HASH].css`)
- Hashed copies of all referenced images and fonts[^1]

All asset paths in HTML, CSS, and JS are rewritten automatically. The hash is a content hash, so unchanged files keep the same filename — good for long-lived CDN caching.[^1]

**Environment variable injection:**

```toml
# bunfig.toml
[serve.static]
env = "PUBLIC_*"   # dev: only expose vars prefixed PUBLIC_
```

```bash
# production build
bun build ./src/index.html --outdir=dist --env=PUBLIC_*
```

References to `process.env.PUBLIC_API_URL` in TS are replaced with literal values at build time.[^1]

### Standalone Single-File HTML Build

```bash
bun build --compile --target=browser --minify ./src/index.html --outdir=dist
```

Everything — JS, CSS, images, fonts, WASM — is inlined into one `.html` file. Images become `data:` URIs, CSS becomes `<style>` tags, JS becomes `<script type="module">` blocks.[^15][^16]

**Use cases where standalone is the right default:**
- Tool/utility that employees or clients open from a file share, email attachment, or S3 URL
- Embedding interactive content in an `<iframe>` with a single URL
- Offline-capable tools (opened from `file://`)
- Shareability: distribute like a PDF[^15]

**Tradeoffs:**

| | `dist/` folder build | Standalone `.html` |
|-|----------------------|-------------------|
| File count | Multiple (HTML + assets) | 1 |
| CDN caching | Per-asset granularity, excellent | Whole file invalidated on any change |
| Binary asset overhead | None | +33% base64 encoding[^15] |
| CDN/host required | Yes | No — works from `file://` |
| Code splitting | Supported (with caveats) | **Not supported** (`--splitting` cannot be combined with `--compile`)[^15] |
| Appropriate for large apps | Yes | No — impractical over ~2 MB total assets |

### Code Splitting

Bun supports `--splitting` for the `dist/` build mode, which emits shared chunks for common imports. However, as of mid-2026, there is an active bug where CSS imports in split chunks are converted to dynamic imports, causing MIME type errors in the browser. Until this is resolved, avoid `--splitting` for projects with significant CSS-from-JS imports. For pure-JS splitting (no CSS imports in the split modules), it works correctly.[^5][^3]

### Recommended Default Build Strategy

For most vanilla projects, the `dist/` folder build is the correct default:

```bash
# package.json scripts
{
  "scripts": {
    "dev": "bun ./src/index.html --console",
    "build": "bun build ./src/index.html --minify --outdir=dist --env=PUBLIC_*",
    "preview": "bunx serve dist",
    "test": "bun test",
    "lint": "bunx biome check --apply ."
  }
}
```

The standalone HTML is the right choice only when you explicitly need zero-dependency distribution.

***

## 5. TypeScript with Vanilla Bun

### How Bun Handles TypeScript

Bun strips TypeScript types at runtime and build time using its native Zig-based transpiler. There is no invocation of `tsc`. Type checking is separate — run `bunx tsc --noEmit` in CI. In development, your editor's TS language server handles real-time errors.[^2]

### tsconfig.json for a Browser-Targeted Vanilla Project

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

**Critical note on DOM types:** Adding `@types/bun` or `bun-types` to `"types"` overrides the `lib: ["DOM"]` setting in older versions of Bun, causing `document`, `window`, etc. to be unrecognised. The fix is to **not** include `"types": ["bun"]` in a browser-targeted project, or add three-slash directives to files that need DOM:[^17][^18]

```typescript
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
```

As of Bun 1.3, the recommended approach is to omit `"types": ["bun"]` from `tsconfig.json` for browser builds and only include it in server-side files or a separate `tsconfig.server.json`.[^8]

### Structuring TS Modules for a Vanilla SPA

```typescript
// scripts/main.ts
import { initRouter } from "./router.js";   // .js extension, not .ts
import { setupNav } from "./components/nav.js";
import "./styles/main.css";                  // CSS import supported

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  setupNav();
});
```

Use `.js` extensions in import paths even for `.ts` files — this is the ESM-native convention and what Bun expects with `moduleResolution: "bundler"`.

### DOM Ergonomics in TypeScript

DOM-heavy vanilla apps are very ergonomic in TypeScript. The key patterns:

```typescript
// Non-null assertion when you know the element exists
const form = document.querySelector<HTMLFormElement>("#contact-form")!;

// Type-safe event handling
form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(form);
});

// Type-safe Web Component definition
class MyModal extends HTMLElement {
  static observedAttributes = ["open"] as const;
  
  connectedCallback() {
    this.render();
  }
  
  private render() {
    this.innerHTML = `<div class="modal-content"><slot></slot></div>`;
  }
}

customElements.define("my-modal", MyModal);
```

### When TypeScript Is Worth It vs. Plain JS

- **Use TypeScript** for anything beyond ~300 lines, all component files, any DOM manipulation logic, and any module shared across pages. The ergonomics are strong and Bun's zero-config TS support removes all friction.
- **Plain JS** is fine for small utility scripts, one-off page scripts with no imports, or `<script>` snippets in HTML that will never be imported elsewhere. JSDoc types can cover the middle ground if teammates resist TypeScript.

***

## 6. Modern Vanilla Ecosystem Around Bun

### By Category

| Category | Bun native | Best external package | Notes |
|----------|-----------|----------------------|-------|
| **Image optimisation** | ❌ Not yet[^4] | `sharp` (Bun-compatible via Node-API v9)[^19] or `bun-image-turbo` (36× faster metadata, Rust-based)[^20] | Run in a `scripts/optimise-images.ts` build script |
| **SVG optimisation** | ❌ | `svgo` | Run via `bunx svgo` in CI |
| **CSS transpiling** | ✅ LightningCSS port[^10] | N/A | Nesting, modern colours, vendor prefixing all built in |
| **Linting / formatting** | ❌ | Biome[^12] | Replaces ESLint + Prettier |
| **Testing** | ✅ `bun:test` (Jest-compatible)[^21] | `@happy-dom/global-registrator` for DOM[^21][^22] | Add `preload = ["./happydom.ts"]` to `bunfig.toml` |
| **Accessibility testing** | ❌ | `axe-core` (run in tests or CI with Playwright) | No Bun-native axe integration |
| **Performance measurement** | ❌ | Lighthouse CLI (`bunx lighthouse`), PageSpeed Insights | Web Vitals: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1[^23][^24] |
| **Error reporting** | ❌ | Sentry (`@sentry/browser`, framework-free), Highlight.io | Browser-only SDK, no server required |
| **Analytics** | ❌ | Plausible (privacy-first, script tag), Fathom, or vanilla GA4 snippet | |
| **SEO / sitemap** | ❌ | Write a `scripts/generate-sitemap.ts` using Bun's file APIs | MPA: trivial; SPA: needs prerendering strategy |
| **Web Vitals monitoring** | ❌ | `web-vitals` npm package (1.5 kB) | `import { onLCP, onINP, onCLS } from 'web-vitals'` |
| **Environment variables** | ✅ `--env=PUBLIC_*` flag[^1] | N/A | |
| **TailwindCSS** | ✅ `bun-plugin-tailwind`[^1] | N/A | Native plugin, zero extra config |

### DOM Testing Setup (Essential)

```bash
bun add -D @happy-dom/global-registrator
```

```typescript
// happydom.ts (preload file)
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();
```

```toml
# bunfig.toml
[test]
preload = ["./happydom.ts"]
```

Now `bun test` has full access to `document`, `window`, `customElements`, etc.[^21]

***

## 7. UI and Component Strategy

### Options Compared

| Approach | Bundle size | Accessibility | Styling freedom | Maintainability | Vanilla-compatible |
|----------|------------|---------------|-----------------|-----------------|-------------------|
| Plain HTML/CSS conventions | 0 kB | Manual | Total | Low for complex UIs | ✅ |
| Vanilla Web Components | 0 kB | Manual | Total | High | ✅ |
| Lit (Web Components library) | ~6 kB gzipped[^25] | Manual | Total | High | ✅ |
| Shoelace / Web Awesome | ~50–80 kB | ✅ Built-in ARIA | Partially via CSS vars | High | ✅ |
| Headless UI (Radix, Ark) | Varies | ✅ | Total | Medium | ⚠️ React/Vue required |
| React / Vue | 40–130 kB | Via community libs | Via CSS-in-JS | High | ❌ |

### Recommendation for Bun + Vanilla

**Start with plain HTML and CSS** for marketing pages, landing pages, and simple multi-page sites. Use semantic HTML, ARIA attributes where necessary, and CSS custom properties for theming. This approach has zero overhead and excellent performance.

**Use Lit for component-heavy apps.** Lit is the industry standard for framework-agnostic Web Components. At ~6 kB gzipped, it provides reactive properties, declarative templates with tagged template literals, and a lifecycle API. Every Lit component is a standard Custom Element — they work in plain HTML, with any framework, or none. Bun bundles Lit without any special configuration.[^26]

```typescript
// scripts/components/counter-button.ts
import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class CounterButton extends LitElement {
  @property({ type: Number }) count = 0;

  static styles = css`
    button { padding: 0.5rem 1rem; font-size: 1rem; }
  `;

  render() {
    return html`
      <button @click=${() => this.count++}>
        Clicked ${this.count} times
      </button>
    `;
  }
}

customElements.define("counter-button", CounterButton);
```

**Use Shoelace / Web Awesome for design-system components with accessibility baked in.** Shoelace is a complete, accessible Web Component library that works with plain HTML — no React/Vue required. It is expensive (50–80 kB), but suitable for admin interfaces and dashboards where accessibility matters and you do not want to implement ARIA manually.

**Avoid Radix UI, Headless UI, and similar headless libraries** — they require React or Vue and undermine the vanilla goal.

### Component Strategy Decision

- Simple content site / landing page → plain HTML + CSS, no components library
- Marketing site with some interactions → Vanilla Web Components (no external library)
- SPA dashboard → Lit (~6 kB) + your own component set
- Accessible admin/back-office → Shoelace or Web Awesome Web Components

***

## 8. Performance and SEO

### Image Strategy

Bun does not optimise images natively at build time. The recommended approach:[^4]

1. **Pre-process images offline** using a `scripts/optimise-images.ts` Bun script with `sharp`: convert JPEG/PNG → WebP + AVIF, generate responsive sizes.[^19]
2. **Use responsive markup in HTML:**
   ```html
   <picture>
     <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w">
     <source type="image/webp" srcset="hero-800.webp 800w, hero-1600.webp 1600w">
     <img src="hero-800.jpg" width="800" height="600" alt="..." loading="lazy">
   </picture>
   ```
3. For the LCP hero image, add `loading="eager"` (not lazy) and a `>` in `<head>`.

### Font Strategy

Use `font-display: swap` for all web fonts. Self-host fonts with `@font-face` rather than Google Fonts for GDPR compliance and reduced DNS lookups. Preload critical fonts:

```html
/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

### CSS/JS Budgeting

- Keep total JS below 100 kB gzipped for a small site; 250 kB for an SPA dashboard.
- Critical CSS: with a small site, Bun's bundler inlines CSS linked in `<head>` into a single file. For above-the-fold critical CSS, consider inline `<style>` tags in HTML for the first viewport's styles.
- Use `import()` dynamic imports for features that load on user interaction. Note the current splitting + CSS bug (§4) — dynamic imports of pure JS modules work; avoid dynamically importing modules that import CSS.

### Core Web Vitals Targets (2025/2026)

- **LCP ≤ 2.5s**: Preload hero image, self-host fonts, use a CDN[^23][^24]
- **INP ≤ 200ms**: Avoid long synchronous tasks; break up work with `scheduler.yield()` or `setTimeout`[^24][^23]
- **CLS ≤ 0.1**: Always specify `width` and `height` on all `<img>` and `<video>` elements[^23]

### Metadata and Structured Data

For a vanilla site, add Open Graph, Twitter cards, and JSON-LD directly in the `<head>`:

```html
<head>
  <meta property="og:title" content="My App" />
  <meta property="og:image" content="https://example.com/og.jpg" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebSite","name":"My App","url":"https://example.com"}
  </script>
</head>
```

### SPA vs. MPA for SEO

**SPAs with client-side routing have a real SEO disadvantage.** Googlebot does crawl JavaScript, but non-Google crawlers (Bing, social scrapers, Slack/Discord unfurlers) frequently do not execute JavaScript and will receive an empty shell. This matters for:

- Content pages that should rank organically
- Social sharing previews
- Link previews in messaging apps

**When to use MPA over SPA:**

- Blog, documentation, product pages, news → MPA with one `.html` per page
- Dashboard, wizard, single-tool app → SPA is fine (users arrive via authentication, not search)
- Marketing site with 5–20 pages → MPA gives clean URLs, zero client routing overhead, better SEO

With Bun, MPA is first-class. `bun ./index.html ./about.html ./pricing.html` serves all three with zero configuration. For `dist/`, `bun build ./**/*.html --minify --outdir=dist` works identically.[^1]

***

## 9. Deployment

### A. Static Deployment

**What gets deployed:** The `dist/` folder (or standalone `.html` file). Bun is not required in production — the output is static HTML, CSS, and JS that any HTTP server can serve.

**Best hosting options:**

| Host | Free tier | CDN | Custom domain/SSL | DX | Cost |
|------|-----------|-----|-------------------|----|------|
| Cloudflare Pages | ✅ Unlimited | ✅ Global edge | ✅ | Excellent | Free for most sites |
| Netlify | ✅ 100 GB/mo | ✅ | ✅ | Excellent | Free → $19/mo |
| Vercel | ✅ | ✅ | ✅ | Excellent | Free → $20/mo |
| GitHub Pages | ✅ | Partial (Fastly) | Custom domain, no auto SSL redirect | Good | Free |
| Render | ✅ Static sites | ✅ | ✅ | Good | Free[^27] |

**Cloudflare Pages is the recommended default** for Bun-built static sites: unlimited free requests and bandwidth, global edge CDN, and zero cold starts. Netlify is a strong alternative with a more mature CI/CD interface and form handling.[^28][^29][^30]

**CI/CD for static deployment:**

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun build ./src/index.html --minify --outdir=dist --env=PUBLIC_*
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          command: pages deploy dist --project-name=my-site
```

**Caching strategy for `dist/` folder:**
- `index.html`: `Cache-Control: no-cache` (browser revalidates each load)
- All hashed assets (`app-[hash].js`, `styles-[hash].css`): `Cache-Control: public, max-age=31536000, immutable`

**SPA routing:** Static hosts need a redirect rule to serve `index.html` for all paths. On Netlify, add `public/_redirects`:
```
/* /index.html 200
```
On Cloudflare Pages, add `public/_routes.json` or set up custom headers. Vercel handles this automatically for SPAs.

**Wrong choice if:** You need server-side rendering, per-request dynamic content, or serverless functions beyond simple form processing.

***

### B. Bun Server Deployment

**What gets deployed:** A Bun server process (`bun src/server.ts`) that can serve the built static files and handle API routes, SSR, or proxying. Bun is required in production.

**When to use:** When you want a Bun-native full-stack setup — a `Bun.serve()` server that serves the HTML entrypoint and also handles API requests, WebSocket connections, or lightweight SSR.

```typescript
// server.ts
Bun.serve({
  port: 3000,
  routes: {
    "/api/health": () => Response.json({ ok: true }),
  },
  // serve static files from dist/
  static: {
    "/": await Bun.file("dist/index.html"),
  },
});
```

**Best hosting options:**

| Platform | Bun support | Free tier | DX | Notes |
|----------|------------|-----------|----|-|
| Railway | ✅ Railpack auto-detects Bun[^31] | $5 trial credits | Excellent | Recommended; instant deploys[^27] |
| Render | ✅ via Docker or native buildpack | ✅ | Good | Free tier web service spins down[^27] |
| Fly.io | ✅ Docker | ✅ 3 shared VMs | Very good | Good for European edge[^32] |
| Docker + VPS | ✅ | Depends on VPS | Manual | Full control |

**Railway is the recommended Bun server host.** It uses Railpack (configured via `railway.json`) which explicitly supports Bun. Zero-config deploys from GitHub, instant deploys on push, and usage-based pricing.[^31][^27]

```json
// railway.json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": { "builder": "RAILPACK" }
}
```

**Docker for Bun:**

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun build ./src/index.html --minify --outdir=dist
EXPOSE 3000
CMD ["bun", "src/server.ts"]
```

Docker is **optional** if your PaaS supports Bun natively (Railway, Render, Fly.io). Docker is **recommended** if you need reproducible environments, multi-service Docker Compose setups, or self-hosted VPS deployment.[^33][^34]

**Wrong choice if:** Your site is purely static — adding a Bun server for a static site is unnecessary operational complexity.

***

### C. Hybrid / Edge Deployment

Cloudflare Pages Functions, Vercel Edge Functions, and Netlify Edge Functions all support a limited subset of JavaScript (no full Node.js or Bun APIs). They work for lightweight SSR, A/B testing, and request middleware, but they do not run `bun serve()` directly. Use this option when you need: server-side rendering for SEO on specific routes while keeping most pages static; personalisation at the edge; or progressive enhancement of a static site with dynamic fragments.

***

### Deployment Decision Tree

```
Is the site purely static HTML/CSS/JS (no server-side logic needed)?
├── YES → Static deployment (Cloudflare Pages recommended)
│         └── Need a single portable file? → Standalone HTML (--compile --target=browser)
│             Otherwise → dist/ folder + CDN
│
└── NO → Do you need API routes, WebSockets, or SSR?
     ├── YES + want simple PaaS → Railway (Railpack, Bun native)
     ├── YES + want containers  → Docker + Fly.io or Render
     ├── YES + edge/serverless  → Cloudflare Pages Functions / Vercel Edge
     └── YES + self-hosted VPS  → Docker + nginx reverse proxy + oven/bun image
```

***

## 10. Risks and Limitations

### Real Limitations in 2026

**1. Code splitting + CSS is buggy.**
When `--splitting` is enabled and a split chunk imports CSS, Bun converts those CSS imports to dynamic imports, causing MIME type errors in the browser. This affects apps that lazy-load feature chunks with associated stylesheets. **Workaround:** Keep CSS imports only in the main entry module, or avoid `--splitting` until the bug is fixed. *Impact: Medium. Changes recommendation for large SPAs with CSS-heavy lazy chunks.*[^3][^5]

**2. CSS Modules have TypeScript type gaps.**
When you import a `.module.css` file, TypeScript does not automatically infer the exported class names — you must manually add a declaration file or suppress the error. **Workaround:**[^35][^36]
```typescript
// css.d.ts
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```
*Impact: Low friction annoyance. Acceptable.*

**3. No native image optimisation.**
Bun does not convert, resize, or generate responsive image variants at build time. This is a feature request open on the Bun GitHub tracker and not yet on the roadmap. **Workaround:** Use `sharp` or `bun-image-turbo` in a separate build script. *Impact: Medium. You need one extra tool for image-heavy projects.*[^4]

**4. Plugin ecosystem is small compared to Vite.**
Vite has 800+ community plugins; Bun has a small handful (`bun-plugin-tailwind`, `bun-plugin-html`, a few others). For anything requiring exotic bundler transforms — MDX, WASM from custom sources, advanced SVG manipulation, Vue single-file components — Vite is more mature. *Impact: High for projects with non-standard build transforms. Low for vanilla HTML/CSS/TS projects.*[^6][^7]

**5. `bunfig.toml` plugin array bug.**
When multiple plugins are listed under `[serve.static]`, only the first plugin runs. This is a known bug. **Workaround:** Chain plugins programmatically via `Bun.build()` API. *Impact: Low for most projects. Annoying when you need two custom plugins.*[^37]

**6. HTML entrypoint HTML etag/hash not updated correctly.**
When using Bun server mode, the HTML entrypoint's ETag may not update after an asset rebuild, causing the browser to serve the cached HTML with stale asset references. **Workaround:** Add `Cache-Control: no-cache` to the HTML response header or set `immutable` only on hashed assets. *Impact: Low if headers are set correctly.*[^38]

**7. Bun is not Node.js.**
Bun has ~75% of Node.js's test suite passing and broad npm compatibility, but edge cases exist — especially with complex native addons, some older CommonJS packages, and packages that rely on Node.js internals. For most npm packages used in vanilla frontend builds, this is a non-issue. *Impact: Low for typical frontend dependency trees.*[^9]

**8. Ecosystem maturity vs. Node.js.**
Bun 1.3 (released October 2025) is a major release and the tooling is stable for production use. However, Bun does not yet have the ~15 years of battle-testing that Node.js has. For critical production servers, evaluate risk accordingly. For static builds that produce inert HTML/CSS/JS, the runtime stability question is irrelevant — Bun just runs the build script.[^39][^40]

### Acceptable Limitations (Do Not Change Recommendation)

- CSS Modules TS types gap — trivial workaround
- No native image optimisation — `sharp` fills the gap
- Small plugin ecosystem — vanilla projects rarely need exotic plugins

### Limitations That Should Change Recommendation

- CSS splitting + CSS import bug → if your SPA has large async feature chunks that each import CSS, consider Vite + Bun as runtime until the bug is fixed
- Large plugin ecosystem need → use Vite as the bundler, Bun as runtime/package manager

***

## 11. Final Recommendation by Project Type

### Small Landing Page

**Bun-only. Zero additional tooling required.**

```bash
bun init
# write index.html, styles.css, main.ts
bun ./index.html
bun build ./index.html --minify --outdir=dist
```

Deploy to Cloudflare Pages free tier. No framework, no plugin, no CI complexity. If the total asset size is under ~500 kB, consider the standalone HTML build for zero-infrastructure deployment.

***

### Polished Marketing Site (5–20 pages)

**Bun + Biome + MPA. TailwindCSS if desired.**

Use `bun ./**/*.html` for multi-page dev server. Add `bun-plugin-tailwind` if using Tailwind. Use Biome for code quality. Deploy to Cloudflare Pages with `bun build ./**/*.html --minify --outdir=dist`.

Extra: add a `scripts/optimise-images.ts` build script using `sharp` for WebP/AVIF generation. Add `web-vitals` to report Core Web Vitals in production. Structured data and Open Graph meta directly in HTML.

***

### Vanilla SPA / Dashboard-Style App

**Bun + Biome + Lit + `happy-dom` for testing.**

Use `bun ./index.html` with SPA fallback routing. Structure TS modules carefully. Use Lit for components if the component count exceeds 5–10. Avoid `--splitting` until the CSS bug is resolved — keep your bundle unsplit or split pure-JS modules only.

Test with `bun:test` + `@happy-dom/global-registrator`. Deploy either as static to Cloudflare Pages (SPA fallback rule needed), or as a Bun server to Railway if you add API routes.

*Note: If you eventually need complex dynamic imports with per-chunk CSS, evaluate Vite + Bun (Bun as runtime and package manager, Vite as bundler). The Bun docs acknowledge this path explicitly.*[^41]

***

### Multi-Page Content-Heavy Site (Blog, Docs, Product)

**Bun-only is not enough at scale. Bun + a static site generator.**

Bun's HTML entrypoint system does not have a template engine, markdown processing, or content management layer. For 50+ pages, use Bun alongside **Eleventy (11ty)** — which integrates well with Bun as the runtime — or write a minimal SSG in TypeScript using Bun's file APIs. Bun handles the TypeScript bundling; 11ty or a custom script handles HTML generation.[^42]

```bash
# Example: 11ty + Bun
bun add -D @11ty/eleventy
bunx eleventy --serve   # dev
bunx eleventy && bun build ./dist/index.html --outdir=public  # prod
```

Deploy the final static output to Cloudflare Pages or Netlify.

***

## Quick Reference: Bun CLI Commands

```bash
# Dev server
bun ./src/index.html                           # SPA (all routes → index.html)
bun ./src/**/*.html                            # MPA (route per file)
bun ./src/index.html --console                 # Bridge browser console to terminal

# Production build
bun build ./src/index.html --minify --outdir=dist
bun build ./src/index.html --minify --outdir=dist --env=PUBLIC_*

# Standalone single-file build
bun build --compile --target=browser --minify ./src/index.html --outdir=dist

# Testing
bun test
bun test --watch
bun test --coverage

# Package management
bun install
bun add <pkg>
bun add -D <pkg>
bun update --interactive

# Code quality
bunx biome check --apply .
bunx tsc --noEmit
```

---

## References

1. [bun: docs/bundler/html-static.mdx](https://fossies.org/linux/bun/docs/bundler/html-static.mdx)

2. [Bun Introduces Built-in Database Clients and Zero-Config Frontend ...](https://www.infoq.com/news/2026/01/bun-v3-1-release/) - Bun 1.3 revolutionizes full-stack JavaScript development with unified database APIs and zero-config ...

3. [Bun.build converts CSS imports to dynamic imports when splitting is ...](https://github.com/oven-sh/bun/issues/20783) - When using Bun.build with splitting: true, static CSS imports are incorrectly converted to dynamic i...

4. [Native out of the box image optimization support via Bun just like ...](https://github.com/oven-sh/bun/issues/29841) - 1. Format conversion. Auto-convert images to WebP / AVIF · 2. Resizing & responsive output. Resize t...

5. [Broken CSS Modules when code splitting enabled #18244 - GitHub](https://github.com/oven-sh/bun/issues/18244) - To reproduce the bug you need to build at least two entrypoints, imported CSS Modules and enabled co...

6. [Cool! Why do you need both Bun and Vite? - Hacker News](https://news.ycombinator.com/item?id=43811930) - Bun is faster & has better package management, but the build is only suitable for very basic use cas...

7. [Bun vs Vite (2026) - PkgPulse](https://www.pkgpulse.com/compare/bun-vs-vite) - Vite 8 + Rolldown closes the speed gap with Bun's bundler. Compare build benchmarks, HMR latency, Re...

8. [Install TypeScript declarations for Bun](https://bun.com/docs/guides/runtime/typescript)

9. [Bun 2.0: The Fastest-Growing JS Runtime in 2025 - LinkedIn](https://www.linkedin.com/posts/arinze-obieze_javascript-webdev-bun-activity-7392559235974213632-o619) - Bun 2.0 is coming — and it's about to change everything. Here's the full breakdown of why Bun is the...

10. [CSS - Bun](https://bun.com/docs/bundler/css) - Bun's bundler has built-in support for CSS with the following features: Transpiling modern/future fe...

11. [bun: docs/bundler/css_modules.md](https://fossies.org/linux/bun/docs/bundler/css_modules.md)

12. [Biome, toolchain of the web](https://biomejs.dev) - Biome is a fast formatter for JavaScript, TypeScript, JSX, TSX, JSON, HTML, CSS and GraphQL. Try the...

13. [TypeScript Development First Steps with Bun and Modern Tooling](https://dappgenie.io/blogs/typescript-development-first-steps-with-bun-and-modern-tooling) - A comprehensive guide to getting started with TypeScript development using Bun runtime, modern linti...

14. [Migrating A JavaScript Project from Prettier and ESLint to BiomeJS](https://blog.appsignal.com/2025/05/07/migrating-a-javascript-project-from-prettier-and-eslint-to-biomejs.html) - In this article, I'll introduce the BiomeJS project, explore its setup, and help you decide if migra...

15. [bun/docs/bundler/standalone-html.mdx at main · oven-sh/bun · GitHub](https://github.com/oven-sh/bun/blob/main/docs/bundler/standalone-html.mdx) - Incredibly fast JavaScript runtime, bundler, test runner, and package manager – all in one - bun/doc...

16. [The Bun Bundler | Bun Blog](https://bun.com/blog/bun-bundler) - Bun's fast native bundler is now in beta. It can be used via the bun build CLI command or the new Bu...

17. [Adding `bun-types` causes typescript to ignore `lib: ['dom']` · Issue #463 · oven-sh/bun](https://github.com/oven-sh/bun/issues/463) - Incredibly fast JavaScript runtime, bundler, test runner, and package manager – all in one - Issue ·...

18. [@types/bun not picking up "DOM" from TSConfig · Issue #7821 · oven-sh/bun](https://github.com/oven-sh/bun/issues/7821) - What version of Bun is running? 1.0.20+09d51486e What platform is your computer? Darwin 23.1.0 arm64...

19. [sharp - npm](https://www.npmjs.com/package/sharp) - This high speed Node-API module is to convert large images in common formats to smaller, web-friendl...

20. [Built a Sharp Alternative That's 36x Faster - And It Works with Both ...](https://dev.to/aissam_af7e3548e20435d720/built-a-sharp-alternative-thats-36x-faster-and-it-works-with-both-bun-and-nodejs-395o) - I built bun-image-turbo , a Rust-powered image processing library that outperforms Sharp in most ben...

21. [DOM testing – Test runner](https://bun.sh/docs/test/dom)

22. [Using Testing Library with Bun](https://bun.com/docs/guides/test/testing-library)

23. [Core Web Vitals 2025 – New Benchmarks And How To Pass Every ...](https://www.enfuse-solutions.com/core-web-vitals-2025-new-benchmarks-and-how-to-pass-every-test/) - Core Web Vitals are a set of metrics Google uses to evaluate real-world user experience , and they i...

24. [Understanding Core Web Vitals and Google search results](https://developers.google.com/search/docs/appearance/core-web-vitals) - Core Web Vitals is a set of metrics that measure real-world user experience for loading performance,...

25. [Lightning-fast templates and Web Components - lit-html & LitElement](https://developer.chrome.com/blog/lit-element-and-lit-html) - lit-html and LitElement bring fast, lightweight templates and interoperable components to the modern...

26. [Lit](https://lit.dev) - Simple. Fast. Web Components.

27. [Railway vs Render in 2026 - MG Software](https://www.mgsoftware.nl/en/vergelijking/railway-vs-render) - Render offers a generous free tier, predictable monthly costs, and a broader range of service types ...

28. [Vercel vs Netlify vs Cloudflare Pages: 2025 Comparison for ...](https://www.ai-infra-link.com/vercel-vs-netlify-vs-cloudflare-pages-2025-comparison-for-developers/) - For example, a static site with minimal build requirements can benefit from Cloudflare Pages' fast b...

29. [Cloudflare Pages](https://pages.cloudflare.com) - Cloudflare Pages makes it dead simple to deploy our static websites and to collaborate within our te...

30. [Render vs Railway for hosting - which one's actually better for static ...](https://www.reddit.com/r/statichosting/comments/1nwkcbg/render_vs_railway_for_hosting_which_ones_actually/) - I know these are more backend-focused but both do static sites now. Render's free tier seems solid a...

31. [Deploy a Bun application on Railway](https://bun.com/docs/guides/deployment/railway) - Deploy Bun applications to Railway with this step-by-step guide covering CLI and dashboard methods, ...

32. [Build fast. Run any code fearlessly. · Fly](https://fly.io) - Fly.io is the platform that gets out of your way, running on the infrastructure that lets you run an...

33. [Bun - Docker Docs](https://docs.docker.com/guides/bun/) - Containerize and develop Bun applications using Docker.

34. [Containerize a Bun application](https://docs.docker.com/guides/bun/containerize/) - Learn how to containerize a Bun application.

35. [CSS Modules are not recognized as TypeScript modules · Issue #18259 · oven-sh/bun](https://github.com/oven-sh/bun/issues/18259) - What version of Bun is running? 1.2.5+013fdddc6 What platform is your computer? Darwin 24.1.0 arm64 ...

36. [CSS Modules not working when using HTMLBundle via Bun.serve() · Issue #18258 · oven-sh/bun](https://github.com/oven-sh/bun/issues/18258) - What version of Bun is running? 1.2.5+013fdddc6 What platform is your computer? Darwin 24.1.0 arm64 ...

37. [[serve.static] config in bunfig.toml on runs the first custom plugin in ...](https://github.com/oven-sh/bun/issues/25269) - What version of Bun is running? 1.2.23. What platform is your computer? Darwin 25.1.0 arm64 arm. Wha...

38. [Bun.build does not update hash/etag for HTML entrypoint ... - GitHub](https://github.com/oven-sh/bun/issues/23009) - This causes the browser to load the cached HTML file containing the old asset names, leading to 404s...

39. [Bun in 2025: Critical Evaluation of an Alternative JavaScript Runtime](https://angelo-lima.fr/en/bun-2025-critical-evaluation-javascript-runtime-alternative/) - Bun has reached a maturity level in 2025 that positions it beyond experimental tool status. It now r...

40. [Bun 1.3 | Bun Blog](https://bun.com/blog/bun-v1.3) - Bun 1.3 introduces zero-config frontend development, unified SQL API, built-in Redis client, securit...

41. [Build a frontend using Vite and Bun](https://bun.com/docs/guides/ecosystem/vite) - You can use Vite with Bun, but many projects get faster builds & drop hundreds of dependencies by sw...

42. [Static Site Generation with 11ty and Bun : r/webdev - Reddit](https://www.reddit.com/r/webdev/comments/1l4xcgf/static_site_generation_with_11ty_and_bun/) - 11ty is a very elegant system for creating static sites in super simple ways like just creating mark...

