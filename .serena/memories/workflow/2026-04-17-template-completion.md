# src/modules/template — Completion Status (2026-04-17)

## Scope
All 3 stub subdomains (generation, ingestion, workflow) in `src/modules/template/subdomains/` are now fully scaffolded.

## What Was Done

### generation subdomain (✅ Complete)
- domain: `GeneratedTemplate` (uses `GenerationId` VO), `GenerationId`, `GenerationRepository`, `GenerationDomainService`, `GenerationCompletedEvent`, `domain/index.ts`
- application: `GenerateTemplateDTO`, `GenerationResultDTO`, `GenerateTemplatePort`, `GenerationRepositoryPort`, `AiGenerationPort`, `GenerateTemplateUseCase`, `application/index.ts`
- adapters: inbound http (`GenerationController`, `routes.ts`) + queue (`GenerationQueueHandler`), outbound firestore (`FirestoreGenerationRepository`) + ai (`AiGenerationAdapter` stub)

### ingestion subdomain (✅ Complete)
- `IngestionJob.ts` entity upgraded: `id: string` → `id: IngestionId` + added `markProcessing()` method
- domain: `IngestionId`, `IngestionJobRepository`, `IngestionDomainService`, `IngestionJobStartedEvent`/`IngestionJobCompletedEvent`, `domain/index.ts`
- application: `StartIngestionDTO`, `IngestionJobResponseDTO`, `StartIngestionPort`, `IngestionRepositoryPort`, `StoragePort`, `StartIngestionUseCase`, `application/index.ts`
- adapters: inbound http + queue, outbound firestore (`FirestoreIngestionJobRepository`) + storage (`CloudStorageAdapter` stub)

### workflow subdomain (✅ Complete)
- `TemplateWorkflow.ts` entity upgraded: `id: string` → `id: WorkflowId`
- domain: `WorkflowId`, `TemplateWorkflowRepository`, `WorkflowDomainService`, `WorkflowInitiatedEvent`/`WorkflowCompletedEvent`, `domain/index.ts`
- application: `InitiateWorkflowDTO`, `WorkflowResponseDTO`, `InitiateWorkflowPort`, `WorkflowRepositoryPort`, `InitiateWorkflowUseCase`, `application/index.ts`
- adapters: inbound http (`WorkflowController`, `routes.ts`), outbound firestore (`FirestoreWorkflowRepository`)

### Root barrel
- `src/modules/template/index.ts` — now exports generation, ingestion, workflow domain + application symbols in addition to document subdomain

## Established Patterns (for all new modules)
1. **Entity ID**: use Value Object class (e.g., `FooId`), not `string`; VO has `create(raw)`, `generate()`, `toString()`, `equals()` using `uuid` pkg
2. **Entity factory**: `static create(params: Pick<Props, 'id' | ...>)` returns entity with sensible defaults; timestamp field named `createdAt`
3. **Firestore adapter pattern**: inline `FirestoreLike` interface (`get/set/delete`), avoids direct Firebase SDK import
4. **AI adapter pattern**: stub class that throws `Error('not yet implemented')`, with TODO comment for Genkit wiring
5. **Port alias pattern**: `export type FooRepositoryPort = FooRepository` (type alias, not re-declaration)
6. **Relative import depth**: adapters/inbound/http/*.ts needs `../../../application/...` (3 levels up)

