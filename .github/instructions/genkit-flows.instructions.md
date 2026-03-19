---
name: Xuanwu Genkit Flow Rules
description: Apply these rules when editing Genkit flows, AI orchestration, or related adapters.
applyTo: "core/**/*.ts,modules/ai/**/*.ts,modules/retrieval/**/*.ts,interfaces/**/*.ts,lib/**/*.ts"
---
# Genkit flow rules

- Keep prompt construction, tool wiring, and AI orchestration isolated from UI and domain entities.
- Define flow inputs and outputs explicitly so downstream interfaces can validate boundaries.
- Do not embed provider-specific details in domain models; keep those concerns in infrastructure or adapter code.
- Prefer composable flow steps over monolithic prompts when orchestration can fail or be retried independently.
- Document runtime assumptions, model dependencies, and fallback behavior in the flow entrypoint.
