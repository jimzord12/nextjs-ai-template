---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it in the workspace `tmp/` directory.

Name the file `xxx-handoff-slug.md`, where `xxx` is a zero-padded three-digit index and `slug` is a short kebab-case summary of the handoff focus. Choose the index by scanning existing handoff files in `tmp/` and using the smallest available positive integer, reusing gaps. For example, if `001-handoff-*.md` is missing and `002-handoff-*.md` exists, the next handoff file must use `001`.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

## Available scripts
- **`scripts/delete-handoff.ts`** — Delete a single handoff by index, slug, filename, or path. Supports `--dry-run`, `--json`, `--list`.
- **`scripts/delete-all-handoffs.ts`** — Delete all handoff files. Supports `--dry-run`, `--json`.

## Cleanup

Delete a single handoff:

```bash
npx tsx scripts/delete-handoff.ts <identifier>
npx tsx scripts/delete-handoff.ts --dry-run 001
npx tsx scripts/delete-handoff.ts --list
```

Delete all handoff files:

```bash
npx tsx scripts/delete-all-handoffs.ts
npx tsx scripts/delete-all-handoffs.ts --dry-run --json
```
