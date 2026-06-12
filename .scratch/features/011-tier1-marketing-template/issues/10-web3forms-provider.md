Method: tdd
Status: ready-for-agent
Complexity: 1
BlockedBy: 9

# Web3Forms CTA provider

## Parent

PRD: `.scratch/features/011-tier1-marketing-template/PRD.md`

## What to build

Add Web3Forms as the second CTA provider, implementing the same `CtaProvider` interface as Formspree. Switching providers is a configuration change (environment variable), not a code change.

**Web3Forms provider** — Renders an inline `<form>` that POSTs to Web3Forms endpoint. Higher free-tier limit (250 submissions/month) but no dashboard. Provider key from `NEXT_PUBLIC_WEB3FORMS_KEY`.

The provider selection logic should read from environment: if `NEXT_PUBLIC_FORMSPREE_FORM_ID` is set → Formspree; if `NEXT_PUBLIC_WEB3FORMS_KEY` is set → Web3Forms. At least one must be configured.

## Acceptance criteria

- [ ] Web3Forms implements `CtaProvider` interface
- [ ] Inline `<form>` POST to Web3Forms endpoint
- [ ] Provider key from environment variable
- [ ] Provider selection: Formspree or Web3Forms based on env config
- [ ] At least one provider must be configured → build-time warning if neither set
- [ ] Switching providers is env-only change, no component code changes
- [ ] Component tests for Web3Forms provider
- [ ] `pnpm build` succeeds
- [ ] `pnpm typecheck` and `pnpm lint` pass

## Blocked by

- `09-cta-band-formspree` — needs CtaProvider interface and CTA Band component
