# Subdomains

## Classification

| Subdomain Type | Goal | Candidate Contexts |
|---|---|---|
| Core | Competitive differentiation and core knowledge workflows | `identity`, `account`, `billing`, `subscription` |
| Supporting | Operational support for core capabilities | `notification`, `audit`, `feature-flags`, `config` |
| Generic | Cross-cutting shared technical capability | `integration`, `observability` |

## Mapping Rules

1. Each bounded context maps to one primary subdomain intent.
2. A context may collaborate with multiple subdomains, but ownership is singular.
3. Reclassification requires updating `bounded-contexts.md`, `context-map.md`, and ADRs.

