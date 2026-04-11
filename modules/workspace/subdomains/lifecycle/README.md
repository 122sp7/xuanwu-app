# Lifecycle

把工作區容器生命週期獨立成正典邊界。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
