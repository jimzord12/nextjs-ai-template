# Web Awesome + Bun: Expert Guide to Vanilla Web Development in 2026

***

## 1. Executive Recommendation

**Web Awesome is a strong fit for a Bun-first vanilla website — but use it selectively and strategically.** The library is the direct successor to Shoelace, built on stable web standards (custom elements, Shadow DOM, CSS custom properties), ships a polished 50+ component set, and works with zero framework overhead. The best integration approach for a Bun-first project is: install `@awesome.me/webawesome` via `bun add`, use the `dist/` directory (not `dist-cdn/`) so Bun's bundler can optimize dependencies, cherry-pick components on a per-file basis, serve the theme CSS via a `>` tag, and call `setBasePath()` once in your main entry point. Apply Web Awesome broadly for interactive UI — dialogs, drawers, menus, selects, tabs, forms, and overlays — where it genuinely saves hundreds of lines of tricky JavaScript. Reserve native HTML/CSS for layouts, typography, headings, paragraphs, images, and any component where a `<button>` or `<input>` would serve just as well. Avoid overloading simple marketing pages with the full component library; the bundle cost only justifies itself when enough interactive complexity is present.[^1][^2]

***

## 2. What Web Awesome Is

### Origin and Relationship to Shoelace

Web Awesome is the official successor to Shoelace, the most popular free and open-source web components library. Shoelace's creator, Cory LaViska, joined Font Awesome in 2022, and the project was subsequently renamed and expanded. The tag prefix changed from `sl-` to `wa-`, and the library grew to over 50 components, plus layout patterns, typography utilities, and a multi-layer theming system. The migration path from Shoelace 2 is largely mechanical — renaming prefixes and updating a handful of renamed attributes.[^2][^3][^1]

### Technical Architecture

Web Awesome is fundamentally a collection of **custom elements** (W3C standard) built with **Lit**, a thin reactive base class from Google. Each component is a class extending `LitElement`, which itself extends `HTMLElement`. The browser registers each component through `customElements.define()`, after which the custom tag behaves as a first-class HTML element. Shadow DOM encapsulates internal structure and styles, making components immune to accidental CSS bleed.[^4][^5][^6][^2]

Lit is an implementation detail, not a public API surface — consumers use Web Awesome components exactly like native HTML elements. The library is "framework-agnostic" in a meaningful sense: no adapter layers, no synthetic event systems, no virtual DOM. Web Awesome components work identically in React, Vue, Angular, Svelte, or plain HTML/JS files. This is the core architectural promise of standards-based web components.[^7][^8][^2]

### Consuming in Plain HTML

Usage is as minimal as:

```html
/dist/styles/themes/default.css" />
<script type="module" src="/dist/webawesome.loader.js"></script>

<wa-button variant="brand">Click me</wa-button>
```

No JSX, no framework, no build step required for basic use.[^2]

***

## 3. How Web Awesome Works at Runtime

### Custom Element Registration

When you import a Web Awesome component file, the module calls `customElements.define('wa-button', WaButton)` internally. Until `define()` is called, the browser treats `<wa-button>` as an unknown HTML element — it renders in the DOM, but has no behavior, styles, or shadow root. This is the root cause of FOUCE.[^5]

### Attributes vs. Properties

Web Awesome components follow the standard Lit convention: HTML attributes (strings) reflect to JavaScript properties (typed). Setting `<wa-button size="small">` is equivalent to `el.size = 'small'`. Boolean attributes like `disabled` follow the HTML convention — presence means `true`, absence means `false`. You **cannot** self-close custom element tags: `<wa-input />` is invalid; `<wa-input></wa-input>` is required.[^8]

### Events

Standard DOM events (`click`, `focus`, `blur`) work normally. Web Awesome also emits lifecycle-specific custom events prefixed with `wa-` — for example, `wa-after-show`, `wa-after-hide`, `wa-after-expand`, and `wa-close`. As of alpha.10, core form events (`input`, `change`, `blur`, `focus`) were standardized to native event names without the `wa-` prefix, allowing components to work naturally with native event delegation.[^9][^8]

```typescript
const dialog = document.querySelector<WaDialog>('wa-dialog')!;
dialog.addEventListener('wa-after-show', () => console.log('dialog opened'));
```

### Methods, Slots, and Rendering

Components expose imperative methods (e.g., `focus()`, `show()`, `hide()`) that can be called directly on the element reference. Named slots are populated using the `slot` attribute on children; slot position in source order is irrelevant.[^8]

Lit batches property updates into a single microtask before re-rendering. This means setting a property and immediately reading its reflected attribute in the next statement will appear stale. To interact with an element after a property mutation, await `updateComplete`:[^10]

```typescript
const checkbox = document.querySelector('wa-checkbox') as WaCheckbox;
checkbox.checked = true;
await checkbox.updateComplete;
console.log(checkbox.hasAttribute('checked')); // true
```

### Registration Timing Utilities

`customElements.whenDefined('wa-button')` returns a promise that resolves when the named element class has been registered. Web Awesome provides a higher-level utility:[^11]

