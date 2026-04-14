# AI Docs

This folder holds module-local architecture notes for the AI bounded context.

## Current baseline

- shared text generation is owned by the generation subdomain
- Genkit wiring is isolated to AI infrastructure
- downstream modules must consume shared AI through the AI public boundary only
