Status: done
Method: scaffold
Complexity: 4

# QA Gate 1 — Performance + Accessibility

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Install and configure Lighthouse CI with performance thresholds (Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1). Install axe-core and integrate with the existing Playwright suite for automated WCAG assertions. Add `pnpm qa:performance` script that runs Lighthouse against the production build and outputs an HTML report. Add `pnpm qa:a11y` script that runs axe against all static pages. Ensure Hotel Example pages pass automated WCAG 2.2 AA checks (0 critical/serious violations). Write a manual accessibility testing checklist (keyboard navigation, focus rings, contrast checker, screen reader basics).

## Acceptance criteria

- [ ] `@lhci/cli` installed with `.lighthouserc.js` config
- [ ] Lighthouse thresholds configured: Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- [ ] axe-core integrated with Playwright — accessibility assertions in E2E tests
- [ ] `pnpm qa:performance` runs Lighthouse and outputs HTML report
- [ ] `pnpm qa:a11y` runs axe against all static pages
- [ ] All Hotel Example pages pass WCAG 2.2 AA automated checks (0 critical/serious violations)
- [ ] Manual accessibility testing checklist documented
- [ ] `pnpm qa:performance` passes against the Hotel Example
- [ ] `pnpm qa:a11y` passes against the Hotel Example

## Blocked by

- `11-playwright-e2e` — needs Playwright configured with smoke tests to extend with axe assertions

## Further Notes

axe-core catches ~30-50% of WCAG issues. The manual checklist covers what automated tools miss. Passing automated checks does NOT guarantee full WCAG compliance — it sets the floor.
