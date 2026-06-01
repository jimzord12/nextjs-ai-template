# Implementation Methods

Method-specific workflows dispatched by the `Method:` field in each issue.

## TDD (`Method: tdd`)

Test-driven development with vertical tracer bullets. One test → one implementation → repeat.

### Per acceptance criterion

1. **RED** — Write ONE test for the next behavior. The test must exercise the public interface and describe observable behavior, not implementation structure. Run it — it must fail.
2. **GREEN** — Write the minimal code to make the test pass. No speculative features, no anticipation of future tests.
3. **Repeat** for the next criterion.

### After all tests pass

4. **REFACTOR** — Look for:
   - Extracted duplication
   - Deep modules (small interface, deep implementation)
   - SOLID principles where natural
   - Run tests after each refactor step

### Rules

- One test at a time. Never write all tests upfront — that produces tests coupled to imagined structure.
- Only enough code to pass the current test.
- Never refactor while RED. Get to GREEN first.
- Tests verify behavior through public interfaces. If a refactor breaks a test, the test was testing structure, not behavior.

For deeper TDD patterns (mocking, interface design, deep modules), see the `/tdd` skill's reference files.

## Chore (`Method: chore`)

Direct implementation without TDD discipline. Used for configuration fixes, documentation updates, dependency changes, scaffolding, or other non-behavioral work.

### Steps

1. Make the required changes
2. Run `next build` (or equivalent) to verify no breakage
3. Run `pnpm test` if the affected area has existing tests
4. No new tests required unless the chore introduces new behavioral logic

## Unknown or missing method

If `Method:` is absent or unrecognized:

- Default to the **chore** workflow
- Note in the completion report that the method was unspecified
- If the work clearly involves behavioral logic (new features, complex business rules), suggest to the user that `Method: tdd` would be more appropriate
