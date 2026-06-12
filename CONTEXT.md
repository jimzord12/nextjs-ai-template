# Next.js AI Template

A marketing website template for a solo freelancer. Ships as a Tier 1 static-export site powered by a Local JSON CMS, with theme system, i18n, and a full QA pipeline. Tier 2 (Sanity, server runtime, blog) is a separate fork for when the client needs it.
## Language

**Freelancer**:
You — the solo developer who uses this template to deliver marketing sites for clients.
_Avoid_: Agency, template user, developer, team

**Client**:
Your customer who receives the delivered site.
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

**Demo Site**:
Skipped. This template ships as a bare skeleton with empty content directories. No demo content is included.
_Avoid_: Hotel Example, example app, sample content

**Reset**:
Running `scripts/reset-example.sh` to strip all content and pages, leaving a bare i18n skeleton with empty content directories.
_Avoid_: Clean, clear, wipe, teardown

**Tier 1 Scope (Current)**:
Static-export only. Local JSON CMS. Single landing page up to a handful of pages. No external CMS, no server runtime, no CI. Theme system, i18n, CSS-only motion, and full QA pipeline. Deploys to Vercel (or any static host). Tier 2 is a separate fork with Sanity, server runtime, blog, CI, and analytics — built when the first Tier 2 client appears.
_Avoid_: Baseline, MVP, V1

**Theme**:
A configuration interface that maps semantic design tokens (primary color, secondary color, heading font, body font, border-radius, etc.) to concrete Tailwind CSS values. Components reference semantic tokens, never raw Tailwind values. Applied via CSS custom properties.
_Avoid_: Skin, look, visual preset

**Theme Instance**:
A concrete set of harmonious values filling the Theme interface. You compose 2-3 theme instances to present to a client. The client picks one, optionally tweaks a few tokens.
_Avoid_: Theme variant, color scheme, preset

**Init Script**:
Deferred. For now, project setup uses a simple bootstrap method (GitHub template, `npx degit`, or manual checklist). A scaffolding CLI may be built when volume justifies it.
_Avoid_: Scaffold, setup wizard, bootstrap, create-jz-app

**QA Report**:
Generated HTML files in `.qa/` from the QA pipeline (Lighthouse, axe, bundle analysis, security audit). You screenshot key metrics into a client-facing summary. Not hosted — local files only.
_Avoid_: Test report, audit report, compliance report

## Locales

i18n is built into the core. Locales are URL-prefixed, including the default (`/en/`, `/el/`, `/de/`). Root `/` redirects to `/en/`. The CMS adapter interface includes locale as a parameter. Single-language sites configure one locale.

- **en** — English (default)
- **el** — Greek
- **de** — German

## Route Structure

Static routing: Tier 1 uses explicit page routes (no catch-all `[[...slug]]` needed for a small site). All routes live inside `[locale]/(marketing)/`.

```
src/app/
  [locale]/
    (marketing)/
      page.tsx        → Homepage
      about/
        page.tsx      → About page (if needed)
      contact/
        page.tsx      → Contact (third-party form)
      layout.tsx      → Marketing layout
    layout.tsx        → Locale providers
  layout.tsx          → Root layout
```
