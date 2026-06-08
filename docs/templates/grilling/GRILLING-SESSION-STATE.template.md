# Grilling Session State

## Goal

`[The final outcome this grilling session wants to achieve — one or two sentences describing what "done" looks like.]`

## Topic

`[What we're grilling — one sentence.]`

## Constraints

- `[Invariant discovered during grilling — things that narrowed later options.]`
- `[Add more as they emerge. Remove this block if none yet.]`

## Decision Tree

### N1: `[Short question title]`

- **Status:** ✅ Resolved
- **Question:** `[Full question text.]`
- **Answer:** `[Chosen option or summary.]`
- **Resolved in:** session `[ISO timestamp or label]`
- **ADR:** `[filename or —]`
- **Opened branches:** N2, N3

### N2: `[Short question title]`

- **Status:** 🔴 Blocked — depends on `[Nx]`
- **Question:** `[Full question text.]`

### N3: `[Short question title]`

- **Status:** 🟡 In Progress
- **Question:** `[Full question text.]`
- **Partial answer:** `[Notes captured so far. Remove if none.]`
- **Active in:** session `[ISO timestamp or label]`

## Open Leaves

Unresolved branches that need a session:

- `N3` → `N4`, `N5` (branches depend on answer)
- `N6` (standalone, unblocked)

## Notes

`[Cross-cutting observations, reminders, or anything that doesn't fit a node. Remove this block if empty.]`

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Resolved |
| 🟡 | In progress |
| 🔴 | Blocked |
| ⬚ | Not started |

## Usage Rules

- One node per design question. Number sequentially: N1, N2, N3…
- **Opened branches** lists the child nodes this answer created.
- A new AI session reads **Open Leaves** to know where to resume.
- When a node is resolved, move it out of **Open Leaves** and fill in the answer fields.
- If a resolved node has a detailed writeup, store it separately using the `GRILLING-SESSION-RESPONSE` template and link it from the answer field.
