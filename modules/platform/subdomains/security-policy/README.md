<!-- Purpose: Subdomain scaffold overview for platform 'security-policy'. -->

## Overview

The **security-policy** subdomain owns security rule definitions, policy enforcement, and access control decision publication within the platform bounded context.

### Responsibility

- Define security rules and policies (e.g., data classification, encryption requirements)
- Publish policy updates to downstream subdomains
- Enforce policy compliance via ACLs and decision gates
- Manage policy versioning and audit trails

### Upstream

- Platform `identity` — authenticated principal information
- Platform `account-profile` — subject attributes and governance metadata

### Downstream

- Platform `access-control` — enforces published policies at decision time
- Platform `compliance` — tracks policy adherence and violations
- All platform subdomains — consume published security policies

### Key Aggregates

- `SecurityPolicy` — root aggregate for a policy (name, rules, version, scope)
- `PolicyRule` — value object defining a single enforcement rule
- `PolicyVersion` — value object tracking policy history

### Key Domain Events

- `security-policy.created`
- `security-policy.updated`
- `security-policy.published`

### Folders

- `api/` — public cross-subdomain boundary
- `domain/` — `SecurityPolicy`, `PolicyRule`, policy validation logic
- `application/` — use cases for policy CRUD and publishing
- `infrastructure/` — persistence and policy distribution adapters
- `interfaces/` — admin UI and configuration controllers (if required)
