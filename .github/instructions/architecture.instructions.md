---
description: Hexagonal Architecture + DDD + Firebase + Genkit + Frontend State + Validation Architecture Rules
applyTo: "**"
---

# Architecture Standard

System is designed under a combined architecture model:

Hexagonal Architecture (Ports and Adapters) + Domain-Driven Design (DDD)
with semantic-first (business-language-aligned domain modeling)
and Firebase Serverless Backend Architecture (Authentication, Firestore, Cloud Functions, Hosting)
and Genkit AI Orchestration Layer (AI Flows, Tool Calling, Prompt Pipelines)
and Frontend State Management Layer (Zustand for client state, XState for finite-state workflows)
and Schema Validation Layer (Zod for runtime type safety and domain validation)

---

# 1. Core Architecture Rules

## 1.1 Hexagonal Structure (Mandatory)

System must strictly follow Ports and Adapters pattern:

- Domain layer is isolated from all external frameworks
- Application layer depends only on domain
- Infrastructure implements ports (interfaces)

Allowed dependency direction:

```

UI → Application → Domain ← Infrastructure

```

Strict rule:
Domain must never import Firebase, Genkit, Zustand, XState, or Zod directly.

---

## 1.2 Domain-Driven Design (DDD)

- All business logic must reside in Domain layer
- Bounded Contexts must be explicit and isolated
- Aggregates must enforce invariants internally
- Entities must not depend on external services

Domain language must reflect business terminology only.

---

## 1.3 Semantic-first Modeling

All domain modeling must be derived from business language:

- UI wording → Domain model naming
- Business rules → Aggregates / Value Objects
- Workflows → Use Cases

No technical naming allowed inside Domain layer.

---

# 2. Backend Architecture (Firebase)

Firebase is the only backend runtime platform.

## Allowed services:
- Firebase Authentication → identity layer
- Firestore → primary database
- Cloud Functions → backend execution
- Firebase Hosting → deployment layer

## Rules:
- Firestore is accessed only via repository implementations
- Cloud Functions must not contain domain logic
- Authentication state must be mapped into domain identity

---

# 3. AI Architecture (Genkit)

Genkit is the AI orchestration layer.

## Responsibilities:
- AI Flows (business-driven workflows)
- Tool calling / function calling
- Prompt pipelines

## Rules:
- AI must not directly mutate domain state
- AI output must be validated via Zod before entering system
- AI is treated as an external untrusted actor

---

# 4. Frontend State Management

## Zustand (UI State Layer)
- Used for lightweight client state
- No domain logic allowed
- No persistence of business rules

## XState (Workflow State Layer)
- Used for complex state machines
- Must represent explicit transitions
- Must align with Use Cases

Rule:
UI state ≠ domain state

---

# 5. Validation Layer (Zod)

Zod is the only runtime validation tool.

Rules:
- All external inputs must be validated via Zod
- Domain invariants must be enforced after validation
- Zod schemas must NOT contain business logic

Validation flow:

```

External Input → Zod Validation → Application Use Case → Domain

```

---

# 6. Dependency Rules

Strict dependency constraints:

## Forbidden:
- Domain importing Firebase / Genkit / UI state libraries
- Infrastructure depending on UI
- AI layer directly modifying Firestore

## Allowed:
- Infrastructure → Domain
- Application → Domain
- UI → Application
- Genkit → Application (via ports only)

---

# 7. Folder Boundary Intent

Recommended structure:

```

modules/
domain/
application/
infrastructure/
interfaces/
platform/ (Firebase + Genkit adapters)

```

Rule:
Each bounded context must replicate this structure independently.

---

# 8. System Principle Summary

- Domain is pure business logic
- Firebase is infrastructure only
- Genkit is external AI actor
- Zustand/XState are UI execution layers
- Zod is validation gate
- All communication flows through ports

---

# 9. Enforcement Principle

If ambiguity exists:

Priority order:

1. Domain integrity
2. Bounded context isolation
3. Dependency direction
4. Infrastructure convenience

Never sacrifice domain purity for implementation simplicity.

