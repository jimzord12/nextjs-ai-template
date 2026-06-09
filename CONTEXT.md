# Next.js AI Template

A multi-CMS marketing website template for agencies. Supports multiple CMS backends through a shared adapter pattern, with typed slice rendering, theme system, i18n, and a full QA pipeline. Ships with a demo site that proves the architecture end-to-end.

## Language

**Agency**:
The primary user of this template — a team that builds and delivers marketing sites for clients.
_Avoid_: Template user, developer, end user

**Client**:
The agency's customer who receives the delivered site.
_Avoid_: End user, customer, stakeholder

**Local CMS**:
One of the supported CMS backends — a repo-local, Strapi-inspired content model backed by JSON files in `src/content/`. Works with static export (`output: 'export'`). Content is consumed through Zod-validated loaders, not direct imports.
_Avoid_: Content system, data layer, fixtures

**CMS Adapter**:
A module that implements the shared CMS interface (`getPageBySlug`, `getGlobalData`) for a specific CMS provider. Translates provider-specific data into the template's normalized `PageModel`. The adapter determines the hosting model: local adapters support static export; external adapters require a server runtime.
_Avoid_: CMS connector, CMS integration, provider

**Collection Type**:
A repeatable content entity with many records (e.g., Rooms, Reviews). Each record has its own slug and is stored as a separate JSON file per locale.
_Avoid_: Content type, model, entity

**Single Type**:
A singleton content document with exactly one record (e.g., Homepage, Site Settings). Stored as one JSON file per locale.
_Avoid_: Singleton, global content, config

**Content Component**:
A reusable JSON fragment embedded inside collection types and single types (e.g., SEO fields, Hero Section, CTA Section). Not stored as independent files — they are sub-objects within their parent records. The data shape that a Slice renders.
_Avoid_: Block, fragment, partial, widget

**Media Record**:
Structured metadata for a local media file (alt text per locale, dimensions, caption, focal point, file reference). Lives in `src/content/media/records/`. The actual file lives in `src/content/media/files/`.
_Avoid_: Image object, asset, attachment

**Content Loader**:
A typed function (e.g., `getRoom(slug, locale)`) that reads a JSON content file, validates it through a Zod schema, and returns a typed object. Used internally by the Local CMS adapter. Invalid content fails at build time.
_Avoid_: Data fetcher, getter, API

**Slice**:
A full-width content section that a CMS editor selects and orders on a page (e.g., Hero, Feature Grid, Testimonials, CTA Band). Each slice maps 1:1 to a React component in the slice registry and receives normalized data from the CMS adapter pipeline. Not the same as a Content Component — a Content Component is the data shape; a Slice is the rendering unit.
_Avoid_: Section, block, widget, panel

**Hotel Example**:
The demo content that ships with the template — a hotel marketing site with rooms, reviews, a contact form, and full i18n. Stripped by the reset script.
_Avoid_: Demo site, example app, sample content

**Reset**:
Running `scripts/reset-example.sh` to strip all Hotel Example content and pages, leaving a bare i18n skeleton with empty content directories.
_Avoid_: Clean, clear, wipe, teardown

**V1 Scope**:
Ships with: Local JSON + Sanity + Payload CMS adapters, a curated component library with unique marketing components, strong documentation, and well-defined developer+AI workflows. Includes: hybrid routing, theme system with presets, i18n, init script, CSS-only motion, and full QA pipeline. Hosting model is determined by CMS choice: local CMS → static export, external CMS → serverless. See `ROADMAP.md` for milestones. Post-V1: GSAP motion, dev theme tool, code generators.
_Avoid_: Baseline, initial release, MVP

**Theme**:
A configuration interface that maps semantic design tokens (primary color, secondary color, heading font, body font, border-radius, etc.) to concrete Tailwind CSS values. Components reference semantic tokens, never raw Tailwind values. Applied via CSS custom properties.
_Avoid_: Skin, look, visual preset

**Theme Instance**:
A concrete set of harmonious values filling the Theme interface. Agencies compose 4-5 theme instances to present to a client. The client picks one, optionally tweaks 2-3 tokens.
_Avoid_: Theme variant, color scheme, preset

**Init Script**:
An in-repo setup script (`pnpm init` or similar) that asks 2-3 questions (CMS choice, project name, locale) and configures the template accordingly. Sets `next.config.ts`, swaps the adapter, and adjusts for static or serverless hosting.
_Avoid_: Scaffold, setup wizard, bootstrap

**QA Report**:
Generated HTML files in `.qa/` from the QA pipeline (Lighthouse, axe, bundle analysis, security audit). The agency screenshots these into a client deck. Not hosted — local files only.
_Avoid_: Test report, audit report, compliance report

## Locales

i18n is built into the core. Locales are URL-prefixed, including the default (`/en/`, `/el/`, `/de/`). Root `/` redirects to `/en/`. The CMS adapter interface includes locale as a parameter. Agencies delivering single-language sites configure one locale.

- **en** — English (default)
- **el** — Greek
- **de** — German

## Route Structure

Hybrid routing: a catch-all `[[...slug]]` route handles CMS-driven pages (most pages). Explicit routes handle pages needing custom server logic (contact forms, search, auth). All routes live inside `[locale]/(marketing)/`.

```
src/app/
  [locale]/
    (marketing)/
      [[...slug]]/
        page.tsx      → CMS-driven pages (default)
        loading.tsx
        not-found.tsx
      contact/
        page.tsx      → Explicit route (custom logic)
      layout.tsx      → Marketing layout
    layout.tsx        → Locale providers
  layout.tsx          → Root layout
```
