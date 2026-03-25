# Documentation

This docs skeleton is based on the Diataxis documentation framework as retrieved from Context7.

## Source of truth

- Framework: Diataxis four-purpose model
- Purposes: tutorials, how-to guides, reference, explanation
- IA rule: keep hierarchy shallow (max two levels under docs/)

## Structure

- tutorials/: learning-oriented, guided paths
- how-to/: task-oriented procedures
- reference/: exact facts, contracts, and specs
- explanation/: concept-oriented reasoning and trade-offs
- _templates/: one template per purpose

## Authoring constraints

1. Each page serves exactly one purpose.
2. Do not mix tutorial/how-to/reference/explanation content in one page.
3. Keep folder depth to docs/<section>/<file>.md.
4. Cross-link related pages instead of mixing content types.
