Status: ready-for-agent

# QA Gate 3 — Security + Bundle

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Add Vercel security configuration and bundle analysis tooling. Create `vercel.json` with OWASP-recommended security headers (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy, Permissions-Policy). Provide a CSP template with clear instructions for relaxing per-project (analytics, fonts, Storybook embeds) — do NOT present it as a drop-in config. Wire `@next/bundle-analyzer` behind the `ANALYZE` env var with a `pnpm analyze` script. Add `pnpm qa:security` script that runs `pnpm audit` and checks for critical/high CVEs. Add `pnpm qa:bundle` script that runs the bundle analyzer.

## Acceptance criteria

- [ ] `vercel.json` exists with OWASP-recommended security headers
- [ ] CSP template includes clear instructions to relax per-project (not a drop-in)
- [ ] `@next/bundle-analyzer` wired in `next.config.ts` behind `ANALYZE` env var
- [ ] `pnpm analyze` script triggers bundle analysis
- [ ] `pnpm qa:security` script runs and exits non-zero on critical/high CVEs
- [ ] `pnpm qa:bundle` script runs and outputs bundle report
- [ ] Security headers documented: how to verify via securityheaders.com and Mozilla Observatory
- [ ] `next build` succeeds with new config

## Blocked by

- `02-version-pinning-audit` — needs audit script foundation
