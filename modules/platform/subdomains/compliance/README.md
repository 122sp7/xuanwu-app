<!-- Purpose: Subdomain scaffold overview for platform 'compliance'. -->

## Compliance Subdomain

Enforces data retention, privacy regulations, and governance policies across the platform.

### Responsibility

- Define and enforce data retention schedules per organizational policy
- Process deletion requests (GDPR right-to-be-forgotten, etc.)
- Audit compliance state and generate compliance reports
- Manage consent records and audit trails for regulatory proof

### Key Aggregates

- `CompliancePolicy` — organizational compliance ruleset (retention periods, deletion triggers)
- `ConsentRecord` — user consent snapshot with timestamp and proof
- `DeletionRequest` — individual or batch deletion mandate with status tracking
- `ComplianceAuditTrail` — immutable log of all compliance actions

### Public API (`api/`)

Exports use-case facades for:
- `InitiateDataDeletionUseCase` — trigger user/workspace data removal
- `DefineCompliancePolicyUseCase` — set retention and deletion rules
- `RecordConsentUseCase` — log consent events (e.g., GDPR acceptance)
- `QueryComplianceStatusUseCase` — check deletion/retention compliance

### Domain Events

- `CompliancePolicyDefined` — new retention rules published
- `DataDeletionInitiated` — deletion request submitted
- `DataDeletionCompleted` — deletion fully executed
- `ConsentRecorded` — consent proof captured

### Dependencies

**Upstream** (feeds this subdomain):
- `platform.account` — account lifecycle (deletions)
- `platform.organization` — org policy scope

**Downstream** (this subdomain notifies):
- `platform.audit-log` — compliance actions logged
- `workspace` — workspace data lifecycle events

### Notes

- All deletion operations are soft or logical unless explicit permanent erasure is required
- Compliance audit trail is append-only and immutable
- Cross-module deletions coordinated via published domain events
