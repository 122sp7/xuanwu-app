# Xuanwu App

A Next.js 16 knowledge-management and AI-assisted workspace platform built on Firebase, following the **Module-Driven Domain Design (MDDD)** architecture.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui |
| Backend | Firebase (Firestore, Storage, Auth, App Hosting) |
| AI / RAG | Google Genkit, Document AI, Upstash Vector |
| Workers | Python 3.11 Cloud Functions (`py_fn/`) |
| Realtime | Upstash Redis, QStash |

## Project Structure

```
xuanwu-app/
├── app/              # Next.js App Router pages, layouts, route handlers
├── modules/          # 19 MDDD business modules (bounded contexts)
├── packages/         # Stable shared packages with TypeScript aliases
├── py_fn/ # Firebase Python worker runtime (ingestion, parsing, embedding)
├── agents/           # AI agent knowledge base and rules
└── docs/             # Architecture docs, ADRs, design documents
```

## Getting Started

### Prerequisites

- Node.js 24
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev        # Start Next.js dev server (port 3000)
npm run build      # Production build (includes TypeScript type-check)
npm run lint       # Run ESLint
```

### Firebase Deployment

```bash
npm run deploy:firebase              # Deploy all Firebase resources
npm run deploy:functions:py-fn        # Deploy Python Cloud Functions only
npm run deploy:rules                 # Deploy Firestore + Storage rules
```

See [`agents/commands.md`](agents/commands.md) for the full command reference.

## Architecture

This project follows **Module-Driven Domain Design (MDDD)** with **Implementing Domain-Driven Design (IDDD)** principles by Vaughn Vernon:

- Each business capability is a self-contained module under `modules/`.
- Each `modules/<module-name>/` is an isolated bounded context.
- Cross-module interaction must go through `modules/<module-name>/api/` only.
- Dependency direction: `UI → Application → Domain ← Infrastructure`.
- Keep boundaries explicit: business logic lives in `application/` + `domain/`, UI/UX lives in `interfaces/` and `app/` composition.
- Shared utilities live in `packages/` behind TypeScript aliases (`@shared-types`, `@integration-firebase`, etc.).

### IDDD 規範

本專案已導入 IDDD 開發規範，確保 Copilot 協作開發遵循通用語言（Ubiquitous Language）、限界上下文（Bounded Contexts）與事件驅動（Event-Driven）架構：

- **通用語言**：所有命名必須查閱 [`.github/terminology-glossary.md`](.github/terminology-glossary.md)。
- **聚合根設計**：使用 Zod 品牌型別、不可變狀態與 `pullDomainEvents()` 模式。
- **領域事件**：過去式命名，包含 `eventId` 與 `occurredAt`（ISO string）欄位。
- **DDD 審查 Agent**：[Domain Architect](.github/agents/domain-architect.agent.md) 負責 IDDD 合規性審查。

See [`agents/knowledge-base.md`](agents/knowledge-base.md) for the full architecture reference and [`agents/README.md`](agents/README.md) for the complete rules index.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## AI Delivery Workflow

This repository includes a formal Copilot delivery workflow for non-trivial changes.

- Start here: [docs/how-to-user/how-to/start-feature-delivery.md](docs/how-to-user/how-to/start-feature-delivery.md)
- Customizations index: [docs/development-reference/reference/ai/customizations-index.md](docs/development-reference/reference/ai/customizations-index.md)

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
