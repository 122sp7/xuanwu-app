---
description: 'Naming rules for modules/, module APIs, use cases, repositories, entities, events, and related MDDD assets'
applyTo: 'modules/**/*.ts, modules/**/*.tsx, modules/**/*.js, modules/**/*.jsx, modules/**/*.md'
---

# Modules Naming

Use consistent naming so module ownership and MDDD layer roles remain obvious.

## Naming Table

| 類型 | 命名 |
| --- | --- |
| Module directory | `kebab-case` bounded-context name, e.g. `workspace-planner`, `content` |
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

## Module Naming Rules

- Use business-domain names, not UI labels or temporary migration names
- Prefer singular bounded-context names unless an existing convention is already plural
- Keep renamed modules aligned with their public API names, Firestore collections, and event discriminants when the contract requires it

## Import Naming Rules

- Use `@alias` imports for packages
- Use relative imports within the same module
- Use `@/modules/<target>/api` only for cross-module imports

## Avoid

- Ambiguous module names like `common`, `misc`, or `helper`
- Cross-module imports that require consumers to know internal filenames
- Inconsistent `Knowledge*` / `Content*` style dual naming after a refactor
