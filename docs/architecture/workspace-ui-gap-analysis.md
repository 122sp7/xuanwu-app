# Workspace UI Gap Analysis

This note captures the current documentation-level UI gaps around the workspace-first experience.

## Current confirmed gaps

- The review → approve → materialize flow described in [`adr/ADR-001-knowledge-to-workflow-boundary.md`](./adr/ADR-001-knowledge-to-workflow-boundary.md) is an architecture target, not a documented shipped workspace UI flow yet.
- Workspace navigation is intentionally workspace-first, so new UI work should extend existing workspace surfaces before adding parallel top-level destinations.
- Any new workspace surface should document its ownership boundary and the module API it depends on before implementation starts.

## Review checklist

Before adding a new workspace-facing UI surface, confirm:

1. the owning bounded context is explicit
2. the route or tab uses module APIs only
3. the flow is reflected in the matching architecture or DDD reference docs

## Related references

- [`README.md`](./README.md)
- [`adr/ADR-001-knowledge-to-workflow-boundary.md`](./adr/ADR-001-knowledge-to-workflow-boundary.md)
- [`module-boundary.md`](./module-boundary.md)
