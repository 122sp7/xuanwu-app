---
description: Minimal rules for the IAM bounded context.
applyTo: 'modules/iam/**/*.{ts,tsx,js,jsx,md}'
---

# IAM Instructions

- modules/iam owns identity, authentication, authorization, access-control, federation, session, tenant, and security-policy concerns.
- Keep governance and access policy semantic here, not in UI composition.
- Expose stable capability contracts from the public API only.
- Keep domain logic framework-free and keep infrastructure adapters isolated.
- Use migration-safe bridges when extracting legacy IAM behavior out of Platform and other bounded contexts.
