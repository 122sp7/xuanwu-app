# Architecture Index

Primary architecture source in this workspace:
- ARCHITECTURE.md

Declared dependency direction:
- UI -> Application -> Domain <- Infrastructure

Per-module layout pattern from ARCHITECTURE.md:
- domain/entities
- domain/repositories
- application/use-cases
- infrastructure/firebase
- interfaces/_actions
- interfaces/hooks
- interfaces/queries
- index.ts public API

Core architectural rules:
- Domain is pure TypeScript and owns entities plus repository interfaces.
- Application orchestrates use cases and should stay framework-agnostic.
- Infrastructure contains Firebase adapters and mapping logic.
- Interfaces are thin Next.js and React adapters.
- Shared utilities live in shared/ and should remain cross-cutting.

Known mismatch to watch:
- ARCHITECTURE.md presents the intended MDDD + Hexagonal model.
- Actual module coverage and directory presence should always be confirmed from the current file tree before making broad refactors.
