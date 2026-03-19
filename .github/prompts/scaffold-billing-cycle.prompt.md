---
name: scaffold-billing-cycle
description: Draft a billing cycle workflow with statuses, invariants, and audit points.
agent: billing-auditor
argument-hint: "[cycle type] [tenant or account context]"
---
Use xuanwu-app-skill first.

Design a billing cycle scaffold for the requested scenario.

- name the billing states and transitions explicitly
- identify money-moving or audit-sensitive operations
- call out provider integrations, retries, and reconciliation checkpoints
- suggest domain, application, infrastructure, and interface file placement
- return assumptions, risks, and validation requirements
