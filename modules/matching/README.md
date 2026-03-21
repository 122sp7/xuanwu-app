# Module: matching

## Description

The **matching** module represents the talent and resource matching capability. It enables intelligent pairing of skills to tasks, people to teams, and resource requirements to availability. The matching engine combines schedule data, skill profiles, and organizational context to produce optimal assignments.

## Responsibilities

- Define the matching request, assignment, and score entity contracts
- Orchestrate multi-step MDDD matching flow (request → match → assignment → projection)
- Enforce matching business rules (availability, skill requirements, capacity)
- Provide matching result queries and projection views

## Related Packages

| Package | Role |
|---------|------|
| [`packages/matching-engine`](../../packages/matching-engine/) | Domain types, matching contracts, orchestration ports |
| `modules/schedule` | MDDD flow implementation: full matching workflow in practice |

## Input / Output

### Commands (write side)
```
SubmitMatchingRequest    → CommandResult { aggregateId: requestId }
AcceptMatchAssignment    → CommandResult { aggregateId: assignmentId }
RejectMatchAssignment    → CommandResult { aggregateId: assignmentId }
CancelMatch              → CommandResult { aggregateId: matchId }
```

### Queries (read side)
```
getMatchingProjection(requestId)   → MatchingProjectionEntity
getMatchAssignments(scheduleId)    → MatchAssignmentEntity[]
```

## Used By

- `modules/schedule` — MDDD schedule flow uses matching engine for assignment
- `app/(shell)/organization/schedule` — schedule management UI
- `modules/workspace` — workspace scheduling and task assignment

## Notes

- **Status**: Conceptual definition only — core contracts defined in `packages/matching-engine`
- The `modules/schedule` module contains a practical MDDD implementation that operationalises matching
- Domain types: `MatchingRequest`, `MatchAssignment`, `MatchScore`, `MatchingProjection`
