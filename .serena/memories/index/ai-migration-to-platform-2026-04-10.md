## Date: 2026-04-10

### Index Update: modules/ai → modules/platform/subdomains/background-job

**Deleted:**
- `modules/ai/**` — entire bounded context removed

**Added:**
- `modules/platform/subdomains/background-job/domain/entities/IngestionDocument.ts`
- `modules/platform/subdomains/background-job/domain/entities/IngestionChunk.ts`
- `modules/platform/subdomains/background-job/domain/entities/IngestionJob.ts`
- `modules/platform/subdomains/background-job/domain/repositories/IIngestionJobRepository.ts`
- `modules/platform/subdomains/background-job/domain/index.ts`
- `modules/platform/subdomains/background-job/application/use-cases/ingestion.use-cases.ts`
- `modules/platform/subdomains/background-job/application/index.ts`
- `modules/platform/subdomains/background-job/adapters/InMemoryIngestionJobRepository.ts`
- `modules/platform/subdomains/background-job/adapters/ingestion-service.ts`
- `modules/platform/subdomains/background-job/adapters/index.ts`
- `modules/platform/subdomains/background-job/index.ts`

**Modified:**
- `modules/platform/api/index.ts` — added `export * from "../subdomains/background-job"`
- `modules/source/interfaces/_actions/file.actions.ts` — cutover to `ingestionService` from `@/modules/platform/api`

**Topology change:**
- `modules/ai` is no longer a bounded context in the module inventory
- `background-job` sub-domain of `modules/platform` now carries knowledge ingestion capability
