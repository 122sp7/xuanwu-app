# Schedule Module

## Purpose

The schedule module owns derived workspace schedule items, workspace request submission, and schedule-specific acknowledgement behavior. It does not own finance lifecycle, workspace lifecycle, or ad hoc UI-only schedule state.

## Current boundary

- derived read model for workspace schedule items
- workspace-originated request submission write-side
- persisted acknowledgement write-side for individual items
- schedule queries resolve workspace and finance context inside the module from `workspaceId`
- no broader request draft, cancellation, or fulfillment workflow yet

## Migration status against legacy schedule capability

The legacy schedule capability captured in `.github/skills/xuanwu-app-skill/references/files.md` is broader than the current MDDD slice.

What is migrated today:

- workspace-scoped derived readiness milestones based on workspace lifecycle and finance timing
- workspace-originated schedule request submission with `requiredSkills` snapshot capture
- per-item acknowledgement persisted separately from the derived read model

What is still outside the current module and remains to be migrated into explicit MDDD slices:

- organization-owned HR schedule governance and pending proposal review
- full request lifecycle such as draft, cancellation, and closure flows
- staffing assignment lifecycle such as assign, reject, cancel proposal, and complete assignment
- persistent organization/account `schedule_items` single source of truth and related projection boundaries
- schedule domain events and downstream notification routing such as `organization:schedule:assigned`

Treat the current `modules/schedule` package as the workspace readiness / request submission / acknowledgement slices, not the full legacy workforce scheduling domain.

## Source of truth

- development contract: `/home/runner/work/xuanwu-app/xuanwu-app/docs/reference/development-contracts/schedule-contract.md`
- architecture baseline: `/home/runner/work/xuanwu-app/xuanwu-app/ARCHITECTURE.md`

## Current interface entrypoints

- `modules/schedule/interfaces/queries/schedule.queries.ts`
- `modules/schedule/interfaces/_actions/schedule.actions.ts`
- `modules/schedule/interfaces/_actions/schedule-request.actions.ts`

## Key rule

Derived item status and persisted acknowledgement state are separate concerns and must not be merged into one mutable document shape.

## Target MDDD design for the legacy workforce scheduling domain

The legacy schedule capability referenced from `.github/skills/xuanwu-app-skill/references/files.md` models a bidirectional workflow:

- workspace submits a staffing or schedule request
- organization reviews and fulfills the request
- task-skill matching decides whether fulfillment can proceed

That legacy domain should migrate into explicit aggregates and services instead of being folded into `WorkspaceScheduleItem`.

### Domain model

#### Bounded contexts inside the legacy schedule capability

1. **Workspace request**
   - owns request submission from a workspace
   - captures request timing, staffing need, and `requiredSkills`
   - maps to the legacy `schedule-proposal` entrypoints
2. **Organization fulfillment**
   - owns pending review, assignment, rejection, cancellation, and completion
   - maps to legacy organization HR governance and schedule events such as `organization:schedule:assigned`
3. **Task-skill matching**
   - owns skill requirement evaluation and candidate coverage checks
   - maps to legacy matching UI such as `Assign Member` and `No matching members`
4. **Schedule projection**
   - owns the organization/account `schedule_items` single source of truth used for query and subscription views
5. **Workspace acknowledgement**
   - remains the current migrated write-side slice for derived workspace schedule items

#### Missing concepts in the current migrated module

The current `modules/schedule` implementation only covers derived readiness items, request submission, and acknowledgement persistence. The following legacy domain concepts are still missing as explicit MDDD models:

- `Task`
  - request decomposition into assignable work units does not exist yet
- `Match`
  - task-skill and task-capability evaluation is still implied by legacy UI and event flows, not modeled as a first-class domain result
- `Schedule`
  - time allocation and conflict-aware staffing allocation are not modeled separately from request / assignment state
- `Capability`
  - only skill requirements are captured today; non-skill operational constraints still need an explicit model
- `Availability`
  - assignee time constraints, overlap checks, and scheduling eligibility are not yet represented
