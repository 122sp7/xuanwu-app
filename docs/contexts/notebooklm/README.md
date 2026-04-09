# notebooklm

> **Domain Type:** Supporting Subdomain
> **Module:** `modules/notebooklm/`
> **Authoritative docs:** [`modules/notebooklm/`](../../../modules/notebooklm/)

## Boundary

- **Responsible for:**
  - `Thread` lifecycle — create and maintain AI conversation threads（`conversation` 子域）
  - `Message` history — ordered, append-only message list within a thread（`conversation` 子域）
  - RAG-augmented response generation — transforms retrieval results into readable, citable answers（`synthesis` 子域）
  - Citation and source trace — preserves `citation` / source references for trustworthy responses（`source` 子域）
  - `Summary` production — condensed knowledge insights from retrieved content（`synthesis` 子域）
  - `Notebook` composition and management（`notebook` 子域）
  - Lightweight note creation and knowledge linkage（`note` 子域）
  - AI model invocation and prompt engineering（`ai` 子域）
  - Conversation version and snapshot policies（`versioning` 子域）

- **Not responsible for:**
  - Semantic search and chunk retrieval → `notion` `search` subdomain
  - Knowledge content creation or editing → `notion`
  - External document ingestion pipeline → `py_fn`
  - Workspace/collaboration scope management → `workspace`

## Subdomain Inventory

| 子域 | 核心語言 |
|---|---|
| `ai` | `ModelConfig`, `PromptTemplate`, `InferenceRequest` |
| `conversation` | `Thread`, `Message`, `MessageRole` |
| `note` | `Note`, `NoteRef` |
| `notebook` | `Notebook`, `NotebookSection` |
| `source` | `SourceDocument`, `Citation`, `SourceTrace` |
| `synthesis` | `NotebookResponse`, `Summary`, `RetrievalContext` |
| `versioning` | `ConversationSnapshot`, `VersionPolicy` |

## Published Language

- **Commands:**
  - `GenerateNotebookResponse` (RAG-augmented, via `notion` search upstream)
  - `CreateThread`
  - `AddMessage`
  - `CreateNotebook`

- **Queries:**
  - `GetThread`
  - `ListMessages`
  - `GetNotebook`

- **Events:**
  - `notebooklm.thread_created`
  - `notebooklm.response_generated`
  - `notebooklm.notebook_created`

## Upstream / Downstream

- **Upstream:**
  - `platform` → notebooklm — identity and account validation (Published Language)
  - `workspace` → notebooklm — `workspaceId` scope (Published Language)
  - `notion` → notebooklm — semantic retrieval chunks via `search` subdomain for RAG generation (Customer/Supplier, synchronous query)

- **Downstream:**
  - notebooklm → `app/(shell)/ai-chat` — AI Chat page calls `notebooklm/api` through a local `_actions.ts` anti-corruption adapter; `notebooklm/api` barrel must **not** be imported directly in Client Components (Genkit server-only)

- **Relationship types:**
  - `platform → notebooklm`: Published Language / Conformist
  - `workspace → notebooklm`: Published Language
  - `notion → notebooklm`: Customer/Supplier (synchronous query)
  - `notebooklm → app/(shell)/ai-chat`: Anti-Corruption Layer (ACL via `_actions.ts`)

## Context Rules

1. Keep domain model isolated from external model leakage.
2. Expose only stable contracts via published language.
3. Record boundary changes in `docs/context-map.md` and ADRs.
4. `notebooklm/api` barrel is server-only (Genkit); never import it directly in Client Components.
5. `Thread.messages` is append-only — messages cannot be reordered or deleted.
6. Retrieval is always delegated to `notion` search subdomain; `notebooklm` does not own embedding or indexing.
