---
description: Minimal rules for the IAM bounded context.
applyTo: 'modules/iam/**/*.{ts,tsx,js,jsx,md}'
---

# IAM Instructions

- modules/iam owns identity, access-control, and tenant concerns.
- Keep governance and access policy semantic here, not in UI composition.
- Expose stable capability contracts from the public API only.
- Keep domain logic framework-free and keep infrastructure adapters isolated.
