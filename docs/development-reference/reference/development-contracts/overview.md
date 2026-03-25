---
title: Development contracts overview
description: Authoritative index of contracts that unblock RAG, parser, schedule, acceptance, billing, and audit implementation.
---

# Development contracts overview

Contracts that remove implementation ambiguity. Each contract names: owning module, runtime boundary, missing write-side/governance, and acceptance gates.

## Current contract set

| Contract | Status | Primary owner | Current shape | Main blocker removed |
| --- | --- | --- | --- | --- |
| [RAG ingestion contract](./rag-ingestion-contract.md) | 🚧 Developing | `modules/asset` + `modules/knowledge` + `modules/retrieval` + `py_fn` | Cross-runtime upload, worker, and retrieval boundary | ADR drift and upload-to-worker trigger mismatch |
| [Parser contract](./parser-contract.md) | 🏗️ Midway | `modules/parser` | Read-side summary over workspace + file data | Missing parser job boundary and source readiness rules |
| [Schedule contract](./schedule-contract.md) | 🏗️ Midway | `modules/schedule` | Resource request write-side + projection on submit | Split ownership: derived items, persisted requests, projection read model |
| [Daily contract](./daily-contract.md) | 🏗️ Midway | `modules/daily` | Notification digest → workspace feed + org aggregation | Clarify feed, interaction, promotion boundaries |
| [Acceptance contract](./acceptance-contract.md) | 🏗️ Midway | `modules/acceptance` | Derived acceptance gates over workspace snapshot | No explicit rule for future write-side approval or override flows |
| [Billing contract](./billing-contract.md) | 📅 Planned | `modules/billing` | Read-side billing record model over in-memory data | No canonical contract for invoice, settlement, and refund slices |
| [Audit contract](./audit-contract.md) | 🏗️ Midway | `modules/workspace-audit` | Workspace and organization audit queries over Firebase | No explicit append-only audit write contract |
| [Event contract](./event-contract.md) | 🚧 Developing | `modules/event` | Domain event capture and dispatch skeleton with in-memory adapters | No Firestore/Pub-Sub adapter or real bus integration |
| [Namespace contract](./namespace-contract.md) | 🚧 Developing | `modules/namespace` | Named-scope registration and slug resolution with in-memory adapter | No Firestore adapter or URL routing integration |

## Why contracts exist

Implementation areas rely on implied boundaries. Contracts convert these into explicit references so teams stay aligned without re-deciding ownership.

## Related sources

- RAG lifecycle and runtime ADRs: `docs/decision-architecture/adr/`
- MDDD architecture: [agents/knowledge-base.md](../../../../agents/knowledge-base.md)
- File module plan: [modules/file/README.md](../../../../modules/file/README.md)

## Rollout order

1. RAG ingestion (crosses Next.js + Python boundary)
2. Parser, schedule, acceptance (snapshot-derived, need extension rules)
3. Billing, audit (enterprise governance impact)

See [Development contract governance](../../../diagrams-events-explanations/explanation/development-contract-governance.md) for maintenance rules.
