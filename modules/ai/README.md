# AI

Shared AI bounded context for model invocation, safety, orchestration, and provider capability.

## Intended ownership

- provider routing
- model policy
- quota and safety guardrails
- prompt and flow orchestration
- shared text generation used by downstream modules

## Active baseline

- the generation subdomain now hosts the shared Genkit-backed text generation seam
- downstream modules should consume shared AI through the AI public boundary
- platform no longer owns shared AI runtime generation behavior
