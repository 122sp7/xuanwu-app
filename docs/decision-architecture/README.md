# Decision Architecture

Architectural decisions (ADRs), system designs, and domain models.

## Core Content

| Type | Count | Entry |
| --- | --- | --- |
| ADRs | 12 | [adr/](./adr/) — RAG (ADR-001-011), Python functions (ADR-012) |
| Architectures | 5 | [architecture/](./architecture/) — AI Knowledge Platform, Daily, Event, Namespace, Schedule |
| Design Models | 5 | [design/](./design/) — core logic, ERD, derivation, RAG E2E, state machines |

## Quick Start

- **System overview** → [architecture/ai-knowledge-platform-architecture.md](./architecture/ai-knowledge-platform-architecture.md)
- **RAG details** → [adr/ADR-001...011](./adr/) (upload → ingestion → query → observability)
- **Domain models** → [design/core-logic.mermaid](./design/core-logic.mermaid), [erd-model.mermaid](./design/erd-model.mermaid)
- **Feature architecture** → [architecture/](./architecture/)

## Related

- [../development-reference/README.md](../development-reference/README.md) — Development guides & contracts
- [../diagrams-events-explanations/diagrams/README.md](../diagrams-events-explanations/diagrams/README.md) — System diagrams

- [docs/README.md](../README.md) — Documentation root
- [docs/development-reference/reference/development-contracts/](../development-reference/reference/development-contracts/) — Implementation contracts derived from ADRs
- [agents/knowledge-base.md](../../agents/knowledge-base.md) — Module inventory and MDDD structure
