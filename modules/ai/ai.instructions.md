---
description: Minimal rules for the AI bounded context.
applyTo: 'modules/ai/**/*.{ts,tsx,js,jsx,md}'
---

# AI Instructions

- modules/ai owns shared AI capability orchestration, generation, safety, tracing, and provider policy.
- Keep Genkit and provider SDK imports only in modules/ai/infrastructure.
- Downstream consumers must import shared AI only through modules/ai/api or modules/ai/api/server.
- Do not mix identity governance or billing policy into this module.
- Keep domain logic framework-free and keep adapters isolated in infrastructure.
