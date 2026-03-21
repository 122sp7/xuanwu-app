# matching-engine

## Purpose

Matching domain core — contracts, entity types, repository ports, and the `IMatchingEngine` orchestration port. This package defines the talent-and-resource matching vocabulary used by the schedule module and future matching implementations.

## Belongs to Module

[`modules/matching`](../../modules/matching/) — talent and resource matching

## Public API

### Entity Types

| Export | Description |
|--------|-------------|
| `MatchingRequestId` | Opaque matching request identifier |
| `MatchAssignmentId` | Opaque assignment identifier |
| `MatchScheduleId` | Schedule reference identifier |
| `MatchingRequestStatus` | `"pending" \| "matching" \| "matched" \| "assigned" \| "rejected" \| "cancelled"` |
| `MatchAssignmentStatus` | `"proposed" \| "accepted" \| "rejected" \| "cancelled"` |
| `MatchingRequest` | Full matching request entity |
| `CreateMatchingRequestInput` | Input for creating a matching request |
| `MatchAssignment` | Proposed assignment entity |
| `MatchScore` | Scoring result for a candidate |
| `MatchingProjection` | Read-model aggregating request + assignments + scores |

### Repository Ports

| Export | Description |
|--------|-------------|
| `MatchingRequestRepository` | CRUD + status update port for requests |
| `MatchAssignmentRepository` | Propose/respond/query assignment port |
| `MatchingProjectionRepository` | Upsert/query projection read-model port |

### Orchestration Port

| Export | Description |
|--------|-------------|
| `IMatchingEngine` | `run(requestId)` + `score(requestId, candidates)` orchestration port |

## Dependencies

- `@shared-types` — `ID` type

## Example

```typescript
import type { IMatchingEngine, MatchingProjection, MatchingRequest } from "@matching-engine";

class SimpleMatchingEngine implements IMatchingEngine {
  async run(requestId): Promise<MatchingProjection> {
    // 1. Load request
    // 2. Score candidates
    // 3. Propose best assignment
    // 4. Return projection
  }
}
```

## Rules

- Zero implementation code — types and interfaces only
- No imports from infrastructure, UI, or Firebase
- `modules/schedule` contains the current practical MDDD implementation of this contract
- Future `packages/matching-service` will implement `IMatchingEngine`
