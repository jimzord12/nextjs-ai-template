# Domain Maker Framework

This directory contains the **Domain Book** — the authoritative record of domain understanding for the project — and the **Milestones** system that manages the work of creating and refining it.

The framework is defined in the [Domain Maker Framework spec](local://domain-maker-framework.md).

## Purpose

The Domain Book captures concepts, rules, relationships, boundaries, states, decisions, risks, and open questions that define the system — before and during implementation.

The Milestones system turns domain questions into **Single Units of Work (SUWs)**, tracks progress through explicit states, and supports promotion of completed outputs into the Domain Book.

## Directory Roles

| Path | Purpose |
|---|---|
| `status.json` | Machine bootstrap view — current SUW landscape, next action |
| `book/` | Modular Domain Book (chapters and sections) |
| `milestones/` | SUW directories with working material and state |
| `schemas/` | JSON schemas for validation |
| `templates/` | Reusable starter files for sections and SUWs |
| `scripts/` | Helper scripts for validation and reporting |
| `generated/` | Machine-produced indexes and summaries |

## SUW Lifecycle

```
planned → ready → inprogress → review → completed → promoted
                     |            |
                     v            v
                  blocked    needsrevision
```

Each SUW lives in its own directory under `milestones/` and contains at minimum `suw.json` (structured state) and `working.md` (long-form working content).

## AI Activity Model

Every `suw.json` exposes an `ai_activity` field that declares the kind of work to perform:

- **`interrogate`** — Extract and challenge domain understanding through structured questioning.
- **`synthesize`** — Consolidate fragmented material into coherent candidate output.
- **`review`** — Verify candidate output against completion criteria and adjacent knowledge.
- **`promote`** — Transform completed output into Domain Book updates.

## Quick-Start for Agents

1. Read `docs/domain-book/status.json`.
2. Resolve `next_suw` → yields a SUW directory name.
3. Open that SUW's `suw.json`.
4. Inspect `ai_activity` → determines the work mode and which files to touch.
5. Execute the activity, respecting transition gates defined in the framework spec.

## Key Rules

- Every Domain Book section lives in its own file.
- Every SUW lives in its own directory with one `suw.json` and one `working.md`.
- No SUW is marked complete without explicit completion criteria.
- No SUW is marked promoted without a promotion record.
- The Domain Book never receives raw brainstorming output — only promoted, edited content.
- Markdown for prose, JSON for structured state.
