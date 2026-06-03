Status: done
Method: scaffold
Complexity: 4

# QA Gate 1 — Performance + Accessibility

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Install and configure Unlighthouse for performance checks with a CI budget (Performance ≥ 90). Install axe-core and integrate with the existing Playwright suite for automated WCAG assertions. Add `pnpm qa:performance` script that runs Unlighthouse against the production build and outputs an HTML report. Add `pnpm qa:a11y` script that runs axe against all static pages. Ensure Hotel Example pages pass automated WCAG 2.2 AA checks (0 critical/serious violations). Write a manual accessibility testing checklist (keyboard navigation, focus rings, contrast checker, screen reader basics).

## Acceptance criteria

- [x] `@unlighthouse/cli` installed and wired into QA performance gate
- [x] Unlighthouse performance budget configured: Performance ≥ 90
- [x] axe-core integrated with Playwright — accessibility assertions in E2E tests
- [x] `pnpm qa:performance` runs Unlighthouse and outputs HTML report
- [x] `pnpm qa:a11y` runs axe against all static pages
- [x] All Hotel Example pages pass WCAG 2.2 AA automated checks (0 critical/serious violations)
- [x] Manual accessibility testing checklist documented
- [x] `pnpm qa:performance` passes against the Hotel Example
- [x] `pnpm qa:a11y` passes against the Hotel Example

## Blocked by

- `11-playwright-e2e` — needs Playwright configured with smoke tests to extend with axe assertions

## Further Notes

axe-core catches ~30-50% of WCAG issues. The manual checklist covers what automated tools miss. Passing automated checks does NOT guarantee full WCAG compliance — it sets the floor.
