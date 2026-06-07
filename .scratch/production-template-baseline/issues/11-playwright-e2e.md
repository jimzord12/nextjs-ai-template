Status: done
Method: scaffold
Complexity: 3
BlockedBy: 6,7

# Playwright + E2E Smoke Tests

## Parent

PRD: `.scratch/production-template-baseline/PRD.md`

## What to build

Install Playwright and configure it with multi-browser projects (Chromium, Firefox, WebKit). Add a `pnpm test:e2e` script. Write smoke tests that verify: all four Hotel Example pages render in all three locales, navigation between pages works, i18n locale switching changes content and URL, the contact form renders and can be filled, the 404 page renders for non-existent routes. These are baseline smoke tests — accessibility, SEO, and responsive assertions come in later QA gate slices.

## Acceptance criteria

- [x] Playwright installed with `playwright.config.ts`
- [x] Multi-browser projects configured: Chromium, Firefox, WebKit
- [x] `pnpm test:e2e` script runs the full Playwright suite
- [x] Homepage renders in all three locales with expected content
- [x] Room listing page renders and shows room cards
- [x] Room detail page renders when navigating from listing
- [x] Contact page renders with form fields
- [x] Locale switching changes the URL and renders localized content
- [x] 404 page renders for non-existent routes
- [x] All tests pass on Chromium (Firefox and WebKit tested in CI)

## Blocked by

- `06-hotel-homepage` — needs Homepage to test
- `07-hotel-rooms` — needs Room pages to test
- `05-contact-form` — needs Contact page to test
