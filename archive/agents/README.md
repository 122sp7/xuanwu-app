# Xuanwu MDDD Architecture Knowledge System

> Module-Driven Domain Design (MDDD) agent knowledge base for xuanwu-app.
> This directory teaches AI agents how to navigate, understand, and contribute to the codebase.

For the formal Copilot delivery workflow, see [docs/development-reference/reference/ai/customizations-index.md](../docs/development-reference/reference/ai/customizations-index.md) and [docs/how-to-user/how-to/start-feature-delivery.md](../docs/how-to-user/how-to/start-feature-delivery.md).

- **[knowledge-base.md](knowledge-base.md)** — Domain knowledge, module boundaries, and architectural patterns
- **[commands.md](commands.md)** — Build, lint, deploy, and development command reference

## Rules Index

### Architecture

- [architecture-module-structure](rules/architecture-module-structure.md) — Four-layer module layout (domain / application / infrastructure / interfaces)
- [architecture-dependency-direction](rules/architecture-dependency-direction.md) — UI → Application → Domain ← Infrastructure
- [architecture-module-boundaries](rules/architecture-module-boundaries.md) — Module public API via `modules/<module-name>/api/`
- [architecture-package-boundaries](rules/architecture-package-boundaries.md) — `packages/*` as stable public boundaries
- [architecture-hexagonal-ports](rules/architecture-hexagonal-ports.md) — Ports pattern for cross-cutting concerns

### Code Quality

- [quality-imports](rules/quality-imports.md) — `@alias` imports, no legacy paths
- [quality-simplicity](rules/quality-simplicity.md) — Keep code simple
- [quality-code-review](rules/quality-code-review.md) — Code review standards
- [quality-error-handling](rules/quality-error-handling.md) — `CommandResult` / `DomainError` patterns
- [quality-code-comments](rules/quality-code-comments.md) — Comment guidelines
- [quality-pr-creation](rules/quality-pr-creation.md) — Pull request best practices

### Data Layer

- [data-repository-pattern](rules/data-repository-pattern.md) — Interface in `domain/`, implementation in `infrastructure/`
- [data-dto-boundaries](rules/data-dto-boundaries.md) — DTOs at layer boundaries
- [data-firebase-collections](rules/data-firebase-collections.md) — Firebase Firestore patterns

### API Design

- [api-module-surface](rules/api-module-surface.md) — Module API surface via `api/` boundary
- [api-contracts](rules/api-contracts.md) — `@api-contracts` route registry patterns

### Performance

- [performance-avoid-quadratic](rules/performance-avoid-quadratic.md) — Avoid O(n²) algorithms

### Testing

- [testing-coverage](rules/testing-coverage.md) — Test coverage requirements
- [testing-mocking](rules/testing-mocking.md) — Mock services and integrations

### Design Patterns

- [patterns-use-case](rules/patterns-use-case.md) — One use case per file
- [patterns-domain-events](rules/patterns-domain-events.md) — Domain event publishing
- [patterns-domain-services](rules/patterns-domain-services.md) — Domain service encapsulation
- [patterns-dependency-injection](rules/patterns-dependency-injection.md) — Constructor injection

### CI/CD

- [ci-type-check-first](rules/ci-type-check-first.md) — Type-check before tests
- [ci-git-workflow](rules/ci-git-workflow.md) — Git and CI workflow

### Culture

- [culture-accountability](rules/culture-accountability.md) — Engineering accountability
- [culture-leverage-ai](rules/culture-leverage-ai.md) — AI tooling practices

### Reference

- [reference-file-locations](rules/reference-file-locations.md) — Key file paths
- [reference-local-dev](rules/reference-local-dev.md) — Local development setup
