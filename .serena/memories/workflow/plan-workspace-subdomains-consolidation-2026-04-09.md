## Phase: plan
## Task: consolidate workspace-* modules into workspace/subdomains
## Date: 2026-04-09

### Scope
Plan migration of:
- modules/workspace-audit -> modules/workspace/subdomains/audit
- modules/workspace-feed -> modules/workspace/subdomains/feed
- modules/workspace-flow -> modules/workspace/subdomains/workflow
- modules/workspace-scheduling -> modules/workspace/subdomains/scheduling

while preserving API-only cross-module access and Hexagonal + DDD dependency direction.

### Current-state findings
- `workspace/subdomains/*` skeleton directories already exist with empty layer folders.
- Four standalone modules currently own real logic and are consumed from app/workspace UI via:
  - `@/modules/workspace-audit/api`
  - `@/modules/workspace-feed/api`
  - `@/modules/workspace-flow/api`
  - `@/modules/workspace-scheduling/api`
- `workspace-flow` already has clean `index.ts -> ./api` boundary.
- `workspace-feed` and `workspace-scheduling` currently leak interfaces/domain from module root barrels and should be tightened during migration.

### Target architecture decision
- Keep `workspace` as parent bounded context.
- Treat audit/feed/workflow/scheduling as **workspace subdomains** implemented under `modules/workspace/subdomains/*` with full hexagonal slices:
  - `api/`, `application/`, `domain/`, `infrastructure/`, `interfaces/`, `ports/`
- Add parent-level anti-corruption/public facades under `modules/workspace/api` that expose stable contracts to app/other modules.

### Migration strategy
- Use **phased compatible migration** (strangler pattern):
  1) Mirror implementation into `workspace/subdomains/*`.
  2) Add compatibility adapters in old module APIs that delegate to new subdomain APIs.
  3) Migrate all imports to `@/modules/workspace/api` (preferred) or temporary stable compatibility endpoints.
  4) Remove old module internals after consumers reach zero.

### Work packages
1. Contract freeze + canonical naming
   - Freeze external API contracts for audit/feed/flow/scheduling.
   - Normalize terms to workspace ubiquitous language + subdomain-specific docs.

2. Subdomain API foundations
   - Create `modules/workspace/subdomains/{audit,feed,workflow,scheduling}/api/*`.
   - Move/copy contracts first, then facades, then use-cases and adapters.

3. Dependency-direction hardening
   - Enforce `interfaces -> application -> domain <- infrastructure` in each subdomain.
   - Ensure ports own contracts where applicable; avoid ports depending on application DTOs.

4. Parent workspace public composition
   - Add/expand `modules/workspace/api` to expose subdomain capabilities as workspace-owned surfaces.
   - Keep cross-module imports API-only through workspace boundary.

5. Consumer migration
   - Replace app/module imports from standalone workspace-* modules to workspace parent API surfaces.
   - Keep temporary compatibility re-exports during rollout.

6. Decommission legacy modules
   - Remove internals from `workspace-audit/feed/flow/scheduling` once import count is zero.
   - Leave short redirect barrels only if needed during final transition window, then remove.

7. Docs + governance
   - Update `modules/workspace/*.md` and `modules/workspace/subdomains/*/README.md` to reflect ownership.
   - Update bounded-context/module map docs where these modules are currently listed as independent contexts.

### Validation and gates
- Gate A: no forbidden cross-layer imports in each migrated subdomain.
- Gate B: no imports remain from app/modules to old standalone module internals.
- Gate C: root/module public exports are API-only (no interfaces/domain leakage).
- Gate D: docs and terminology reflect final ownership and context map.

### Risks
- Consumer breakage from path changes.
- Temporary dual-write/dual-read drift if compatibility layer is inconsistent.
- Over-merging could blur bounded-context boundaries if workflow/feed/audit/scheduling semantics diverge.

### Recommended rollout order
1) audit (smallest, least coupled)
2) scheduling
3) feed
4) flow (largest, most integration-heavy)

### Open questions
- Should `workspace-flow` remain an independent supporting bounded context for strategic reasons, with only UI composition moving under workspace, or be fully merged as a subdomain implementation?
- Preferred final import policy: strictly `@/modules/workspace/api` only, or allow `@/modules/workspace/subdomains/*/api` for selected internal consumers?