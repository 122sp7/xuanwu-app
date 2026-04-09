## Phase: impl
## Task: refactor workspace-audit into workspace subdomain audit
## Date: 2026-04-09

### Scope
- Implemented functional ownership move from standalone `modules/workspace-audit` to `modules/workspace/subdomains/audit`.
- Preserved compatibility via legacy module re-exports.
- Switched active app/workspace consumers to `@/modules/workspace/api`.

### Files added (new canonical ownership)
- modules/workspace/subdomains/audit/api/index.ts
- modules/workspace/subdomains/audit/application/use-cases/list-audit-logs.use-cases.ts
- modules/workspace/subdomains/audit/domain/entities/AuditLog.ts
- modules/workspace/subdomains/audit/domain/repositories/AuditRepository.ts
- modules/workspace/subdomains/audit/domain/schema.ts
- modules/workspace/subdomains/audit/infrastructure/firebase/FirebaseAuditRepository.ts
- modules/workspace/subdomains/audit/interfaces/components/AuditStream.tsx
- modules/workspace/subdomains/audit/interfaces/components/WorkspaceAuditTab.tsx
- modules/workspace/subdomains/audit/interfaces/queries/audit.queries.ts

### Files changed
- modules/workspace/api/contracts.ts
  - Re-export audit domain contracts/types from workspace subdomain audit API.
- modules/workspace/api/facade.ts
  - Re-export audit query functions.
- modules/workspace/api/ui.ts
  - Re-export audit UI components.
- modules/workspace/interfaces/web/components/screens/WorkspaceDetailScreen.tsx
  - import path moved from `@/modules/workspace-audit/api` to `@/modules/workspace/api`.
- app/(shell)/organization/audit/page.tsx
  - import path moved from `@/modules/workspace-audit/api` to `@/modules/workspace/api`.
- modules/workspace-audit/api/index.ts
  - converted to compatibility re-export to `@/modules/workspace/subdomains/audit/api`.
- modules/workspace-audit/index.ts
  - reduced to `export * from "./api"` compatibility root.
- modules/workspace-audit/AGENT.md
  - documented compatibility-module status and canonical import guidance.
- modules/workspace/subdomains/audit/README.md
  - documented subdomain ownership and integration rule.

### Design and dependency direction result
- Canonical audit implementation now sits under workspace bounded context subdomain.
- Workspace parent API now composes and exposes audit capabilities (`contracts/facade/ui`).
- Consumer direction improved: app/workspace screens now consume audit via workspace API boundary.
- Legacy `workspace-audit` preserved as compatibility facade to avoid immediate breakage.

### Validation / Evidence
- `app/**/*` and `modules/**/*` no longer import `@/modules/workspace-audit/api` in runtime code.
- no direct imports found to `workspace/subdomains/audit/domain/*` from outside intended layers.
- `modules/workspace-audit/index.ts` now API-only compatibility barrel.

### Known environment limitation
- lint/build command execution remains blocked in this runtime because `pwsh.exe` is unavailable.