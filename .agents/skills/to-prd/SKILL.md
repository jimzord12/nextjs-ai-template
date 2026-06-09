---
name: to-prd
description: >
  Synthesize a grilling session into a PRD (HLD document) with a feature registry
  that maps to existing features in features-status.json.
  Use when user wants to create a PRD, turn a grilling session into a plan,
  or says "to-prd", "create PRD", "write PRD", "turn this into a PRD".
---

Takes a resolved grilling session and produces a PRD with feature registry.

## Input

- **Primary**: Grilling session at `.scratch/features/<id>-<slug>/GRILL_SESSION.md`. Determine the active feature directory by running `pnpm issues-manager get-feature` — this returns the feature `id` and `slug`. The session file contains resolved decisions from the grilling loop (decision tree nodes, constraints, conclusions).
- **Fallback**: If no grilling session file exists, use the current conversation context.

## Process

1. **Locate feature directory**. Run `pnpm issues-manager get-feature` to get the current feature `id` and `slug`. The feature directory is `.scratch/features/<id>-<slug>/`.

2. **Gather context**. Read the grilling session file (`GRILL_SESSION.md`). Explore the repo to understand current state. Use the project's domain glossary (`CONTEXT.md`) vocabulary throughout, and respect ADRs in `docs/adr/`.

3. **Define test seams**. Sketch the seams at which you'll test the feature. Prefer existing seams over new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point. Check with the user that these seams match expectations.

4. **Write the HLD**. Using the [PRD template](./TEMPLATE.md), write the High-Level Design document. Synthesize all resolved decisions from the grilling session.

   **Token optimization**: The PRD must be a refined, condensed version of the grilling session — resolve the decision tree into implementation decisions. Drop the Q&A format entirely; keep only the conclusions. Do not reproduce the grilling dialogue or enumerate alternatives that were rejected.

5. **Create feature registry**. Reference features that already exist in `features-status.json` (created by `milestone-to-briefs`). The registry maps PRD sections to those existing features — it does NOT create new features. Add a Feature Registry section (after Further Notes) using the format in [TEMPLATE.md](./TEMPLATE.md). Rules:
   - Horizontal (infrastructure) features before vertical (end-to-end) ones that depend on them
   - Phase groups features that should be built together
   - Each dependency references another feature slug from `features-status.json`

6. **Do NOT generate feature briefs**. Feature briefs were already created in step 1 of the pipeline (`milestone-to-briefs`). The PRD's feature registry maps to those existing briefs. Do NOT regenerate briefs.

7. **Publish PRD**: Write `PRD.md` to `.scratch/features/<id>-<slug>/PRD.md`.

## Output Artifacts

| Artifact | Location |
|----------|----------|
| HLD + Feature Registry | `.scratch/features/<id>-<slug>/PRD.md` |
