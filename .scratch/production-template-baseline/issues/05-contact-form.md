Status: ready-for-agent

# Contact Form (TanStack Form + Web3Forms)

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Install TanStack Form and build a working Contact page with a form that submits to Web3Forms. The form collects name, email, and message. Validation uses Zod schemas (consistent with the CMS validation pattern). The form submits via POST to the Web3Forms endpoint, configurable through the `NEXT_PUBLIC_FORM_ENDPOINT` environment variable. Success and error states show user-facing feedback (toast or inline messages). The Contact page lives at `/[locale]/contact` in the marketing route group.

This slice does NOT depend on the Local CMS — it only needs the i18n routing from S2. The contact page is a standalone feature.

## Acceptance criteria

- [ ] TanStack Form installed and configured
- [ ] Contact form built with fields: name (required), email (required, validated), message (required, min length)
- [ ] Zod schema validates form inputs — shared validation pattern with CMS
- [ ] Form submits to Web3Forms via `NEXT_PUBLIC_FORM_ENDPOINT` env var
- [ ] `.env.example` includes `NEXT_PUBLIC_FORM_ENDPOINT` with a placeholder
- [ ] Success state shows confirmation feedback to the user
- [ ] Error state shows failure feedback to the user
- [ ] Contact page renders at `/en/contact`, `/el/contact`, `/de/contact`
- [ ] Form labels and error messages are localized (use message files from i18n setup)
- [ ] Component tests verify: form validates inputs, shows errors on invalid submit, calls endpoint on valid submit
- [ ] `pnpm test` passes
- [ ] `next build` succeeds

## Blocked by

- `03-i18n-routing-skeleton` — needs locale routing and message files for the page route

## Further Notes

The template should ship with a working Web3Forms access key (or clear instructions to obtain one). The `.env.example` should document that `NEXT_PUBLIC_FORM_ENDPOINT` can point to any form backend, not just Web3Forms.