```typescript
import { allDefined } from '@awesome.me/webawesome/dist/webawesome.js';
await allDefined(); // waits for all wa-* elements in the document
```

`allDefined()` accepts options for `root`, `match`, and `additionalElements` to scope or extend which elements to wait for. This is the correct pattern to use before attaching event listeners to forms or before calling methods on components loaded asynchronously.[^8]

***

## 4. Installation and Loading Strategies

### Strategy Comparison

| Strategy | Setup | Bundle Size | DX | Dev | Production |
|---|---|---|---|---|---|
| **CDN (Project)** | 1 script tag | Full library CDN-cached | Good | ✅ Great | ⚠️ CDN dependency |
| **CDN (jsDelivr)** | 2 tags (CSS + JS) | Full library CDN-cached | Okay | ✅ Fast | ⚠️ CDN dependency, version pin needed |
| **npm + autoloader** | `bun add`, import loader | Lazy per component | Good | ✅ Great | ✅ Self-hosted |
| **npm + cherry-pick** | `bun add`, per-component import | Only used components | Best | ⚠️ More imports | ✅ Optimal |

**CDN (Web Awesome Project):** The official "project" CDN gives you a single `<script>` tag that auto-configures your chosen version, theme, and Font Awesome kit. This is the fastest to set up and ideal for prototyping, but it creates a hard external dependency and limits control over asset caching headers.[^12]

**npm + autoloader:** Installing `@awesome.me/webawesome` and loading `webawesome.loader.js` gives you lazy, on-demand component loading — the autoloader watches the DOM for unregistered `wa-` elements and dynamically imports them. This is excellent for development and works in production, but every component is an HTTP request and true tree-shaking isn't applied.[^13]

**npm + cherry-pick (recommended for Bun production builds):** Explicitly import only the components used, from the `/dist/` path. This allows Bun to resolve and bundle dependencies efficiently, sharing Lit runtime code across components:[^12]

```typescript
import '@awesome.me/webawesome/dist/styles/themes/default.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/input/input.js';
```

**Recommended default for Bun projects:** Use cherry-picked npm imports with Bun's HTML entrypoint bundler for production. Use the autoloader during development for iteration speed, then switch to explicit imports before building.

***

## 5. Using Web Awesome with Bun

### Project Setup

```bash
# Create project and install Web Awesome
mkdir my-wa-site && cd my-wa-site
bun init -y
bun add @awesome.me/webawesome
```

### HTML Entrypoint Workflow

Bun has first-class HTML bundling support — just point `bun` at your `index.html`. All `<script type="module">` tags and `>` tags are bundled and processed automatically, including TypeScript transpilation and CSS bundling:[^14]

```bash
# Development server (hot reload)
bun ./index.html

# Production build
bun build ./index.html --outdir=dist --minify
```

Your `index.html` can reference TypeScript directly:

```html
<!doctype html>
<html class="wa-cloak">
  <head>
    /src/styles/themes/default.css" />
    /src/styles/main.css" />
    <script type="module" src="./src/main.ts"></script>
  </head>
  <body>
    <wa-button variant="brand">Hello</wa-button>
  </body>
</html>
```

### TypeScript Entry Point

```typescript
// src/main.ts
import { setBasePath, allDefined } from '@awesome.me/webawesome/dist/webawesome.js';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';

// Required: tell WA where to find icon/asset files
setBasePath('/node_modules/@awesome.me/webawesome/dist');

// Optional: wait for all WA elements on page before binding logic
await allDefined();
```

### dist/ vs dist-cdn/

The npm package ships two directories:[^12]

- **`dist/`** — dependencies are separate modules, bundler-friendly. Use this with Bun.
- **`dist-cdn/`** — all dependencies bundled together, suitable for direct browser loading or CDN use.

When bundling with Bun, always use `dist/`. Using `dist-cdn/` with a bundler duplicates Lit and other shared dependencies in the output.

### CSS Handling

Bun's CSS bundler natively handles `import './styles.css'` from TypeScript files and `@import` inside CSS files. CSS from `node_modules` path imports works correctly. Bun will extract and bundle all imported CSS into a single per-entrypoint `.css` file alongside the compiled JS. One known caveat: when using `splitting: true` in `Bun.build`, CSS imports may be incorrectly converted to dynamic imports; prefer `splitting: false` unless you test the behavior in your Bun version.[^15][^16][^14]

### setBasePath Requirement

Web Awesome uses a base path to resolve icon SVGs and other assets. You must call `setBasePath()` before components load, or icons will 404. The safest way for a bundled project is to copy `node_modules/@awesome.me/webawesome/dist/assets` into your output directory and point `setBasePath()` at the correct public path. For Bun builds, you can automate this with a `postbuild` script:[^12]

```bash
# package.json scripts
"build": "bun build ./index.html --outdir=out --minify",
"postbuild": "cp -r node_modules/@awesome.me/webawesome/dist/assets out/assets"
```

### Recommended Folder Layout

