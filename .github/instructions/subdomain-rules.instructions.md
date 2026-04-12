---
description: ''
applyTo: ''
---

# subdomain-rules.instructions.md

## Core Definition
Subdomain = Business Capability Boundary

A subdomain represents a single, well-defined business capability. It must not mix multiple responsibilities.

---

## Layer Constraints (Hard Rules)

Allowed inside a subdomain:
- domain
- application
- ports (optional)

Forbidden:
- interfaces (React / UI)
- infrastructure (Firebase / DB / API)

---

## Single Responsibility

Each subdomain must focus on one business capability.

Correct:
- authoring
- collaboration
- publishing

Incorrect:
- article + comment + permission mixed together

---

## No Cross-Subdomain Dependency

Subdomains must not import each other directly.

Communication must go through:
- upper application layer
- module API boundary

---

## Domain Purity

Domain layer must:
- have zero framework dependency
- not depend on Firebase, DB, or API
- not include UI logic

Allowed:
- Entities
- Value Objects
- Domain Services
- Business invariants

---

## Application Layer Role

Application layer is responsible for:
- Use cases
- Workflow orchestration
- Calling domain logic
- Calling ports

It must NOT contain:
- UI
- database implementation

---

## Ports (Abstraction Boundary)

Ports define external dependencies.

Examples:
- ArticleRepository
- AIContentGeneratorPort

Rules:
- Defined inside subdomain
- Implemented in infrastructure layer

---

## No UI Logic

Subdomain must not be aware of UI.

Forbidden:
- React components
- RouteScreen
- hooks
- JSX

---

## No Direct Data Access

Subdomain must not directly access:
- Firestore
- REST APIs
- SDKs

All access must go through ports.

---

## Naming Rules

Use business language for subdomain names.

Correct:
- authoring
- knowledge-base
- workspace

Incorrect:
- utils
- common
- shared

---

## Independent Evolution

Each subdomain should:
- be independently testable
- be independently refactorable
- be ready for future microservice extraction

---

## Summary

Subdomain = Pure business logic + No framework + No UI + No database
