# Agent Guide — workspace-flow

This file defines how agents and contributors should structure and evolve the workspace-flow module.

## Module Purpose

workspace-flow is a logic-first bounded context.
It owns workflow rules, state transitions, guard conditions, persistence contracts, and public module APIs.

It does not own product UI composition.
UI should be assembled outside this module and consume workspace-flow only through the public api boundary.

Related references:
- [README.md](./README.md)
- [Workspace-Flow.mermaid](./Workspace-Flow.mermaid)
- [Workspace-Flow-Tree.mermaid](./Workspace-Flow-Tree.mermaid)
- [Workspace-Flow-UI.mermaid](./Workspace-Flow-UI.mermaid)
- [Workspace-Flow-States.mermaid](./Workspace-Flow-States.mermaid)
- [Workspace-Flow-Sequence.mermaid](./Workspace-Flow-Sequence.mermaid)
- [Workspace-Flow-ERD.mermaid](./Workspace-Flow-ERD.mermaid)
- [Workspace-Flow-Architecture.mermaid](./Workspace-Flow-Architecture.mermaid)
- [Workspace-Flow-Permissions.mermaid](./Workspace-Flow-Permissions.mermaid)
- [Workspace-Flow-Events.mermaid](./Workspace-Flow-Events.mermaid)
- [Workspace-Flow-Lifecycle.mermaid](./Workspace-Flow-Lifecycle.mermaid)

## Target Module Shape

```text
modules/workspace-flow/
├── api/
│   ├── contracts.ts
│   ├── index.ts
│   └── workspace-flow.facade.ts
├── application/
│   ├── dto/
│   │   ├── add-invoice-item.dto.ts
│   │   ├── create-task.dto.ts
│   │   ├── invoice-query.dto.ts
│   │   ├── issue-query.dto.ts
│   │   ├── open-issue.dto.ts
│   │   └── task-query.dto.ts
│   ├── ports/
│   │   ├── InvoiceService.ts
│   │   ├── IssueService.ts
│   │   └── TaskService.ts
│   └── use-cases/
│       ├── add-invoice-item.use-case.ts
│       ├── approve-invoice.use-case.ts
│       ├── approve-task-acceptance.use-case.ts
│       ├── archive-task.use-case.ts
│       ├── assign-task.use-case.ts
│       ├── close-invoice.use-case.ts
│       ├── close-issue.use-case.ts
│       ├── create-invoice.use-case.ts
│       ├── create-task.use-case.ts
│       ├── fail-issue-retest.use-case.ts
│       ├── fix-issue.use-case.ts
│       ├── open-issue.use-case.ts
│       ├── pass-issue-retest.use-case.ts
│       ├── pass-task-qa.use-case.ts
│       ├── pay-invoice.use-case.ts
│       ├── reject-invoice.use-case.ts
│       ├── remove-invoice-item.use-case.ts
│       ├── review-invoice.use-case.ts
│       ├── start-issue.use-case.ts
│       ├── submit-issue-retest.use-case.ts
│       ├── submit-invoice.use-case.ts
│       └── submit-task-to-qa.use-case.ts
├── domain/
│   ├── entities/
│   │   ├── Invoice.ts
│   │   ├── InvoiceItem.ts
│   │   ├── Issue.ts
│   │   └── Task.ts
│   ├── events/
│   │   ├── InvoiceEvent.ts
│   │   ├── IssueEvent.ts
│   │   └── TaskEvent.ts
│   ├── repositories/
│   │   ├── InvoiceRepository.ts
│   │   ├── IssueRepository.ts
│   │   └── TaskRepository.ts
│   ├── services/
│   │   ├── invoice-guards.ts
│   │   ├── invoice-transition-policy.ts
│   │   ├── issue-transition-policy.ts
│   │   ├── task-guards.ts
│   │   └── task-transition-policy.ts
│   └── value-objects/
│       ├── InvoiceId.ts
│       ├── InvoiceItemId.ts
│       ├── InvoiceStatus.ts
│       ├── IssueId.ts
│       ├── IssueStage.ts
│       ├── IssueStatus.ts
│       ├── TaskId.ts
│       ├── TaskStatus.ts
│       └── UserId.ts
├── infrastructure/
│   ├── firebase/
│   │   ├── invoice-item.converter.ts
│   │   ├── invoice.converter.ts
│   │   ├── issue.converter.ts
│   │   ├── task.converter.ts
│   │   └── workspace-flow.collections.ts
│   ├── persistence/
│   └── repositories/
│       ├── FirebaseInvoiceItemRepository.ts
│       ├── FirebaseInvoiceRepository.ts
│       ├── FirebaseIssueRepository.ts
│       └── FirebaseTaskRepository.ts
├── interfaces/
│   ├── _actions/
│   │   └── workspace-flow.actions.ts
│   ├── contracts/
│   │   └── workspace-flow.contract.ts
│   └── queries/
│       └── workspace-flow.queries.ts
├── AGENT.md
├── README.md
├── Workspace-Flow-Architecture.mermaid
├── Workspace-Flow-ERD.mermaid
├── Workspace-Flow-Events.mermaid
├── Workspace-Flow-Lifecycle.mermaid
├── Workspace-Flow-Permissions.mermaid
├── Workspace-Flow-Sequence.mermaid
├── Workspace-Flow-States.mermaid
├── Workspace-Flow.mermaid
├── Workspace-Flow-Tree.mermaid
├── Workspace-Flow-UI.mermaid
└── index.ts
```

