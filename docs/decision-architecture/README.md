# Decision Architecture

Records of architectural decisions, system designs, and domain models through ADRs, architecture files, and diagrams.

## Architecture Records (ADRs)

| ADR | Topic | Status |
| --- | --- | --- |
| [ADR-001](./adr/ADR-001-rag-upload-storage-and-document-lifecycle.md) | RAG upload storage and document lifecycle | Accepted |
| [ADR-002](./adr/ADR-002-rag-upload-storage-and-naming.md) | RAG upload storage and naming conventions | Accepted |
| [ADR-003](./adr/ADR-003-rag-firestore-data-model-and-lifecycle.md) | RAG Firestore data model and lifecycle | Accepted |
| [ADR-004](./adr/ADR-004-rag-query-retrieval-and-enterprise-enhancements.md) | RAG query retrieval and enterprise features | Accepted |
| [ADR-005](./adr/ADR-005-rag-ingestion-execution-contract.md) | RAG ingestion execution contract | Accepted |
| [ADR-006](./adr/ADR-006-rag-query-execution-contract.md) | RAG query execution contract | Accepted |
| [ADR-007](./adr/ADR-007-rag-optional-enhancements-rollout.md) | RAG optional enhancements rollout plan | Accepted |
| [ADR-008](./adr/ADR-008-rag-observability-slo-and-acceptance.md) | RAG observability, SLO, and acceptance | Accepted |
| [ADR-009](./adr/ADR-009-rag-firestore-index-matrix.md) | RAG Firestore index matrix | Accepted |
| [ADR-010](./adr/ADR-010-rag-upload-and-worker-event-contract.md) | RAG upload and worker event contract | Accepted |
| [ADR-011](./adr/ADR-011-rag-genkit-flow-contract.md) | RAG Genkit flow contract | Accepted |
| [ADR-012](./adr/ADR-012-functions-python-directory-placement.md) | Python functions directory placement | Accepted |

## System Architectures

| File | Topic |
| --- | --- |
| [ai-knowledge-platform-architecture.md](./architecture/ai-knowledge-platform-architecture.md) | AI knowledge platform system overview |
| [daily.md](./architecture/daily.md) | Daily digest and notifications architecture |
| [event.md](./architecture/event.md) | Event capture and dispatch architecture |
| [namespace.md](./architecture/namespace.md) | Named scopes and slug resolution |
| [schedule.md](./architecture/schedule.md) | Resource scheduling architecture |

## Design Diagrams

| File | Topic |
| --- | --- |
| [core-logic.mermaid](./design/core-logic.mermaid) | Core system domain model |
| [erd-model.mermaid](./design/erd-model.mermaid) | Entity-relationship diagram |
| [project-derivation.mermaid](./design/project-derivation.mermaid) | Data derivation flows |
| [rag-enterprise-e2e.mermaid](./design/rag-enterprise-e2e.mermaid) | RAG end-to-end enterprise flow |
| [state-machine.mermaid](./design/state-machine.mermaid) | Document and task state machines |

## Quick Start

1. **For system overview**: Start with [ai-knowledge-platform-architecture.md](./architecture/ai-knowledge-platform-architecture.md)
2. **For RAG details**: Read [ADR-001](./adr/ADR-001-rag-upload-storage-and-document-lifecycle.md) through [ADR-011](./adr/ADR-011-rag-genkit-flow-contract.md)
3. **For domain models**: View [core-logic.mermaid](./design/core-logic.mermaid) and [erd-model.mermaid](./design/erd-model.mermaid)
4. **For feature architecture**: See feature-specific files in [architecture/](./architecture/)

## Related References

- [docs/README.md](../README.md) — Documentation root
- [docs/development-reference/reference/development-contracts/](../development-reference/reference/development-contracts/) — Implementation contracts derived from ADRs
- [agents/knowledge-base.md](../../agents/knowledge-base.md) — Module inventory and MDDD structure
