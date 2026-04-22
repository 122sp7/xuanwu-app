# fn Agent Rules

## ROLE

- The agent MUST treat fn as the Python worker runtime for heavy, retryable ingestion and retrieval pipelines.
- The agent MUST keep fn focused on callable/trigger handlers, orchestration use-cases, and infrastructure gateways.
- The agent MUST preserve runtime split between fn and src.

## DOMAIN BOUNDARIES

- The agent MUST keep Next.js browser-facing orchestration outside fn.
- The agent MUST keep business rules and value objects in domain and orchestration in application.
- The agent MUST NOT place Firebase Web SDK or UI/session logic in fn.
- The agent MUST preserve hexagonal dependency flow interface -> application -> domain <- infrastructure.

## TOOL USAGE

- The agent MUST validate callable input schemas before use-case execution.
- The agent MUST validate environment-variable usage against src/core/config.py.
- The agent MUST use tests for behavior validation and compile checks for syntax safety.

## EXECUTION FLOW

- The agent MUST follow this order:
    1. Confirm ownership belongs to fn runtime.
    2. Identify affected layer (interface/application/domain/infrastructure).
    3. Update layer-local code only.
    4. Run py compile and tests.
    5. Report contracts and runtime impacts.

## DATA CONTRACT

- The agent MUST keep callable payload contracts explicit and version-safe.
- The agent MUST keep Firestore/GCS document fields consistent with gateway and schema usage.
- The agent MUST keep cross-runtime payload mirrors aligned with TypeScript contracts.

## CONSTRAINTS

- The agent MUST NOT bypass authorization checks for callable entry points.
- The agent MUST NOT add hidden side effects outside declared gateways.
- The agent MUST NOT couple fn directly to src module internals.

## ERROR HANDLING

- The agent MUST fail fast on invalid schema input.
- The agent MUST report auth failures and external-service failures explicitly.
- The agent MUST keep retry behavior idempotent where required.

## CONSISTENCY

- The agent MUST keep Cloud Function declarations aligned with interface handlers.
- The agent MUST keep AGENTS as routing/rules and README as operator overview.
- The agent MUST keep runtime split language consistent across fn and src docs.

## SECURITY

- The agent MUST preserve callable auth and tenant/account scope boundaries.
- The agent MUST keep secrets in Secret Manager/env and never hardcode credentials.
- The agent MUST avoid leaking sensitive payloads in logs and examples.

## Cloud Functions Index

| Function | Trigger Type | Core Handler |
|---|---|---|
| on_document_uploaded | Storage trigger | handle_object_finalized |
| parse_document | HTTPS callable | handle_parse_document |
| rag_query | HTTPS callable | handle_rag_query |
| rag_reindex_document | HTTPS callable | handle_rag_reindex_document |

## Route Here When

- You change parse/chunk/embed/reindex/query pipeline behavior.
- You modify callable schemas, worker orchestration, or gateway implementations.
- You change RAG cache/rate-limit/audit publish behavior in worker runtime.

## Route Elsewhere When

- Browser-facing upload UX and route composition: [../src/app/AGENTS.md](../src/app/AGENTS.md)
- Module-level UX or server actions: [../src/modules/AGENTS.md](../src/modules/AGENTS.md)
- Firestore/Storage security policy files at repo root: [../AGENTS.md](../AGENTS.md)

## Validation Commands

```bash
cd fn
python -m compileall -q .
python -m pytest tests/ -v
```

## Quick Links

- Pair: [README.md](README.md)
- Runtime entry: [main.py](main.py)
- Config authority: [src/core/config.py](src/core/config.py)
- Runtime DI: [src/app/container/runtime_dependencies.py](src/app/container/runtime_dependencies.py)
- Cross-runtime contract reference: [../docs/01-architecture/contexts/ai/cross-runtime-contracts.md](../docs/01-architecture/contexts/ai/cross-runtime-contracts.md)
