---
name: xuanwu-rag-runtime-boundary
description: 'Apply Xuanwu''s RAG runtime split between Next.js and `functions-python`. Use when working on uploads, document ingestion, parser jobs, taxonomy, chunking, embeddings, Firestore `documents` or `chunks`, vector retrieval, or AI query orchestration. Helps decide which runtime owns the change, preserve the fixed ingestion order, and keep organization/workspace retrieval boundaries intact.'
---

# Xuanwu RAG Runtime Boundary

Use this skill when a change touches the end-to-end RAG lifecycle and you need to preserve the boundary between the user-facing Next.js app and the Python worker runtime.

## When to Use This Skill

- Upload registration and document metadata creation
- `functions-python` ingestion or reprocess flows
- Parser, normalization, taxonomy, chunking, or embedding work
- Firestore `documents` and `chunks` schema changes
- Retrieval, query orchestration, vector search, or answer generation changes
- Auditing whether logic belongs in Next.js or `functions-python`

## Authoritative Sources

- [functions-python/README.md](../../../functions-python/README.md)
- [docs/reference/development-contracts/rag-ingestion-contract.md](../../../docs/reference/development-contracts/rag-ingestion-contract.md)
- [docs/design/rag-implementation-mapping.md](../../../docs/design/rag-implementation-mapping.md)

## Workflow

1. **Decide the owning runtime**
   - **Next.js owns** upload UI, auth, request validation, initial document metadata, retrieval orchestration, prompt assembly, and streaming responses
   - **`functions-python` owns** parsing, normalization, taxonomy, chunking, embedding generation, chunk persistence, and lifecycle write-back

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
   - `functions-python` should expose worker or admin-safe entrypoints, not product-facing query APIs

5. **Validate the boundary**
   - Check that DTOs, Firestore fields, and worker command fields match the contract
   - Run `npm run lint`
   - Run `npm run build`

## Guardrails

- Do not move browser-facing product APIs into `functions-python`.
- Do not make Next.js perform ingestion-only responsibilities such as chunk generation or embedding persistence inside the request path.
- Do not break the `organizationId` / `workspaceId` retrieval boundaries.
- Do not reorder ingestion steps without updating the contract and the runtime documentation together.

## Output Expectations

When using this skill, return:

1. the owning runtime for the change,
2. the contract fields or lifecycle states affected,
3. the ingestion or retrieval boundary that must stay intact,
4. and any cross-runtime documentation that must be updated with the code.
