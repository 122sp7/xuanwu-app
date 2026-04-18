# Instructions Index

本目錄是 `applyTo` 驅動的行為規則層。

## Core Routers (read first)

1. `architecture-core.instructions.md`
2. `architecture-runtime.instructions.md`
3. `process-framework.instructions.md`
4. `docs-authority-and-language.instructions.md`

## Topic Map

| Topic | Primary instruction |
|---|---|
| Global architecture contract (compatibility entry) | `architecture.instructions.md` |
| Bounded context / subdomain strategy | `bounded-context-rules.instructions.md`, `subdomain-rules.instructions.md` |
| Domain purity / modeling | `domain-layer-rules.instructions.md`, `domain-modeling.instructions.md`, `hexagonal-rules.instructions.md` |
| Next.js composition | `nextjs-app-router.instructions.md`, `nextjs-parallel-routes.instructions.md`, `nextjs-server-actions.instructions.md` |
| State management | `state-management.instructions.md`, `event-driven-state.instructions.md` |
| AI / RAG / embedding | `genkit-flow.instructions.md`, `rag-architecture.instructions.md`, `embedding-pipeline.instructions.md` |
| Data / security | `firestore-schema.instructions.md`, `security-rules.instructions.md` |
| UI system | `shadcn-ui.instructions.md`, `tailwind-design-system.instructions.md` |
| Quality / validation | `testing-unit.instructions.md`, `testing-e2e.instructions.md`, `lint-format.instructions.md`, `ci-cd.instructions.md` |
| Deployment / runtime worker | `hosting-deploy.instructions.md`, `cloud-functions.instructions.md` |
| Prompt authoring | `prompt-engineering.instructions.md` |

## Usage Pattern

- 先看 `applyTo` 是否命中你的檔案。
- 同時命中多個 instruction 時：
  1) 先遵守 core routers
  2) 再套用 topic-specific rules
- 若規則衝突，回到 `docs/README.md` 檢查戰略權威。
