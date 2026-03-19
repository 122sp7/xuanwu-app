---
name: scaffold-genkit-flow
description: Plan a Genkit flow scaffold with explicit boundaries, inputs, outputs, and runtime assumptions.
agent: rag-architect
argument-hint: "[flow purpose] [input/output expectations]"
---
Use xuanwu-app-skill first.

Design a Genkit flow scaffold for the requested capability.

- identify the owning module and target layer placement
- define flow input and output contracts
- separate orchestration from provider-specific adapters
- list eval, observability, fallback, and deployment considerations
- return a concrete file scaffold and follow-up implementation checklist
