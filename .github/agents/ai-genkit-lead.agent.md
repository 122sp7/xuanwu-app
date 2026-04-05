---
name: AI Genkit Lead
description: Lead Genkit-oriented AI orchestration with boundary-safe runtime split across Next.js and py_fn pipelines.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refine Genkit Flow
    agent: Genkit Flow Agent
    prompt: Refine the Genkit flow contract, tool orchestration boundaries, and fallback behavior for this scope.
  - label: Review RAG Boundary
    agent: RAG Lead
    prompt: Review the retrieval and worker-runtime contract impact for this AI scope.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this AI and Genkit change for regression risk, boundary safety, and validation gaps.

---

# AI Genkit Lead

## Target Scope

- `modules/agent/**`
- `app/**`
- `py_fn/**` when coordinating runtime boundaries and worker handoff contracts

## Focus

- Genkit flow ownership and app-side orchestration
- Contract-safe integration with ingestion and retrieval layers

## Guardrails

- Keep auth and chat orchestration in Next.js.
- Keep parsing, chunking, embedding in py_fn workers.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill 
