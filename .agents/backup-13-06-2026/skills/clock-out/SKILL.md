---
name: clock-out
description: Wrap up a work session by validating the repo, grouping the diff into logical change sets, stashing each group, then fanning out parallel subagents that create branches, commits, PRs, and monitor CI — following the repo's GitHub Flow strategy. Use when the user wants to close shop, end a shift, wrap up today's work, or batch a day's coding into PRs.
argument-hint: "Optional: grouping preferences or override branch names"
---

# Clock Out

Close a work session with a full GitHub Flow pipeline: validate → group → stash → branch → commit → PR → CI.

## Quick start

1. Validate the repo with `pnpm check`.
2. Inspect the diff and cluster changes into logical groups.
3. Stash each group using its destined branch name as the stash message.
4. Fan out parallel `task` subagents — one per stash — to create branches, commit, push, open PRs, and monitor CI.
5. Report a structured summary of all PRs and CI status.

## Hard stops

- `pnpm check` fails → stop. Do not stash, commit, or push anything.
- `gh auth status` fails → stop. Report the failure. No PRs can be created.
- A git hook fails during commit → stop. Leave the repo as-is and report.
- Never push directly to `main`.
- Never auto-merge PRs.
- Never skip hooks, downgrade checks, or use destructive git commands.
- Never hide failures. Report everything — passing and failing.

## Prerequisites

Before starting, confirm:

- `git` is available and the working directory is a git repo.
- `gh` CLI is installed and authenticated (`gh auth status` succeeds).
- The repo has a remote called `origin` pointing to GitHub.

If any prerequisite fails, stop and report.

## Workflow

### Phase 1: Validate

- Run `pnpm check` from the repo root.
- If it fails, show the relevant failure output and stop.

### Phase 2: Build a commit plan

- Review `git status`, staged diff, and unstaged diff.
- Cluster changes into the smallest sensible set of logical groups.
- Prefer fewer coherent groups over many tiny ones.
- Keep refactors separate from behavior changes only when the split is real and safe.
- If a file mixes concerns and hunk-splitting is risky, keep it together.
- If the diff cannot be split safely, ask the user before proceeding.

### Phase 3: Classify and name each group

For each group, determine the branch prefix based on the nature of the changes:

| Prefix | When to use |
|---|---|
| `feature/` | New files, new pages, new components, new exports |
| `bugfix/` | Fixes in test files, error handling, regression fixes |
| `chore/` | `package.json`, `biome.json`, `tsconfig`, `.github/`, dependency updates |
| `docs/` | Files under `docs/`, `*.md` changes, README updates |
| `refactor/` | No behavioral changes — restructuring, renaming, reordering |

Pick a short, descriptive slug after the prefix. Examples:

- `feature/add-dark-mode`
- `bugfix/fix-auth-redirect`
- `chore/bump-nextjs`
- `docs/update-architecture`
- `refactor/extract-layout-component`

Present the proposed groups and branch names to the user for confirmation before stashing.

### Phase 4: Stash each group

For each group, stage only its files/hunks, then stash:

```bash
git stash push -m "feature/add-dark-mode" -- <files...>
```

Key rules:

- The stash message **must** be exactly the branch name (e.g., `feature/add-dark-mode`).
- Stage only the files belonging to the current group before stashing.
- If a file needs to be split across groups, use `git add -p` for hunk-level staging.
- Verify with `git stash list` after each stash that the message is correct.
- If stashing fails, stop and report. Do not proceed with partial stashes.

After all groups are stashed, confirm the working tree is clean (`git status`).

### Phase 5: Fan out parallel subagents

Spawn one `task` subagent per stash group. All subagents run in parallel — they are fully independent.

**Subagent assignment template:**

Each subagent receives these instructions:

1. **Create branch from main:**
   ```bash
   git fetch origin main
   git checkout -b <branch-name> origin/main
   ```

2. **Pop the matching stash:**
   ```bash
   STASH_INDEX=$(git stash list | grep -F "<branch-name>" | head -1 | cut -d: -f1)
   git stash pop "$STASH_INDEX"
   ```

3. **Commit all changes:**
   - Write a clear conventional-commit message.
   - Stage everything on the branch (`git add -A`).
   - Commit non-interactively so hooks run.
   - If a hook fails, stop and report the error. Do not force the commit.

4. **Push the branch:**
   ```bash
   git push -u origin <branch-name>
   ```

5. **Create a pull request using `gh pr create`:**
   - Title: conventional-commit style summary of the change.
   - Body must follow the PR template from `.github/PULL_REQUEST_TEMPLATE.md`:

   ```markdown
   ## What

   <!-- Brief description of what this PR does -->

   ## Why

   <!-- Context or motivation — why is this change needed -->

   ## How

   <!-- Key implementation details worth reviewing -->

   ## Testing

   <!-- How you verified this works — commands, manual steps -->

   ## Checklist

   - [x] `pnpm check` passes (pre-validated)
   - [ ] `pnpm test` passes (awaiting CI)
   - [ ] `pnpm build` passes (awaiting CI)
   - [ ] Doctor score ≥ 80 (awaiting CI)
   ```

   - Set the base branch to `main`.

6. **Monitor CI:**
   ```bash
   gh pr checks <pr-url> --watch
   ```
   - Wait until all checks resolve (pass or fail).
   - If CI fails, report the failing check names and do **not** retry or merge.
   - If CI passes, report success.

7. **Return results:** Each subagent must return a structured result:
   - Branch name
   - Commit hash
   - PR URL
   - CI status: `pass` | `fail` | `error`
   - Failing checks (if any)

### Phase 6: Close out with the user

After all subagents complete, produce an ultra-brief report:

1. **PR summary table:**

   | Branch | PR | CI | Status |
   |---|---|---|---|
   | `feature/add-dark-mode` | #42 | ✅ pass | Ready for review |
   | `bugfix/fix-auth` | #43 | ❌ fail | `lint` failed |

2. **One- or two-line summary** of what changed today.
3. **Any remaining uncommitted changes** (if the working tree is not clean).
4. **Next steps:** which PRs need attention (failed CI, needs review).

Do not auto-merge anything. The user reviews and merges at their discretion.

## Error handling

- If a subagent fails (commit hook, push rejection, PR creation error), report it in the summary table with status `error` and include the error message.
- Partial success is acceptable — some PRs may succeed while others fail. Report all of them.
- If all subagents fail, report that and suggest the user inspect the stashes with `git stash list`.

## Edge cases

- **No changes to commit:** If `pnpm check` passes but the working tree is clean, say so and exit.
- **Single group:** Still follow the full workflow — stash, subagent, PR. Consistency over shortcuts.
- **Mixed concern files:** If a file spans multiple groups and cannot be safely split by hunk, keep it in the larger group and note it in the report.
- **Branch name collision:** If a branch with the same name already exists on the remote, append a `-2` suffix and note it in the report.

## Output style

- Keep the final report terse.
- Lead with the PR summary table.
- Do not include a long narrative unless the user asks for it.
