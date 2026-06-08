# Tech Stack

Every dependency in this template, why it's here, and where to learn more.

> For version pinning policy, see [CONVENTIONS.md](./CONVENTIONS.md#version-pinning).
> For available scripts, see [CONTRIBUTING.md](../CONTRIBUTING.md#available-scripts).

---

## Core Framework

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `next` | `16.2.6` | React framework with App Router, SSG, and static export | Production-grade SSG with `output: 'export'` support, Turbopack dev speed, and first-class i18n integration. Pinned to exact version. | [nextjs.org/docs](https://nextjs.org/docs) | `[installed]` |
| `react` | `19.2.4` | UI library | Latest stable React with server components, actions, and improved Suspense. Pinned to exact version. | [react.dev](https://react.dev) | `[installed]` |
| `react-dom` | `19.2.4` | React DOM renderer | Required companion to `react`. Pinned to exact version. | [react.dev](https://react.dev) | `[installed]` |
| `typescript` | `5.9.3` | Typed superset of JavaScript | Type safety is non-negotiable for a template that agencies will extend. Pinned to exact version. | [typescriptlang.org](https://www.typescriptlang.org/docs/) | `[installed]` |

---

## UI & Styling

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `tailwindcss` | `4.3.0` | Utility-first CSS framework | Tailwind v4 with CSS-native config, zero config files, and faster builds. Pinned to exact version. | [tailwindcss.com/docs](https://tailwindcss.com/docs) | `[installed]` |
| `@tailwindcss/postcss` | `4.3.0` | Tailwind PostCSS plugin for v4 | Required integration layer for Tailwind v4. Pinned to match Tailwind version. | [tailwindcss.com/docs](https://tailwindcss.com/docs) | `[installed]` |
| `tw-animate-css` | `^1.4.0` | CSS animation utilities for Tailwind | Provides `animate-in`, `animate-out`, and other motion primitives used by shadcn components. | [github.com/WolfYuille/tw-animate-css](https://github.com/WolfYuille/tw-animate-css) | `[installed]` |
| `@base-ui/react` | `^1.5.0` | Unstyled headless UI primitives (MUI Base) | Powers shadcn's more complex primitives (Select, etc.) with accessible, unstyled behavior. | [base-ui.com](https://base-ui.com) | `[installed]` |
| `shadcn` | `^4.8.2` | CLI for adding copy-paste UI components | Design system foundation — copy-paste components that the Agency owns and can customize. Not a dependency at runtime. | [ui.shadcn.com](https://ui.shadcn.com) | `[installed]` |
| `class-variance-authority` | `^0.7.1` | Variant utility for component classes | Standard pattern for `className` variants in shadcn components (`cvb()`). | [cva.style](https://cva.style/) | `[installed]` |
| `clsx` | `^2.1.1` | Conditional className utility | Lightweight class merger used alongside `tailwind-merge` in `cn()`. | [github.com/lukeed/clsx](https://github.com/lukeed/clsx) | `[installed]` |
| `tailwind-merge` | `^3.6.0` | Intelligent Tailwind class merging | Resolves conflicting Tailwind classes (e.g. `px-4 px-6` → `px-6`). Core of `cn()`. | [github.com/dcastil/tailwind-merge](https://github.com/dcastil/tailwind-merge) | `[installed]` |
| `lucide-react` | `^1.16.0` | Icon library | Consistent, tree-shakeable icon set. Default icon provider for shadcn. | [lucide.dev](https://lucide.dev/) | `[installed]` |
| `next-themes` | `^0.4.6` | Dark mode / theme switching for Next.js | Simple theme provider that works with static export and Tailwind's dark mode. | [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) | `[installed]` |
| `sonner` | `^2.0.7` | Toast notification component | Accessible, composable toast library. Recommended by shadcn. | [sonner.emilkowal.dev](https://sonner.emilkowal.dev/) | `[installed]` |

---

## Forms & Validation

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `@tanstack/react-form` | `^1.33.0` | Type-safe form state management | Headless, performant form library with first-class TypeScript support and no re-render overhead. | [tanstack.com/form](https://tanstack.com/form/latest) | `[installed]` |
| `zod` | `^4.4.3` | Schema validation library | Validates content loaders, env vars, form inputs, and API responses. Used pervasively across the template. | [zod.dev](https://zod.dev) | `[installed]` |

---

## Internationalization

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `next-intl` | `^4.13.0` | i18n library for Next.js App Router | Tight App Router integration, type-safe messages, locale-aware routing. All locales are URL-prefixed including the default. | [next-intl.dev](https://next-intl.dev) | `[installed]` |

---

## Testing

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `vitest` | `^4.1.7` | Vite-native test runner | Fast, ESM-native, compatible with Vite config. Replaces Jest for this stack. | [vitest.dev](https://vitest.dev/) | `[installed]` |
| `@vitejs/plugin-react` | `^6.0.2` | Vite React plugin (used by Vitest) | Enables JSX transform in Vitest's Vite-powered environment. | [github.com/vitejs/vite-plugin-react](https://github.com/vitejs/vite-plugin-react) | `[installed]` |
| `jsdom` | `^29.1.1` | DOM implementation for Node.js | Provides a browser-like DOM environment for Vitest component tests. | [github.com/jsdom/jsdom](https://github.com/jsdom/jsdom) | `[installed]` |
| `@testing-library/react` | `^16.3.2` | React testing utilities | Queries by user-facing behavior (role, text, label), not implementation details. | [testing-library.com/docs/react-testing-library](https://testing-library.com/docs/react-testing-library/intro/) | `[installed]` |
| `@testing-library/jest-dom` | `^6.9.1` | Custom DOM matchers (`toBeVisible`, etc.) | Extends Vitest's `expect` with DOM-specific assertions. | [testing-library.com/docs/ecosystem-jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) | `[installed]` |
| `@testing-library/user-event` | `^14.6.1` | User interaction simulation | Fires realistic browser events (click, type, hover) for interaction tests. | [testing-library.com/docs/ecosystem-user-event](https://testing-library.com/docs/ecosystem-user-event/) | `[installed]` |
| `tsx` | `^4.22.4` | TypeScript execution for scripts | Runs TypeScript utility scripts without a build step. | [github.com/privatenumber/tsx](https://github.com/privatenumber/tsx) | `[installed]` |

---

## E2E & QA

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `@playwright/test` | `^1.60.0` | End-to-end browser testing framework | Cross-browser (Chromium, Firefox, WebKit), auto-wait, trace viewer. Industry standard for E2E. | [playwright.dev](https://playwright.dev/) | `[installed]` |
| `@axe-core/playwright` | `^4.11.3` | Accessibility testing for Playwright | Automated WCAG violation detection integrated into Playwright E2E tests. | [github.com/dequelabs/axe-core-npm](https://github.com/dequelabs/axe-core-npm) | `[installed]` |
| `@unlighthouse/cli` | `^0.17.9` | Site-wide Lighthouse auditing | Scans all pages, produces performance/SEO/accessibility reports. Powers `pnpm qa:performance`. | [unlighthouse.dev](https://unlighthouse.dev/) | `[installed]` |
| `lighthouse` | `^13.3.0` | Google Lighthouse CLI | Direct Lighthouse audits for performance and SEO metrics. | [developer.chrome.com/docs/lighthouse](https://developer.chrome.com/docs/lighthouse) | `[installed]` |
| `react-doctor` | `^0.2.15` | React codebase quality scorer | Automated quality gate with configurable threshold (default: 80). CI gate via `pnpm qa:doctor`. | [react-doctor.dev](https://react-doctor.dev) | `[installed]` |
| `@next/bundle-analyzer` | `^16.2.7` | Webpack bundle visualization for Next.js | Visualizes bundle size per route. Enabled with `ANALYZE=true pnpm build` or `pnpm qa:bundle`. | [nextjs.org/docs/app/api-reference/config/next-config-js/bundleAnalyzer](https://nextjs.org/docs/app/api-reference/config/next-config-js/bundleAnalyzer) | `[installed]` |

---

## Linting & Git Hooks

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `@biomejs/biome` | `^2.4.16` | Linter and formatter (Rust-based) | Single tool for lint + format. Replaces ESLint + Prettier. Fast, opinionated, zero config drift. | [biomejs.dev](https://biomejs.dev/) | `[installed]` |
| `husky` | `^9.1.7` | Git hooks manager | Runs lint-staged on pre-commit and commitlint on commit-msg. Zero-config setup. | [typicode.github.io/husky](https://typicode.github.io/husky/) | `[installed]` |
| `lint-staged` | `^17.0.5` | Run linters on staged files only | Prevents committing unformatted or linted code. Speeds up commits by not linting the whole repo. | [github.com/lint-staged/lint-staged](https://github.com/okonet/lint-staged) | `[installed]` |
| `@commitlint/cli` | `^21.0.1` | Commit message linter | Enforces Conventional Commits format for clean history and automated changelogs. | [commitlint.js.org](https://commitlint.js.org/) | `[installed]` |
| `@commitlint/config-conventional` | `^21.0.1` | Conventional Commits preset for commitlint | Standard rules: `feat:`, `fix:`, `chore:`, `docs:`, etc. | [commitlint.js.org](https://commitlint.js.org/) | `[installed]` |

---

## Storybook

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `storybook` | `^10.4.1` | Component documentation and playground | Visual development environment for UI components. Useful for Agency client reviews. | [storybook.js.org](https://storybook.js.org/) | `[installed]` |
| `@storybook/react` | `^10.4.1` | Storybook framework for React | React renderer for Storybook 10. | [storybook.js.org](https://storybook.js.org/) | `[installed]` |
| `@storybook/react-vite` | `^10.4.1` | Vite builder for Storybook React | Faster Storybook builds using Vite instead of Webpack. | [storybook.js.org](https://storybook.js.org/) | `[installed]` |

---

## Tooling

| Package | Version | What it is | Why we chose it | Docs | Status |
|---|---|---|---|---|---|
| `@types/node` | `^25` | Node.js type definitions | Type safety for Node.js APIs in build scripts and config files. | [github.com/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) | `[installed]` |
| `@types/react` | `^19` | React type definitions | Type definitions matching the pinned React version. | [github.com/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) | `[installed]` |
| `@types/react-dom` | `^19` | React DOM type definitions | Type definitions matching the pinned React DOM version. | [github.com/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) | `[installed]` |
| `fallow` | `^2.85.0` | Dead code detection | Identifies unused exports and dead code paths. Run via `pnpm fallow` or `pnpm fallow:audit`. | [github.com/nicojs/fallow](https://github.com/nicojs/fallow) | `[installed]` |
| `chrome-launcher` | — | Chrome launcher for Lighthouse | Used by Lighthouse/Unlighthouse to spawn a Chrome instance for audits. | [github.com/GoogleChrome/chrome-launcher](https://github.com/GoogleChrome/chrome-launcher) | `[installed]` |
