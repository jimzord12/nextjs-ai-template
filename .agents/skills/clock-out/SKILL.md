---
name: clock-out
description: Wrap up a work session by validating the repo, turning the current diff into logical commits, and handing the user a push-ready summary. Use when the user wants to close shop, end a shift, do closing duties, wrap up today's work, or batch a day's coding into clean commits without pushing.
argument-hint: "Optional: commit message style or grouping preferences"
---

# Clock Out

Close a work session without cutting corners.

## Quick start

1. Inspect the working tree with `git status` and staged/unstaged diffs.
2. Run `pnpm check` before touching staging.
3. Split the current diff into the smallest sensible set of logical commits.
4. Commit each group non-interactively so Husky and commitlint run on every commit.
5. If all commits succeed, give the user a wrap-up.
6. Give the user an ultra-brief wrap-up, then ask them to push the commits.

## Hard stops

- If `pnpm check` fails, stop. Report the failure and do not stage or commit anything.
- If the diff cannot be split safely, stop and ask before committing.
- Never push to the remote yourself as part of this skill.
- Never hide failures by skipping hooks, downgrading checks, or using destructive git commands.

## Workflow

### 1. Validate first

- Run `pnpm check` from the repo root.
- If it fails, show the relevant failure and stop.

### 2. Build a commit plan

- Review `git status`, staged diff, and unstaged diff.
- Propose commit groups in dependency order before staging.
- Prefer fewer coherent commits over many tiny ones.
- Keep refactors separate from behavior changes only when the split is real and safe.
- If a file mixes concerns and hunk-splitting is risky, keep it together.

### 3. Commit group by group

- Stage only the files or hunks for the current group.
- Re-check the staged diff before committing.
- Write clear conventional-commit style messages so the local `commit-msg` hook passes.
- Commit each group non-interactively.
- If a hook fails, stop, report it, and leave the repo in its current state.


### 4. Close out with the user

End with an ultra-brief report containing:

1. The commit subjects in order.
2. A one- or two-line summary of what changed today.
3. Any remaining uncommitted changes, if any.
4. A direct prompt asking the user to push the commits to the remote.

## Output style

- Keep the final report terse.
- Lead with the commit list.
- Do not include a long narrative unless the user asks for it.