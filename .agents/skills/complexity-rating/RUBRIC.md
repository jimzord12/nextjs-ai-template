# Complexity Rating Rubric

Detailed heuristics for assigning Complexity 1-5 to issues.

## Rating Philosophy

**When in doubt, rate up.** The cost of under-rating (agent fails mid-session, work stalls) is much higher than the cost of over-rating (issue gets a bit more scrutiny before starting). If an issue sits between two ratings, assign the higher one.

## Complexity 1 — Trivial

An agent completes this in minutes with zero ambiguity.

**Signals:**
- Single file, single function, or a config change
- No design decisions — the fix/approach is obvious from the issue text
- No new dependencies
- 1-3 acceptance criteria, all straightforward
- No cross-cutting concerns (no i18n, no auth, no data migration)
- No other issues depend on this one's output as a contract

**Examples:**
- Fix a typo in a component
- Update a dependency version
- Add a missing import
- Change a color value in CSS

## Complexity 2 — Straightforward

An agent completes this in a single session with minimal decisions. The agent is **replicating** an existing pattern, not composing multiple patterns or making structural choices.

**Signals:**
- 1-3 files or a clearly scoped subsystem
- Purely replicates an existing pattern — the agent copies structure, doesn't design it
- 3-5 acceptance criteria, all with obvious pass/fail
- Tests follow existing test patterns exactly (same test runner, same assertions)
- Minor integration points (e.g., add a route, register a component)
- No foundational contract risk — other issues don't depend on the types/APIs this creates

**Not Complexity 2 if:**
- The issue introduces types, schemas, or APIs that downstream issues consume → rate 3+
- The issue integrates 2+ external tools that must work together → rate 3+
- Any AC says "all X pass Y" (e.g., "all pages pass WCAG") — open-ended verification → rate 3+
- More than 5 ACs → rate 3+

**Examples:**
- Add a new page with a single component
- Create a Storybook story for an existing component
- Add a CI workflow file following a standard template
- Write tests for an existing untested component using the project's existing test patterns

## Complexity 3 — Moderate

An agent can do it in one session but needs to make several design decisions along the way.

**Signals:**
- 3-6 files across 2-3 subsystems
- Some unspecified behavior the agent must infer from existing patterns
- 5-8 acceptance criteria
- Integration across layers (data fetching, rendering, routing, metadata)
- May need to update shared utilities or types that other code depends on
- Error handling and edge cases are non-trivial
- Integrates 2 external tools that must coordinate

**Not Complexity 3 if:**
- Other issues depend on the contracts produced here as a foundation → rate 4
- The issue integrates 3+ external tools → rate 4
- Any AC requires hitting a quantitative threshold (e.g., "Performance ≥ 90", "SEO score targets 100") that may surface real problems needing code fixes → rate 4
- The issue creates patterns that future issues will replicate — foundational pattern-setting → rate 4
- More than 8 ACs → rate 4

**Examples:**
- Build a new section of a page with multiple sub-components
- Add a new CMS collection type with localized content and dynamic routes
- Implement a form with validation and submission handling
- Add E2E tests for a multi-step user flow

## Complexity 4 — Hard

An agent can barely finish in one session. Multiple complex subsystems, high decision density, or significant integration surface.

**Signals:**
- 6+ files across 4+ subsystems
- 6+ acceptance criteria (lower if any are open-ended or carry implicit sub-requirements)
- Cross-cutting concerns: i18n + SEO + accessibility + testing
- Must create new patterns or extend shared abstractions that other issues depend on
- **Foundational contract risk**: schemas, APIs, or types produced here are consumed by multiple downstream issues — mistakes propagate
- **Multi-tool integration**: 3+ external tools must be wired together (e.g., Lighthouse CI + axe-core + Playwright)
- **Open-ended verification**: ACs like "all pages pass WCAG" or "score targets 100" may surface real violations requiring code fixes, not just configuration
- High risk of mid-session discovery (unexpected edge cases, missing data, broken integrations)
- The agent would need to run builds/tests multiple times to verify
- Touches foundational code that other features depend on

**Examples:**
- Build a foundational schema + loader layer that all page features consume (even if file count looks moderate)
- Wire Lighthouse CI + axe-core + Playwright integration with threshold enforcement
- Build an entire feature section with listing + detail + i18n + SEO + tests
- Implement a full form system with validation, error states, accessibility, and E2E tests
- Create a cross-browser test matrix (5 viewports × N pages × 3 browsers) plus umbrella QA orchestration

## Complexity 5 — Decompose

Too large, too ambiguous, or too interconnected for a single agent session. Must be split before work can begin.

**Signals:**
- 10+ acceptance criteria
- Spans more than one "vertical feature" (e.g., two independent page types)
- Requires architectural decisions that should be validated before continuing
- Multiple independent subsystems that don't share a data model
- The issue reads like a mini-PRD rather than a vertical slice
- Any single AC would itself be a Complexity 3+ item
- The issue mixes concerns that could be independently shipped (e.g., "build rooms AND reviews AND gallery")
- Missing critical context that blocks design decisions

**Examples:**
- "Build the entire CMS layer with all content types, all locales, all pages"
- "Set up i18n routing, translation pipeline, AND localize all existing content"
- "Implement the full booking flow from search to payment to confirmation"
- Any issue where you'd say "this is really 3 issues in a trench coat"

## Defensive Rating Checklist

Before finalizing a rating, run through this checklist. If any answer is "yes", consider bumping up:

1. **Do other issues depend on this issue's output as a contract?** (schemas, types, loaders, APIs) → +1
2. **Does any AC require hitting a measurable threshold?** (Lighthouse score, performance budget, WCAG compliance) → +1
3. **Does the issue integrate 3+ external tools?** → +1
4. **Are there 6+ acceptance criteria?** → consider 4
5. **Are there 10+ acceptance criteria?** → consider 5
6. **Could mid-session discovery invalidate earlier work?** (e.g., schema doesn't compose cleanly, test matrix reveals failures) → +1
7. **Is this issue setting patterns that future issues will replicate?** (foundational pattern-setting) → +1

## Edge Cases

### Issues with existing decomposition

If an issue already has a `Decomposed into:` line, it has already been rated and decomposed. Note it in the summary but don't re-rate unless the user asks.

### PRDs

PRDs are not issues — they are specifications. Rate only issue files (files with acceptance criteria and a `What to build` section). If the directory contains a PRD, skip it.

### Very small directories

If the directory has fewer than 3 issues, still rate them all. The summary table is still useful for prioritization.

### Mixed-complexity directories

It's normal for a directory to have a mix of 1-5. The goal is to surface the 5s so they get decomposed, not to normalize everything to the same level.