- `Organization`, `Team`, and `AccountUser`
  - organization-owned fulfillment structure exists elsewhere in the repo, but the schedule target model does not yet declare how those references participate in assignment and scheduling decisions

#### Suggested aggregates and boundaries

##### `Request`

- boundary: workspace-originated request lifecycle
- identity: `requestId`
- invariants:
  - belongs to one `workspaceId`
  - targets one `organizationId`
  - contains a stable `requiredSkills` snapshot at submission time
  - may also capture `requiredCapabilities` and requested time constraints
  - cannot be fulfilled before it reaches `submitted`
- responsibility:
  - preserves the workspace demand as the source aggregate for downstream task creation
- note:
  - the current migrated slice persists this aggregate as `ScheduleRequest`
- status examples:
  - `draft`
  - `submitted`
  - `cancelled`
  - `closed`

##### `Task`

- boundary: assignable unit of work derived from one `Request`
- identity: `taskId`
- invariants:
  - belongs to exactly one `Request`
  - keeps its own `requiredSkills`, `requiredCapabilities`, staffing quantity, and target `TimeWindow`
  - can enter matching before assignment, but not completion before assignment
- responsibility:
  - narrows one workspace demand into a unit the organization can match, assign, and schedule
- status examples:
  - `open`
  - `matching`
  - `assignable`
  - `assigned`
  - `scheduled`
  - `completed`
  - `cancelled`

##### `Assignment`

- boundary: organization-owned fulfillment lifecycle
- identity: `assignmentId`
- invariants:
  - belongs to exactly one `Task`
  - references the originating `Request`
  - assignment decisions are made by the organization actor, not the workspace actor
  - assignees must satisfy the matching policy before confirmation
  - may reference one `Team` and one chosen `AccountUser`
- responsibility:
  - records who takes the task, under whose organizational authority, and with what decision outcome
- note:
  - the current README previously called this target aggregate `FulfillmentAssignment`; `Assignment` is the canonical target name for the full legacy flow
- status examples:
  - `pending-review`
  - `matching`
  - `assigned`
  - `assign-rejected`
  - `assignment-cancelled`
  - `completed`

##### `Schedule`

- boundary: time allocation lifecycle after assignment is approved
- identity: `scheduleId`
- invariants:
  - belongs to exactly one `Assignment`
  - allocates one assignee into one `TimeWindow`
  - must satisfy availability and overlap constraints before becoming active
- responsibility:
  - owns the actual staffing allocation in time, separate from demand and assignment decision state
- status examples:
  - `planned`
  - `reserved`
  - `active`
  - `completed`
  - `cancelled`

##### `ScheduleItemProjection`

- boundary: query-side projection for workspace and organization schedule views
- identity: `scheduleItemId`
- purpose:
  - supports the legacy `accounts/{orgId}/schedule_items` read model
  - exposes request summary, task/assignment outcome, assignees, and requirement display state
- rule:
  - projection state must not become the place where workflow decisions are made

##### `WorkspaceScheduleAcknowledgement`

- boundary: current migrated acknowledgement write-side
- identity: derived from `workspaceId` + `scheduleItemId`
- rule:
  - remains separate from both derived readiness items and future request / fulfillment aggregates

#### Supporting reference models

##### `AccountUser`

- role in schedule domain:
  - candidate or assignee selected by the organization
  - carries skill inventory, capability coverage, team membership, and availability reference

##### `Organization`

- role in schedule domain:
  - fulfillment owner for a workspace request
  - owns assignment policy, governance, and the schedule projection single source of truth

##### `Team`

- role in schedule domain:
  - optional operational grouping inside an organization
  - narrows eligible assignee pools and can own team-level capability or staffing constraints

##### `Skill`

- role in schedule domain:
  - competency used for requirement and candidate matching
  - usually evaluated with level and quantity requirements

##### `Capability`

- role in schedule domain:
  - non-skill or operational qualification required for a task or assignment
  - examples include role authorization, equipment access, language coverage, or domain-specific certification

