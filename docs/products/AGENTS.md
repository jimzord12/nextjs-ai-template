# AGENTS.md — docs/products/

## What This Is

A single self-contained HTML file (`web-tiers-guide.html`) that teaches non-technical Greek business owners about website quality through a 5-tier framework, anchored to a car analogy. Bilingual GR/EN, interactive, printable.

**Tech stack:** Bun + Web Awesome + vanilla TypeScript → bundled into one distributable HTML file.

---

## Directory Map

| Path | Purpose |
|------|---------|
| `SPEC.md` | Full specification — the source of truth for all content, behavior, and design |
| `ROADMAP.md` | Implementation milestones (M1–M6) with done-when criteria |
| `content/product-tiers.json` | Structured tier data (pricing, TCO, hours, pros/cons) |
| `content/Greek Web Development Market *.md` | Market research — pricing & quality benchmarks |
| `tech-stack/TECH_STACK.md` | Bun + Web Awesome patterns, gotchas, and configuration (**mandatory read**) |
| `page/` | Implementation directory — Bun project root |

---

## Before You Start
1. **Read `SPEC.md`** for content, copy, behavior, and design decisions. It overrides everything else.
2. **Read `ROADMAP.md`** for the current milestone scope and done-when criteria.
3. **Read `tech-stack/TECH_STACK.md`** — mandatory. You MUST read this before writing any Bun or Web Awesome code. It contains critical gotchas (import paths, FOUCE, TS config traps) that will break the build if ignored.
4. Check `page/` for existing implementation state before writing code.
5. **Update `ROADMAP.md` milestones.** Each milestone has a `Status:` line and `Done when:` checkboxes. When you start a milestone, set its status to `IN PROGRESS` and add the date. When you complete a milestone, set status to `DONE`, add the completion date, and check all done-when boxes (`[x]`). Check them off one by one as you verify each criterion — never batch-check without proof.

---

## Key Architecture Rules

- **Single HTML output.** Everything bundles into one `dist/web-tiers-guide.html` via `bun build --compile --target=browser --minify`.
- **No framework.** Vanilla TypeScript + Web Awesome custom elements. No React, Vue, or Svelte.
- **Web Awesome imports:** Always cherry-pick from `dist/` (never `dist-cdn/`), centralized in `src/wa.ts`.
- **FOUCE prevention:** `<html class="wa-cloak">` + `await allDefined()` in `src/main.ts`.
- **Bilingual:** All UI strings in a single `i18n` object (GR primary, EN required). No i18n library.
- **TypeScript config:** Browser-targeted. Do NOT include `"types": ["bun"]` in tsconfig — it breaks DOM types.
- **Dark/light theme:** CSS custom properties with `[data-theme]` toggle. Sync with WA `.wa-dark`.
- **Print:** `@media print` forces light theme, hides interactive elements, expands accordions.

---

## Build Commands

All commands run from `docs/products/page/`:

```bash
bun dev              # dev server (bun ./src/index.html)
bun run build        # production single-file HTML
bun run typecheck    # tsc --noEmit
bun run lint         # biome check --apply .
bun test             # bun:test
```

---

## Content Source Hierarchy

1. `SPEC.md` — authoritative content and copy
2. `content/product-tiers.json` — structured data (prices, hours, TCO calculations)
3. `content/Greek Web Development Market *.md` — market research backing the data
4. `ROADMAP.md` — milestone scope (what to build when)

When in doubt about content, SPEC.md wins.
