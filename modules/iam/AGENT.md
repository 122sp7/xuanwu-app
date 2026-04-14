# IAM Module Agent Guide

## Purpose

This bounded context owns identity, access control, and tenant-scoped governance concerns.

## Boundary Rules

- Keep authentication, actor identity, access decision, and tenant isolation here.
- Do not place billing, AI orchestration, or workspace product behavior here.
- Cross-module consumers must use the public API boundary.
- Preserve the dependency direction of interfaces to application to domain, with infrastructure depending inward.

## Current subdomains

- identity
- access-control
- tenant