##### `Availability`

- role in schedule domain:
  - scheduling constraint model that declares whether an `AccountUser` can take a scheduled time allocation
  - used after candidate matching and before schedule confirmation to prevent overlaps and infeasible assignments

##### `CalendarSlot`

- role in schedule domain:
  - concrete reserved time allocation for one scheduled assignment
  - provides the canonical overlap-check input for conflict detection and calendar projection

##### `Constraint`

- role in schedule domain:
  - hard rule that must be satisfied before assignment or scheduling can proceed
  - examples include mandatory capability coverage, location requirement, no-overlap policy, max load, or team restriction

##### `Preference`

- role in schedule domain:
  - soft rule used for ranking and tie-breaking rather than hard rejection
  - examples include preferred team, preferred member continuity, preferred start window, or workload balancing preference

#### Structured entity map

| Entity | Kind | Primary responsibility |
| --- | --- | --- |
| `Request` | demand aggregate root | captures workspace-originated staffing demand and preserves the submitted requirement snapshot |
| `Task` | fulfillment aggregate root | represents one assignable work unit decomposed from a request |
| `Match` | policy result model | explains candidate eligibility, score, gaps, and rejection reasons for a task |
| `Assignment` | fulfillment aggregate root | records the organization’s assignee selection and decision lifecycle |
| `Schedule` | time-allocation aggregate root | owns the concrete reserved slot and execution lifecycle after assignment |
| `AccountUser` | reference model | provides candidate identity, inventory, team membership, and availability inputs |
| `Organization` | reference model | owns fulfillment governance, staffing policy, and projection authority |
| `Team` | reference model | scopes candidate pools and local operational constraints |
| `Skill` | catalog / value object | represents competency requirements and inventory dimensions |
| `Capability` | catalog / value object | represents non-skill qualifications such as authorization or certification |
| `Availability` | supporting model | represents workable time windows and load thresholds |
| `CalendarSlot` | value object | represents a reserved interval used for overlap detection and projection |
| `Constraint` | value object / policy input | represents hard rules that block assignment or scheduling when violated |
| `Preference` | value object / policy input | represents soft ranking signals used for tie-breaking and optimization |

#### Value objects

- `SkillRequirement`
- `CapabilityRequirement`
- `TimeWindow`
- `AvailabilityWindow`
- `CalendarSlot`
- `Constraint`
- `Preference`
- `AssignmentDecision`
- `MatchResult`
- `MatchCandidate`
- `MatchGap`
- `RequestStatus`
- `TaskStatus`
- `AssignmentStatus`
- `ScheduleStatus`

#### Domain services

- `DecomposeRequestIntoTasks`
- `SubmitScheduleRequest`
- `CancelScheduleRequest`
- `EvaluateCandidateMatch`
- `BuildFulfillmentPlan`
- `ConfirmAssignment`
- `AllocateScheduleWindow`
- `CancelAssignment`
- `RejectAssignment`
- `CompleteAssignment`
- `DeriveWorkspaceScheduleItems`
  - remains separate because it belongs to the current workspace readiness slice, not the legacy workforce fulfillment workflow

### Aggregates definition

#### `RequestAggregate`

- aggregate root: `Request`
- contains:
  - demand snapshot
  - request-level constraints and preferences
- boundary:
  - workspace-owned lifecycle from draft/submission through cancellation/closure
- invariants:
  - belongs to one workspace and one target organization
  - requirement snapshot is immutable after submission
  - cannot decompose into fulfillment work before reaching `submitted`

#### `TaskAggregate`

- aggregate root: `Task`
- contains:
  - one operational work unit
  - task-level requirements, constraints, preferences, and headcount
- boundary:
  - assignable unit of work derived from one request
- invariants:
  - belongs to exactly one request
  - preserves required headcount and target time window
  - cannot transition to completion before assignment and schedule execution exist

#### `AssignmentAggregate`

