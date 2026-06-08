---
name: to-prd
description: >
  Synthesize conversation context or a grilling session state file into a PRD (HLD document),
  feature registry, and feature briefs, then publish all artifacts to the issue tracker.
  Use when user wants to create a PRD, turn a grilling session into a plan, produce feature briefs,
  or says "to-prd", "create PRD", "write PRD", "turn this into a PRD".
---

Takes conversation context or a grilling session state file and produces a complete PRD package.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Input

- **Primary**: Grilling session state file at `tmp/<slug>.grilling-session-state.md`. Read this file to synthesize resolved decisions into the PRD. The session state contains a decision tree (N1–Nn nodes), constraints, and open leaves.
- **Fallback**: If no session state file is provided, use the current conversation context (original behavior).

## Process

1. **Gather context**. If a grilling session state file was provided, read it. Also explore the repo to understand current state. Use the project's domain glossary (`CONTEXT.md`) vocabulary throughout, and respect ADRs in `docs/adr/`.

2. **Define test seams**. Sketch the seams at which you'll test the feature. Prefer existing seams over new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point. Check with the user that these seams match expectations.

3. **Write the HLD**. Using the [PRD template](./TEMPLATE.md), write the High-Level Design document. Synthesize all resolved decisions from the grilling session or conversation.

4. **Create feature registry**. Decompose the solution into an ordered list of features. Add a Feature Registry section (after Further Notes) using the format in [TEMPLATE.md](./TEMPLATE.md). Rules:
   - Horizontal (infrastructure) features before vertical (end-to-end) ones that depend on them
   - Phase groups features that should be built together
   - Each dependency references another feature slug from the same registry

5. **Generate feature briefs**. For each feature in the registry, produce a mini-PRD using the feature brief template in [TEMPLATE.md](./TEMPLATE.md). Each brief has: scope, acceptance criteria (checkboxes), out of scope, dependencies.

6. **Publish to issue tracker**:
   - HLD (including feature registry) → `.scratch/<feature-slug>/PRD.md`
   - Each feature brief → `.scratch/<feature-name>/brief.md`
   - Apply `ready-for-agent` triage label — no additional triage needed

## Output Artifacts

| Artifact | Location |
|----------|----------|
| HLD + Feature Registry | `.scratch/<feature-slug>/PRD.md` |
| Feature Brief (per feature) | `.scratch/<feature-name>/brief.md` |
