# Task Decomposition & Difficulty Scoring Framework

This document defines the rules for decomposing tasks in `TODO.md` and assigning `[D:N]` difficulty scores. An agent reading these rules should produce the same decomposition and scores as the original author.

---

## 1. Decomposition Rules

### When to decompose

A task **must** be decomposed only when **all three** tests pass:

1. **Independence test** — Each sub-task can be verified on its own, without needing the other sub-tasks to be complete. If you can only verify the parts by completing the whole, it is one task.

2. **Dependency-boundary test** — There is a real dependency between sub-tasks (one requires output from the other), or they produce artifacts consumed by different downstream sections. If sub-tasks are merely sequential steps in a single workflow with no handoff point, it is one task.

3. **Distinct-deliverable test** — The parent task describes multiple separate files, systems, or artifacts — not variations of the same artifact. If sub-tasks are just parametric variants (e.g., "test at 5 viewports"), they are one task.

### When NOT to decompose

- The task is a single coherent unit of work (one file, one config, one script).
- Splitting would create sub-tasks that cannot be verified independently.
- The sub-tasks are sequential steps in a single install-and-verify flow.
- The original task already has sub-bullets describing implementation details — these are guidance, not separate deliverables.

### Decomposition format

Decomposed tasks use indented sub-checkboxes under the parent:

```
- [ ] X.Y Parent task description `[D:N]`
  - [ ] X.Y.1 First sub-task `[D:N]`
  - [ ] X.Y.2 Second sub-task `[D:N]`
```

The parent retains its own checkbox and difficulty score (the aggregate). Sub-tasks get individual scores.

---

## 2. Difficulty Scoring

### What the score measures

Difficulty = how hard it is for an AI agent to complete the task **correctly in one pass**, given only the task description and project context.

It does **not** measure human effort, calendar time, or lines of code.

### Scoring axes

Every task is evaluated on four axes. The final score is the **highest** axis rating.

| Axis                           | Question                                                | Low (1–2)                                         | High (3–5)                                                                            |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Specification completeness** | Is everything needed to solve this written in the task? | All inputs, outputs, and constraints are explicit | Requires design judgment, interpretation, or decisions not stated in the task         |
| **Integration surface**        | How many external systems/tools does this touch?        | Zero or one well-documented integration           | Multiple systems with interaction effects, or systems with known friction points      |
| **Verification cost**          | Can correctness be confirmed mechanically?              | Single command or obvious visual check            | Requires manual inspection, iterative testing, or cross-referencing multiple outputs  |
| **Failure mode**               | What happens if you get it subtly wrong?                | Obvious failure (build error, test fails)         | Silent failure (works but is incorrect — wrong headers, insecure config, broken a11y) |

### Score definitions

**`[D:1]` — Trivial**

All four axes are at their lowest:

- Task is fully specified — no judgment needed.
- No external integrations, or integration is a one-line change.
- Verification is a single command that passes/fails.
- Failure is immediately visible (build error, command exits non-zero).

Examples: adding a `pnpm` script alias, moving a file, adding a cross-reference link, writing usage instructions for a script that already exists.

**`[D:2]` — Straightforward**

Specification is complete, but there is a minor integration or one non-obvious detail:

- Task is mostly specified — may need one small decision (e.g., which config format).
- Integration with one well-documented tool (e.g., `@next/bundle-analyzer`, Unlighthouse).
- Verification is mechanical (command + inspect output).
- Failure is visible within one iteration.

The "one iteration" qualifier is key: you might need to read docs once or fix one config issue, but the path from "start" to "done" is linear and well-paved.

Examples: installing a tool and adding its standard config, writing a QA script that wraps an existing tool, documenting a well-known process.

**`[D:3]` — Moderate**

At least one axis is elevated. The task requires design decisions, integration knowledge, or careful edge-case handling:

- Task requires **design judgment** — multiple valid approaches, need to pick one that fits the project's conventions.
- Integration has **known friction points** (e.g., Storybook + Next.js App Router, axe-core + Playwright setup).
- Verification may require **running multiple checks** or inspecting non-obvious output.
- Failure can be **subtle** — the thing runs but isn't correct (wrong Storybook config, incomplete test coverage).

The hallmark of D:3 is "you need to know something that isn't in the task description" — a convention, a gotcha, a non-obvious constraint.

Examples: configuring Storybook for Next.js App Router, writing a reset script that must surgically remove some files while preserving others, creating example components that demonstrate architectural conventions, integrating axe-core with Playwright.

**`[D:4]` — Hard**

Multiple axes are elevated. The task has significant complexity, non-obvious constraints, or high risk of silent failure:

- Task spans **multiple systems** with interaction effects (e.g., security headers across 4 hosting platforms with different capabilities).
- Requires **domain knowledge** outside typical frontend work (e.g., CSP directives, OWASP headers, WCAG 2.2 compliance).
- Verification requires **iterative testing** or cross-referencing against external standards.
- Failure is **silent and consequential** — insecure headers pass builds but leave the site vulnerable; a11y passes automated checks but fails real users.

