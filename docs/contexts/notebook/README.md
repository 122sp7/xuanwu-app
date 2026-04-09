# notebook

> **Domain Type:** Supporting Subdomain  
> **Module:** `modules/notebooklm/`  
> **Authoritative docs:** [`modules/notebooklm/`](../../../modules/notebooklm/)

## Boundary

- **Responsible for:**
  - `Thread` lifecycle — create and maintain AI conversation threads
  - `Message` history — ordered, append-only message list within a thread
  - RAG-augmented response generation — transforms retrieval results into readable, citable answers
  - Citation and source trace — preserves `citation` / source references for trustworthy responses
  - `Summary` production — condensed knowledge insights from retrieved content

- **Not responsible for:**
  - Semantic search and chunk retrieval → `search`
  - AI ingestion pipeline → `ai`
  - Knowledge content creation or editing → `knowledge` / `knowledge-base`
  - External document ingestion → `source`
  - Workspace/collaboration scope management → `workspace`

## Published Language

- **Commands:**
  - `GenerateNotebookResponse` (RAG-augmented, via `search` upstream)

- **Queries:**
  - `GetThread`
  - `ListMessages`

- **Events:**
  - None currently published.
  - Potential future events: `notebook.thread_created`, `notebook.response_generated` (for audit and token tracking)

## Upstream / Downstream

- **Upstream:**
  - `search` → notebook — provides semantic retrieval chunks for RAG-augmented generation (Customer/Supplier, synchronous query)
  - `knowledge` / `knowledge-base` / `source` — content origins ingested via `ai` and indexed by `search`; consumed indirectly

- **Downstream:**
  - notebook → `app/(shell)/ai-chat` — AI Chat page calls `notebook/api` through a local `_actions.ts` anti-corruption adapter; `notebook/api` barrel must **not** be imported directly in Client Components (Genkit server-only)

- **Relationship types:**
  - `search → notebook`: Customer/Supplier (synchronous query)
  - `notebook → app/(shell)/ai-chat`: Anti-Corruption Layer (ACL via `_actions.ts`)

## Context Rules

1. Keep domain model isolated from external model leakage.
2. Expose only stable contracts via published language.
3. Record boundary changes in `docs/context-map.md` and ADRs.
4. `notebook/api` barrel is server-only (Genkit); never import it directly in Client Components.
5. `Thread.messages` is append-only — messages cannot be reordered or deleted.
6. Retrieval is always delegated to `search`; `notebook` does not own embedding or indexing.
