# Manual Accessibility Testing Checklist

Automated tooling (axe-core via `pnpm qa:a11y`) catches roughly 30–40% of
WCAG 2.2 AA issues. The items below cover the rest — the things a scanner
cannot reliably detect. Run this checklist before every release that
touches user-facing UI.

**Scope:** Hotel Example pages (homepage, rooms listing, room detail,
contact) across all three locales (`en`, `el`, `de`).

**Conformance target:** WCAG 2.2 Level AA.

---

## 1. Keyboard navigation

Page must be fully operable without a mouse.

- [ ] **Tab order is logical and follows the visual reading order.**
  - No focus traps (except deliberate ones in modals/dialogs).
  - No hidden focusable elements (e.g., links with `display: none` parents
    that still receive focus via tab).
- [ ] **Every interactive element is reachable with `Tab` and `Shift+Tab`.**
  - Links, buttons, inputs, selects, textareas, summary/details.
  - Custom widgets (tabs, accordions, dialogs) included.
- [ ] **`Enter` activates links and buttons.** `Space` activates buttons.
- [ ] **Skip-to-content link** (if present) becomes visible on first `Tab`
      and moves focus past the header/navigation.
- [ ] **Modal/dialog traps focus** while open and returns focus to the
      trigger on close.
- [ ] **Dropdowns and menus** open/close with `Enter`/`Space`/`Esc`, arrow
      keys navigate within, `Esc` closes.
- [ ] **No keyboard shortcut conflicts** with assistive tech (AT) —
      single-key shortcuts only when documented and overrideable.

## 2. Focus indicators (visible focus rings)

Every focusable element must show a clearly visible focus indicator.

- [ ] **Focus ring is visible on every focusable element** in default and
      dark theme.
- [ ] **Contrast of focus indicator against the background is ≥ 3:1**
      (WCAG 2.4.11 Focus Appearance, 2.4.7 Focus Visible).
- [ ] **Focus ring size is ≥ 2 CSS pixels** on each side and the
      perimeter is continuous (no dashed-only outlines that fall below
      the size threshold).
- [ ] **`outline: none` is never applied without a replacement indicator.**
- [ ] **Focus moves predictably** — e.g., closing a menu returns focus to
      the menu trigger, not to `<body>`.

## 3. Color contrast and visual presentation

- [ ] **Body text contrast ≥ 4.5:1** against its background (WCAG 1.4.3).
- [ ] **Large text (≥ 18pt or ≥ 14pt bold) contrast ≥ 3:1.**
- [ ] **UI components and graphical objects contrast ≥ 3:1** against
      adjacent colors — icon strokes, form-field borders, focus rings,
      chart series (WCAG 1.4.11).
- [ ] **Color is never the only visual means of conveying information.**
      - Errors are not red-only; pair with icon or text.
      - Required fields use both `*` and `aria-required`.
- [ ] **Links are distinguishable** from surrounding body text by more
      than color alone (underline, weight, or contrast difference).
- [ ] **Text reflows at 320 CSS px wide** without horizontal scrolling
      and without clipping (WCAG 1.4.10 Reflow).
- [ ] **Text spacing can be overridden** up to: line-height 1.5,
      paragraph spacing 2× font size, letter-spacing 0.12em,
      word-spacing 0.16em — without content loss (WCAG 1.4.12).

## 4. Screen reader basics

Test with at least **NVDA + Firefox** and **VoiceOver + Safari**.
Chrome/Edge + screen reader is an acceptable additional check.

- [ ] **Page `<title>` is descriptive and unique per route.**
- [ ] **`lang` attribute on `<html>` matches the active locale**
      (`en`, `el`, `de`) — critical for Greek and German content
      pronunciation.
- [ ] **Every page has exactly one `<h1>` that describes the page.**
      Heading levels (`<h1>` → `<h2>` → `<h3>`) do not skip.
- [ ] **Landmark roles are present and labelled:**
      `<header>`, `<nav>`, `<main>`, `<footer>`, and where relevant
      `<aside>` / `<search>`.
- [ ] **Images have meaningful `alt` text.** Decorative images use
      `alt=""`. Charts/diagrams convey their data via `aria-label`,
      `aria-describedby`, or adjacent text.
- [ ] **Form controls have associated `<label>` elements** (or
      `aria-label` / `aria-labelledby`). Placeholder text is not a
      substitute for a label.
- [ ] **Field errors are announced** via `aria-invalid="true"` and
      `aria-describedby` pointing at the error message.
- [ ] **Status messages** (toasts, success banners) use `role="status"`,
      `role="alert"`, or `aria-live="polite"` so they are announced
      without stealing focus.
- [ ] **Dynamic content changes** (filtered lists, AJAX updates) are
      announced via live regions.
- [ ] **Tabular data uses `<th scope="...">`** with captions.
- [ ] **`prefers-reduced-motion` is respected** — auto-playing
      animations/transitions stop or simplify (WCAG 2.3.3).

## 5. Touch and pointer

- [ ] **Touch targets ≥ 24×24 CSS px** (44×44 recommended), with
      adequate spacing (WCAG 2.5.8 Target Size — Minimum).
- [ ] **No drag-only interactions** without a keyboard/single-pointer
      alternative (WCAG 2.5.7 Dragging Movements).
- [ ] **Pointer cancellation** — `pointerdown`/`touchstart` does not
      commit an action; the user can cancel by moving the pointer off
      the target before release (WCAG 2.5.2 Pointer Cancellation).

## 6. Cognitive / readability

- [ ] **Language of parts** — foreign-language phrases use
      `lang` attributes (e.g., a Greek phrase in the English page).
- [ ] **Instructions are clear** and don't rely solely on sensory
      characteristics ("the round button", "the button on the right").
- [ ] **Timeouts are announced and extendable** when applicable.
- [ ] **Consistent navigation** across pages — same labels, same order.

## 7. Reduced motion and prefers-color-scheme

- [ ] **`prefers-reduced-motion: reduce`** disables non-essential
      animations and parallax.
- [ ] **Dark theme** (if supported) maintains all contrast and focus
      guarantees from §2 and §3.

## 8. Hidden / conditional content

- [ ] **Content hidden with `display: none` or `visibility: hidden` is
      also hidden from assistive tech.**
- [ ] **`aria-hidden="true"`** is not applied to focusable elements
      while they can receive focus.
- [ ] **Toggling visibility** (expando, disclosure) updates
      `aria-expanded` and, where relevant, `aria-controls`.

## 9. Validation summary

- [ ] **After completing the checklist, re-run `pnpm qa:a11y` and
      `pnpm qa:performance` to confirm no regression.**
- [ ] **Document any genuine exceptions** in the PR description with a
      rationale and a follow-up ticket.
