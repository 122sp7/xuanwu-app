## Phase: impl
## Task: complete workspace alignment for Hexagonal Architecture + DDD
## Date: 2026-04-09

### Goal
Fix remaining concrete misalignments after doc refresh so modules/workspace can be considered aligned in practice.

### Changes made
1. Fixed cross-module boundary bypass imports to API-only surface:
   - `modules/workspace-scheduling/interfaces/WorkspaceSchedulingTab.tsx`
   - `modules/source/interfaces/queries/file.queries.ts`
   - `modules/source/interfaces/components/WorkspaceFilesTab.tsx`
   - Changed `@/modules/workspace/interfaces/api` -> `@/modules/workspace/api`

2. Updated workspace structure documentation to include existing `docs/` directory:
   - `modules/workspace/README.md`
   - `modules/workspace/AGENT.md`

### Verification
- Repo-wide search under `modules/` found no remaining `@/modules/workspace/interfaces/api` imports.
- Workspace docs now reflect `docs/` in structure contract.

### Note
- `pwsh` unavailable in this environment, so lint/build via powershell tool remains unavailable.