## Target File Plan

The module should be implemented with concrete files, not only folders.
Use the following file plan as the construction baseline.

### api

Files:
- api/index.ts
- api/workspace-flow.facade.ts
- api/contracts.ts

Responsibilities:
- expose the public module surface for external consumers
- export only the minimum stable contracts, facades, and public types
- hide internal domain, application, and infrastructure details

Recommended exports:
- WorkspaceFlowFacade
- TaskSummary
- IssueSummary
- InvoiceSummary
- TaskQueryDto / IssueQueryDto / InvoiceQueryDto if needed publicly

### domain

Files:
- domain/entities/Task.ts
- domain/entities/Issue.ts
- domain/entities/Invoice.ts
- domain/entities/InvoiceItem.ts
- domain/value-objects/TaskId.ts
- domain/value-objects/IssueId.ts
- domain/value-objects/InvoiceId.ts
- domain/value-objects/InvoiceItemId.ts
- domain/value-objects/UserId.ts
- domain/value-objects/TaskStatus.ts
- domain/value-objects/IssueStatus.ts
- domain/value-objects/IssueStage.ts
- domain/value-objects/InvoiceStatus.ts
- domain/events/TaskEvent.ts
- domain/events/IssueEvent.ts
- domain/events/InvoiceEvent.ts
- domain/repositories/TaskRepository.ts
- domain/repositories/IssueRepository.ts
- domain/repositories/InvoiceRepository.ts
- domain/services/task-transition-policy.ts
- domain/services/issue-transition-policy.ts
- domain/services/invoice-transition-policy.ts
- domain/services/task-guards.ts
- domain/services/invoice-guards.ts

Responsibilities:
- define entities and lifecycle states
- define legal transitions and invariant checks
- define repository contracts only, never implementations
- stay framework-free

### application

Files:
- application/dto/task-query.dto.ts
- application/dto/issue-query.dto.ts
- application/dto/invoice-query.dto.ts
- application/dto/create-task.dto.ts
- application/dto/open-issue.dto.ts
- application/dto/add-invoice-item.dto.ts
- application/ports/TaskService.ts
- application/ports/IssueService.ts
- application/ports/InvoiceService.ts
- application/use-cases/create-task.use-case.ts
- application/use-cases/assign-task.use-case.ts
- application/use-cases/submit-task-to-qa.use-case.ts
- application/use-cases/pass-task-qa.use-case.ts
- application/use-cases/approve-task-acceptance.use-case.ts
- application/use-cases/archive-task.use-case.ts
- application/use-cases/open-issue.use-case.ts
- application/use-cases/start-issue.use-case.ts
- application/use-cases/fix-issue.use-case.ts
- application/use-cases/submit-issue-retest.use-case.ts
- application/use-cases/pass-issue-retest.use-case.ts
- application/use-cases/fail-issue-retest.use-case.ts
- application/use-cases/close-issue.use-case.ts
- application/use-cases/create-invoice.use-case.ts
- application/use-cases/add-invoice-item.use-case.ts
- application/use-cases/remove-invoice-item.use-case.ts
- application/use-cases/submit-invoice.use-case.ts
- application/use-cases/review-invoice.use-case.ts
- application/use-cases/approve-invoice.use-case.ts
- application/use-cases/reject-invoice.use-case.ts
- application/use-cases/pay-invoice.use-case.ts
- application/use-cases/close-invoice.use-case.ts

Responsibilities:
- orchestrate domain rules through use cases
- define command and query DTOs
- provide application-facing ports for module consumers

### infrastructure

Files:
- infrastructure/firebase/workspace-flow.collections.ts
- infrastructure/firebase/task.converter.ts
- infrastructure/firebase/issue.converter.ts
- infrastructure/firebase/invoice.converter.ts
- infrastructure/firebase/invoice-item.converter.ts
- infrastructure/repositories/FirebaseTaskRepository.ts
- infrastructure/repositories/FirebaseIssueRepository.ts
- infrastructure/repositories/FirebaseInvoiceRepository.ts
- infrastructure/repositories/FirebaseInvoiceItemRepository.ts

Responsibilities:
- map Firestore collections and document formats
- implement repository contracts from domain
- keep Firebase-specific concerns out of domain

### interfaces

Files:
- interfaces/contracts/workspace-flow.contract.ts
- interfaces/queries/workspace-flow.queries.ts
- interfaces/_actions/workspace-flow.actions.ts

Optional:
- add module-local interface files only if this module genuinely needs them
- keep product UI composition outside this module by default

### module root

