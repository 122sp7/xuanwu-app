# matching-service

## Purpose

Matching application service — orchestrates repository calls, invokes the pure `@matching-engine` scoring logic, and returns `CommandResult`-compatible responses. This is the service adapter layer between the domain and the application shell.

## Belongs to Module

[`modules/matching`](../../modules/matching/) — talent and resource matching

## Architecture Position

```
app/ / modules/  →  @matching-service  →  @matching-engine (pure logic)
                                       →  @task-core       (task types)
                                       →  @skill-core      (skill/account-skill types)
                                       →  @shared-types    (CommandResult)
```

## Public API

### Use-Cases

| Export | Description |
|--------|-------------|
| `MatchTaskUseCase` | Load candidates → score → return ranked `MatchScore[]` (read-only) |
| `AssignTaskUseCase` | Persist a proposed `MatchAssignment` from a winning score |

### Input Types

| Export | Description |
|--------|-------------|
| `MatchTaskInput` | `{ request, candidateIds? }` |
| `MatchTaskResult` | `{ success: true, scores: MatchScore[] }` |
| `AssignTaskInput` | `{ score: MatchScore }` |

## Matching Flow

```
1. MatchTaskUseCase.execute({ request, candidateIds? })
   ├── skillRepository.findAll()                    → build skillIndex
   ├── accountSkillRepository.findBySkill(skillId)  → gather candidates
   ├── buildCandidateProfiles(accountSkills, index) → CandidateProfile[]
   └── SkillMatcher.score(request, profiles)        → MatchScore[] (ranked)

2. AssignTaskUseCase.execute({ score })
   ├── accountSkillRepository.findByAccount(candidateId) → candidateSkills
   ├── assignTaskWithScore(requestId, score, skills)      → assignment payload
   └── assignmentRepository.propose(payload)              → MatchAssignment
                                                           → CommandResult
```

## Ranking Strategy

Scoring is performed by the pure `SkillMatcher` in `@matching-engine`.  
Each candidate receives a composite score:

| Dimension | Weight | How Computed |
|-----------|--------|--------------|
| `skillOverlapScore` | 50% | matched skills ÷ required skills |
| `skillLevelScore` | 30% | avg level weight of matched skills (expert=1.0, beginner=0.25) |
| `tagAffinityScore` | 20% | required skill tags covered by candidate's skills |
| `availabilityScore` | — | default 1.0 (infra layer may override) |
| `capacityScore` | — | default 1.0 (infra layer may override) |

Results are sorted descending by `totalScore ∈ [0, 1]`.

## Example

```typescript
import { MatchTaskUseCase, AssignTaskUseCase } from "@matching-service";
import type { MatchingRequest } from "@matching-engine";

// Wire up with your repository implementations
const matchUseCase = new MatchTaskUseCase(skillRepo, accountSkillRepo);
const assignUseCase = new AssignTaskUseCase(accountSkillRepo, assignmentRepo);

// Step 1: find best candidates
const result = await matchUseCase.execute({
  request: { id: "req_1", requiredSkillIds: ["skill_ts", "skill_react"] },
});

if (result.success && result.scores.length > 0) {
  // Step 2: assign the top candidate
  const best = result.scores[0];
  const cmdResult = await assignUseCase.execute({ score: best });
  if (cmdResult.success) {
    console.log("Assignment created:", cmdResult.aggregateId);
  }
}
```

## Dependencies

- `@matching-engine` — pure scoring functions, domain contracts, `SkillMatcher`
- `@skill-core` — `SkillRepository`, `AccountSkillRepository`, entity types
- `@shared-types` — `CommandResult`, `commandSuccess`, `commandFailureFrom`

## Rules

- No Firebase, no HTTP client, no React imports
- Use-cases depend only on port interfaces — inject concrete implementations at wiring time
- Use `@matching-engine` pure functions for all scoring logic; never duplicate scoring here
