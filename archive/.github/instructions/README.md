# Instructions Index

Repository instruction index for `applyTo`-scoped Copilot rules.

## DDD 戰略與戰術設計 (IDDD)

遵循 Vaughn Vernon《Implementing Domain-Driven Design》規範：

- [ubiquitous-language.instructions.md](ubiquitous-language.instructions.md)
- [bounded-context-rules.instructions.md](bounded-context-rules.instructions.md)
- [domain-modeling.instructions.md](domain-modeling.instructions.md)
- [event-driven-state.instructions.md](event-driven-state.instructions.md)

## Architecture

- [architecture-api-boundary.instructions.md](architecture-api-boundary.instructions.md)
- [architecture-mddd.instructions.md](architecture-mddd.instructions.md)
- [architecture-modules.instructions.md](architecture-modules.instructions.md)
- [architecture-monorepo.instructions.md](architecture-monorepo.instructions.md)

## Delivery Process

- [branching-strategy.instructions.md](branching-strategy.instructions.md)
- [ci-cd.instructions.md](ci-cd.instructions.md)
- [commit-convention.instructions.md](commit-convention.instructions.md)
- [lint-format.instructions.md](lint-format.instructions.md)

## Platform and Runtime

- [firebase-architecture.instructions.md](firebase-architecture.instructions.md)
- [cloud-functions.instructions.md](cloud-functions.instructions.md)
- [hosting-deploy.instructions.md](hosting-deploy.instructions.md)
- [firestore-schema.instructions.md](firestore-schema.instructions.md)
- [security-rules.instructions.md](security-rules.instructions.md)

## AI and RAG

- [genkit-flow.instructions.md](genkit-flow.instructions.md)
- [embedding-pipeline.instructions.md](embedding-pipeline.instructions.md)
- [rag-architecture.instructions.md](rag-architecture.instructions.md)
- [prompt-engineering.instructions.md](prompt-engineering.instructions.md)

## Next.js and UI

- [nextjs-app-router.instructions.md](nextjs-app-router.instructions.md)
- [nextjs-parallel-routes.instructions.md](nextjs-parallel-routes.instructions.md)
- [nextjs-server-actions.instructions.md](nextjs-server-actions.instructions.md)
- [shadcn-ui.instructions.md](shadcn-ui.instructions.md)
- [tailwind-design-system.instructions.md](tailwind-design-system.instructions.md)

## Testing

- [testing-unit.instructions.md](testing-unit.instructions.md)
- [testing-e2e.instructions.md](testing-e2e.instructions.md)

## Legacy

Legacy files were moved from `old/` into the categorized files above.

## Legacy Mapping

- `old/06-context7-usage.instructions.md` -> `architecture-monorepo.instructions.md` (external-doc usage boundary)
- `old/07-markitdown-rag.instructions.md` -> `embedding-pipeline.instructions.md`, `rag-architecture.instructions.md`, `cloud-functions.instructions.md`
- `old/modules-api-boundary.instructions.md` -> `architecture-api-boundary.instructions.md`
- `old/modules-architecture.instructions.md` -> `architecture-mddd.instructions.md`, `architecture-modules.instructions.md`
- `old/modules-dependency-graph.instructions.md` -> `architecture-mddd.instructions.md`, `architecture-api-boundary.instructions.md`
- `old/modules-naming.instructions.md` -> `architecture-modules.instructions.md`
- `old/modules-refactoring.instructions.md` -> `architecture-modules.instructions.md`
- `old/xuanwu-app-nextjs-mddd.instructions.md` -> `nextjs-app-router.instructions.md`, `nextjs-server-actions.instructions.md`, `firebase-architecture.instructions.md`, `architecture-monorepo.instructions.md`
- `old/xuanwu-functions-python.instructions.md` -> `cloud-functions.instructions.md`, `embedding-pipeline.instructions.md`, `firebase-architecture.instructions.md`
- `old/prompt.instructions.md` -> `prompt-engineering.instructions.md`

## Customization Frontmatter Quick Reference

Use these condensed rules for customization files outside runtime/business architecture.

- `.instructions.md`: required `description`, `applyTo`; keep glob scopes narrow.
- `.prompt.md`: use `description`, `agent`; define required inputs and fallback behavior.
- `.agent.md`: required `description`; keep tools least-privilege; keep role boundaries explicit.
- `SKILL.md`: required `name`, `description`; keep workflows deterministic and discoverable.

Keep these files concise, avoid duplicating repository-global policy, and prefer linking canonical references over copying long handbooks.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill slavingia-skills-mvp
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
