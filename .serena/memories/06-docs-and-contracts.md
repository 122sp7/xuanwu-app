# Docs Index and Development Contracts

**Verified:** 2026-03-19

## docs/ Top-Level Structure

```
docs/
├── adr/               Architecture Decision Records (RAG, 11 files)
├── ai/                AI workflow notes
├── architecture/      Architecture docs + notes
├── design/            Design diagrams (Mermaid + Markdown)
├── explanation/       Governance and policy docs
└── reference/
    └── development-contracts/   Formal delivery contracts (6 files)
```

---

## docs/adr/ — Architecture Decision Records (RAG-focused)

All 11 ADRs cover the RAG (Retrieval-Augmented Generation) system:

| ADR | Topic |
|-----|-------|
| ADR-001 | RAG upload storage and document lifecycle |
| ADR-002 | RAG upload storage and naming |
| ADR-003 | RAG Firestore data model and lifecycle |
| ADR-004 | RAG query retrieval and enterprise enhancements |
| ADR-005 | RAG ingestion execution contract |
| ADR-006 | RAG query execution contract |
| ADR-007 | RAG optional enhancements rollout |
| ADR-008 | RAG observability, SLO, and acceptance |
| ADR-009 | RAG Firestore index matrix |
| ADR-010 | RAG upload and worker event contract |
| ADR-011 | RAG Genkit flow contract |

> These ADRs define the authoritative design decisions for the Knowledge/RAG pipeline.

---

## docs/architecture/

| File | Content |
|------|---------|
| `knowledge.md` | Knowledge domain architecture |
| `schema-registry.md` | Schema registry design |
| `state-machines.md` | XState state machine patterns |
| `vector-topology.md` | Vector store topology (Upstash Vector) |
| `notes/model-driven-hexagonal-architecture.md` | MDDD + Hexagonal architecture notes |

---

## docs/ai/

| File | Content |
|------|---------|
| `prompt-engineering.md` | Prompt design patterns |
| `workflow-orchestration.md` | Genkit workflow orchestration |

---

## docs/design/

| File | Content |
|------|---------|
| `core-logic.mermaid` | Core business logic diagram |
| `erd-model.mermaid` | Entity-Relationship Diagram |
| `project-derivation.mermaid` | Project derivation flow |
| `rag-enterprise-e2e.mermaid` | RAG enterprise end-to-end flow |
| `rag-implementation-mapping.md` | RAG implementation mapping |
| `state-machine.mermaid` | State machine diagram |

---

## docs/explanation/

| File | Content |
|------|---------|
| `development-contract-governance.md` | How contracts are governed and evolved |

---

## docs/reference/development-contracts/ — ⭐ CRITICAL FOR FUTURE WORK

These are the **formal delivery contracts** that define acceptance criteria, data shapes, and event contracts for each module. Always read the relevant contract before implementing a module.

| Contract File | Module | Notes |
|--------------|--------|-------|
| `overview.md` | All | Contract governance overview |
| `acceptance-contract.md` | acceptance | Acceptance criteria contract |
| `audit-contract.md` | audit | Audit trail contract |
| `billing-contract.md` | billing | Billing lifecycle contract |
| `parser-contract.md` | parser | Document parsing contract |
| `rag-ingestion-contract.md` | RAG / knowledge-core | RAG ingestion pipeline contract |
| `schedule-contract.md` | schedule | **Bidirectional request→fulfillment MDDD contract** (PR #9) |

> ⚠️ **Rule**: Before implementing any module feature, locate and read its contract file here first.  
> Missing contract = create one in this folder before writing code.

---

## Python Functions ADRs — `lib/firebase/functions-python/docs/adr/`

7 Python-specific ADRs (separate from docs/adr/):

| ADR | Topic |
|-----|-------|
| ADR-001 | Document parsing strategy |
| ADR-002 | Runtime boundary (Python vs TypeScript) |
| ADR-003 | Dependency selection |
| ADR-004 | Structure and interaction design |
| ADR-005 | Migration from TypeScript functions |
| ADR-006 | Enterprise RAG pipeline design |
| ADR-007 | Firestore RAG data model |
