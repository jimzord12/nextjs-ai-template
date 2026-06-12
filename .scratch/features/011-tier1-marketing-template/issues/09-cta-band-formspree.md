Method: tdd
Status: ready-for-agent
Complexity: 3
BlockedBy: 5, 7

# CTA Band slice + Formspree provider

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Build the CTA Band slice with an inline contact form that POSTs to Formspree — the default CTA provider. This is the fifth and final composable slice, completing the component library.

**CtaProvider interface** — Shared interface for CTA form providers. Both Formspree and Web3Forms implement it. Provider selection is a configuration change, not a code change.

**Formspree provider** — Default implementation. Renders an inline `<form>` that POSTs directly to Formspree endpoint. No redirect to external page. Form fields: name, email, message. Provider endpoint key configured via environment variable (`NEXT_PUBLIC_FORMSPREE_FORM_ID`).

**CTA Band component** — Renders a call-to-action section with headline, description, and the inline contact form. The form submits to the configured CtaProvider. Uses semantic theme tokens.

**Constraints** — No server-side form processing. The form is a plain HTML form POST to a third-party endpoint. Works under static export.

## Acceptance criteria

- [ ] `CtaProvider` interface defined with form rendering/submit contract
- [ ] Formspree implements `CtaProvider` with inline `<form>` POST
- [ ] CTA Band renders headline, description, and contact form
- [ ] Form submits to Formspree endpoint (verified with test markup, not live POST)
- [ ] Form fields: name, email, message (required)
- [ ] Form accessible: labels, error states, focus management
- [ ] Provider endpoint from environment variable, not hardcoded
- [ ] CTA Band registered in component registry
- [ ] CTA Band uses semantic theme tokens exclusively
- [ ] Home page seed JSON updated with CTA Band slice (all 5 slices now present)
- [ ] Component tests with mock provider
- [ ] `pnpm build` succeeds
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `05-content-model-remaining-schemas` — needs CTA Band slice schema
- `07-hero-features-slices` — follows the established slice component pattern
