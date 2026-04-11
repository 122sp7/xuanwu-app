---
description: 'NotebookLM infrastructure layer rules: Firebase adapters, Genkit AI client, vector store, and RAG persistence contracts.'
applyTo: 'modules/notebooklm/infrastructure/**/*.{ts,tsx}'
---

# NotebookLM Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md`, `.github/instructions/genkit-flow.instructions.md`, and `docs/contexts/notebooklm/*`.

## Core Rules

- Implement only **port interfaces** declared in subdomain `domain/ports/` or context-wide `domain/ports/output/`; never invent new contracts here.
- Genkit adapters (`infrastructure/genkit/`) implement `IRagGenerationRepository` or `NotebookRepository` — keep Genkit flow wiring inside the adapter, not in use cases.
- Firebase adapters own their Firestore collection(s); do not read or write sibling subdomain or cross-module collections directly.
- Vector store interactions must go through `IVectorStore` port — never call embedding or retrieval APIs directly from use cases.
- Keep AI client initialisation (`genkit-ai-client.ts`, `client.ts`) in infrastructure; domain must not reference any AI SDK types.
- Version breaking schema transitions with migration steps; update `firestore.indexes.json` with query-shape changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill rag-architecture
