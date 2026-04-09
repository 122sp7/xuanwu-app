## Phase: impl
## Task: align modules/workspace to domain-first Hexagonal + DDD dependency direction
## Date: 2026-04-09

### Goal
Make workspace composition flow from domain outward, reduce reverse dependencies, and enforce API-only module boundary usage.

### Main fixes
1. Cross-module API boundary alignment kept in place:
   - No remaining `@/modules/workspace/interfaces/api` imports under `modules/`.

2. Domain-first contract extraction for query/read language:
   - Added `modules/workspace/domain/entities/WorkspaceMemberView.ts`
   - Added `modules/workspace/domain/entities/WikiContentTree.ts`
   - Moved canonical query/read model type ownership to domain entities.

3. Layer direction updates:
   - Updated `ports/input/WorkspaceQueryPort.ts` to import query types from `domain/entities/*`.
   - Updated `ports/output/WorkspaceQueryRepository.ts` and `ports/output/WikiWorkspaceRepository.ts` to import from domain entities.
   - Updated infrastructure adapters:
     - `infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts`
     - `infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts`
     to avoid `application/dtos` imports.
   - Updated application services/use-cases to consume query/read types from domain entities.

4. Public API contract alignment:
   - Updated `api/contracts.ts` to export canonical contracts from domain (aggregates, entities, value-objects, events) instead of routing through `interfaces/api/contracts/*`.
   - Kept `interfaces/api/contracts/*` as thin adapters re-exporting domain-owned contracts.

5. Compatibility kept:
   - Existing `application/dtos/workspace-member-view.dto.ts` and `application/dtos/wiki-content-tree.dto.ts` are now compatibility re-export shims to domain entities.

### Verification outcomes
- No remaining `@/modules/workspace/interfaces/api` imports in `modules/`.
- No `infrastructure/* -> application/*` imports remain in workspace.
- No `api/contracts.ts -> interfaces/api/contracts/*` dependency remains.
- Ports query contracts now depend on `domain/entities/*` for read/query language types.

### Note
- Full lint/build command execution remains blocked in this environment due to missing `pwsh` runtime for powershell tool execution.