```
my-wa-site/
├── index.html
├── src/
│   ├── main.ts           # WA imports, setBasePath, allDefined
│   ├── pages/            # Per-page modules
│   │   └── home.ts
│   ├── components/       # Your own vanilla TS modules (not WA)
│   │   └── navbar.ts
│   └── styles/
│       ├── main.css      # Brand/global styles, imports WA theme
│       └── tokens.css    # Override --wa-* custom properties
├── public/
│   └── assets/           # Icons, images
├── bun.lockb
├── package.json
└── tsconfig.json
```

***

## 6. Styling and Theming

### Three-Layer Customization System

Web Awesome's theming operates at three distinct levels using only standard CSS:[^17][^2]

**Layer 1 — Global design tokens (`:root`):** All theme-wide values live as CSS custom properties prefixed with `--wa-`. Colors, typography, spacing, shadows, border radii, and more:[^17]

```css
:root {
  --wa-color-brand: oklch(60% 0.22 250);
  --wa-border-radius-medium: 0.375rem;
  --wa-font-family-base: 'Inter', system-ui, sans-serif;
}
```

**Layer 2 — Component-scoped properties:** Each component exposes its own scoped custom properties that don't carry the `--wa-` prefix:[^17]

```css
wa-button {
  --border-width: 2px;
  --height: 2.75rem;
}
```

**Layer 3 — CSS parts (`::part()`):** For full style freedom, target any named part of a component's shadow DOM:[^17]

```css
wa-button.brand-cta::part(base) {
  background: linear-gradient(135deg, var(--wa-color-brand), oklch(50% 0.25 300));
  font-weight: 700;
  letter-spacing: 0.04em;
}
```

### Dark Mode

Web Awesome handles dark mode through theme classes and `prefers-color-scheme`. Components automatically adapt when you apply `.wa-dark` to `<html>` or `<body>`, or via media query. CSS custom properties are inheritable across shadow roots, making them an effective design token system for light/dark variants.[^18][^19]

### Achieving a Custom Brand Feel

The default theme is polished but generic. For a custom brand:

1. Override `--wa-color-brand-*` tokens to match your brand palette.
2. Adjust `--wa-border-radius-*` tokens for your desired roundness.
3. Set `--wa-font-family-base` and `--wa-font-family-heading` to your typeface stack.
4. Use `::part()` selectively for components where the default shape needs significant rework.

Because CSS custom properties cascade through shadow roots, you can define tokens once in `:root` and they apply across all components — no preprocessor required.[^20]

***

## 7. FOUCE and Loading Behavior

### What FOUCE Is

FOUCE — Flash of Undefined Custom Elements — occurs when the browser renders HTML containing `<wa-button>` before the JavaScript defining that element has executed. The element appears as an unstyled block, then jumps into its styled state, causing a jarring flash.[^21]

### The `wa-cloak` Solution

Web Awesome provides a `wa-cloak` CSS class that hides cloaked elements until their dependencies are registered. Apply it to `<html>` for full-page cloaking:[^21][^9]

```html
<html class="wa-cloak">
```

The autoloader removes `wa-cloak` automatically once all `wa-*` elements in the document are registered — or after a 2-second timeout to prevent permanent blank screens. Component-level `wa-cloak` is also possible for targeted suppression.[^21]

### Autoloader vs. Cherry-Pick Timing

With the **autoloader**, components are loaded lazily when they appear in the DOM. The FOUCE window is inherently larger because each component's module must be fetched before it registers. With **cherry-picked imports** bundled into a single JS file, all component registrations happen in one network round-trip, drastically shrinking the FOUCE window.[^13]

For production builds with Bun, cherry-picked bundled imports plus `<html class="wa-cloak">` is the cleanest approach.

### Turbo / Navigation FOUCE

For multi-page applications using Turbo or similar SPA-style navigation, import the `preventTurboFouce` middleware to re-cloak pages during navigation until components re-register:[^21]

```typescript
import { preventTurboFouce } from '@awesome.me/webawesome/dist/webawesome.js';
preventTurboFouce();
```

### SEO Implications

