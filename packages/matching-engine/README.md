# matching-engine

## Purpose

Matching domain core — **pure** scoring logic, entity contracts, repository ports, and the `IMatchingEngine` orchestration port. This package is framework-free and has zero I/O side effects.

## Belongs to Module

[`modules/matching`](../../modules/matching/) — talent and resource matching

## Architecture Position

```
@matching-service (orchestration) → @matching-engine (pure logic)
@matching-engine                  → @shared-types, @skill-core
```

## Public API

### Pure Functions

| Export | Signature | Description |
|--------|-----------|-------------|
| `matchTaskToSkills` | `(request, candidates) → MatchScore[]` | Score + rank all candidates against a request |
| `assignTask` | `(requestId, candidateId, skills) → assignment payload` | Build an assignment object (no score) |
| `assignTaskWithScore` | `(requestId, score, skills) → assignment payload` | Build an assignment with score injected |
| `buildCandidateProfiles` | `(accountSkills, skillIndex) → Map<id, CandidateProfile>` | Group flat skill list into per-candidate profiles |

### Classes

| Export | Description |
|--------|-------------|
| `SkillMatcher` | Concrete scorer: `score()`, `topN()`, `best()` |

### Entity / Value Types

| Export | Description |
|--------|-------------|
| `MatchingRequest` | A request to find candidates for a task/slot |
| `CreateMatchingRequestInput` | Input for creating a request |
| `MatchAssignment` | A proposed candidate-to-task assignment |
| `MatchAssignmentStatus` | `"proposed" \| "accepted" \| "rejected" \| "cancelled"` |
| `MatchScore` | Scoring result for one candidate |
| `MatchingProjection` | Read-model aggregating request + candidates + assignment |
| `CandidateProfile` | Grouped candidate skills input for the matcher |

### Repository Ports

| Export | Description |
|--------|-------------|
| `MatchingRequestRepository` | CRUD + status update port |
| `MatchAssignmentRepository` | Propose / respond / query assignments |
| `MatchingProjectionRepository` | Upsert / query projection read-model |

### Orchestration Port

| Export | Description |
|--------|-------------|
| `IMatchingEngine` | `run(requestId)` + `score(requestId, candidates)` port |

---

## Matching Flow

```
Input:
  MatchingRequest { id, requiredSkillIds: ["skill_ts", "skill_react"] }
  CandidateProfile[] (pre-loaded by service layer)

For each candidate:
  1. Find which required skills the candidate holds (skillOverlapScore)
  2. Average the level weights of matched skills  (skillLevelScore)
  3. Count required skill tags present in candidate (tagAffinityScore)
  4. Compute totalScore = 0.5×overlap + 0.3×level + 0.2×tags

Output:
  MatchScore[] sorted by totalScore descending
```

## Ranking Strategy

| Dimension | Weight | Description |
|-----------|--------|-------------|
| `skillOverlapScore` | **50%** | `matchedSkills / requiredSkills` — core coverage |
| `skillLevelScore` | **30%** | avg of level weights for matched skills |
| `tagAffinityScore` | **20%** | fraction of required skill tags held by candidate |
| `availabilityScore` | — | default 1.0; infra layer may override before persisting |
| `capacityScore` | — | default 1.0; infra layer may override before persisting |

### Skill Level Weights

| Level | Weight |
|-------|--------|
| `expert` | 1.00 |
| `advanced` | 0.75 |
| `intermediate` | 0.50 |
| `beginner` | 0.25 |

### Edge Cases

| Situation | Behaviour |
|-----------|-----------|
| `requiredSkillIds` is empty | All candidates score `totalScore = 1.0` |
| Candidate has zero matching skills | `skillOverlapScore = 0`, `skillLevelScore = 0` |
| No skill details / no tags | `tagAffinityScore = 1.0` (not penalised) |
| No candidates | `matchTaskToSkills` returns `[]` |

---

## Input / Output Contract

### `matchTaskToSkills`

```typescript
matchTaskToSkills(
  request: Pick<MatchingRequest, "id" | "requiredSkillIds">,
  candidates: readonly CandidateProfile[],
): MatchScore[]
```

### `CandidateProfile`

```typescript
interface CandidateProfile {
  candidateId: string;
  skills: readonly AccountSkillEntity[];   // from @skill-core
  skillDetails: ReadonlyMap<string, SkillEntity>; // from @skill-core
}
```

### `MatchScore`

```typescript
interface MatchScore {
  candidateId: string;
  requestId: MatchingRequestId;
  skillOverlapScore: number; // [0, 1]
  availabilityScore: number; // default 1
  capacityScore: number;     // default 1
  totalScore: number;        // [0, 1] weighted composite
}
```

---

## Example

```typescript
import {
  matchTaskToSkills,
  assignTaskWithScore,
  buildCandidateProfiles,
  SkillMatcher,
} from "@matching-engine";
import type { SkillEntity } from "@skill-core";

// Build skill index
const skillIndex = new Map<string, SkillEntity>(skills.map(s => [s.id, s]));

// Group accountSkills into profiles
const profiles = buildCandidateProfiles(accountSkills, skillIndex);

// Score candidates
const matcher = new SkillMatcher();
const request = { id: "req_1", requiredSkillIds: ["skill_ts", "skill_react"] };
const scores = matcher.score(request, Array.from(profiles.values()));
// scores[0] is the best match

// Build assignment payload
const best = scores[0];
const payload = assignTaskWithScore("req_1", best, accountSkills.filter(s => s.accountId === best.candidateId));
// → { requestId, assigneeId, assigneeSkillIds, score, status: "proposed" }
```

---

## Dependencies

- `@shared-types` — `ID`, `generateId`
- `@skill-core` — `AccountSkillEntity`, `SkillEntity`, `SkillLevel`

## Rules

- **Zero I/O** — no `fetch`, no Firebase, no file system access
- **No React / Next.js** imports
- All scoring is done through pure functions or `SkillMatcher` methods
- Repository ports are _interfaces only_ — implementations live in infrastructure adapters
- `IMatchingEngine.run()` is intentionally not implemented here; it requires repository access, so it belongs in `@matching-service`
