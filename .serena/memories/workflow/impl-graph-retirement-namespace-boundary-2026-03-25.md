## Phase: impl
## Task: retire modules/graph and assess namespace ownership
## Date: 2026-03-25

### Scope
- Verify whether `modules/graph` and `modules/ai` are fully migrated and can be retired.
- Validate whether `modules/namespace` should move into `modules/content`.

### Decisions / Findings
- `modules/ai` had no remaining tracked runtime files; ownership already migrated to `modules/agent` + `modules/retrieval`.
- `modules/graph` still had two residual files (`api/index.ts`, `domain/entities/view-config.ts`) and no runtime imports; both were removed.
- `modules/namespace` should remain independent, not merged into `modules/content`.
  - Reason: contract-owned slug registration/resolution, collision rules, lifecycle (`active/suspended/archived`), and routing concerns are a distinct bounded context from content CRUD.

### Validation / Evidence
- Runtime import search found no `@/modules/graph` or `@/modules/ai` code usage in app/modules/providers/debug/packages TS/TSX files.
- `npm run build` passed after graph retirement and doc sync.

### Deviations / Risks
- Some documentation may still contain historical wording in non-critical pages; core ownership docs used in this change were synchronized.

### Open Questions
- none