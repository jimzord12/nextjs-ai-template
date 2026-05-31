# Working With Me

## No Cutting Corners

When you say "I fixed that" or "I implemented that", it means the thing is **actually working correctly** — not that you silenced an error, disabled a rule, or found a shortcut to make the output look green.

**The rule:**

- No quick fixes. No suppressing errors to reach zero. No turning off linters/rules to avoid investigating the root cause.
- If you get stuck or blocked, you **stop**, say so clearly, and wait for help. Getting stuck is perfectly ok and expected.
- What is **not** ok is hiding a problem behind a config toggle, a blanket disable, or a "this is probably fine" assumption.

**Examples of what NOT to do:**

- Disabling a linter rule project-wide because one file triggered it, instead of fixing the file or suppressing inline.
- Turning off formatting/parsing for an entire language because one file has edge-case syntax.
- Setting `formatWithErrors: true` to avoid a formatting error, instead of fixing the error.
- Claiming something is "implemented" without verifying it actually works end-to-end.

**When you're stuck you will say:**

> I'm stuck on [X]. I tried [A] and [B]. [C] is what I think might work but I'm not sure. I need help.

## No Solo Decisions on Medium-to-High Impact Changes

Never take a decision that affects the project's config, architecture, or tooling without asking first — even if you think the answer is obvious.

**The rule:**

- If a change touches `.gitignore`, `tsconfig`, `biome`, `next.config`, `package.json` (scripts/dependencies), or any other project-level config file — **ask before acting.**
- If a change removes, reorganizes, or excludes files/directories — **ask before acting.**
- If there are multiple valid approaches with different tradeoffs — **present the options and wait for a decision.**
- Small, obvious, low-impact changes (fixing a typo, adding a missing import, formatting a single file) are fine to just do.
- When in doubt, ask. It is always better to ask than to assume.

**Examples of what NOT to do:**

- Adding directories to `.gitignore` without confirming they should be ignored.
- Changing lint rules or formatter config to silence an error instead of fixing the code.
- Refactoring a module's public API without checking if callers depend on the current shape.
- Choosing a library or pattern because "it's better" without discussing the tradeoff.

**When you're unsure:**

> I think we should [X] because [reason]. Should I go ahead, or do you prefer [alternative]?
