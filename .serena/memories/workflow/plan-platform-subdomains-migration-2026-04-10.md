## Phase: plan
## Task: migrate account/identity/notification/organization into platform subdomains
## Date: 2026-04-10

### Scope
- Reviewed platform skeleton and docs under modules/platform (adapters/api/application/docs/domain/events/infrastructure/ports/shared/subdomains + AGENT/README/index).
- Reviewed source modules: modules/account, modules/identity, modules/notification, modules/organization.
- Produced migration roadmap aligned to Hexagonal Architecture + DDD boundaries.

### Decisions / Findings
- Platform structure is Hexagonal-compliant at root level: `api` public boundary, `application/domain/ports/infrastructure` layering, and inventory-driven subdomains.
- Target subdomains for migration already exist as scaffolds but are placeholders only (`README.md` + layer index files with comments):
  - `platform/subdomains/identity`
  - `platform/subdomains/account`
  - `platform/subdomains/account-profile`
  - `platform/subdomains/organization`
  - `platform/subdomains/notification`
- Source module file counts (migration size baseline):
  - account: 25
  - identity: 23
  - notification: 21
  - organization: 31
- Target subdomain scaffold counts (each): 8 files.
- Workspace consumers currently import these modules through `/api` only; no direct internal imports detected for these four modules.

### Migration Blueprint (execution contract)
1. Phase 0 — Contract freeze + terminology mapping
   - Freeze current public APIs in source modules.
   - Create mapping table old API -> platform API facade contracts.
   - Normalize terms to platform ubiquitous language.
2. Phase 1 — Build target contracts first (inside platform)
   - Implement subdomain-level domain/application/adapters contracts in:
     - identity
     - account + account-profile (split profile concerns)
     - organization
     - notification
   - Keep all external dependencies behind existing platform output ports.
3. Phase 2 — Bridge compatibility layer
   - Keep `modules/<source>/api` as compatibility facade delegating to `modules/platform/api`.
   - Mark old facades deprecated, but keep behavior stable.
4. Phase 3 — Consumer cutover
   - Update app/modules consumers from source APIs to platform APIs.
   - Validate no behavior regression in auth/account/org/notification flows.
5. Phase 4 — Remove source internals
   - After all consumers moved, remove source `domain/application/infrastructure/interfaces` internals.
   - Retain thin API shims temporarily if needed for staged rollout.
6. Phase 5 — Final cleanup
   - Delete legacy modules only after import graph reaches zero.
   - Update docs: platform docs + bounded context docs + context map + events/repositories/app-services docs.

### Subdomain Mapping
- `modules/identity` -> `platform/subdomains/identity`
- `modules/account` -> `platform/subdomains/account` + `platform/subdomains/account-profile`
- `modules/organization` -> `platform/subdomains/organization`
- `modules/notification` -> `platform/subdomains/notification`

### Risk Controls
- Use compatibility facades to avoid breaking imports during transition.
- Avoid adapter-to-adapter coupling; all flows through ports.
- Keep event naming as facts; map/bridge legacy events where required.
- Run lint/build/tests on each migration wave.

### Validation / Evidence
- Reviewed: modules/platform/{README.md,AGENT.md,index.ts,api/*,application/index.ts,domain/index.ts,events/index.ts,infrastructure/index.ts,ports/*,shared/index.ts,docs/*,subdomains/*}
- Reviewed: modules/{account,identity,notification,organization}/{README.md,index.ts,api/index.ts,domain-events.md}
- Confirmed consumer import usage via workspace search for `@/modules/(account|identity|notification|organization)/` (api-only results).

### Deviations / Risks
- Platform subdomain READMEs are placeholders; migration governance details are not yet encoded per-subdomain.
- Source module APIs currently expose some infrastructure/UI concerns; migration should tighten API contracts to platform boundaries.

### Open Questions
- Whether to keep long-lived compatibility shims in source modules or hard-cut after one release window.
- Whether account-profile should be extracted first (parallel wave) or together with account aggregate migration.