---
description: 'Naming rules for modules/, module APIs, use cases, repositories, entities, events, and related MDDD assets'
applyTo: 'modules/**/*.md'
---

# Modules Naming

Use consistent naming in module specifications and architecture docs so ownership and layer roles remain obvious.

## Naming Table

| Type | Naming |
| --- | --- |
| Module directory | `kebab-case` bounded-context name, e.g. `workspace-scheduling`, `content` |
| Module public API folder | `api/` |
| Module barrel | `index.ts` |
| Module README | `README.md` |
| Public facade type | `PascalCaseFacade`, e.g. `ContentFacade` |
| Public facade instance | `camelCaseFacade`, e.g. `contentFacade` |
| Use case file | `verb-noun.use-case.ts`, e.g. `create-content-page.use-case.ts` |
| DTO file | `verb-noun.dto.ts` or domain-specific DTO filename in `application/dto/` |
| Repository interface | `PascalCaseRepository`, e.g. `ContentPageRepository` |
| Repository implementation | `TechnologyPascalCaseRepository`, e.g. `FirebaseContentPageRepository` |
| Entity / aggregate | `PascalCase`, e.g. `ContentPage` |
| Value object | `PascalCase`, e.g. `IssueStage`, `ContentPath` |
| Domain event type | `PascalCaseEvent` or clear event object name |
| Event discriminant | `module-name.action`, e.g. `content.page-created` |
| Server Action file | `domain-name.actions.ts` under `interfaces/_actions/` |
| Query file | `domain-name.queries.ts` under `interfaces/queries/` |

## Conventions

- Use business-domain names; avoid `common`, `misc`, `helper`, UI labels, or migration labels.
- Prefer singular bounded-context names unless established convention is plural.
- Keep module renames aligned with API surface, event discriminants, and persistence naming.
- Keep naming aligned with `modules-api-boundary.instructions.md`.
