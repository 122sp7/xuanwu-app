# Sharing

把對外共享與可見性規則收斂到單一上下文。

## Ownership

- **Bounded Context**: workspace
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
