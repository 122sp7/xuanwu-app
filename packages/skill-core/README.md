# skill-core

## Purpose

Skill domain core — pure TypeScript types, entity contracts, and repository port interfaces for professional skill and competency management. This package defines the skills vocabulary used across the organization and matching modules.

## Belongs to Module

[`modules/skill`](../../modules/skill/) — professional skill and competency management

## Public API

### Entity Types

| Export | Description |
|--------|-------------|
| `SkillId` | Opaque skill identifier type |
| `AccountId` | Opaque account identifier type |
| `SkillLevel` | `"beginner" \| "intermediate" \| "advanced" \| "expert"` |
| `SkillCategory` | `"technical" \| "management" \| "communication" \| "design" \| "domain" \| "other"` |
| `SkillEntity` | Full skill entity (id, name, category, tags, timestamps) |
| `CreateSkillInput` | Input for creating a skill |
| `UpdateSkillInput` | Input for updating a skill |
| `AccountSkillEntity` | Skill-to-account assignment with level and experience |
| `AssignSkillToAccountInput` | Input for assigning a skill to an account |

### Repository Ports

| Export | Description |
|--------|-------------|
| `SkillRepository` | CRUD + category query port for skills |
| `AccountSkillRepository` | Assign/revoke/query account skill assignments |

## Dependencies

**None** — zero external dependencies. Pure TypeScript domain types only.

## Example

```typescript
import type { SkillEntity, SkillRepository, SkillLevel } from "@skill-core";

class InMemorySkillRepository implements SkillRepository {
  private skills: SkillEntity[] = [];
  async create(input: CreateSkillInput): Promise<SkillEntity> { /* ... */ }
  async findByCategory(category): Promise<SkillEntity[]> {
    return this.skills.filter(s => s.category === category);
  }
  // ...
}
```

## Rules

- Zero implementation code — types and interfaces only
- No imports from infrastructure, UI, or framework code
- Implementation belongs in `packages/skill-service` (future)
- This package is the single source of truth for the skills domain vocabulary
