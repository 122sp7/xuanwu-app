---
description: 'Ingestion and embedding pipeline contract for worker-side RAG preparation.'
applyTo: '{py_fn/**/*.py,docs/**/*.md}'
---

# Embedding Pipeline

## Contract Order

Parse -> Clean -> Taxonomy -> Chunk -> Chunk metadata -> Embedding -> Firestore writes -> Mark ready

## Rules

- Do not reorder stages without contract/doc update.
- Normalize source documents to markdown (for example via MarkItDown) before chunking when required by source format.
- Keep metadata traceable for retrieval citations.
- Validate converted markdown quality before chunking.
- Record notable format-loss risk when conversion fidelity may affect downstream retrieval.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill 
#use skill slavingia-skills-company-values
#use skill slavingia-skills-find-community
#use skill slavingia-skills-first-customers
#use skill slavingia-skills-grow-sustainably
#use skill slavingia-skills-minimalist-review
#use skill slavingia-skills-mvp
#use skill slavingia-skills-pricing
#use skill slavingia-skills-validate-idea
