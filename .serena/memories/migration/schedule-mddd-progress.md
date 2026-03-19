# Schedule MDDD Progress

Branch: copilot/redesign-scheduling-task-system
Date: 2026-03-19

## Summary

This branch introduces a full MDDD domain sub-package at modules/schedule/domain/mddd/ modelling the legacy workforce scheduling domain as explicit aggregates. The PR #9 defines the full bidirectional request→fulfillment workflow contract.

## Domain MDDD sub-package (modules/schedule/domain/mddd/)

### Entities
- Request — workspace-originated staffing/schedule request; status transitions via REQUEST_STATUS_TRANSITIONS; factory: createRequest
- Schedule — time allocation aggregate; status transitions via SCHEDULE_STATUS_TRANSITIONS; factory: createSchedule
- Task — assignable unit derived from a Request; status transitions via TASK_STATUS_TRANSITIONS; factory: createTask
- Assignment — organization-owned fulfillment lifecycle; status transitions via ASSIGNMENT_STATUS_TRANSITIONS; factory: createAssignment
- Match — task-skill/capability evaluation result; factory: createMatch
- References — cross-aggregate ID reference value object

### Value objects
- WorkflowStatuses — canonical status sets: REQUEST_STATUSES, SCHEDULE_STATUSES, TASK_STATUSES, ASSIGNMENT_STATUSES; typed variables: RequestStatus, ScheduleStatus, TaskStatus, AssignmentStatus
- Requirements — skill/capability requirements model
- Scheduling — time window and scheduling constraint model

### Domain services
- matching-engine.ts — computeScore, matchTaskCandidates, satisfiesHardConstraints, includesAllRequiredSkills, includesAllRequiredCapabilities, hasSufficientSkillLevel; constants: MATCHING_SCORE_WEIGHTS, SKILL_LEVEL_RANK
- scheduling-engine.ts — canAllocateSchedule, detectScheduleConflicts, isSlotWithinAvailability, overlaps, resolveConcurrencyLimit, resolveLoadLimit; constant: ACTIVE_SCHEDULE_STATUSES

### Repository ports (interfaces only)
- RequestRepository, ScheduleRepository, TaskRepository, AssignmentRepository, MatchRepository, MemberAvailabilityRepository, OrganizationStructureRepository, ProjectionRepository

### Events
- ScheduleDomainEvents — domain event type definitions

### Utils
- create-id.ts — deterministic ID generator for aggregates

## Application layer (modules/schedule/application/use-cases/mddd/)

- RunScheduleMdddFlowUseCase — orchestrates the full matching + scheduling + assignment creation flow
  - Input: RunScheduleMdddFlowInput
  - Output: RunScheduleMdddFlowResult (CommandResult-aligned)
  - Constants: ASSIGNMENT_REJECTION_REASON_UNSPECIFIED, DEFAULT_ASSIGNMENT_LOAD_WEIGHT, REVIEW_REJECTION_REASON_UNSPECIFIED

## Interface layer (modules/schedule/interfaces/)

- _actions/schedule-mddd.actions.ts — Next.js "use server" thin wrapper around RunScheduleMdddFlowUseCase
- _actions/schedule-request.actions.ts — request submission actions
- _actions/schedule.actions.ts — legacy schedule actions (acknowledge, list)
- queries/schedule.queries.ts — query wrappers
- components/WorkspaceScheduleTab.tsx — shell component

## Infrastructure layer (modules/schedule/infrastructure/)

- firebase/FirebaseScheduleRequestRepository.ts — Firestore adapter for Request
- firebase/FirebaseWorkspaceScheduleRepository.ts — Firestore adapter for derived workspace schedule items
- firebase/FirebaseScheduleAcknowledgementRepository.ts — Firestore adapter for acknowledgement
- firebase/converters/schedule-request.converter.ts — Firestore ↔ domain converter
- default/DefaultWorkspaceScheduleRepository.ts — fallback/default adapter

## Legacy slices still in modules/schedule/domain/ (non-mddd)

- entities/ScheduleItem.ts, ScheduleRequest.ts, ScheduleAcknowledgement.ts — original migrated slice for workspace readiness / request submission / acknowledgement; these remain active and should not be removed before the MDDD aggregates have full Firebase adapters.

## What is NOT yet implemented

- Firebase adapters for the new MDDD aggregates (task, assignment, match, schedule) — MDDD flow currently runs in-memory
- Persistent projection repository for schedule_items
- Domain event routing to notification module
- Organization-owned HR governance UI
- Full request lifecycle: draft, cancel, close

## Key rule from README

Derived item status and persisted acknowledgement state are separate concerns and must not be merged into one mutable document shape.
