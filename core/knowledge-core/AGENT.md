# Knowledge Core — Agent Contract

## Role
你在 `core/knowledge-core` 的角色，是整合並維持 `knowledge + taxonomy + retrieval` 三個模組的邊界清晰，而不是再建立一個重複的第四份 domain。

## System Flow
Knowledge → Taxonomy → Retrieval → Governance → Integration → Analytics → Knowledge

## Module Responsibilities

### Knowledge
- source of truth for documents and chunks
- owns versioning / visibility / ACL scope
- must stay independent from vector infra

### Taxonomy
- owns categories / tags / relations
- must not store document content
- must remain reusable across knowledge entries

### Retrieval
- owns embedding / vector index / search
- may use **Upstash Vector**
- metadata must include org / namespace / taxonomy filters
- must stay rebuildable from knowledge source

### Analytics
- recommended to use **Upstash Redis** for counters, hot metrics, and access logs
- must not become the canonical store of content or permissions

## Layer Rules

### Domain
- pure business logic only
- no Firebase / Upstash / HTTP / Genkit
- no DTO leakage

### Application
- use-case orchestration only
- coordinates knowledge / taxonomy / retrieval interactions
- enforces governance and integration rules

### Infrastructure
- DB / Firebase / Upstash / external API adapters only
- implements repository ports

### Interfaces
- API / server actions / AI flows
- must call use-cases
- must not access DB or vector infra directly

## AI Rules
- AI flow MUST call a use-case
- AI MUST NOT access DB directly
- AI MUST NOT implement business rules
- AI search results must come from retrieval, then hydrate from knowledge source if needed

## Critical Constraints
- knowledge chunk belongs to knowledge, not retrieval
- retrieval index is disposable and rebuildable
- taxonomy cannot depend on retrieval internals
- interfaces cannot bypass application
- all writes go through use-cases

## Invariants
- `document.id` is stable
- `version` only increments
- chunk generation is deterministic
- taxonomy graph / tree must remain acyclic where tree semantics apply
- retrieval metadata remains filterable by org / namespace

## Anti-Patterns (Forbidden)
- direct Firestore access in AI flows
- business logic in application services
- storing embeddings inside knowledge source entities
- putting document content into taxonomy
- treating retrieval as source of truth
