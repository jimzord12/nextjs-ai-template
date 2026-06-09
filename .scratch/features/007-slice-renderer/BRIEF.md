# Slice Renderer

**Type**: horizontal
**Phase**: 2
**Dependencies**: `cms-adapter-interface`, `content-model-schemas`

## Scope

The pipeline from CMS adapter → normalized `PageModel` → component registry → rendered React components. The core rendering engine.

Includes:
- **`SliceRegistry`** — a map from `sliceType` string to React component. New slices register themselves (or are auto-registered via convention).
- **`SliceRenderer` component** — takes a `SliceModel[]` array, looks up each slice's component in the registry, passes the typed data as props. Handles unknown slice types gracefully (fallback or warning, no crash).
- **Component props typing** — each slice component receives its specific props type derived from the discriminated union. Type-safe at the component level.
- **Slice boundary** — each rendered slice is wrapped in a consistent container (section with id for anchor linking, optional spacing/layout tokens).
- **Proving the "2-file operation"** — document and demonstrate that adding a new slice type requires exactly: (1) a Zod schema in `content-model-schemas`, (2) a React component registered in the `SliceRegistry`. No other files touched.

## Acceptance Criteria

- [ ] `SliceRegistry` maps `sliceType` strings to React components
- [ ] `SliceRenderer` component renders a `SliceModel[]` array to React elements
- [ ] Unknown slice types are handled gracefully (logged warning, visible fallback in dev)
- [ ] Each slice component receives correctly typed props (no `any`)
- [ ] Adding a new slice type is demonstrably a 2-file operation
- [ ] Slice boundary wrapper provides consistent section semantics
- [ ] TypeScript strict mode passes

## Out of Scope

- Specific slice component implementations for Hotel Example (see `hotel-example` feature)
- CMS adapter implementation (see `cms-adapter-interface` feature)
- Routing / page generation (see `hybrid-routing` feature)
- Storybook stories for slices (M2)

## Notes

This is the architectural centerpiece of the template. The discriminated union on `sliceType` is what makes the whole pipeline type-safe. The registry pattern keeps slice addition mechanical. Consider a convention-based approach (file naming → auto-registration) vs. explicit registration — the simpler option wins for V1.
