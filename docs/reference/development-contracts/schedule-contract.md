---
title: Schedule development contract
description: Full MDDD contract for bidirectional request-fulfillment scheduling with intelligent task-skill matching.
---

# Schedule development contract

## Purpose

This contract defines the target full MDDD architecture for a bidirectional scheduling system:

- demand side: workspace submits requests
- supply side: organization fulfills requests

Canonical domain flow:

`Request -> Task -> Match -> Assignment -> Schedule`

This contract is the source of truth for domain boundaries, aggregates, invariants, workflow state transitions, matching, scheduling, events, and module structure.

## Bounded contexts

| Context | Responsibility |
| --- | --- |
| Request Intake Context | capture and govern workspace demand (`Request`) |
| Fulfillment Context | decompose request to executable `Task` units and drive assignment decisions |
| Matching Context | evaluate qualified candidates and produce `Match` outcomes |
| Scheduling Context | allocate time slots, prevent conflicts/overload, and maintain `Schedule` |
| Projection & Notification Context | publish read models and integration events |

## Domain model (structured)

### Core entities

| Entity | Role | Key fields |
| --- | --- | --- |
| `Request` | Workspace demand aggregate root | `requestId`, `workspaceId`, `organizationId`, `requestedWindow`, `priority`, `requiredSkills`, `constraints`, `preferences`, `status`, `createdBy`, `createdAt` |
| `Task` | Executable work unit derived from request | `taskId`, `requestId`, `title`, `requiredCapabilities`, `estimatedMinutes`, `effortWeight`, `locationType`, `timeWindow`, `status` |
| `Match` | Candidate evaluation result for a task | `matchId`, `taskId`, `candidateId`, `score`, `scoreBreakdown`, `disqualificationReasons`, `constraintViolations`, `rank`, `generatedAt` |
| `Assignment` | Offer/acceptance/rejection lifecycle between task and assignee | `assignmentId`, `taskId`, `assigneeId`, `organizationId`, `offeredAt`, `respondBy`, `status`, `decisionReason` |
| `Schedule` | Time allocation and execution plan for accepted assignments | `scheduleId`, `assignmentId`, `calendarSlot`, `timezone`, `status`, `version`, `createdAt`, `updatedAt` |

### Supporting entities

| Entity | Role | Key fields |
| --- | --- | --- |
| `AccountUser` | Person identity and eligibility source | `accountUserId`, `organizationMemberships`, `teamMemberships`, `capabilities`, `active` |
| `Organization` | Fulfillment owner and policy boundary | `organizationId`, `policySet`, `workRules`, `timezone`, `businessHours` |
| `Team` | Execution sub-boundary in organization | `teamId`, `organizationId`, `capacityProfile`, `supportedCapabilities` |
| `Capability` | Stable capability taxonomy entry | `capabilityId`, `name`, `category` |
| `Skill` | Proficiency-bearing concrete skill signal | `skillId`, `capabilityId`, `level`, `lastValidatedAt` |
| `Availability` | Assignee availability ledger | `accountUserId`, `calendarSlots`, `exceptions`, `maxConcurrentAssignments` |
| `CalendarSlot` | Time-slot value object for planning | `startAt`, `endAt`, `timezone` |
| `Constraint` | Hard requirement for matching/scheduling | `constraintType`, `parameters`, `scope` |
| `Preference` | Soft requirement affecting ranking | `preferenceType`, `weight`, `parameters` |

### Value objects

- `RequestPriority`
- `TimeWindow`
- `LocationRequirement`
- `SkillRequirement`
- `CapabilityRequirement`
- `ScoreBreakdown`
- `ConflictSet`
- `LoadProfile`

## Aggregates definition

### `RequestAggregate` (root: `Request`)

Boundary:

- owns request creation/submission/cancellation/closure lifecycle
- owns immutable demand snapshot after submit

Invariants:

1. submitted request must contain at least one required capability or skill
2. `workspaceId` and `organizationId` become immutable after `submitted`
3. cancelled/closed request cannot emit new executable tasks

### `TaskAggregate` (root: `Task`)

Boundary:

