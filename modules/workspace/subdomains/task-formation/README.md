# task-formation

**Subdomain**: task-formation  
**Module**: workspace  
**Status**: 🏗️ Active (implemented)

## Responsibility

AI-assisted batch formation of tasks from workspace knowledge pages.

This subdomain owns:
- `TaskFormationJob` — tracks a batch job that extracts and materializes tasks from a set of knowledge page IDs.
- `ExtractTaskCandidatesUseCase` — calls the AI bounded context (`modules/ai`) to extract candidate tasks from knowledge content.
- `SubmitTaskFormationJobUseCase` — queues a new batch formation job.
- Firestore persistence via `FirebaseTaskFormationJobRepository`.
- AI delegation via `AiTaskCandidateExtractionAdapter` (wraps `modules/ai/api/server`).
- Standalone UI: `WorkspaceTaskFormationPanel`.

## Boundaries

- Does **not** own task creation — tasks are created by the `task` subdomain after candidates are confirmed.
- Does **not** contain AI model selection or safety policy — those belong to `modules/ai`.
- Communicates with `task` subdomain through workspace module `api/` boundary only.

## Layer Map

```
api/              ← public cross-subdomain entry surface
domain/
  entities/       ← TaskFormationJob
  value-objects/  ← TaskFormationJobStatus, TaskCandidate
  ports/          ← TaskCandidateExtractionPort
  repositories/   ← TaskFormationJobRepository (interface)
application/
  dto/            ← DTOs and summary projections
  use-cases/      ← SubmitTaskFormationJobUseCase, ExtractTaskCandidatesUseCase
infrastructure/
  firebase/       ← Firestore converter + collection constants
  repositories/   ← FirebaseTaskFormationJobRepository
  ai/             ← AiTaskCandidateExtractionAdapter
interfaces/
  _actions/       ← Server Actions (tfSubmitFormationJob, tfExtractTaskCandidates, …)
  queries/        ← getTaskFormationJob, listTaskFormationJobs
  components/     ← WorkspaceTaskFormationPanel (standalone UI)
```
