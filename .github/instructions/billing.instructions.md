---
name: Xuanwu Billing Rules
description: Apply these rules when editing billing models, cycles, invoices, credits, or settlement logic.
applyTo: "modules/billing/**/*,app/**/*.tsx,interfaces/**/*.ts,infrastructure/**/*.ts"
---
# Billing rules

- Treat pricing, invoicing, credit, and settlement rules as high-risk domain logic that must remain explicit and reviewable.
- Keep currency, interval, status, and ledger concepts modeled with stable names; avoid ambiguous booleans.
- Do not mix provider webhook payloads directly into billing domain objects.
- Preserve auditability: every billing state change should have a source, timestamp, and responsible actor or system reason.
- Prefer additive migrations for billing data contracts over destructive rewrites.