- owns task decomposition, readiness, execution status
- links back to one `Request`

Invariants:

1. task must reference exactly one request
2. task cannot transition to `assigned` without accepted assignment
3. completed/cancelled task is terminal

### `AssignmentAggregate` (root: `Assignment`)

Boundary:

- owns offer, accept, reject, cancel, complete lifecycle
- ties one task to one assignee decision stream

Invariants:

1. only match-qualified candidates can be offered
2. accepted assignment must be unique active assignment for the task
3. rejected/cancelled assignment cannot move to accepted

### `ScheduleAggregate` (root: `Schedule`)

Boundary:

- owns slot reservation, reschedule, cancellation, completion
- references accepted assignment

Invariants:

1. no overlapping active slot for same assignee in same time window
2. load must not exceed assignee overload policy
3. schedule cannot exist without accepted assignment

### `ProjectionAggregate` (root: projection stream)

Boundary:

- consumes domain events and materializes read models
- does not own business decisions

Invariants:

1. projection is idempotent by event id/version
2. stale event versions must be ignored

## Matching engine contract

### Objective

Given a `Task` and organizational candidate pool, produce ranked `Match` results with deterministic filtering and scoring.

### Inputs

- task requirements (`CapabilityRequirement`, `SkillRequirement`, constraints)
- candidate profiles (`AccountUser`, `Skill`, `Capability`, team membership)
- candidate availability snapshots
- organization policy and compliance constraints
- request preferences

### Pipeline

1. **Eligibility filter (hard constraints)**
   - organization/team scope
   - mandatory capability/skill threshold
   - legal/compliance constraints
2. **Availability pre-check**
   - candidate has feasible slot(s) in requested window
3. **Scoring**
   - skill fit score
   - capability depth score
   - historical reliability score
   - preference alignment score
   - continuity/affinity score
4. **Penalty and disqualification**
   - conflict penalties
   - overload risk penalties
   - explicit disqualification reasons
5. **Ranking and cut-off**
   - deterministic tie-breakers
   - top-N shortlist output

### Output

`MatchResult[]` where each item includes:

- `candidateId`
- `score`
- `scoreBreakdown`
- `constraintViolations`
- `disqualificationReasons`
- `rank`

## Scheduling logic contract

### Objective

Allocate accepted assignments to conflict-free calendar slots while enforcing workload and policy limits.

### Responsibilities

- reserve or update `CalendarSlot`
- detect and prevent overlap conflicts
- enforce max concurrent assignments and workload limits
- support reschedule and cancellation with auditability

### Rules

1. same assignee cannot have overlapping active schedules
2. schedule duration must satisfy task estimated effort window
3. organization/team blackout windows block allocation
4. overload threshold violation blocks confirmation
5. reschedule creates explicit event trail; no silent overwrite

### Decision outcomes

- `Scheduled`
- `RejectedByConflict`
- `RejectedByOverload`
- `RejectedByPolicy`
- `RescheduleRequired`

## Workflow states

### `RequestStatus`

`draft -> submitted -> under_review -> accepted | rejected -> cancelled | closed`

State rules:

- only `draft` can transition to `submitted`
- `cancelled` and `closed` are terminal

### `TaskStatus`

`pending -> ready_for_matching -> matched -> assigned -> in_progress -> completed | cancelled`

State rules:

- `assigned` requires accepted assignment
- `completed` is terminal

### `AssignmentStatus`

`proposed -> offered -> accepted | rejected -> cancelled -> completed`

State rules:

- `accepted` is required before scheduling
- `rejected` and `cancelled` cannot return to `offered`

### `ScheduleStatus`

`draft -> confirmed -> in_execution -> completed | cancelled | conflicted`

State rules:

- `confirmed` requires conflict and overload checks pass
- `conflicted` requires explicit reschedule or cancellation

## Event-driven design

### Required events

- `RequestCreated`
- `TaskMatched`
- `AssignmentAccepted`
- `TaskCompleted`

### Recommended domain event stream