- aggregate root: `Assignment`
- contains:
  - staffing decision metadata
  - selected match reference
- boundary:
  - organization-owned acceptance / rejection / cancellation lifecycle
- invariants:
  - belongs to exactly one task
  - references the originating request
  - accepted assignment must reference an eligible assignee or an explicit override reason

#### `ScheduleAggregate`

- aggregate root: `Schedule`
- contains:
  - `CalendarSlot`
  - assigned load allocation
  - execution timestamps
- boundary:
  - actual time reservation, activation, completion, cancellation, and conflict handling
- invariants:
  - belongs to exactly one assignment
  - active or reserved slots for the same assignee must not overlap
  - load must remain within assignee and policy thresholds

#### `ScheduleProjectionAggregate`

- aggregate root:
  - projection document such as organization/account `schedule_items`
- boundary:
  - query-side read model only
- invariants:
  - never becomes the place where demand, matching, or assignment decisions are authored
  - reflects events emitted from request / assignment / scheduling lifecycles

### Workflow states

#### `RequestStatus`

- `draft`
- `submitted`
- `under-review`
- `cancelled`
- `closed`

#### `TaskStatus`

- `open`
- `matching`
- `assignable`
- `assigned`
- `scheduled`
- `completed`
- `cancelled`

#### `AssignmentStatus`

- `pending-review`
- `proposed`
- `accepted`
- `rejected`
- `cancelled`
- `completed`

#### `ScheduleStatus`

- `planned`
- `reserved`
- `active`
- `completed`
- `cancelled`
- `conflicted`

### Matching mechanism

Task matching should be treated as a domain policy, not a UI-only helper.

#### Inputs

- `requiredSkills` from the request or task
- `requiredCapabilities` from the task or organization policy
- eligible organization members
- member skill inventory
- member capability inventory
- member availability windows
- organization and team staffing constraints
- already assigned members
- staffing quantity per required skill

#### Outputs

- matched member candidates
- unmet requirements
- availability conflicts
- total coverage vs required headcount
- assignment allowed / rejected decision

#### Suggested policy surface

- `computeTaskMatch(task, member, organizationPolicy)`
- `computeTaskCoverage(task, members)`
- `resolveAvailabilityConflicts(task, candidateSet, availabilityWindows)`
- `isAssignmentAllowed(task, candidateSet, matchResult)`

#### Matching pipeline

1. **Filter**
   - exclude candidates missing mandatory `Skill` or `Capability` requirements
   - exclude candidates blocked by team, organization, location, or policy constraints
   - exclude candidates whose current `Availability` cannot support the target window
2. **Score**
   - compute weighted coverage for skill fit, capability fit, availability fit, continuity, and preference satisfaction
   - apply penalties for high current load, partial coverage, or expensive schedule adjustments
3. **Constrain candidate set**
   - validate the proposed assignee set as a whole rather than one candidate at a time
   - reject candidate combinations that still violate total headcount coverage, team-composition rules, overlap interactions, or combined max-load rules
4. **Rank**
   - return ordered `Match` results with reasons, gaps, and rejection explanations

#### Suggested scoring dimensions

| Dimension | Purpose |
| --- | --- |
| `skillScore` | measures skill requirement coverage and proficiency fit |
| `capabilityScore` | measures non-skill qualification coverage |
| `availabilityScore` | rewards direct availability fit without rescheduling |
| `continuityScore` | rewards same-team or same-member continuity when desired |
| `loadPenalty` | penalizes candidates already near maximum capacity |
| `constraintPenalty` | penalizes candidates that require policy exceptions or extra movement |

#### Refactored domain type map

