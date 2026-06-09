# Implementation Methods

Method-specific workflows dispatched by the `Method:` field in each issue.

The Features CLI lives at `scripts/Features CLI/` and runs via `pnpm features-cli <command>`.

## TDD (`Method: tdd`)

Test-driven development with strict red-green-refactor discipline. The subagent MUST follow these phases in order:

### RED — Write a failing test first

1. Read the issue acceptance criteria and identify the expected behavior
2. Write a test that asserts the expected behavior — it MUST fail
3. Run `pnpm test` and confirm the test fails for the right reason (not a syntax error)
4. Do NOT write any implementation code at this stage

### GREEN — Minimum implementation

1. Write the absolute minimum code required to make the failing test pass
2. Run `pnpm test` and confirm the test now passes
3. Do not add extra features, edge cases, or polish — just make it green

### REFACTOR — Clean up

1. Clean up the code while keeping tests green
2. Remove duplication, improve naming, tighten types
3. Run `pnpm test` after each refactor step to confirm nothing broke

### VERIFY — Final confirmation

1. Run `pnpm test` to confirm all tests pass
2. Run `pnpm build` to confirm no type or build errors
3. Verify every acceptance criterion has evidence

### Reference

For full TDD skill documentation, see [tdd](../tdd).

## Chore (`Method: chore`)

Direct implementation without TDD discipline. Used for configuration fixes, documentation updates, dependency changes, scaffolding, or other non-behavioral work.

### Steps

1. Make the required changes
2. Run `pnpm build` to verify no breakage
3. Run `pnpm test` if the affected area has existing tests
4. No new tests required unless the chore introduces new behavioral logic

## Unknown or missing method

If `Method:` is absent or unrecognized:

- Default to the **chore** workflow
- Note in the completion report that the method was unspecified
- If the work clearly involves behavioral logic (new features, complex business rules), suggest to the user that `Method: tdd` would be more appropriate
