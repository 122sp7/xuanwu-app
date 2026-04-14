---
description: 'AI subdomains structural rules: hexagonal per subdomain, strict boundary isolation, orchestration vs inference separation, and domain purity enforcement.'
applyTo: 'modules/ai/subdomains/**/*.{ts,tsx,md}'
---

# AI Subdomains Layer (Local)

This document defines execution guardrails for `modules/ai/subdomains/*`.
It must be consistent with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/ai/subdomains.md`.

---

## 1. Subdomain Standard Shape (Hexagonal Core)

Each active subdomain MUST follow a consistent hexagonal layout:

```

api/
application/
domain/
infrastructure/
interfaces/
ports/        (optional but preferred for external boundaries)
README.md

```

Rules:
- `domain/` contains pure business logic only (no SDKs, no framework code)
- `application/` contains use cases and coordination logic
- `api/` is the ONLY cross-subdomain entry point
- `interfaces/` defines inbound/outbound contracts (DTOs, ports contracts)
- `infrastructure/` contains external integrations (Firebase, LLM SDKs, DB, APIs)

---

## 2. Boundary Isolation Rules

### 2.1 Cross-subdomain access rule
- A subdomain MUST NOT import internals of another subdomain:
  - ❌ `domain/` of sibling
  - ❌ `application/` of sibling
  - ❌ `infrastructure/` of sibling
  - ❌ `interfaces/` of sibling
- Allowed:
  - ✅ import ONLY from sibling `api/`

This enforces strict bounded-context isolation inside `ai/*`.

---

### 2.2 Data ownership rule
- Each subdomain owns its own Firestore collections
- No direct read/write to another subdomain's collections
- Cross-domain data access must go through:
  - `api/` layer
  - or orchestration pipeline contracts

---

## 3. Dependency Direction (Strict Layering)

Inside each subdomain:

```

interfaces → application → domain ← infrastructure

```

Rules:
- `domain/` is the center and must not depend on anything else
- `application/` depends on `domain/`
- `interfaces/` depends on `application/`
- `infrastructure/` depends on `domain/` (implements ports/adapters only)

---

## 4. Provider Isolation Rule (AI Safety Boundary)

- External AI providers (OpenAI / Gemini / Vertex / others) MUST ONLY exist in:
  - `infrastructure/`
- Forbidden in:
  - `domain/`
  - `application/`
- Provider logic must be abstracted behind ports defined in `interfaces/ports/`

---

## 5. Subdomain Responsibilities

### 5.1 orchestration
- Owns multi-step pipeline composition
- Controls routing between subdomains
- Manages execution graph
- Does NOT perform raw inference

### 5.2 inference
- Owns single model invocation boundary
- Handles prompt execution abstraction
- Does NOT orchestrate multi-step workflows

### 5.3 context
- Constructs per-request context window
- Stateless per execution
- Must NOT store persistent memory

### 5.4 memory
- Persistent cross-request state
- Long-term user or system memory
- Must NOT include request-time prompt assembly logic

### 5.5 retrieval
- Responsible for candidate ranking / fetching
- Does NOT generate final answers
- Does NOT perform reasoning or synthesis

### 5.6 reasoning
- Performs structured inference logic
- Works on inputs only (no retrieval ownership)
- May consume retrieval results but cannot fetch them directly

### 5.7 generation
- Produces final output artifacts
- Consumes reasoning + context
- Must NOT perform retrieval or orchestration

### 5.8 evaluation
- Evaluates output quality, correctness, regression
- NOT for billing, usage tracking, or telemetry aggregation

### 5.9 distillation
- Produces compressed datasets / fine-tuning data
- Must NOT generate canonical production content
- Must remain downstream-only from generation/evaluation outputs

### 5.10 tool-calling
- Defines tool invocation contracts
- Executes structured tool calls via orchestration
- Must remain stateless

### 5.11 safety
- Enforces policy constraints and filtering rules
- Must operate as a pre-generation gate
- Cannot modify domain logic directly

### 5.12 tracing
- Observability layer for AI execution flows
- Captures execution graphs, latency, and dependencies
- Must NOT influence decision logic

---

## 6. Cross-Subdomain Collaboration Rule

All cross-subdomain communication MUST flow through:

```

subdomain/api/

```

Never:
- direct application-to-application calls
- domain-to-domain coupling
- infrastructure sharing between subdomains

Allowed pattern:
```

orchestration/api → retrieval/api → reasoning/api → generation/api

```

---

## 7. Event Naming Convention

Domain events MUST follow:

```

ai.<subdomain>.<action>

```

Examples:
- `ai.orchestration.pipeline-completed`
- `ai.inference.model-called`
- `ai.retrieval.candidates-ranked`
- `ai.evaluation.score-computed`

Rules:
- events are immutable contracts
- events are emitted from `domain/` or `application/` only
- `infrastructure/` cannot define event semantics

---

## 8. Stub Promotion Rule

A subdomain is considered **ACTIVE** only when:

- `README.md` exists and defines responsibility
- `domain/` contains non-trivial logic (not only index exports)
- ADR exists for activation decision
- at least one real integration exists in `application/` or `infrastructure/`

Otherwise:
- it is considered a **stub**
- must not be used as dependency target

---

## 9. Critical Semantic Separations

- `context` ≠ `memory`
- `orchestration` ≠ `inference`
- `retrieval` ≠ `generation`
- `evaluation` ≠ `telemetry`
- `distillation` ≠ `production content`

These separations are strict and non-negotiable.

---

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
