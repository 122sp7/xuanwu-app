# 0015 Module `api/` Layer Removal — `index.ts` as Sole Public Boundary

| Field | Value |
|---|---|
| Status | **Accepted** |
| Date | 2025 |
| Supersedes | ADR 0007 (Infrastructure in api/ Layer) |
| Resolves Smells | 1100, 1103, 1200 (§3), 1300, 1400, 1401, 1402, 1403, 1404, 2100, 3100, 4100, 5100, 5203 |

---

## Context

The codebase previously used a dedicated `api/` subdirectory inside each module as its cross-module public boundary:

```
src/modules/<context>/api/index.ts          ← was: module public boundary
src/modules/<context>/subdomains/<sub>/api/ ← was: subdomain public boundary
```

This layer accumulated multiple design smells documented in SMELL-INDEX.md:
- Layer violations (Firebase SDK inside `api/`)
- Dependency leakage (wildcard `export * from "../application"` and `export * from "../interfaces"`)
- Tight coupling (78 files depending on monolithic `platform/api`)
- Low cohesion (mixed responsibility: infra API + service API + UI components in one barrel)
- Change amplification (single `api/index.ts` as choke point for 68–78 consumers)

## Decision

**The `api/` subdirectory layer has been removed from all modules.**

The module root `index.ts` is now the **sole cross-module public boundary**:

```
src/modules/<context>/index.ts    ← new: only public boundary
```

### Migration Mapping

| Old import path | New import path |
|---|---|
| `@/modules/platform/api` | `@/modules/platform` |
| `@/modules/platform/api/ui` | `@/modules/platform` (UI exports at module root) |
| `@/modules/notion/api` | `@/modules/notion` |
| `@/modules/workspace/api` | `@/modules/workspace` |
| `@/modules/notebooklm/api` | `@/modules/notebooklm` |
| `@/modules/<context>/api` | `@/modules/<context>` |

### New Boundary Contract

- `src/modules/<context>/index.ts` exposes only the stable semantic capability contract.
- It must NOT expose repository factories, container wiring, or internal composition helpers.
- Internal composition helpers belong under module-local `interfaces/` or `infrastructure/` paths.
- UI components are exported from the module root `index.ts` (not via a separate `api/ui.ts`).

## Consequences

### Positive

- Eliminates the dual-boundary confusion between `api/` and module root.
- Removes the choke-point that caused 68–78 file change propagation when `platform/api` was touched.
- Forces explicit, selective exports — no accidental wildcard leakage from `application/` or `interfaces/`.
- Cross-module import reads as `@/modules/<target>` — same shape as all other module aliases.

### Migration Notes

- All smell ADRs referencing `api/` paths (1100, 1103, 1200, 1300, 1400–1404, 2100, 3100, 4100, 5100, 5203) remain as historical records; their described problems are resolved by this layer removal.
- Instructions and docs referencing `@/modules/<target>/api` must use `@/modules/<target>` instead.
- ESLint rules targeting `modules/**/api/**/*.ts` globs are no longer needed and should be removed or updated.

## Related

- [0007 Infrastructure in api/ Layer](./0007-infrastructure-in-api-layer.md) — superseded
- [1100 Layer Violation](./1100-layer-violation.md) — resolved
- [1400 Dependency Leakage](./1400-dependency-leakage.md) — resolved
- [2100 Tight Coupling](./2100-tight-coupling.md) — resolved
