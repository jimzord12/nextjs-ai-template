---
name: grill-with-docs
description: Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline as decisions crystallise. Use when user wants to stress-test a plan against their project's language and documented decisions.
---

## Pipeline Integration

When invoked in the pipeline context (e.g. "grill this brief"), the skill operates on a feature directory under `.scratch/features/`.

### Input

1. Determine the active feature by running `pnpm features-cli get-feature`. This returns the feature slug (e.g. `001-my-feature`).
2. Read the brief from `.scratch/features/<slug>/BRIEF.md`. The brief is the primary input — the grilling session stress-tests it.

### Output

- Write the session state to `.scratch/features/<slug>/GRILL_SESSION.md` using the template at `docs/templates/grilling/GRILLING-SESSION-STATE.template.md`.
- For each branch that receives a detailed response, create a separate file using `docs/templates/grilling/GRILLING-SESSION-RESPONSE.template.md` and link it from the corresponding node in `GRILL_SESSION.md`.

### Template usage

- **State file** (`GRILL_SESSION.md`): Maintains the full decision tree, constraints, open leaves, and status of every node. Created on the first question, updated after every resolved decision — never batch updates.
- **Response files**: One per resolved branch. Linked from the node's `Answer` field as `[explanation](./grill-responses/N<N>-response.md)`. Store these in `.scratch/features/<slug>/grill-responses/`.

### Update cadence

Update `GRILL_SESSION.md` on **every** resolved decision. Do not batch. Each resolution writes:
- The chosen answer in the node.
- Any new child branches opened by that answer.
- The `Open Leaves` section pruned accordingly.

### Done condition

The session is **done** when the `Open Leaves` section is empty — every leaf of the decision tree has been resolved. At that point:
- Confirm to the user that the grilling session is complete.
- State that the session is ready for `to-prd`.
- The `GRILL_SESSION.md` file serves as the handoff artifact for the next pipeline stage.

### Non-pipeline usage

When invoked outside the pipeline (no active feature, or user starts a standalone grilling session), all pipeline integration is skipped. The skill falls back to its original behavior: inline updates to `CONTEXT.md` glossary and ADRs as described below.


<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

</what-to-do>

<supporting-info>

## Domain awareness

During codebase exploration, also look for existing documentation:

### File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. Do not treat `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

</supporting-info>
