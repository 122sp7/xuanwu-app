# Context Map

## Strategic Relationship Map

```mermaid
flowchart LR
  ID[identity] -->|Customer/Supplier| AC[account]
  AC -->|Customer/Supplier| SUB[subscription]
  SUB -->|Customer/Supplier| BILL[billing]
  AC -->|Published Language| NOTI[notification]
  BILL -->|Published Language| AUD[audit]
  SUB -->|Conformist| FF[feature-flags]
  CFG[config] -->|Shared Kernel| OBS[observability]
  INT[integration] -->|ACL| ID
  INT -->|ACL| AC
  INT -->|ACL| BILL
```

## Relationship Rules

1. **Customer/Supplier**: supplier owns model evolution; customer adapts by contract versioning.
2. **Conformist**: downstream adopts upstream model intentionally and tracks drift risk.
3. **ACL**: external model translation must happen in adapter boundary, never in domain.
4. **Shared Kernel**: shared concepts must stay minimal and version-governed.
5. **Published Language**: externally visible DTO/events are stable, explicit, and testable.

