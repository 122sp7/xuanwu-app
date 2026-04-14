---
description: "AI subdomains architecture rules: capability-based subdomains, strict hexagonal boundaries, orchestration as application kernel, and infrastructure isolation."
applyTo: "modules/ai/subdomains/**/*.{ts,tsx,md}"
---
```

# AI Subdomains Layer (Canonical)

This document defines structural rules for `modules/ai/subdomains/*`.

It must align with AI execution architecture principles and remain consistent with DDD + Hexagonal + AI pipeline separation.

---

# 1️⃣ Core Principle

Subdomains represent **capabilities inside a single AI execution engine**, NOT services.

* ❌ NOT microservices
* ❌ NOT independent APIs
* ❌ NOT cross-service bus participants
* ✔ ARE internal capability modules

---

# 2️⃣ Standard Subdomain Structure (Hexagonal Capability Module)

Each subdomain MUST follow this structure:

```
api/
application/
domain/
infrastructure/
interfaces/
ports/        (preferred for external contracts)
README.md
```

---

## Layer Responsibilities

### domain/

* Pure business logic
* No SDKs, no LLM calls, no Firebase
* Deterministic rules only

### application/

* Use cases
* Coordination logic within the subdomain
* Can call ports/interfaces

### interfaces/

* DTOs
* Input/output contracts
* Boundary definitions

### ports/

* Abstract external dependencies
* LLM, DB, retrieval, tools, etc.

### infrastructure/

* Implements ports
* Firebase / LLM SDK / vector DB / APIs

### api/

* External entry point ONLY
* HTTP / Firebase Functions / Edge endpoints

---

# 3️⃣ System-Level Architecture Rule

## 3.1 API is NOT internal bus

* ❌ subdomain-to-subdomain MUST NOT communicate via `api/`
* ✔ api is ONLY external boundary

---

## 3.2 Internal communication model

Subdomains communicate via:

```
application → ports → application
```

or via orchestration kernel:

```
orchestration (application) → subdomain application
```

---

# 4️⃣ Dependency Rules (Strict Direction)

Inside each subdomain:

```
interfaces → application → domain ← infrastructure
```

Rules:

* domain is pure and independent
* application depends only on domain + ports
* infrastructure implements ports only
* interfaces define contracts only

---

# 5️⃣ Cross-Subdomain Communication Rule

### Allowed:

* orchestration application calls other subdomain application via interfaces/ports

### Forbidden:

* ❌ direct domain-to-domain coupling
* ❌ infrastructure-to-infrastructure coupling
* ❌ api-to-api internal routing

---

# 6️⃣ AI Capability Subdomain Definitions

## 6.1 orchestration (system kernel)

* Owns execution graph
* Controls workflow sequencing
* Calls subdomains via application layer
* Does NOT perform inference itself

---

## 6.2 context

* Builds request-time context
* Stateless per execution
* No persistence logic

---

## 6.3 memory

* Persistent state across sessions
* Read/write via ports only
* No prompt construction logic

---

## 6.4 retrieval

* Fetches and ranks candidates
* No final answer generation
* May use scoring models but no synthesis

---

## 6.5 reasoning

* Structured inference logic
* Operates on prepared inputs only
* No data fetching responsibility

---

## 6.6 generation

* Produces final output
* Consumes reasoning + context
* No retrieval or orchestration logic

---

## 6.7 tool-calling

* Defines tool schemas and invocation contracts
* Execution is handled in infrastructure/adapters
* Stateless logic only

---

## 6.8 safety

* Policy enforcement layer
* Pre/post generation guardrails
* Cannot modify domain logic

---

## 6.9 evaluation

* Quality scoring and regression checks
* Offline/online evaluation logic
* No telemetry aggregation

---

## 6.10 distillation

* Produces training datasets
* Downstream-only from evaluation/generation

---

## 6.11 tracing

* Observability only
* Execution logs, latency, graph tracing
* Must NOT affect decisions

---

# 7️⃣ AI Execution Flow (Canonical Model)

```
context
   ↓
retrieval
   ↓
reasoning
   ↓
tool-calling (optional)
   ↓
generation
   ↓
evaluation (async)
```

Controlled by:

```
orchestration (application kernel)
```

---

# 8️⃣ Event Convention

```
ai.<subdomain>.<event>
```

Examples:

* ai.orchestration.started
* ai.retrieval.completed
* ai.reasoning.finished
* ai.generation.completed
* ai.evaluation.scored

Rules:

* domain/application emit events
* infrastructure publishes events
* events are immutable contracts

---

# 9️⃣ Subdomain Activation Rule

A subdomain is ACTIVE only if:

* README defines responsibility
* application layer contains real use cases
* at least one port is implemented
* infrastructure integration exists

Otherwise:

* treated as capability stub
* cannot be referenced by orchestration

---

# 🔟 Critical Semantic Constraints (Non-Negotiable)

* context ≠ memory
* retrieval ≠ generation
* reasoning ≠ orchestration
* evaluation ≠ telemetry
* tool-calling ≠ execution engine
* api ≠ internal communication layer

---

# 🧠 Final Model

This architecture represents:

> AI Execution Engine with Capability-Based Modular Subdomains

NOT:

* microservices
* API mesh
* distributed services system

---

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
