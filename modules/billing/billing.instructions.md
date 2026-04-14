---
description: Minimal rules for the billing bounded context.
applyTo: 'modules/billing/**/*.{ts,tsx,js,jsx,md}'
---

# Billing Instructions

- `modules/billing` owns subscription and entitlement concerns.
- Keep commercial policy inside billing, not platform UI or transport layers.
- Expose only semantic capabilities from `api/`.
- Keep infrastructure adapters isolated from domain logic.
