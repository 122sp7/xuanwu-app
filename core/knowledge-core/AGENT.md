# Knowledge Core — Agent Contract (Strict + Safe)

## System Flow
Knowledge → Taxonomy → Retrieval → Governance → Integration → Analytics → Knowledge

---

## Layer Rules

### Domain
- Pure business logic only
- Contains: entities, value-objects, aggregates, repositories (interfaces)
- No Firebase / Genkit / HTTP

### Application
- UseCase orchestration only
- No business rules
- Calls domain + repositories

### Infrastructure
- Firebase / DB / external APIs
- Implements repository interfaces

### Interfaces
- API / Genkit Flow
- Must call UseCase
- Never access DB directly

---

## AI Rules
- AI Flow MUST call UseCase
- AI MUST NOT access DB
- AI MUST NOT implement business logic

---

## Critical Constraints
- Domain cannot import infrastructure
- Interfaces cannot bypass application
- All writes go through UseCase

---

## Anti-Patterns (Forbidden)
- Direct Firestore access in AI
- Business logic in Application
- DTO in Domain
