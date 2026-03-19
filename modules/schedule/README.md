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

The legacy schedule capability captured in `.github/skills/xuanwu-skill/references/files.md` is broader than the current MDDD slice.

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

The legacy schedule capability referenced from `.github/skills/xuanwu-skill/references/files.md` models a bidirectional workflow:

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

#### Suggested aggregates and boundaries

##### `ScheduleRequest`

- boundary: workspace-originated request lifecycle
- identity: `requestId`
- invariants:
  - belongs to one `workspaceId`
  - targets one `organizationId`
  - contains a stable `requiredSkills` snapshot at submission time
  - cannot be fulfilled before it reaches `submitted`
- status examples:
  - `draft`
  - `submitted`
  - `cancelled`
  - `closed`

##### `FulfillmentAssignment`

- boundary: organization-owned fulfillment lifecycle
- identity: `assignmentId`
- invariants:
  - belongs to exactly one `ScheduleRequest`
  - assignment decisions are made by the organization actor, not the workspace actor
  - assignees must satisfy the matching policy before confirmation
- status examples:
  - `pending-review`
  - `matching`
  - `assigned`
  - `assign-rejected`
  - `assignment-cancelled`
  - `completed`

##### `ScheduleItemProjection`

- boundary: query-side projection for workspace and organization schedule views
- identity: `scheduleItemId`
- purpose:
  - supports the legacy `accounts/{orgId}/schedule_items` read model
  - exposes request summary, assignees, and skill requirement display state
- rule:
  - projection state must not become the place where workflow decisions are made

##### `WorkspaceScheduleAcknowledgement`

- boundary: current migrated acknowledgement write-side
- identity: derived from `workspaceId` + `scheduleItemId`
- rule:
  - remains separate from both derived readiness items and future request / fulfillment aggregates

#### Value objects

- `SkillRequirement`
- `TimeWindow`
- `AssignmentDecision`
- `MatchResult`
- `ScheduleRequestStatus`
- `FulfillmentAssignmentStatus`

#### Domain services

- `SubmitScheduleRequest`
- `CancelScheduleRequest`
- `EvaluateCandidateMatch`
- `BuildFulfillmentPlan`
- `ConfirmAssignment`
- `RejectAssignment`
- `CompleteAssignment`
- `DeriveWorkspaceScheduleItems`
  - remains separate because it belongs to the current workspace readiness slice, not the legacy workforce fulfillment workflow

### Matching mechanism

Task-skill matching should be treated as a domain policy, not a UI-only helper.

#### Inputs

- `requiredSkills` from the request or schedule item
- eligible organization members
- member skill inventory
- already assigned members
- staffing quantity per required skill

#### Outputs

- matched member candidates
- unmet requirements
- total coverage vs required headcount
- assignment allowed / rejected decision

#### Suggested policy surface

- `computeMemberMatch(member, requiredSkills)`
- `computeRequestCoverage(members, requiredSkills)`
- `isAssignmentAllowed(candidateSet, requiredSkills)`

### Flow diagram

```text
Workspace user
  -> drafts request with timing, notes, and requiredSkills
  -> SubmitScheduleRequest
  -> ScheduleRequest: draft -> submitted
  -> publish ScheduleRequestSubmitted
  -> projection adds pending organization work item

Organization HR / operations
  -> reviews pending ScheduleRequest
  -> EvaluateCandidateMatch / BuildFulfillmentPlan
  -> selects assignees
  -> ConfirmAssignment
     -> success: FulfillmentAssignment -> assigned
              -> publish organization:schedule:assigned
     -> failure: FulfillmentAssignment -> assign-rejected
               -> publish organization:schedule:assignRejected

Workspace or organization actor
  -> CancelScheduleRequest
  -> ScheduleRequest -> cancelled
  -> publish organization:schedule:proposalCancelled

Organization or system
  -> CompleteAssignment
  -> FulfillmentAssignment -> completed
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
      ScheduleRequest.ts
      FulfillmentAssignment.ts
      ScheduleAcknowledgement.ts
    value-objects/
      SkillRequirement.ts
      TimeWindow.ts
      MatchResult.ts
      ScheduleRequestStatus.ts
      FulfillmentAssignmentStatus.ts
    domain-services/
      SubmitScheduleRequest.ts
      EvaluateCandidateMatch.ts
      BuildFulfillmentPlan.ts
      ConfirmAssignment.ts
      RejectAssignment.ts
      CompleteAssignment.ts
      DeriveWorkspaceScheduleItems.ts
    events/
      ScheduleRequestSubmitted.ts
      ScheduleAssigned.ts
      ScheduleAssignRejected.ts
      ScheduleProposalCancelled.ts
      ScheduleCompleted.ts
    ports/
      ScheduleRequestRepository.ts
      FulfillmentAssignmentRepository.ts
      ScheduleAcknowledgementRepository.ts
      ScheduleProjectionRepository.ts
      OrganizationMemberSkillRepository.ts
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
        assign-schedule-request.use-case.ts
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
