# Schedule MDDD Migration Progress

**Branch:** `copilot/redesign-scheduling-task-system`  
**PR #9:** docs(schedule): define full MDDD contract for bidirectional request→fulfillment workflow  
**Last verified:** 2026-03-19

## Overall Status: Domain + Infrastructure COMPLETE; UI integration partially started

## Domain Layer — `modules/schedule/domain/mddd/`

### Entities (6)
- `Assignment.ts` — ScheduleMdddAssignment
- `Match.ts` — ScheduleMdddMatch
- `References.ts` — cross-entity reference aggregation
- `Request.ts` — ScheduleMdddRequest
- `Schedule.ts` — ScheduleMddd (aggregate root)
- `Task.ts` — ScheduleMdddTask

### Value Objects (4)
- `WorkflowStatuses.ts`
- `Requirements.ts`
- `Scheduling.ts`
- `Projection.ts` — `ScheduleMdddFlowProjection` interface (read-model)

### Repository Ports (9)
- `AssignmentRepository.ts`
- `MatchRepository.ts`
- `MemberAvailabilityRepository.ts`
- `OrganizationStructureRepository.ts`
- `ProjectionRepository.ts` — write-side projection
- `ProjectionQueryRepository.ts` — `ScheduleMdddProjectionQueryRepository` read-side
- `RequestRepository.ts`
- `ScheduleRepository.ts`
- `TaskRepository.ts`

### Domain Services (2)
- `matching-engine.ts`
- `scheduling-engine.ts`

### Events
- `ScheduleDomainEvents.ts`

### Errors
- `errors.ts` — `SCHEDULE_MDDD_ERROR_CODES` enum, `ScheduleMdddDomainError` class

### Utils
- `create-id.ts`

## Application Layer — `modules/schedule/application/use-cases/mddd/`

| Use Case File | Class | Status |
|---------------|-------|--------|
| `run-schedule-mddd-flow.use-case.ts` | `RunScheduleMdddFlowUseCase` | ✅ |
| `cancel-schedule.use-case.ts` | `CancelScheduleUseCase` | ✅ |
| `reject-schedule-assignment.use-case.ts` | `RejectScheduleAssignmentUseCase` | ✅ |
| `reject-schedule-request.use-case.ts` | `RejectScheduleRequestUseCase` | ✅ |

## Infrastructure Layer — `modules/schedule/infrastructure/firebase/`

### MDDD Adapters (all implemented ✅)
- `FirebaseMdddAssignmentRepository.ts`
- `FirebaseMdddMatchRepository.ts`
- `FirebaseMdddProjectionRepository.ts` — exports `appendEventType`, `applyEvent`
- `FirebaseMdddRequestRepository.ts`
- `FirebaseMdddScheduleRepository.ts`
- `FirebaseMdddTaskRepository.ts`

### Legacy Adapters (kept for backwards compatibility)
- `FirebaseScheduleAcknowledgementRepository.ts`
- `FirebaseScheduleRequestRepository.ts`
- `FirebaseWorkspaceScheduleRepository.ts`

> ⚠️ Previous memory stated "Firebase adapters not yet implemented" — INCORRECT.  
> All 6 `FirebaseMddd*Repository` adapters are COMPLETE.

## Interface Layer — `modules/schedule/interfaces/`

### Server Actions — `_actions/schedule-mddd.actions.ts`
- `runScheduleMdddFlow`
- `cancelSchedule`
- `rejectScheduleAssignment`
- `rejectScheduleRequest`
- `createRunFlowUseCase` (factory helper)

### Queries
- `queries/schedule-mddd.queries.ts`
  - `getScheduleMdddFlowProjection` — fetch single projection
  - `listWorkspaceScheduleMdddFlowProjections` — list projections for workspace
  - `projectionRepository` — shared repo instance
- `queries/schedule.queries.ts`
  - `getWorkspaceSchedule` — legacy schedule list query via `FirebaseWorkspaceScheduleRepository`

### UI component status
- `components/WorkspaceScheduleTab.tsx` already exists
- It currently mixes:
  - legacy schedule list data from `getWorkspaceSchedule`
  - MDDD projection list data from `listWorkspaceScheduleMdddFlowProjections`
  - MDDD write actions from `schedule-mddd.actions.ts`
- This means the UI migration has started, but read-model consolidation is not finished yet

## Development Contract

See `docs/reference/development-contracts/schedule-contract.md` — defines:
- Bidirectional request→fulfillment workflow
- All domain event contracts
- Acceptance criteria and delivery gates

## Next Steps (Priority Order)

1. **Unify read model in UI** — refactor `WorkspaceScheduleTab` to clearly separate or converge legacy list vs MDDD projection data
2. **Promote MDDD-first screen contract** — ensure screen states map directly to request/task/match/assignment/schedule projection statuses
3. **Schedule state machine** — add XState machine wiring for workflow transitions and action affordances
4. **Integration tests** — end-to-end flow tests for run→cancel/reject paths and projection refresh
5. **Legacy migration** — retire legacy query/repository path once projection-based view fully replaces it
6. **Firestore indexes** — confirm `firestore.indexes.json` covers projection queries
