# Project Rules

## Git Rules

- **_NEVER_** run destructive git commands without explicit user permission. Before running, briefly explain what the command does and why it's needed. Examples of destructive commands: `git reset --hard`, `git push --force`, `git clean -fd`, `git checkout -- .`, `git branch -D`, `git rebase`, `git filter-branch`, `git reflog expire`.

## Docs Rules

- Whenever a file is added under `docs/`, update `docs/index.md`.
- Whenever a file is deleted from `docs/`, update `docs/index.md`.
