---
name: xuanwu-rag-runtime-boundary
description: 'Enforce Xuanwu''s RAG runtime split between Next.js and `py_fn`. Use for uploads, ingestion, parser jobs, chunking, embeddings, Firestore `documents` or `chunks`, vector retrieval, and AI query orchestration. Preserves runtime ownership, fixed ingestion order, and organization/workspace boundaries.'
---

# Xuanwu RAG Runtime Boundary

Use this skill when a change touches the end-to-end RAG lifecycle and you need to preserve the boundary between the user-facing Next.js app and the Python worker runtime.

## When to Use This Skill

- Upload registration and document metadata creation
- `py_fn` ingestion or reprocess flows
- Parser, normalization, taxonomy, chunking, or embedding work
- Firestore `documents` and `chunks` schema changes
- Retrieval, query orchestration, vector search, or answer generation changes
- Auditing whether logic belongs in Next.js or `py_fn`

## Authoritative Sources

- [py_fn/README.md](../../../py_fn/README.md)
- [docs/development-reference/reference/development-contracts/rag-ingestion-contract.md](../../../docs/development-reference/reference/development-contracts/rag-ingestion-contract.md)
- [docs/decision-architecture/adr/ADR-005-rag-ingestion-execution-contract.md](../../../docs/decision-architecture/adr/ADR-005-rag-ingestion-execution-contract.md)

## Workflow

1. **Decide the owning runtime**
   - **Next.js owns** upload UI, auth, request validation, initial document metadata, retrieval orchestration, prompt assembly, and streaming responses
   - **`py_fn` owns** parsing, normalization, taxonomy, chunking, embedding generation, chunk persistence, and lifecycle write-back

2. **Preserve the canonical ingestion contract**
   - Keep `organizationId` and `workspaceId` on both documents and chunks
   - Keep the shared lifecycle states aligned with the contract
   - Treat Firestore as the canonical metadata store

3. **Preserve the fixed ingestion order**
   1. Parse
   2. Clean / normalize
   3. Document taxonomy
   4. Chunk / structure
   5. Chunk metadata
   6. Embedding
   7. Persist chunks
   8. Mark document ready

4. **Keep query orchestration in Next.js**
   - User query handling, query embeddings, retrieval orchestration, and answer generation remain in Next.js
   - `py_fn` should expose worker or admin-safe entrypoints, not product-facing query APIs

5. **Validate the boundary**
   - Check that DTOs, Firestore fields, and worker command fields match the contract
   - Run `npm run lint`
   - Run `npm run build`

## Guardrails

- Do not move browser-facing product APIs into `py_fn`.
- Do not make Next.js perform ingestion-only responsibilities such as chunk generation or embedding persistence inside the request path.
- Do not break the `organizationId` / `workspaceId` retrieval boundaries.
- Do not reorder ingestion steps without updating the contract and the runtime documentation together.

## Output Expectations

When using this skill, return:

1. the owning runtime for the change,
2. the contract fields or lifecycle states affected,
3. the ingestion or retrieval boundary that must stay intact,
4. and any cross-runtime documentation that must be updated with the code.
