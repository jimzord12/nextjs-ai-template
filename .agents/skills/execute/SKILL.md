---
name: execute
description: Discover ready-for-agent issues from the local issue tracker, pick 1-3, and implement them using the method specified in each issue (TDD, chore). Use when user wants to pick up work, implement issues, work on the backlog, or says "execute", "do issues", "pick up work", "start working".
---

# Execute

# Execute

Discover `ready-for-agent` issues, let the user pick 1-3, implement them, mark them done.

The issue tracker and triage label vocabulary should already be configured — run `/setup-matt-pocock-skills` if not.

## Orchestration Principles

You are the **orchestrator, not the implementer**. Your job is to:

1. **Scan** — find ready issues, present them to the user
2. **Load context** — read the issue, PRD, domain docs, and codebase area
3. **Delegate** — hand implementation to a subagent with everything it needs
4. **Judge** — review the subagent's output for correctness and completeness
5. **Close** — mark the issue done or send it back for rework

**You MUST NOT implement code yourself.** Every line of production code, test code, or configuration must be written by a subagent. You may read files to build context for delegation, but you never edit files directly (except issue status updates in step 5).

If a subagent's output is incomplete or incorrect, re-delegate with sharper instructions — do not fix it yourself.

## Workflow

### 1. Scan for ready issues

Scan `.scratch/` for issue files with `Status: ready-for-agent`. Collect all matches across all feature directories.

Present a numbered table:

| # | Issue | Feature | Method | Blocked by |
|---|-------|---------|--------|------------|

If nothing is `ready-for-agent`, say so and suggest `/triage` or `/to-issues`.

### 2. User picks 1-3

Ask the user to pick 1-3 issues by number. Warn if:

- Any picked issue has unresolved blockers (show which)
- Multiple picked issues touch overlapping files (they'll run sequentially)

### 3. Load context

For each picked issue, read:

- The full issue file (body, acceptance criteria, blocked-by)
- The parent PRD if referenced under `## Parent`
- `CONTEXT.md` and applicable ADRs in `docs/adr/` for the area the issue touches
- The codebase area the issue modifies — explore before delegating

Use the project's domain glossary from `CONTEXT.md` throughout.

Build a **delegation brief** for each issue containing:
- The issue body and all acceptance criteria
- The method to follow (from `Method:` field — see [METHODS.md](METHODS.md))
- The relevant domain context (terms, conventions, constraints)
- The files and modules the subagent will need to touch
- Any dependencies on other issues or external state

### 4. Delegate implementation

Spawn one subagent per issue. Use the `task` agent type for all implementation work.

- **Independent issues** (no shared files) → spawn in parallel in a single `task` batch
- **Overlapping issues** → spawn sequentially, completing one fully before delegating the next

Each subagent assignment MUST include:
- The full delegation brief from step 3
- The method workflow to follow (TDD or chore — copy the relevant section from [METHODS.md](METHODS.md))
- Explicit instruction to **skip all gates, linters, and formatters** (the orchestrator runs those once at the end)
- The acceptance criteria as a verifiable checklist
- Any file paths, conventions, or constraints discovered during context loading

### 5. Judge output

When a subagent returns, review its output critically:

- Does every acceptance criterion have evidence of being met?
- Did the subagent follow the correct method (TDD red-green-refactor, or chore steps)?
- Are there obvious gaps — untested branches, missing error handling, hardcoded values?
- Does the code match the project's existing style and conventions?

**If the output is incomplete or incorrect:** re-delegate to a new subagent with a sharper brief that calls out exactly what was wrong. Do NOT fix it yourself.

**If the output is acceptable:** proceed to step 6.

### 6. Verify

After all subagents complete and pass judgment, run verification yourself:

- `pnpm test` — all tests must pass
- Build verification (`next build` or equivalent)
- Fix any failures by re-delegating to a subagent with specific instructions about what broke

### 7. Mark done

For each completed issue, update its file:

- `Status: ready-for-agent` → `Status: done`
- Check off completed acceptance criteria: `[ ]` → `[x]`
- Leave unchecked any criteria that could not be met, with a note explaining why

### 8. Report

After all picked issues are done, summarise:

- What was implemented (per issue)
- Tests added or modified
- Acceptance criteria met vs. unmet (with reasons)
- Build and test results