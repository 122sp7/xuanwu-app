---
name: multitenancy
description: Review or scaffold tenant-aware boundaries, ownership rules, and shared-resource isolation across Xuanwu modules.
---

# Multitenancy Skill

Use this skill when a task spans account, organization, workspace, or cross-tenant access boundaries.

## What to do

1. Identify the tenant root for the flow.
2. Trace access from user identity through account, organization, and workspace context.
3. Verify data reads, writes, caches, indexes, and background jobs remain tenant-scoped.
4. Surface any places where implicit global state could violate isolation.
5. Use the checklist before changing persistence rules or shared retrieval logic.

## Included resources

- [tenant-boundary-checklist.md](./templates/tenant-boundary-checklist.md)
