# Grilling Session State

## Goal

Define the contract types, interfaces, and wiring that every CMS adapter implements — the normalized data shapes the rest of the template consumes — aligned with the hexagonal architecture described in the HLD.

## Topic

Feature-003: CMS Adapter Interface — reconciling the brief with the HLD's port-and-adapter architecture.

## Constraints

- Types compile cleanly under TypeScript strict mode
- No provider-specific types leak through the adapter boundary
- Local CMS adapter skeleton implements the interface (may throw "not implemented")
- Zod schemas for content validation belong to a separate feature (`content-model-schemas`)
- Content loader implementations belong to a separate feature (`content-loaders`)
- Slice component rendering belongs to a separate feature (`slice-renderer`)
- External CMS adapters (Sanity, Payload) belong to M3
- Draft/preview/visual editing are out of scope for this feature

## Decision Tree

### N1: Port granularity — monolithic vs split

- **Status:** ✅ Resolved
- **Question:** The brief describes a single `CMSAdapter` interface with `getPageBySlug` and `getGlobalData`. The HLD describes split ports: `ContentRepositoryPort`, `PreviewPort`, `VisualEditingPort`, `AssetPort`, aggregated by `CmsProviderPort`. Which model do we ship for this feature?
- **Answer:** Start monolithic. Ship one `CMSAdapter` interface with `getPageBySlug(locale, slug)` and `getGlobalData(locale)`. Return types are standalone, not coupled to methods. When M3 adds external CMS adapters, decompose into split ports as a refactor — not before.
- **Resolved in:** session 1
- **ADR:** —
- **Opened branches:** none

### N2: Naming — Models vs DTOs

- **Status:** ✅ Resolved
- **Question:** The brief uses `PageModel`, `SliceModel`, `GlobalDataModel`. The HLD uses `PageDto`, `NavigationDto`, `AssetDto`. Which naming convention?
- **Answer:** `Model` suffix. Matches `CONTEXT.md` glossary. Types are domain vocabulary, not transient wire objects.
- **Resolved in:** session 1
- **ADR:** —
- **Opened branches:** none

### N3: Slice/Section data shape

- **Status:** ✅ Resolved
- **Question:** The brief says discriminated union on `sliceType`. The HLD says sections with `unknown` fallback. What does the slice data shape look like?
- **Answer:** Open discriminated union with `unknown` fallback. Each slice has `sliceType` discriminator + typed `data` payload. Unrecognized slice types map to `{ sliceType: 'unknown'; data: Record<string, unknown> }`. Specific slice types defined later as component library grows. This feature defines the union structure, not the full type list.
- **Resolved in:** session 1
- **ADR:** —
- **Opened branches:** none

### N4: Provider registry vs factory

- **Status:** ✅ Resolved
- **Question:** The brief says "factory or config." The HLD says "provider registry keyed by provider enum, active provider selected through env-backed config." Which wiring pattern?
- **Answer:** Simple factory function (`getCmsAdapter()`) with switch on `CMS_PROVIDER` env var. Include a code comment noting that once multiple CMS adapters exist, this should be refactored to a provider registry pattern.
- **Resolved in:** session 1
- **ADR:** —
- **Opened branches:** none

### N5: Global data shape

- **Status:** ✅ Resolved
- **Question:** `getGlobalData(locale)` returns what exactly? The brief lists navigation, footer, site settings. The HLD mentions `NavigationDto`. How granular is the global data model?
- **Answer:** Structured `GlobalDataModel` with named sub-types: `navigation: NavigationModel`, `footer: FooterModel`, `siteSettings: SiteSettingsModel`. Each is its own typed model. The adapter aggregates from separate single-type sources and maps into this shape.
- **Resolved in:** session 1
- **ADR:** —
- **Opened branches:** none

### N6: Media handling

- **Status:** ⬚ Not started
- **Question:** The brief defines `MediaModel` (alt, dimensions, src, caption). The HLD defines an `AssetPort` for URL generation. Does media normalization live inside the main adapter, or is it a separate port?

### N7: File organization

- **Status:** ⬚ Not started
- **Question:** The brief says `src/content/types.ts` or a types directory. The HLD proposes `domain/`, `application/`, `infrastructure/` layer directories. Where do these types and interfaces live?

## Open Leaves

- N6 (active question)
- N7
- N6
- N7

## Notes

- The HLD (`plan/cms-agnostic-nextjs-template-hld.md`) is the primary architectural reference. The brief is a feature-scoped simplification. Tensions between the two must be resolved here.
- This feature is horizontal — it establishes vocabulary for all downstream features. Getting it right is critical.
- The Local CMS is the first adapter implementation. External adapters (Sanity, Payload) come in M3.

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Resolved |
| 🟡 | In progress |
| 🔴 | Blocked |
| ⬚ | Not started |
