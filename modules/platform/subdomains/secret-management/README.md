# Secret Management

把憑證、token、rotation 從 integration 中切開。

## Ownership

- **Bounded Context**: platform
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
