# Documentation

This docs skeleton is based on the Diataxis documentation framework as retrieved from Context7.

## Source of truth

- Framework: Diataxis four-purpose model
- Purposes: tutorials, how-to guides, reference, explanation
- IA rule: keep hierarchy shallow (max two levels under docs/)

## Structure

- tutorials/: learning-oriented, guided paths
- guides/how-to/: task-oriented procedures
- guides/explanation/: concept-oriented reasoning and trade-offs
- reference/: exact facts and reference material
- reference/specification/: specification documents
- architecture/: architecture docs and ADR collection
- development/: development process and implementation guides
- diagrams/: architecture and flow diagrams
- templates/: one template per purpose

## Authoring constraints

1. Each page serves exactly one purpose.
2. Do not mix tutorial/how-to/reference/explanation content in one page.
3. Keep folder depth to docs/<section>/<file>.md.
4. Cross-link related pages instead of mixing content types.