The hallmark of D:4 is "you can get this wrong in a way that isn't immediately obvious and has real consequences."

Examples: making content pass WCAG 2.2 AA (automated + requires understanding what axe doesn't catch), CSP configuration (one wrong directive breaks the site or leaves it insecure), security headers for 4 platforms with different capabilities, multi-platform deployment guide with ISR/security considerations.

**`[D:5]` — Expert**

Reserved for tasks that require deep domain expertise, significant architectural judgment, or iterative debugging that cannot be automated:

- Task is **underspecified by design** — the whole point is to figure out what the right approach is.
- Requires **novel problem-solving** — no well-documented path exists for this specific combination of constraints.
- Verification is **open-ended** — "is this good?" requires human judgment.
- Failure is **architectural** — wrong decision constrains the project for years.

Use D:5 sparingly. If a task has a clear spec, it is almost never D:5 regardless of size.

### Quick scoring heuristic

Ask these questions in order. Stop at the first "yes":

1. Is failure silent and consequential? → **at least D:4**
2. Does it require domain knowledge not in the task description? → **at least D:3**
3. Does it require a design decision (multiple valid approaches)? → **at least D:3**
4. Does it integrate with a tool that has known friction points? → **at least D:3**
5. Does it need anything beyond a single mechanical step? → **at least D:2**
6. Is it a single mechanical step with obvious pass/fail? → **D:1**

---

## 3. Worked Examples

### Decomposition: 2.1 Storybook

**Independence test**: Config (2.1.1) can be verified by running `pnpm storybook` and seeing it launch. Stories (2.1.2) can be verified by opening Storybook and seeing the component rendered. **Pass.**

**Dependency-boundary test**: Stories require components from §1 — config does not. The config is a prerequisite for stories, but stories are a separate deliverable consumed by different users (developers browsing components). **Pass.**

**Distinct-deliverable test**: Config produces a `storybook` binary config + pnpm script. Stories produce `.stories.tsx` files. Different file types, different purposes. **Pass.**

→ Decomposed into 2.1.1 (config, D:3 — Storybook+Next.js has known friction) and 2.1.2 (stories, D:2 — straightforward once config is done).

### Decomposition rejected: 4.6.1 Responsive viewport tests

The task says "Add responsive viewport smoke tests at 320px, 375px, 768px, 1280px, 1440px." Five viewports, but these are parametric variants of the same test structure — not independent deliverables. You write one test, parameterize the viewport. Splitting into five sub-tasks would be artificial.

**Distinct-deliverable test**: Fail — they produce the same artifact type (test cases) in the same file.

→ Not decomposed.

### Scoring: 1.4 Reset script → D:3

- **Specification completeness**: High — the task describes exactly what to keep and remove.
- **Integration surface**: Moderate — needs to touch `src/`, `scripts/`, possibly `package.json`.
- **Verification cost**: Moderate — you must run the script and verify the result matches the spec (files present/absent). Not a single command.
- **Failure mode**: Subtle — if the script deletes architecture files or leaves example data behind, it's a silent failure.

Quick heuristic hits: "design decision" (what exactly counts as "example content" vs "architecture"?). → **D:3**

### Scoring: 4.2.3 WCAG compliance → D:4

- **Failure mode**: Silent and consequential — automated axe checks pass but real users can't use the site. axe-core only catches ~30-50% of WCAG issues.
- **Domain knowledge**: Requires understanding what WCAG 2.2 AA actually requires, not just running a tool.
- **Integration surface**: Depends on all example content from §1 being correct.
- **Verification cost**: Run automated checks, then manually review for gaps.

Quick heuristic: "failure is silent and consequential" → **D:4**

### Scoring: 2.5 pnpm audit:ci → D:1

- Fully specified: "script that fails on critical/high CVEs."
- No integration: wraps an existing pnpm command.
- Verification: run the script, it passes or fails.
- Failure: immediately visible.

Quick heuristic: single mechanical step, obvious pass/fail. → **D:1**

---

## 4. Anti-patterns

**Do not** decompose to make the TODO list look more granular. Decomposition is a claim that each sub-task is independently verifiable and deliverable. If you cannot write a verification step for a sub-task, it should not exist.

**Do not** score based on estimated time. A 2-hour documentation task can be D:1. A 30-minute CSP config task is D:4. Difficulty measures cognitive complexity and failure risk, not effort.

**Do not** score based on lines of code. One line of CSP config is D:4. A 200-line reset script could be D:3.

**Do not** inflate scores defensively beyond D:4 unless the task genuinely requires novel architectural judgment. D:5 should be rare — if more than 10% of tasks are D:5, the scoring is too generous.

**Do not** decompose tasks that are already atomic. If the task describes one file, one config, one script, or one coherent deliverable — it is one task regardless of how many "steps" it internally has.
