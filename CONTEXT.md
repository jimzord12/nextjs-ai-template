# Next.js AI Template

A production-grade static-site template optimized for agencies delivering client sites. Ships with a complete hotel demo that demonstrates the architecture, stripped by a reset script to a bare skeleton.

## Language

**Agency**:
The primary user of this template — a team that builds and delivers static marketing sites for clients.
_Avoid_: Template user, developer, end user

**Client**:
The agency's customer who receives the delivered site.
_Avoid_: End user, customer, stakeholder

**Local CMS**:
A repo-local, Strapi-inspired content model backed by JSON files in `src/content/`. Content is consumed through Zod-validated loaders, not direct imports.
_Avoid_: Content system, data layer, fixtures

**Collection Type**:
A repeatable content entity with many records (e.g., Rooms, Reviews). Each record has its own slug and is stored as a separate JSON file per locale.
_Avoid_: Content type, model, entity

**Single Type**:
A singleton content document with exactly one record (e.g., Homepage, Site Settings). Stored as one JSON file per locale.
_Avoid_: Singleton, global content, config

**Content Component**:
A reusable JSON fragment embedded inside collection types and single types (e.g., SEO fields, Hero Section, CTA Section). Not stored as independent files — they are sub-objects within their parent records.
_Avoid_: Block, fragment, partial, widget

**Media Record**:
Structured metadata for a local media file (alt text per locale, dimensions, caption, focal point, file reference). Lives in `src/content/media/records/`. The actual file lives in `src/content/media/files/`.
_Avoid_: Image object, asset, attachment

**Content Loader**:
A typed function (e.g., `getRoom(slug, locale)`) that reads a JSON content file, validates it through a Zod schema, and returns a typed object. Invalid content fails at build time. This is the Strapi-like API contract between the CMS and pages.
_Avoid_: Data fetcher, getter, adapter, API

**Hotel Example**:
The demo content that ships with the template — a hotel marketing site with rooms, reviews, a contact form, and full i18n. Stripped by the reset script.
_Avoid_: Demo site, example app, sample content

**Reset**:
Running `scripts/reset-example.sh` to strip all Hotel Example content and pages, leaving a bare i18n skeleton with empty content directories.
_Avoid_: Clean, clear, wipe, teardown

**V1 Scope**:
The first release targets Vercel's free tier with static export. Uses Vercel's built-in image optimization. Security headers only for `vercel.json`. Other hosting platforms and a custom static image loader are deferred to v2.
_Avoid_: Baseline, initial release, MVP

**QA Report**:
Generated HTML files in `.qa/` from the QA pipeline (Lighthouse, axe, bundle analysis, security audit). The agency screenshots these into a client deck. Not hosted — local files only.
_Avoid_: Test report, audit report, compliance report

## Locales

Three locales ship with the template. English is the default. All locales are URL-prefixed, including the default (`/en/`, `/el/`, `/de/`). Root `/` redirects to `/en/`.

- **en** — English (default)
- **el** — Greek
- **de** — German

Content is stored as one JSON file per locale per record (e.g., `rooms/en/deluxe-suite.json`, `rooms/el/deluxe-suite.json`).

## Route Structure

The template ships only a `(marketing)` route group inside `[locale]`. No `(app)` route group in v1 — the demo is a static marketing site with no auth or dashboard.

```
src/app/
  [locale]/
    (marketing)/
      page.tsx        → Homepage
      rooms/
        page.tsx      → Room listing
        [slug]/
          page.tsx    → Room detail
      contact/
        page.tsx      → Contact form
      layout.tsx      → Marketing layout
    layout.tsx        → Locale providers
  layout.tsx          → Root layout
```
