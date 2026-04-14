---
description: 'AI subdomains structural rules: hexagonal shape per subdomain, provider isolation, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/ai/subdomains/**/*.{ts,tsx}'
---

# AI Subdomains Layer (Local)

Use this file as execution guardrails for `modules/ai/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/ai/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within ai goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `ai.<subdomain>.<action>` (e.g. `ai.inference.model-called`, `ai.orchestration.pipeline-completed`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- Provider SDK details (OpenAI, Vertex, Gemini, etc.) must never appear in `domain/` — they belong in `infrastructure/` adapters only.
- `orchestration` owns pipeline composition and routing policy; `inference` owns the single model invocation boundary — do not merge these concerns.
- `tool-execution` is isolated from `inference`; tool calls are dispatched by `orchestration`, not resolved inside the inference boundary.
- `context` is per-request scope (prompt context window assembly); `memory` is persistent cross-request state — never conflate the two.
- `retrieval` supplies ranked candidates to consumers; it does not own generation or grounding logic.
- `trace` is append-only; never modify or delete trace entries after they are recorded.
- `evaluation` describes output quality and regression results — do not use it for usage metrics or billing signals.
- `distillation` owns model output compression and fine-tuning data preparation; it must not produce canonical content that belongs to other bounded contexts.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
