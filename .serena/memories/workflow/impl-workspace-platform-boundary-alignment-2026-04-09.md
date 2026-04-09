## Phase: impl
## Task: workspace docs alignment + platform export/import boundary correction
## Date: 2026-04-09

### Scope
- Verified workspace module markdown docs requested by user are already aligned with current module structure and Hexagonal + DDD language.
- Corrected platform module boundary types so ports no longer depend on application DTOs.

### Files reviewed (workspace docs)
- modules/workspace/AGENT.md
- modules/workspace/README.md
- modules/workspace/aggregates.md
- modules/workspace/application-services.md
- modules/workspace/bounded-context.md
- modules/workspace/context-map.md
- modules/workspace/domain-events.md
- modules/workspace/domain-services.md
- modules/workspace/repositories.md
- modules/workspace/subdomain.md
- modules/workspace/ubiquitous-language.md

### Files changed (platform)
- modules/platform/ports/input/index.ts
  - Moved PlatformCommandName, PlatformQueryName, PlatformCommand, PlatformQuery, PlatformCommandResult into input ports (contract ownership).
  - Removed dependency on ../../application/dtos.
- modules/platform/ports/output/index.ts
  - Removed dependency on ../../application/dtos.
  - Added read-model contract types: PlatformContextView, PolicyCatalogView, SubscriptionEntitlementsView, WorkflowPolicyView.
  - Kept outbound command result contract via import from ../input.
- modules/platform/application/dtos/index.ts
  - Removed read-model view types moved to ports/output.
- modules/platform/api/contracts.ts
  - Re-exported read-model view types from ../ports/output so API remains stable.

### Dependency-direction result
- Eliminated platform ports -> application/dtos coupling.
- Port contracts now owned under ports/input and ports/output.
- API boundary remains modules/platform/index.ts -> ./api only.

### Validation / Evidence
- ripgrep confirms no remaining `application/dtos` imports from platform ports.
- lint/build execution blocked by environment: pwsh.exe unavailable.

### Risks / Notes
- Validation commands could not be executed due missing pwsh runtime in host environment.