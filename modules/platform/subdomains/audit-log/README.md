<!-- Purpose: Subdomain scaffold overview for platform 'audit-log'. -->

## Audit Log

**Subdomain**: `audit-log` | **Module**: `platform` | **Context**: Platform  
**Classification**: Generic Subdomain | **Owner**: Platform Team

### Purpose

Track and maintain permanent records of significant platform actions—account changes, organization membership, access control modifications, security events, and compliance-relevant operations. Audit logs serve as the authoritative ledger for regulatory compliance, forensic investigation, and operational accountability.

### Core Responsibility

- Record immutable audit entries for all actionable events
- Provide queryable audit trail filtered by actor, resource, action, and timestamp
- Ensure entries are tamper-evident and meet compliance retention policies
- Support audit export and report generation for compliance teams

### Key Aggregates

- **AuditEntry** — single immutable log record (aggregateId, action, actor, resource, timestamp, metadata)
- **AuditLog** — collection view scoped by workspace or organization

### Domain Events

- `audit-log.entry-recorded` — new audit entry appended

### Inbound Contracts

Other subdomains publish events that trigger audit recording:
- `account.created`, `account.deleted` → audit record
- `organization.member-added`, `organization.member-removed` → audit record
- `access-control.permission-changed` → audit record
- `identity.session-created`, `identity.session-terminated` → audit record

### Outbound Contracts

- Read-only: expose `AuditLog` via query use cases or API
- No command dependency from audit-log to other subdomains

### Technical Notes

- Append-only event store or immutable collection
- Indexed by actor, resource type, timestamp for efficient querying
- Retention policy enforced by compliance subdomain

### Status

🔨 Implementation in progress
