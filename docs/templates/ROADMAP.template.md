# Roadmap — <Project Name>

## Vision

One or two sentences on what this product is and who it serves. This is the
north star every milestone serves.

<What the current major version delivers, at a high level.>

---

## V1

<!--
  Milestone format is load-bearing. The `milestone-to-briefs` skill parses this
  file to start the Feature Delivery Pipeline (see docs/ROUTINES.md). For each
  milestone it extracts:

    - The heading              → `### M<N> — <Title>`
    - The one-line summary      → the `>` blockquote
    - The scope items           → the `**Scope:**` bullet list
    - The completion checklist   → the `**Done when:**` checkbox list

  Keep the headings and the two bold labels exactly as written. Number
  milestones sequentially (M1, M2, …) — the number is what features reference via
  their `milestone` field in `.scratch/features-status.json`.
-->

### M1 — <Milestone Title>

> One-line summary of what this milestone establishes and why it comes first.

**Scope:**

- <A concrete, buildable scope item>
- <Another scope item — prefer specifics over vague themes>
- <Group related sub-items under a parent bullet when helpful:>
  - <Sub-item>
  - <Sub-item>

**Done when:**

- [ ] <An observable, verifiable completion condition>
- [ ] <Another — phrase it so it's unambiguous whether it's met>
- [ ] <Tooling/quality gate, e.g. all of `pnpm lint`, `pnpm test`, `pnpm build` pass>

---

### M2 — <Milestone Title>

> One-line summary.

**Scope:**

- <Scope item>
- <Scope item>

**Done when:**

- [ ] <Completion condition>
- [ ] <Completion condition>

---

<!-- Repeat for M3, M4, … as needed. -->

### What V1 Is NOT

State the boundaries explicitly — what this version deliberately does not try to
be. Prevents scope creep and clarifies intent for agents decomposing milestones.

- <Non-goal>
- <Non-goal>

### Post-V1 (Explicitly Deferred)

Things that are real but intentionally out of scope for now. Listing them here
keeps them off the current milestones without losing them.

- <Deferred item>
- <Deferred item>

---

## V2

> One-line theme for the next major version.

- <High-level direction — not yet decomposed into milestones>
- <High-level direction>
