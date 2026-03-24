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
├── modules/          # 20 MDDD business modules (bounded contexts)
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
npm run deploy:functions:python      # Deploy Python Cloud Functions only
npm run deploy:rules                 # Deploy Firestore + Storage rules
```

See [`agents/commands.md`](agents/commands.md) for the full command reference.

## Architecture

This project follows **Module-Driven Domain Design (MDDD)**:

- Each business capability is a self-contained module under `modules/`.
- Each `modules/<module-name>/` is an isolated bounded context.
- Cross-module interaction must go through `modules/<module-name>/api/` only.
- Dependency direction: `UI → Application → Domain ← Infrastructure`.
- Keep boundaries explicit: business logic lives in `application/` + `domain/`, UI/UX lives in `interfaces/` and `app/` composition.
- Shared utilities live in `packages/` behind TypeScript aliases (`@shared-types`, `@integration-firebase`, etc.).

See [`agents/knowledge-base.md`](agents/knowledge-base.md) for the full architecture reference and [`agents/README.md`](agents/README.md) for the complete rules index.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## AI Delivery Workflow

This repository includes a formal Copilot delivery workflow for non-trivial changes.

- Start here: [docs/how-to/ai/start-feature-delivery.md](docs/how-to/ai/start-feature-delivery.md)
- Customizations index: [docs/reference/ai/customizations-index.md](docs/reference/ai/customizations-index.md)

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
