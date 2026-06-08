# Implementation Methods

Method-specific workflows dispatched by the `Method:` field in each issue.

## TDD (`Method: tdd`)

Test-driven development with vertical tracer bullets. One test → one implementation → repeat.

Invoke this Agent skill: [tdd](../tdd).

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