Files:
- index.ts
- AGENT.md
- README.md
- Workspace-Flow.mermaid
- Workspace-Flow-Tree.mermaid
- Workspace-Flow-UI.mermaid
- Workspace-Flow-States.mermaid
- Workspace-Flow-Sequence.mermaid
- Workspace-Flow-ERD.mermaid
- Workspace-Flow-Architecture.mermaid
- Workspace-Flow-Permissions.mermaid
- Workspace-Flow-Events.mermaid
- Workspace-Flow-Lifecycle.mermaid

Rules:
- index.ts is a local module barrel, not the cross-module public boundary
- cross-module consumers still use api/index.ts

## Legacy Types Policy

The old types/ folder was temporary migration input only.
The legacy files have been removed and must not be recreated.

Rules:
- Do not treat types/ as a public module boundary
- Do not add new code under types/
- Do not import types/* from outside this module
- Move the logic into domain/application/infrastructure/api instead of recreating the legacy files
- After deletion, do not recreate types/ as a shortcut export surface

Legacy-to-target mapping:
- core.ts → domain/value-objects/ and domain/events/
- models.ts → domain/entities/
- transitions.ts → domain/services/
- services.ts → application/ports/
- firestore.ts → infrastructure/firebase/ or infrastructure/persistence/
- examples.ts → documentation examples or application examples if still needed
- index.ts → split into api/index.ts and local module index.ts responsibilities

Deletion rule:
- once a target file exists, do not keep a duplicate legacy type file with the same responsibility

## Ownership Rules

workspace-flow owns:
- Task, Issue, Invoice, InvoiceItem workflow logic
- status unions and transition rules
- guard rules such as no-open-issues and invoice submission constraints
- persistence-facing document contracts for this module
- public contracts exposed through api

workspace-flow does not own:
- route composition in app/
- page layout, cards, boards, or dashboards
- direct product UI rendering for external consumers

## Layer Responsibilities

### api

Public cross-module surface only.
Export the minimum set of contracts, facades, and types needed by other modules or app composition.

External consumers must import only through:
@/modules/workspace-flow/api

### application

Use cases, orchestration, command and query DTOs, and service contracts.
Application may depend on domain contracts but must not depend directly on interfaces.

### domain

Pure business rules.
Put entities, value objects, transition maps, guards, repository interfaces, and domain events here.

Domain must stay framework-free.
No React, Firebase SDK, browser APIs, or HTTP clients.

### infrastructure

Persistence and adapter implementations.
Firestore collections, document mappings, repository implementations, and external integrations belong here.

Infrastructure implements contracts defined by domain or application.

### interfaces

Optional for this module.
Keep empty unless this module later needs module-local actions, query hooks, or interface-specific contracts.

If UI is needed, prefer assembling it outside this module unless there is a strong reason to keep module-local interface adapters here.

## Dependency Direction

Allowed direction:
interfaces → application → domain ← infrastructure
api → application / domain
api must not become a dumping ground for internal re-exports

Forbidden direction:
- domain → application
- domain → infrastructure
- domain → interfaces
- application → interfaces
- external modules → domain/application/infrastructure/interfaces internals

## Public Boundary Rule

Cross-module interaction must go through api only.

Allowed:
- import from @/modules/workspace-flow/api

Forbidden:
- import from @/modules/workspace-flow/domain/*
- import from @/modules/workspace-flow/application/*
- import from @/modules/workspace-flow/infrastructure/*
- import from @/modules/workspace-flow/interfaces/*
- import from types/* as a public dependency

Recommended external usage pattern:
- read models or summaries through api/contracts.ts
- execute workflow operations through api/workspace-flow.facade.ts
- never bind external UI directly to repository implementations or transition policies

## Local Import Rule

Inside workspace-flow:
- use relative imports within the module
- do not self-import through the public api
- do not use the module public boundary for internal wiring

## UI Boundary Rule

workspace-flow is logic-first.
External pages or modules may assemble UI using workspace-flow public contracts.

Preferred pattern:
app or another module UI
→ imports from workspace-flow/api
→ calls application-facing facades or use cases
→ renders its own interface

Do not move product UI concerns into domain or application.

## Documentation Alignment

Keep these documents aligned whenever workflow structure changes:
- [README.md](./README.md)
- [Workspace-Flow.mermaid](./Workspace-Flow.mermaid)
- [Workspace-Flow-Tree.mermaid](./Workspace-Flow-Tree.mermaid)
- api exports if public contracts change

If event names, states, or guards change, update the docs in the same change.
If a temporary migration file is removed, update the docs in the same change so no document still presents it as canonical.

## Construction Order

Implement in this order to avoid boundary drift:

1. domain/value-objects and domain/events
2. domain/entities and domain/repositories
3. domain/services for transitions and guards
4. application/dto and application/ports
5. application/use-cases
6. infrastructure/firebase and infrastructure/repositories
7. api/contracts.ts and api/workspace-flow.facade.ts
8. optional interfaces contracts or actions

Do not start from UI.
Do not expose unfinished internals through api just to unblock temporary callers.

## Validation

Required validation after structural or public-boundary changes:
- npm run lint
- npm run build

Re-check:
- no cross-module internal imports
- no UI logic in domain
- no infrastructure dependencies leaking into domain
- api exports remain narrow and intentional