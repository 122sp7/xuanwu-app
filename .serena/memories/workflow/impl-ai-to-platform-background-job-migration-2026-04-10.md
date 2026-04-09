## Phase: impl
## Task: Migrate modules/ai into modules/platform/subdomains/background-job
## Date: 2026-04-10

### Scope
Refactored `modules/ai` (Knowledge Ingestion Pipeline) into `modules/platform/subdomains/background-job` as a proper platform capability following Hexagonal Architecture + DDD.

### What Was in modules/ai
- Domain: `IngestionJob` aggregate, `IngestionDocument` value entity, `IngestionChunk` value entity, `IngestionStatus` state machine, `IngestionJobRepository` port
- Application: `RegisterIngestionDocumentUseCase`, `AdvanceIngestionStageUseCase`
- Infrastructure: `InMemoryIngestionJobRepository`
- API facade: `KnowledgeIngestionApi` class (tightly coupled — defect: instantiates own repo)
- One real consumer: `modules/source/interfaces/_actions/file.actions.ts`

### Target: modules/platform/subdomains/background-job

**New files created (clean rewrite — no copy):**
- `domain/entities/IngestionDocument.ts` — value entity
- `domain/entities/IngestionChunk.ts` — value entity + `IngestionChunkMetadata`
- `domain/entities/IngestionJob.ts` — aggregate with state machine (`canTransitionIngestionStatus`), added `createdAtISO` field (was missing in original)
- `domain/repositories/IIngestionJobRepository.ts` — output port (renamed with `I` prefix)
- `domain/index.ts` — domain barrel
- `application/use-cases/ingestion.use-cases.ts` — 3 use cases + `IngestionResult<T>` custom result type
- `application/index.ts` — application barrel
- `adapters/InMemoryIngestionJobRepository.ts` — default in-memory adapter (keyed by document.id)
- `adapters/ingestion-service.ts` — composition root (replaces `KnowledgeIngestionApi` class)
- `adapters/index.ts` — adapters barrel
- `background-job/index.ts` — updated subdomain barrel

### Improvements Over Original (禁止直接複製)
1. `KnowledgeIngestionApi` class replaced by `ingestionService` plain object — no tight coupling to repo
2. Result type: custom `IngestionResult<T>` with `ok`/`data`/`error` discriminant — returns actual entity data
3. Error codes: `KN_*` prefix → `INGESTION_*` (platform-aligned)
4. `IngestionJob` now has `createdAtISO` (was missing in original)
5. `IngestionResult` uses `DomainError` from `@shared-types` for structured error objects
6. `IngestionStatus` re-exported via adapters layer for consumer convenience

### Consumer Updated
- `modules/source/interfaces/_actions/file.actions.ts`:
  - `import { KnowledgeIngestionApi } from "@/modules/ai/api"` → `import { ingestionService } from "@/modules/platform/api"`
  - `new KnowledgeIngestionApi()` removed
  - `knowledgeIngestionApi.registerDocument(...)` → `ingestionService.registerDocument(...)`

### Platform API Updated
- `modules/platform/api/index.ts` now exports `* from "../subdomains/background-job"`

### Deleted
- `modules/ai` — entire directory removed after consumer cutover

### Validation / Evidence
- `npm run build` — no errors, full route tree rendered successfully
- Zero new TypeScript errors

### Architecture Compliance
- `domain/` has zero framework dependencies
- `adapters/` implements domain ports
- `application/` depends only on domain abstractions (via constructor injection)
- Platform `api/` is the only cross-module entry point

### Open Items
- `InMemoryIngestionJobRepository` is still the only adapter — a `FirebaseIngestionJobRepository` should be implemented when production persistence is needed
- `background-job` subdomain currently only covers knowledge ingestion; generic job scheduling patterns (cron, retry, queue) are not yet modeled
