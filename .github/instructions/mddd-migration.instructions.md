---
name: Xuanwu MDDD Migration Rules
description: Apply these rules when editing modules, shared code, or shell features during the VSA to MDDD migration.
applyTo: "app/**/*,modules/**/*,shared/**/*,ui/**/*,infrastructure/**/*,interfaces/**/*,libs/**/*"
---
# Xuanwu MDDD migration rules

- Start by loading `xuanwu-app-skill` and mapping the affected flow across the repository.
- Prefer filesystem MCP, repomix MCP, and memory MCP over ad-hoc single-file reading.
- Preserve the target layering from `ARCHITECTURE.md`:
  - UI only coordinates presentation and user interactions.
  - Application owns workflows and use-cases.
  - Domain stays framework-free.
  - Infrastructure owns Firebase, APIs, persistence, and adapters.
- Before moving or creating code, check whether the concern already belongs in:
  - `shared/` for common types, validators, hooks, constants, and utilities
  - `libs/` for generic abstractions/integrations
  - `ui/` for reusable presentation components
- Avoid VSA-style coupling where pages or components directly absorb business logic.
- During migration, prefer augmenting an existing module over introducing duplicate paths.
- Keep migration actions idempotent and safe to rerun without duplicate files, adapters, or UI flows.
- Validate identity/account/organization module completeness first before moving to other unfinished scopes.
- Enforce cross-module UI/UX consistency (tokens, spacing, typography, shadcn usage, feedback patterns).
- When a meaningful module milestone is reached, update memory MCP notes with:
  - completed scope
  - reusable patterns
  - remaining gaps or follow-up work
- Refresh repo index or skill references when module boundaries or reusable UI patterns materially change.