- `RequestSubmitted`
- `TaskDecomposed`
- `MatchGenerated`
- `AssignmentOffered`
- `AssignmentRejected`
- `ScheduleConfirmed`
- `ScheduleRescheduled`
- `ScheduleCancelled`
- `TaskStarted`
- `TaskCompleted`

### Event ownership

| Event | Emitted by aggregate | Purpose |
| --- | --- | --- |
| `RequestCreated` / `RequestSubmitted` | `RequestAggregate` | start fulfillment workflow |
| `TaskMatched` / `MatchGenerated` | matching domain service + `TaskAggregate` | publish candidate ranking outcome |
| `AssignmentAccepted` | `AssignmentAggregate` | lock assignee decision and unlock scheduling |
| `TaskCompleted` | `TaskAggregate` or `ScheduleAggregate` | close execution lifecycle and downstream settlement/notification |

## Flow description

1. Workspace creates and submits `Request`
2. Request is decomposed into one or more `Task`
3. Matching engine evaluates candidates and produces ranked `Match`
4. Organization offers assignment to selected candidate
5. Candidate accepts -> `AssignmentAccepted`
6. Scheduling service allocates conflict-free slot and confirms `Schedule`
7. Execution lifecycle updates task progress
8. Task completion emits `TaskCompleted` and updates projections

## Suggested folder structure (modules/schedule)

```text
modules/schedule/
  domain/
    mddd/
      entities/
        Request.ts
        Task.ts
        Match.ts
        Assignment.ts
        Schedule.ts
      value-objects/
        SkillRequirement.ts
        CapabilityRequirement.ts
        CalendarSlot.ts
        TimeWindow.ts
        ScoreBreakdown.ts
        Constraint.ts
        Preference.ts
      services/
        matching-engine.ts
        scheduling-engine.ts
      events/
        RequestCreated.ts
        TaskMatched.ts
        AssignmentAccepted.ts
        TaskCompleted.ts
      repositories/
        RequestRepository.ts
        TaskRepository.ts
        MatchRepository.ts
        AssignmentRepository.ts
        ScheduleRepository.ts
        OrganizationStructureRepository.ts
        MemberAvailabilityRepository.ts
        ProjectionRepository.ts
      policies/
        matching-policy.ts
        scheduling-policy.ts
      index.ts
  application/
    use-cases/
      mddd/
        submit-request.use-case.ts
        decompose-request-to-tasks.use-case.ts
        generate-task-matches.use-case.ts
        offer-assignment.use-case.ts
        accept-assignment.use-case.ts
        build-schedule.use-case.ts
        complete-task.use-case.ts
    services/
      orchestrators/
        request-to-fulfillment.orchestrator.ts
    index.ts
  interfaces/
    _actions/
      schedule-request.actions.ts
      task-matching.actions.ts
      assignment.actions.ts
      schedule.actions.ts
    queries/
      schedule-projection.queries.ts
    index.ts
  infrastructure/
    firebase/
      FirebaseRequestRepository.ts
      FirebaseTaskRepository.ts
      FirebaseMatchRepository.ts
      FirebaseAssignmentRepository.ts
      FirebaseScheduleRepository.ts
      FirebaseProjectionRepository.ts
      FirebaseOrganizationStructureRepository.ts
      FirebaseMemberAvailabilityRepository.ts
    events/
      OutboxSchedulingEventBus.ts
    mappers/
      request.mapper.ts
      task.mapper.ts
      match.mapper.ts
      assignment.mapper.ts
      schedule.mapper.ts
```

## Migration notes (current vs target)

- Current implementation remains a limited slice (derived workspace schedule read model + request submission + acknowledgement).
- This contract defines the **target full MDDD** architecture and must be implemented incrementally by explicit slices.
- New behavior must follow aggregate boundaries and event ownership above; avoid introducing ad hoc mutable flags into derived read models.

## Acceptance gates

A new scheduling/task slice is accepted only if:

1. aggregate root and invariants are explicit
2. state transition rules are validated in domain/application layer
3. matching and scheduling decisions are separated into dedicated domain services
4. emitted events are idempotent and owned by the correct aggregate
5. repository/adapters stay in infrastructure and do not leak into domain entities
