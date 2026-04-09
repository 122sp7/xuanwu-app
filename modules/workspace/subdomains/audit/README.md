## workspace.audit subdomain

The audit subdomain owns workspace operation audit trails, read/query capabilities, and UI audit views. It records events and changes for compliance, forensics, and user activity tracking within workspace scope.

### Strategic classification

**Subdomain Type:** Supporting (generic)  
**Parent Domain:** workspace  
**Anchoring aggregate:** `AuditLog` (scoped to `workspaceId`)

### Hexagonal shape

```
interfaces/
    ├── queries/          # TanStack Query hooks for audit event fetching
    ├── components/       # React UI for audit log views, timeline, filters
    └── view-models/      # View transformation for audit display

application/
    ├── use-cases/        # Query audit trails, export logs, filter by actor/action
    └── dto/              # AuditEventReadDTO, AuditFilterDTO

domain/
    ├── entities/         # AuditLog (aggregate root)
    ├── value-objects/    # AuditAction, AuditActorId, AuditTimestamp
    ├── repositories/     # IAuditLogRepository (read/query contracts)
    └── ports/            # (reserved for future event sink ports)

infrastructure/
    ├── firebase/         # FirebaseAuditLogRepository (Firestore collections)
    └── memory/           # InMemoryAuditLogRepository (testing)

api/
    └── index.ts          # Public subdomain boundary (use-case exports, queries)
```

### Ownership and contracts

- **Aggregate root:** `AuditLog` — immutable audit event record with `workspaceId`, `actorId`, `action`, `resourceType`, `resourceId`, `metadata`, `occurredAtISO`
- **Repository interface:** `IAuditLogRepository` — read-only queries (list, filter by date/actor/action)
- **Published events:** Domain events from other workspace subdomains trigger audit log entries via event subscription
- **Dependency:** Consumes published events from workspace parent and sibling subdomains (feed, scheduling, workflow)

### Cross-module integration

- Entry: `@/modules/workspace/api` (parent workspace public API is the preferred cross-module entry)
- Subdomain internal queries: use `@/modules/workspace/subdomains/audit/api`
- Do NOT reach into `domain/`, `application/`, `infrastructure/`, `interfaces/` directly from other modules

### Use cases (sample)

- `list-audit-logs.use-case.ts` — Fetch audit events for a workspace with pagination/filtering
- `export-audit-report.use-case.ts` — Generate audit trail export (CSV/JSON)
- `query-by-actor.use-case.ts` — Find all actions performed by a specific actor

