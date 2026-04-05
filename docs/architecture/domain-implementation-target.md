# Domain Implementation Target

This note tracks the current implementation target for bounded-context coverage and legacy decomposition follow-up.

## Current target

- Keep the active bounded-context inventory in `modules/` aligned with the canonical map in [`../ddd/bounded-contexts.md`](../ddd/bounded-contexts.md).
- Treat legacy wiki behavior as decomposed across `content`, `asset`, `workspace`, and `retrieval`, and avoid re-introducing a separate legacy wiki module.
- Use `docs/ddd/<context>/` as the detailed implementation reference for each active bounded context.

## Refresh triggers

Update this note when any of the following change:

- a bounded context is added, merged, renamed, or removed
- a legacy capability is reassigned to a different module owner
- architecture planning adds or removes implementation phases that affect module ownership

## Related references

- [`../ddd/bounded-contexts.md`](../ddd/bounded-contexts.md)
- [`module-boundary.md`](./module-boundary.md)
