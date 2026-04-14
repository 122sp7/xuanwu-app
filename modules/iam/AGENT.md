# IAM Module Agent Guide

## Purpose

This bounded context owns identity, authentication, authorization, access control, federation, session, tenant-scoped governance, and security-policy concerns.

## Boundary Rules

- Keep sign-in, actor identity, access decisions, session lifecycle, federation, and tenant isolation here.
- Do not place billing, AI orchestration, or workspace product behavior here.
- Cross-module consumers must use the public API boundary.
- Preserve the dependency direction of interfaces to application to domain, with infrastructure depending inward.
- During migration, prefer IAM-owned bridges over direct imports from Platform internals.

## Current subdomains

- identity
- authentication
- authorization
- access-control
- federation
- session
- tenant
- security-policy
