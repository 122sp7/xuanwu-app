# Module: skill

## Description

The **skill** module represents the professional skill and competency capability. It enables defining, discovering, and mapping skills to individuals (accounts) and team members within the organization. Skills are the foundation for talent matching and workforce planning.

## Responsibilities

- Define the skill entity and skill taxonomy (category, level, proficiency)
- Support skill assignment to accounts/profiles
- Provide skill search and discovery capabilities
- Serve as the skills vocabulary for the matching module

## Related Packages

| Package | Role |
|---------|------|
| [`packages/skill-core`](../../packages/skill-core/) | Domain types, skill entity contracts, repository ports |

## Input / Output

### Commands (write side)
```
CreateSkillInput   → CommandResult { aggregateId: skillId }
AssignSkillInput   → CommandResult { aggregateId: assignmentId }
```

### Queries (read side)
```
getSkillsByCategory(category) → SkillEntity[]
getAccountSkills(accountId)   → AccountSkillEntity[]
```

## Used By

- `modules/matching` — skill-based matching engine consumes skill registry
- `modules/account` — account profiles reference skills
- `modules/organization` — team skill gap analysis

## Notes

- **Status**: Conceptual definition only — implementation not yet started
- Domain entities and repository ports are defined in `packages/skill-core`
- No implementation exists in `infrastructure/` or `interfaces/` yet
