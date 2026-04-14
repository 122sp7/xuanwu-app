# IAM

Migration-safe bounded-context foundation for identity and access management.

## Canonical subdomains

- identity
- authentication
- authorization
- access-control
- federation
- session
- tenant
- security-policy

This module is the semantic home for actor identity, sign-in lifecycle, authorization decisions, federated provider integration, tenant isolation, and security governance.

## Migration note

Platform may still host some legacy implementation details during convergence, but new cross-context consumers should depend on the IAM public boundary first.
