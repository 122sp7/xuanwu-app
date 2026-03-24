---
title: Development contracts overview
description: Authoritative index of development contracts that unblock RAG, parser, schedule, acceptance, billing, and audit implementation.
---

# Development contracts overview

This index collects the development contracts that are intended to remove implementation ambiguity before broader MDDD slices are added. Each contract names the owning module, the current runtime boundary, the missing write-side or governance boundary, and the acceptance gates required before code should expand.

## Current contract set

| Contract | Status | Primary owner | Current shape | Main blocker removed |
| --- | --- | --- | --- | --- |
| [RAG ingestion contract](./rag-ingestion-contract.md) | 🚧 Developing | `modules/file` + `modules/ai` + `py_fn` | Cross-runtime upload, worker, and retrieval boundary | ADR drift and upload-to-worker trigger mismatch |
| [Parser contract](./parser-contract.md) | 🏗️ Midway | `modules/parser` | Read-side summary over workspace + file data | Missing parser job boundary and source readiness rules |
| [Schedule contract](./schedule-contract.md) | 🏗️ Midway | `modules/schedule` | Resource request write-side + initial projection on submit + org-level pending dispatch view | Split ownership between derived items, persisted requests, and projection read model — see also [Schedule architecture](../../architecture/schedule.md), [Dev guide](../../schedule/development-guide.md), [User manual](../../schedule/user-manual.md) |
| [Daily contract](./daily-contract.md) | 🏗️ Midway | `modules/daily` | Notification-driven digest baseline evolving toward workspace-authored feed + organization aggregation | Clarifies how Workspace Daily and Organization Daily should grow into explicit feed, interaction, and promotion boundaries — see also [Daily architecture](../../architecture/daily.md), [Dev guide](../../daily/development-guide.md), [User manual](../../daily/user-manual.md) |
| [Acceptance contract](./acceptance-contract.md) | 🏗️ Midway | `modules/acceptance` | Derived acceptance gates over workspace snapshot | No explicit rule for future write-side approval or override flows |
| [Billing contract](./billing-contract.md) | 📅 Planned | `modules/billing` | Read-side billing record model over in-memory data | No canonical contract for invoice, settlement, and refund slices |
| [Audit contract](./audit-contract.md) | 🏗️ Midway | `modules/audit` | Workspace and organization audit queries over Firebase | No explicit append-only audit write contract |
| [Event contract](./event-contract.md) | 🚧 Developing | `modules/event` | Domain event capture and dispatch skeleton with in-memory adapters | No Firestore/Pub-Sub adapter or real bus integration |
| [Namespace contract](./namespace-contract.md) | 🚧 Developing | `modules/namespace` | Named-scope registration and slug resolution with in-memory adapter | No Firestore adapter or URL routing integration |

## Why these contracts exist

The repository already contains ADRs, design notes, and a few module plans, but several implementation areas still rely on implied boundaries. These contract pages convert those implied boundaries into explicit references so future work can stay inside `UI -> Application -> Domain <- Infrastructure` without re-deciding ownership each time.

## Existing source documents

The development contracts complement, rather than replace, the existing design corpus:

- RAG lifecycle and runtime ADRs under `docs/decision-architecture/adr/`
- the file-module implementation plan in `modules/file/README.md`
- the MDDD architecture guide in `agents/knowledge-base.md`

## Recommended rollout order

Start with the RAG ingestion contract because it crosses Next.js and Python runtimes. Then stabilize the parser, schedule, and acceptance contracts because those modules still derive behavior from snapshots and need clearer extension rules before more write-side work lands. Billing and audit should follow because they affect enterprise governance and long-term auditability.

For governance and maintenance rules, see [Development contract governance](../../explanation/development-contract-governance.md).
