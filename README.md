# Xuanwu App

Xuanwu is a personal- and organization-oriented Knowledge Platform. Its product goal is to bring documents, notes, knowledge pages, knowledge-base articles, structured data, and external sources into one governable workspace system so knowledge can be preserved, verified, retrieved, reasoned over, and turned into executable work.

The system is built as a modular monolith with Module-Driven Domain Design. `knowledge` and `knowledge-base` are the core domains: `knowledge` owns the Notion-like content lifecycle, while `knowledge-base` owns organization-grade wiki, SOP, and article assets. `workspace` and `organization` provide collaboration and governance boundaries. `source` plus integration adapters form the anti-corruption boundary for external content. `ai`, `search`, and `notebook` provide ingestion, retrieval, reasoning, and research workflows on top of that knowledge base.

## Product Capabilities

- Knowledge pages, block-based editing, versioning, and approval
- Organizational knowledge-base articles, categories, and verification workflows
- Structured databases with records, schema, and multi-view exploration
- External document/source ingestion with workspace-scoped governance
- Ask/Cite, retrieval, summarization, and notebook-style knowledge generation
- Workspace, organization, audit, feed, workflow, and scheduling support for execution

## Architecture At A Glance

- Architecture style: Modular Monolith + Module-Driven Domain Design
- Boundary model: bounded contexts with local ubiquitous language and domain model ownership
- Cross-context collaboration: public `api/` surfaces and published domain events
- Runtime split:
	- `Next.js` owns UI, auth/session orchestration, route composition, and server-side application flow
	- `py_fn/` owns parsing, chunking, embedding, and worker-style ingestion tasks
- Anti-corruption boundary: external systems are translated through source workflows and infrastructure adapters before entering core domains

## Current Domain Shape

- Core domains: `knowledge`, `knowledge-base`
- Supporting domains: `ai`, `knowledge-collaboration`, `knowledge-database`, `notebook`, `search`, `source`, `workspace-audit`, `workspace-feed`, `workspace-flow`, `workspace-scheduling`
- Generic domains: `identity`, `account`, `organization`, `workspace`, `notification`
- Shared kernel: `shared`

See [docs/ddd/subdomains.md](docs/ddd/subdomains.md) and [docs/ddd/bounded-contexts.md](docs/ddd/bounded-contexts.md) for the canonical strategic map.

## Documentation Entry Points

- [docs/getting-started.md](docs/getting-started.md): local setup and validation flow
- [docs/ddd/subdomains.md](docs/ddd/subdomains.md): strategic subdomain classification
- [docs/ddd/bounded-contexts.md](docs/ddd/bounded-contexts.md): bounded-context inventory
- [docs/reference/specification/system-overview.md](docs/reference/specification/system-overview.md): system overview specification
- [AGENTS.md](AGENTS.md): repository-wide operating rules and validation commands
- [.github/copilot-instructions.md](.github/copilot-instructions.md): Copilot workspace baseline

## Development Quick Start

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run build
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## Repository Notes

- `modules/` contains bounded contexts and their local markdown reference sets
- `docs/ddd/` contains strategic DDD entrypoints
- `.github/` contains Copilot customizations, instructions, and repomix-generated skills
- `docs/swarm.md`, `docs/beads.md`, and related files document internal AI delivery workflow, not the product surface itself
