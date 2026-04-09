# ADR 0005: Anti-Corruption Layer for External Models

- Status: Accepted

## Decision

All external provider models are translated through ACL adapters.

## Rules

1. External payloads do not cross into domain model directly.
2. Translation logic lives in infrastructure adapters.
3. ACL changes require contract impact review in context map and ADRs.

