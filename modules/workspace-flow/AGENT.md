# Agent Guide — workspace-flow

This file defines how agents and contributors should structure and evolve the workspace-flow module.

## Module Purpose

workspace-flow is a logic-first bounded context.
It owns workflow rules, state transitions, guard conditions, persistence contracts, and public module APIs.

It does not own product UI composition.
UI should be assembled outside this module and consume workspace-flow only through the public api boundary.

Related references:
- [README.md](http://_vscodecontentref_/6)
- [Workspace-Flow.mermaid](http://_vscodecontentref_/7)
- [Workspace-Tree-Flow.mermaid](http://_vscodecontentref_/8)

## Target Module Shape

modules/workspace-flow/
├── api/
│   └── index.ts
├── application/
│   ├── dto/
│   ├── ports/
│   └── use-cases/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── services/
│   ├── value-objects/
│   └── events/
├── infrastructure/
│   ├── firebase/
│   ├── persistence/
│   └── repositories/
├── interfaces/
│   ├── _actions/
│   ├── queries/
│   └── contracts/
├── [README.md](http://_vscodecontentref_/9)
├── [Workspace-Flow.mermaid](http://_vscodecontentref_/10)
├── [Workspace-Tree-Flow.mermaid](http://_vscodecontentref_/11)
└── index.ts

## Current Source Mapping

The existing types folder is reference material for the refactor target.
Do not treat types/ as the long-term public module boundary.

Suggested mapping:
- types/core.ts → domain/value-objects or domain/events depending on content
- types/models.ts → domain/entities
- types/transitions.ts → domain/services
- types/services.ts → application/ports
- types/firestore.ts → infrastructure/firebase or infrastructure/persistence
- types/examples.ts → documentation or application/examples if still needed
- types/index.ts → replace with api/index.ts and local module index.ts responsibilities

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
- [README.md](http://_vscodecontentref_/12)
- [Workspace-Flow.mermaid](http://_vscodecontentref_/13)
- [Workspace-Tree-Flow.mermaid](http://_vscodecontentref_/14)
- api exports if public contracts change

If event names, states, or guards change, update the docs in the same change.

## Validation

Required validation after structural or public-boundary changes:
- npm run lint
- npm run build

Re-check:
- no cross-module internal imports
- no UI logic in domain
- no infrastructure dependencies leaking into domain
- api exports remain narrow and intentional