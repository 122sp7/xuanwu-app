---
title: Four-Layer Module Structure
impact: CRITICAL
impactDescription: Ensures every module follows the MDDD Clean Architecture layout
tags: architecture, mddd, module-structure, clean-architecture
---

## Four-Layer Module Structure

**Impact: CRITICAL**

Every module under `modules/` must follow the four-layer Clean Architecture layout. Layers are technical subdivisions **inside** each module — the top-level organization is always by business domain, not by technical concern.

**Incorrect (layer-driven top-level organization):**

```
src/
  controllers/
    taskController.ts
    wikiController.ts
  services/
    taskService.ts
    wikiService.ts
  repositories/
    taskRepository.ts
    wikiRepository.ts
```

**Correct (module-driven with internal layers):**

```
modules/
  domain-a/
    api/index.ts                      # Cross-module API boundary
    domain/
      entities/DomainAEntity.ts
      repositories/DomainARepository.ts
    application/
      use-cases/domain-a.use-cases.ts
    infrastructure/
      firebase/DomainAFirebaseRepository.ts
    interfaces/
      components/DomainAList.tsx
      queries/domain-a.queries.ts
      _actions/domain-a.actions.ts
  domain-b/
    api/index.ts
    domain/
      entities/domain-b.entity.ts
      repositories/idomain-b.repository.ts
      services/derive-domain-b-summary.ts
    application/
      use-cases/create-domain-b.ts
    infrastructure/
      repositories/DomainBRepository.ts
    interfaces/
      components/DomainBPanel.tsx
      queries/domain-b.queries.ts
```

**Layer responsibilities:**

| Layer | Directory | Owns | Must NOT |
|-------|-----------|------|---------|
| Domain | `domain/` | Entities, repository interfaces, value objects, domain services, ports | Import from infrastructure or interfaces |
| Application | `application/` | Use cases, DTOs | Import from interfaces |
| Infrastructure | `infrastructure/` | Repository implementations, external adapters | Contain business logic |
| Interfaces | `interfaces/` | React components, queries, server actions, hooks, API controllers | Contain domain logic |

Not every module needs every subdirectory — include only what the module requires.