| Type | Kind | Responsibility |
| --- | --- | --- |
| `Request` | aggregate root | capture workspace demand and its stable requirement snapshot |
| `Task` | aggregate root | represent the assignable unit of work derived from a request |
| `Match` | domain service result / value object | describe candidate coverage, gaps, and assignment eligibility |
| `Assignment` | aggregate root | record organization-owned assignee selection and decision lifecycle |
| `Schedule` | aggregate root | allocate approved work into an actual time window |
| `AccountUser` | reference model | candidate / assignee identity with skills, capabilities, and availability |
| `Organization` | reference model | fulfillment owner and policy boundary |
| `Team` | reference model | organization sub-structure for staffing pools and operational constraints |
| `Skill` | value object / catalog reference | competency used for matching |
| `Capability` | value object / catalog reference | non-skill qualification used for assignment constraints |
| `Availability` | value object / supporting model | time constraint source used before schedule confirmation |
| `CalendarSlot` | value object | canonical scheduled interval for conflict detection and projection |
| `Constraint` | value object / policy input | hard rule that blocks fulfillment when violated |
| `Preference` | value object / policy input | soft rule that influences ranking and schedule choice |

### Scheduling logic

Scheduling should remain separate from candidate ranking and assignment confirmation.

#### Responsibilities

- reserve a `CalendarSlot` for an accepted assignment
- prevent slot overlap for the chosen `AccountUser`
- prevent workload overload based on organization and assignee rules
- surface schedule conflicts as explicit outcomes instead of hidden UI rejections
- support cancellation, reschedule, activation, and completion as explicit transitions

#### Scheduling rules

1. an assignment cannot be scheduled until it is accepted
2. a `CalendarSlot` must fit an eligible assignee `Availability` window
3. the assignee cannot exceed max concurrent assignments or configured load limits
4. conflicting reservations must produce a conflict result instead of silently overwriting another schedule
5. reschedule should preserve the original assignment identity and emit explicit schedule events

#### Scheduling service surface

- `checkAvailability(assignee, calendarSlot, policy)`
- `detectScheduleConflict(assignee, calendarSlot, existingSchedules)`
- `allocateCalendarSlot(assignment, calendarSlot)`
- `rescheduleAssignment(assignment, nextCalendarSlot)`
- `completeScheduledTask(schedule)`

### Events

The legacy target flow should be event-driven so that projections, notifications, and downstream policy handlers remain decoupled from command handlers.

#### Required domain events

- `RequestCreated`
- `TaskMatched`
- `AssignmentAccepted`
- `TaskCompleted`

#### Recommended event stream

- `RequestSubmitted`
- `RequestCancelled`
- `TaskCreated`
- `TaskMatched`
- `AssignmentProposed`
- `AssignmentAccepted`
- `AssignmentRejected`
- `AssignmentCancelled`
- `SchedulePlanned`
- `ScheduleConflictDetected`
- `ScheduleCompleted`

#### Event ownership

| Event | Emitted by | Purpose |
| --- | --- | --- |
| `RequestCreated` / `RequestSubmitted` | `RequestAggregate` | start fulfillment workflow and request decomposition |
| `TaskMatched` | matching application flow | persist candidate ranking and open assignment review |
| `AssignmentAccepted` | `AssignmentAggregate` | confirm organization staffing decision |
| `SchedulePlanned` / `ScheduleConflictDetected` | scheduling application flow | drive calendar and projection updates |
| `TaskCompleted` | `ScheduleAggregate` or completion flow | close fulfillment and publish downstream completion state |

### Flow diagram

```text
Workspace user
  -> drafts request with timing, notes, requiredSkills, and requiredCapabilities
  -> SubmitScheduleRequest
  -> Request: draft -> submitted
  -> publish ScheduleRequestSubmitted
  -> DecomposeRequestIntoTasks
  -> Task(s): open
  -> projection adds pending organization work item

Organization HR / operations
  -> reviews pending Request / Task
  -> EvaluateCandidateMatch / BuildFulfillmentPlan
  -> selects assignees
  -> ConfirmAssignment on Assignment
     -> success: Assignment -> assigned
              -> AllocateScheduleWindow
              -> Schedule -> planned / reserved
               -> publish organization:schedule:assigned
     -> failure: Assignment -> assign-rejected
                -> publish organization:schedule:assignRejected

Workspace or organization actor
  -> CancelScheduleRequest
  -> Request -> cancelled
  -> publish organization:schedule:proposalCancelled

Organization or system
  -> CompleteAssignment
  -> Assignment -> completed
  -> Schedule -> completed
  -> publish organization:schedule:completed

Current migrated workspace slice
  -> getWorkspaceSchedule(workspaceId)
  -> resolve workspace + finance context inside modules/schedule
  -> DeriveWorkspaceScheduleItems
  -> optional acknowledgeWorkspaceScheduleItem(input)
  -> persist WorkspaceScheduleAcknowledgement separately
```