Server-rendered HTML contains the full custom element markup regardless of JavaScript. Search engines can crawl the markup. However, since Shadow DOM content is generated by JavaScript, rich component internals (text in slots, dynamic labels) may not be indexed. For SEO-critical text, keep it in light DOM (the element's regular children), not exclusively in shadow DOM internals.[^2]

***

## 8. Component Usage Patterns

### Declarative HTML Usage

The simplest and most maintainable pattern — works with zero JavaScript:

```html
<wa-card>
  <h3 slot="header">Pricing</h3>
  <p>Standard plan includes 10 GB storage.</p>
  <wa-button slot="footer" variant="brand">Get Started</wa-button>
</wa-card>
```

### Imperative JS Usage

For behavior you must do in script, wait for component definition first:[^8]

```typescript
await customElements.whenDefined('wa-dialog');
const dialog = document.querySelector<WaDialog>('#confirm-dialog')!;
document.querySelector('#open-btn')!.addEventListener('click', () => {
  dialog.open = true;
});
dialog.addEventListener('wa-after-hide', () => console.log('closed'));
```

### Form Handling

Web Awesome form controls (`wa-input`, `wa-select`, `wa-checkbox`, `wa-radio-group`, `wa-textarea`, `wa-switch`) integrate with the browser's native `FormData` API — they inject their values when the containing `<form>` fires the `formdata` event. Always attach form submit listeners **after** components are registered, or WA's internal `formdata` handlers won't have run first:[^22]

```typescript
await allDefined();
document.querySelector('form')!.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target as HTMLFormElement);
  // WA controls appear in FormData correctly
});
```

### High-Value Components

**Dialog/Drawer:** Fully keyboard-managed, focus-trapped, and ARIA-compliant out of the box. These alone justify using WA — building accessible dialogs from scratch is 150+ lines of tricky JS:[^23]

```html
<wa-dialog id="my-dialog" label="Confirm Action">
  <p>Are you sure?</p>
  <wa-button slot="footer" data-dialog="close">Cancel</wa-button>
  <wa-button slot="footer" variant="danger">Delete</wa-button>
</wa-dialog>
<wa-button onclick="document.getElementById('my-dialog').open = true">Open</wa-button>
```

**Select/Combobox:** Accessible listbox with keyboard navigation, multi-select, and search — vastly superior to native `<select>` for custom-styled UIs.

**Tab Group:** Full keyboard navigation, ARIA roles, and orientation support.

**Tooltip/Popover:** Positioning engine handles viewport overflow, arrow rendering, and keyboard focus. Do not try to recreate this.

**Carousel/Animated Image:** Genuinely complex state; worth the overhead.

### What Not to Do

- Do not use self-closing tags: `<wa-input />` is invalid HTML for custom elements.[^8]
- Do not assume WA components share exact APIs with native counterparts — `<wa-button>` defaults `type` to `"button"`, not `"submit"` like `<button>`.[^8]
- Do not mutate a property and synchronously read its reflected attribute — await `updateComplete` first.[^8]
- Do not call methods on WA elements before `customElements.whenDefined()` resolves.[^8]
- Do not import from a single index barrel — cherry-pick instead.[^24]

***

## 9. TypeScript Ergonomics

### Package-Provided Types

The `@awesome.me/webawesome` npm package ships multiple type artifacts:[^12][^8]

- `dist/custom-elements-jsx.d.ts` — JSX intrinsic types for React 19+
- `dist/vscode.html-custom-data.json` — VS Code HTML IntelliSense
- `web-types.json` — JetBrains web-types for WebStorm/IntelliJ

### VS Code Setup

Create `.vscode/settings.json`:

```json
{
  "html.customData": [
    "./node_modules/@awesome.me/webawesome/dist/vscode.html-custom-data.json"
  ]
}
```

This enables attribute autocomplete, documentation tooltips, and tag name completion for all Web Awesome components in HTML files.[^8]

### JetBrains Setup

Add to `package.json`:[^8]

```json
{
  "web-types": "./node_modules/@awesome.me/webawesome/web-types.json"
}
```

JetBrains IDEs auto-detect and apply component types immediately.

### Typing Element References in Vanilla TS

`document.querySelector()` returns `Element | null` — useless for component-specific properties. Use typed assertions:

```typescript
import type { WaDialog } from '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import type { WaInput } from '@awesome.me/webawesome/dist/components/input/input.js';

const dialog = document.querySelector<WaDialog>('wa-dialog')!;
const input = document.querySelector<WaInput>('#email-input')!;

dialog.open = true;         // ✅ typed
input.value;                // ✅ typed
await input.updateComplete; // ✅ from LitElement
```

### Augmenting HTMLElementTagNameMap

For tighter integration — especially in utility functions that accept tag name strings — extend the global map:

```typescript
import type { WaButton } from '@awesome.me/webawesome/dist/components/button/button.js';
import type { WaDialog } from '@awesome.me/webawesome/dist/components/dialog/dialog.js';

declare global {
  interface HTMLElementTagNameMap {
    'wa-button': WaButton;
    'wa-dialog': WaDialog;
  }
}

// Now document.querySelector('wa-button') returns WaButton
```

### Known Friction Points

- `updateComplete` is typed on `LitElement` but the return type is `Promise<boolean>` — safe to `await` or `.then()`.
- Custom events have a generic `CustomEvent<unknown>` type at the DOM level; to get typed `detail`, you need to cast: `(e as CustomEvent<{ value: string }>).detail`.
- VS Code HTML custom data provides attribute hints in HTML files, but TypeScript typing for attributes only appears when using element references, not HTML template strings.

***

## 10. Performance Implications

### Bundle Size Reality

Each Web Awesome component is a reasonably sized JS module (~5–25 KB minified + gzipped), backed by a shared Lit runtime (~6 KB gzipped). Cherry-picking 10 components will result in roughly 80–180 KB of gzipped JS depending on complexity. The Lit runtime is shared across all components, so the marginal cost of each additional component decreases.[^25]

The `dist/` bundler path allows Bun to deduplicate the Lit runtime — a meaningful saving vs. the `dist-cdn/` path which bundles Lit into each component file independently.

### Autoloader vs. Manual Imports for Performance

| Approach | Initial Bundle | Per-Component Cost | Tree-Shaking | Suitable For |
|---|---|---|---|---|
| Autoloader | ~8 KB loader | Lazy HTTP per component | None | Prototyping, large sites with many components |
| Cherry-pick + bundle | All imported upfront | Amortized Lit runtime | Effective | Production, smaller sites |
| Full bundle (`webawesome.js`) | All ~200–400 KB | Zero additional | None | Rare; avoid |

Tree-shaking Web Awesome is only effective at the per-file import level. Importing from a barrel entry point prevents any dead code elimination.[^24]

### Core Web Vitals Implications

- **LCP:** WA doesn't help or hurt LCP by itself — content in light DOM slots (not shadow DOM) is parsed immediately. But blocking JS on the critical path delays rendering. Move WA imports to non-render-blocking module scripts (async/deferred, which `type="module"` is by default).[^26]
- **CLS:** FOUCE is a direct CLS threat. Unstyled custom elements collapsing into styled ones cause layout shifts. Use `wa-cloak` to prevent this.[^21]
- **INP:** WA form controls and interactive components are React-speed optimized via Lit's microtask batching. INP should not be adversely affected for typical UI interactions.

### When to Skip Web Awesome

- Static text pages, landing pages with no interactive UI
- Components with native equivalents that don't require custom styling (bare `<details>`, `<select>`, `<button>`, `<input type="checkbox">`)
- Any page where you'll ship fewer than 3 WA components — the JS cost isn't justified

***

## 11. Accessibility

### Built-in Accessibility Story

Web Awesome is accessibility-oriented by design. Every component includes:[^2][^8]

- Correct ARIA roles, states, and properties
- Full keyboard navigation (Tab, Arrow keys, Enter, Space, Escape)
- Focus management for dialogs, drawers, and overlays (focus trapping)
- Screen reader announcements for live regions and status changes
- High-contrast mode support (`@media (forced-colors: active)`) per component styles

As of version 3.0.0-beta.3, screen reader hint announcement was fixed for form controls (`wa-input`, `wa-select`, `wa-checkbox`, `wa-radio-group`, `wa-switch`, `wa-textarea`), and `wa-animated-image` was updated so keyboard users can focus and toggle animations.[^9]

### Developer Responsibilities

Web Awesome does **not** fully automate accessibility. Remaining responsibilities:

- **Labels:** Always provide meaningful `label` attributes on form controls (`<wa-input label="Email address">`). An unlabeled form control is inaccessible regardless of ARIA defaults.
- **Form semantics:** Wrap related controls in `<fieldset>` + `egend>` when grouping. WA's `<wa-radio-group>` handles internal grouping semantics, but your outer page structure still matters.
- **Dialog trigger labeling:** `<wa-dialog label="Confirm Deletion">` — the label attribute is the accessible name announced to screen readers.[^23]
- **Icon-only buttons:** Use the `label` attribute on `<wa-button>` when no visible text exists.
- **Tab order:** Do not manipulate `tabindex` casually around WA components; WA manages focus delegation internally.
- **Custom content in slots:** Content you place in slots is your responsibility. Decorative images need `alt=""`.

***

## 12. Which Components Are Worth Using

### Best Use Cases

These components provide features that are genuinely hard to build correctly from scratch:

| Component | Why It's Worth It |
|---|---|
| `wa-dialog` | Focus trapping, `Escape` key, backdrop dismiss, ARIA `role="dialog"`, animation |
| `wa-drawer` | Same as dialog but for side panels — declarative open/close |
| `wa-select` | Custom-styled listbox with keyboard nav, multi-select, search, tags |
| `wa-tab-group` | ARIA-correct tablist, keyboard nav, animated ink indicator |
| `wa-tooltip` | Viewport-aware positioning engine, delay management |
| `wa-dropdown` | Smart popup positioning, submenu support, keyboard nav |
| `wa-popover` | Floating UI-style anchored content without the setup overhead |
| `wa-color-picker` | Full sRGB/HSL color picker — thousands of lines if you DIY |
| `wa-carousel` | Lazy-loaded slides, touch support, accessible prev/next |
| `wa-tree` | Recursive expandable tree with lazy loading |
| `wa-combobox` (Pro) | Filterable select with async search |

### Okay Use Cases

Worth using but have strong native alternatives:

| Component | Consideration |
|---|---|
| `wa-button` | Consistent cross-browser styling is its main value; native `<button>` + CSS works equally well |
| `wa-input` | Consistent label placement and hint/error slots are nice, but native `<input>` + CSS labels are viable |
| `wa-card` | Essentially a `<div>` with slots; useful for design consistency, not functionality |
| `wa-badge`, `wa-tag` | Convenience styling; trivial to replicate |
| `wa-progress-bar`, `wa-spinner` | Simple enough to DIY, but WA's ARIA compliance is a bonus |

### Avoid Unless Truly Needed

| Component | Reason |
|---|---|
| `wa-avatar` | A styled `<img>` or initials `<div>` — unnecessary overhead |
| `wa-format-date`, `wa-relative-time` | Use `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` directly in TS |
| `wa-qr-code` | Only needed if you actually need QR codes |
| `wa-animated-image` | Extremely niche |
| `wa-icon` alone | Only justified if using Font Awesome kit; otherwise use SVG directly |

***

## 13. Recommended Architecture for a Bun + Web Awesome Site

### Opinionated Folder Structure

```
my-wa-site/
├── index.html               # Primary HTML entrypoint
├── about.html               # Additional pages (MPA support)
├── src/
│   ├── main.ts              # WA initialization, setBasePath, allDefined
│   ├── wa.ts                # All WA component imports (single place)
│   ├── pages/               # Page-specific JS modules
│   │   ├── home.ts
│   │   └── contact.ts
│   ├── components/          # Your own vanilla TS UI helpers
│   │   ├── modal-manager.ts
│   │   └── form-handler.ts
│   └── styles/
│       ├── main.css         # Global layout, typography, @import tokens
│       ├── tokens.css       # --wa-* overrides for brand customization
│       ├── components/      # Per-native-element CSS (not WA)
│       │   └── nav.css
│       └── themes/
│           └── default.css  # Symlink or copy from node_modules
├── public/
│   └── assets/              # Static images, fonts, icons
├── out/                     # Production build output (gitignored)
├── .vscode/
│   └── settings.json        # WA custom data for HTML IntelliSense
├── bunfig.toml
├── tsconfig.json
└── package.json
```

### WA Import Strategy

Centralize all Web Awesome imports in a single file (`src/wa.ts`). This avoids scattered imports, simplifies tree-shaking analysis, and makes it easy to audit what's included in the bundle:

```typescript
// src/wa.ts — the single source of truth for WA components
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/select/select.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/drawer/drawer.js';
import '@awesome.me/webawesome/dist/components/tab-group/tab-group.js';
import '@awesome.me/webawesome/dist/components/tab/tab.js';
import '@awesome.me/webawesome/dist/components/tab-panel/tab-panel.js';
```

```typescript
// src/main.ts
import { setBasePath, allDefined } from '@awesome.me/webawesome/dist/webawesome.js';
import './wa.js';

setBasePath('/assets/webawesome');
await allDefined();

// Now safe to bind all page-level JavaScript
import('./pages/home.js');
```

### CSS Organization

Keep WA token overrides in `tokens.css`, imported before any component-specific styles. This ensures design token overrides cascade through all components:

```css
/* src/styles/tokens.css */
:root {
  --wa-color-brand: oklch(58% 0.22 250);
  --wa-font-family-base: 'Inter Variable', sans-ui, sans-serif;
  --wa-border-radius-medium: 0.5rem;
}
```

### Mixing Native and WA

The rule: use native HTML/CSS for layout structure (grid, flexbox, `<main>`, `<section>`, `<header>`, `<nav>`, `<footer>`) and native text elements (headings, paragraphs, lists, links). Use Web Awesome where behavior complexity exceeds what CSS alone can deliver. This keeps WA from becoming a dependency for things it adds no value to.

***

## 14. Deployment Considerations

### Production Build

```bash
# Build all HTML pages and their assets
bun build ./index.html ./about.html --outdir=out --minify

# Or using Bun's API for advanced config (build.ts)
await Bun.build({
  entrypoints: ['./index.html'],
  outdir: './out',
  minify: true,
});
```

Output in `out/` is fully static HTML, CSS, and JS — **no Bun runtime is needed in production**. This is pure static output, deployable to any CDN.[^14]

### Asset Pipeline

After build, copy Web Awesome's icon/asset files:

```bash
cp -r node_modules/@awesome.me/webawesome/dist/assets out/assets/webawesome
```

Update your `setBasePath()` call to match the deployed path:

```typescript
setBasePath('/assets/webawesome');
```

Alternatively, configure Bun's `publicPath` and file copying in a custom build script to automate this.

### CDN Caching

Since Bun hashes output filenames (e.g., `app-[HASH].js`), you can serve JS and CSS with long-lived cache headers (`Cache-Control: max-age=31536000, immutable`). HTML files should use `no-cache` or short TTLs since they reference the hashed assets.[^14]

### Standalone HTML

Bun supports compiling the entire frontend into a **single self-contained HTML file** with all JS, CSS, and images inlined:

```bash
bun build --compile --target=browser ./index.html --outdir=dist
```

This works with Web Awesome — components get bundled inline. Useful for email templates, offline tools, or distribution as single files.[^14]

### Deployment Targets

| Platform | Bun Support | Notes |
|---|---|---|
| **Cloudflare Pages** | Partial | Set `SKIP_DEPENDENCY_INSTALL=true`, install Bun manually in build command[^27] |
| **Netlify** | ✅ Native | Bun detection works; set `bun build` as build command |
| **Vercel** | ✅ Native | Full Bun support, set framework to "Other" |
| **GitHub Pages** | ✅ via CI | Run `bun build` in CI, push `out/` to gh-pages branch |
| **S3 / R2 / Tigris** | ✅ | Upload `out/` contents directly |

### SSR Considerations

Web Awesome is a client-side library. There is no server-side rendering support for shadow DOM content in 2026 beyond Declarative Shadow DOM (DSD), which is still an emerging standard. For content-heavy sites that require SSR, serve static HTML with WA components for interactive regions only. The server renders semantic HTML; WA enhances it on the client.[^2]

***

## 15. Risks, Caveats, and Expert Tips

### Registration Timing

**Risk:** Calling `.focus()`, `.open = true`, or any component method before `customElements.whenDefined()` resolves will silently fail or throw. This is the #1 source of "why is my WA dialog not opening" bugs.

**Fix:** Always gate imperative JS behind `await allDefined()` or `await customElements.whenDefined('wa-X')`.

***

### FOUCE in Multi-Page Sites

**Risk:** With cherry-picked imports and Bun bundling, FOUCE is minimal for a single-page app but reappears in MPA scenarios where each page triggers a fresh component registration cycle.

**Fix:** `<html class="wa-cloak">` + ensure your main bundle loads synchronously (not deferred). Use `preventTurboFouce` if using Turbo or similar navigation libraries.[^21]

***

### Don't Import From Barrels

**Risk:** Importing from `@awesome.me/webawesome/dist/react` or any single-entrypoint export includes all components in the bundle regardless of usage.[^24]

**Fix:** Always import from the component-level path: `@awesome.me/webawesome/dist/components/button/button.js`.

***

### The `dist/` vs `dist-cdn/` Trap

**Risk:** Accidentally importing from `dist-cdn/` in a Bun-bundled project doubles the Lit runtime in the output since each component file in `dist-cdn/` bundles its own Lit copy.[^12]

**Fix:** Use `dist/` unconditionally in your imports when bundling with Bun.

***

### Avoiding the "Component Library Look"

**Risk:** Out-of-the-box Web Awesome has a distinctive visual identity. Sites built without theme customization look identical.

**Fix:** Override `--wa-color-brand-*`, `--wa-border-radius-*`, `--wa-font-*`, and typography tokens immediately after installing. Use `::part()` selectors for components that need visual surgery. Do this before building UI, not after — retrofitting brand tokens is tedious.

***

### Shadow DOM Styling Limits

**Risk:** You cannot target shadow DOM internals with regular CSS selectors. `wa-button .my-class` doesn't work.

**Fix:** Use `::part()` for structural customization, component-scoped custom properties for value-based customization, and host-level CSS (`wa-button.my-class { ... }`) for host element targeting.

***

### Native Elements Are Often Better

For: text inputs, checkboxes, and radio groups that will be heavily styled with CSS anyway — native elements with good CSS are lighter, faster, and have more reliable browser autofill behavior. Use WA selects/dialogs/drawers. Use native `<input>` + label for simple text fields when form design is fully custom.

***

### TypeScript and Dynamic DOM Manipulation

When building elements with `document.createElement('wa-input')` or injecting WA markup via `innerHTML`, TypeScript won't automatically apply element types. Register `HTMLElementTagNameMap` augmentations (see Section 9) so that `createElement('wa-input')` returns `WaInput` rather than `HTMLElement`.

***

### Version Pinning

As of June 2026, Web Awesome 3.x is in stable release (v3.2.1), but the API has had breaking attribute renames in every major beta. Pin to an exact version in `package.json` (`"@awesome.me/webawesome": "3.2.1"`) and audit changelogs carefully before upgrading. The Shoelace 2 → Web Awesome 3 migration was breaking; treat minor versions carefully during the 3.x lifecycle.[^9]

***

## 16. Final Recommendation by Project Type

| Project Type | Recommendation | Rationale |
|---|---|---|
| **Small marketing site (< 3 interactive UI needs)** | **Avoid** | JS overhead unjustified; native HTML/CSS + maybe a dialog polyfill is sufficient |
| **Polished product site (moderate interactivity)** | **Use selectively** | Use for dialogs, drawers, selects, tooltips, tabs. Skip for layout, typography, simple buttons |
| **Vanilla SPA / dashboard (high interactivity)** | **Use broadly** | The investment in consistent components pays off when building 10+ interactive views |
| **Content-heavy multi-page site** | **Use selectively** | Interactive regions only; native HTML for content; FOUCE management per-page is required |

For the target developer building a Bun-first vanilla website: if the project involves a product UI, dashboard, or application, Web Awesome will save meaningful development time and produce a more accessible, consistent result than building component behaviors from scratch. If the project is primarily a content site with minimal interaction, the JS cost outweighs the benefit. The architecture is sound, the DX with VS Code and TypeScript is good, and the Bun integration works well — the main investment is upfront theming work to avoid the generic component-library aesthetic.

---

## References

1. [Web Awesome](https://webawesome.com) - Web Awesome is the biggest open-source library of meticulously designed, highly customizable, and fr...

2. [Framework-Agnostic UI Components with Web Awesome](https://blog.openreplay.com/framework-agnostic-ui-web-awesome/) - Web Awesome enables reusable UI components via native Web Components that run in React, Vue, Angular...

3. [Introducing Web Awesome](https://blog.fontawesome.com/introducing-web-awesome/) - Web Awesome provides a collection of meticulously designed, highly customizable UI components built ...

4. [shoelace-style/webawesome: Build better with Web ...](https://github.com/shoelace-style/webawesome) - Build better with Web Awesome, the open source library of web components from Font Awesome. Upgrade ...

5. [Defining a component - Lit](https://lit.dev/docs/components/defining/) - The @customElement decorator is shorthand for calling customElements.define , which registers a cust...

6. [The Guide to Accessible Web Components | Erik Kroes](https://www.erikkroes.nl/blog/accessibility/the-guide-to-accessible-web-components-draft/) - Thankfully, keyboard navigation does work through Shadow DOM boundaries. Which means you can <TAB> i...

7. [Web Component Version of Web Awesome · shoelace-style shoelace · Discussion #2120](https://github.com/shoelace-style/shoelace/discussions/2120) - Hello I am wondering if is feasible to expose a non-framework version of Web Awesome, in addition to...

8. [Usage - Web Awesome](https://webawesome.com/docs/usage) - Web Awesome components are just regular HTML elements, or custom elements to be precise. You can use...

9. [Changelog - Web Awesome](https://webawesome.com/docs/resources/changelog) - Fixed incorrect docs for the wa-include-error event which is dispatched ... Added the .wa-cloak util...

10. [lit-element/docs/_guide/lifecycle.md at master · lit/lit-element](https://github.com/lit/lit-element/blob/master/docs/_guide/lifecycle.md) - LEGACY REPO. This repository is for maintenance of the legacy LitElement library. The LitElement bas...

11. [CustomElementRegistry: whenDefined() Methode - Web APIs | MDN](https://developer.mozilla.org/de/docs/Web/API/CustomElementRegistry/whenDefined) - Die whenDefined() Methode der CustomElementRegistry Schnittstelle gibt ein Promise zurück, das aufge...

12. [The Difference Between /dist...](https://webawesome.com/docs/) - Choose the installation method that works best for you.

13. [Installation - Shoelace](https://shoelace.style/getting-started/installation) - The experimental autoloader is the easiest and most efficient way to use Shoelace. A lightweight scr...

14. [HTML & static sites - Bun](https://bun.com/docs/bundler/html-static) - Bun's bundler has first-class support for HTML. Build static sites, landing pages, and web applicati...

15. [Bun.build converts CSS imports to dynamic imports when splitting is ...](https://github.com/oven-sh/bun/issues/20783) - When using Bun.build with splitting: true, static CSS imports are incorrectly converted to dynamic i...

16. [CSS - Bun](https://bun.com/docs/bundler/css) - Bun's CSS bundler lets you use modern/future CSS features without having to worry about browser comp...

17. [Customizing & Theming | Web Awesome](https://webawesome.com/docs/customizing) - Themes are built with a collection of predefined CSS custom properties, which we call design tokens,...

18. [Dark Mode in Web Components is About to Get AWESOME!](https://dev.to/stuffbreaker/dark-mode-in-web-components-is-about-to-get-awesome-4i14) - light-dark() is a new CSS color function that allows us to define light and dark mode colors in a si...

19. [Dark theme experiment, design token thoughts, and ... - GitHub](https://github.com/shoelace-style/shoelace/issues/381) - This experiment will change the context of the color scale for dark themes, effectively reversing th...

20. [Behind the scenes of Web Awesome theming](https://blog.fontawesome.com/web-awesome-theming/) - Our objective was to establish a collection of CSS custom properties — an API, if you will — for cre...

21. [Reducing FOUCE - Web Awesome](https://webawesome.com/docs/utilities/fouce/) - The FOUCE style utility takes care of hiding custom elements until both they and their contents have...

22. [When we need customElements.whenDefined() to access methods](https://github.com/shoelace-style/shoelace/discussions/1796) - It seems to be an issue with libraries that wrap the customElements.define() statement you would oth...

23. [Drawer](https://webawesome.com/docs/components/drawer/) - Drawers slide in from a container to expose additional options and information.

24. [React - Web Awesome](https://webawesome.com/docs/frameworks/react) - Tips for using Web Awesome in your React app.

25. [Tree shake big bundle size · Issue #180 · shoelace-style ... - GitHub](https://github.com/shoelace-style/shoelace/issues/180) - I'm trying the amazing Shoelace for the first time today. I'm working on a project with Rollup. Ever...

26. [Largest Contentful Paint (LCP) | Articles - web.dev](https://web.dev/articles/lcp) - FCP measures when any content is painted to screen and LCP when the main content is painted so LCP i...

27. [Using Bun on Cloudflare Pages](https://dt.in.th/BunCloudflarePages)

