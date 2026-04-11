# Tenant

建立多租戶隔離與 tenant-scoped 規則的正典邊界。

## Ownership

- **Bounded Context**: platform
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