### Suggested folder structure

```text
modules/schedule/
  README.md
  domain/
    entities/
      Request.ts
      Task.ts
      Assignment.ts
      Schedule.ts
      ScheduleAcknowledgement.ts
    value-objects/
      Skill.ts
      Capability.ts
      SkillRequirement.ts
      CapabilityRequirement.ts
      Availability.ts
      TimeWindow.ts
      MatchResult.ts
      MatchCandidate.ts
      MatchGap.ts
      CalendarSlot.ts
      Constraint.ts
      Preference.ts
      RequestStatus.ts
      TaskStatus.ts
      AssignmentStatus.ts
      ScheduleStatus.ts
    domain-services/
      DecomposeRequestIntoTasks.ts
      SubmitScheduleRequest.ts
      EvaluateCandidateMatch.ts
      BuildFulfillmentPlan.ts
      ConfirmAssignment.ts
      AllocateScheduleWindow.ts
      RejectAssignment.ts
      CompleteAssignment.ts
      DeriveWorkspaceScheduleItems.ts
    events/
      RequestCreated.ts
      RequestSubmitted.ts
      TaskCreated.ts
      TaskMatched.ts
      AssignmentAccepted.ts
      AssignmentRejected.ts
      SchedulePlanned.ts
      ScheduleConflictDetected.ts
      TaskCompleted.ts
    ports/
      RequestRepository.ts
      TaskRepository.ts
      MatchRepository.ts
      AssignmentRepository.ts
      ScheduleRepository.ts
      ScheduleAcknowledgementRepository.ts
      ScheduleProjectionRepository.ts
      OrganizationStructureRepository.ts
      OrganizationMemberSkillRepository.ts
      MemberAvailabilityRepository.ts
      SchedulingEventBus.ts
  application/
    use-cases/
      workspace/
        submit-schedule-request.use-case.ts
        cancel-schedule-request.use-case.ts
        list-workspace-schedule-items.use-case.ts
        acknowledge-workspace-schedule-item.use-case.ts
      organization/
        review-pending-schedule-request.use-case.ts
        match-schedule-task.use-case.ts
        assign-schedule-task.use-case.ts
        allocate-schedule-window.use-case.ts
        reject-schedule-assignment.use-case.ts
        complete-schedule-assignment.use-case.ts
  infrastructure/
    firebase/
      FirebaseWorkspaceScheduleRepository.ts
      FirebaseScheduleAcknowledgementRepository.ts
      FirebaseScheduleRequestRepository.ts
      FirebaseFulfillmentAssignmentRepository.ts
      FirebaseScheduleProjectionRepository.ts
      FirebaseOrganizationMemberSkillRepository.ts
    events/
      OutboxSchedulingEventBus.ts
    converters/
      schedule-request.converter.ts
      fulfillment-assignment.converter.ts
      schedule-projection.converter.ts
  interfaces/
    queries/
      schedule.queries.ts
      organization-schedule.queries.ts
    _actions/
      schedule.actions.ts
      submit-schedule-request.action.ts
      assign-schedule-request.action.ts
      reject-schedule-assignment.action.ts
      complete-schedule-assignment.action.ts
    components/
      workspace/
        WorkspaceScheduleTab.tsx
        ScheduleProposalForm.tsx
      organization/
        OrganizationScheduleGovernancePanel.tsx
        PendingScheduleAssignmentsTable.tsx
        MemberMatchInspector.tsx
```
