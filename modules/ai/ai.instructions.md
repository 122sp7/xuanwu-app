---
description: Minimal rules for the AI bounded context.
applyTo: 'modules/ai/**/*.{ts,tsx,js,jsx,md}'
---

# AI Instructions

- modules/ai owns shared AI capability orchestration and policy.
- Keep AI safety, provider routing, and orchestration concerns behind public APIs.
- Do not mix identity governance or billing policy into this module.
- Keep domain logic framework-free and keep adapters isolated in infrastructure.
