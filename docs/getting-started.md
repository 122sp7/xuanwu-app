# Getting Started

This guide gets a contributor from clone to a working local Xuanwu environment.

## Prerequisites

- Node.js 24
- npm
- Python environment compatible with `py_fn/requirements.txt` if you need to run worker validation

## Install Dependencies

```bash
npm install
```

## Start the App

```bash
npm run dev
```

The default development surface is the Next.js app. The authenticated shell is workspace-first and routes users into knowledge, source, knowledge-base, knowledge-database, and notebook workflows.

## Validate the Repository

Run the web validation commands:

```bash
npm run lint
npm run build
```

Run the Python worker checks when your change touches `py_fn/` or ingestion-related contracts:

```bash
cd py_fn
python -m compileall -q .
python -m pytest tests/ -v
```

## Read the Right Docs First

1. [../README.md](../README.md) for product and architecture summary
2. [ddd/subdomains.md](./ddd/subdomains.md) for strategic domain classification
3. [ddd/bounded-contexts.md](./ddd/bounded-contexts.md) for the current bounded-context inventory
4. [architecture/README.md](./architecture/README.md) for cross-context architecture reading paths
5. [development/README.md](./development/README.md) for repository-local implementation guidance

## Internal AI Delivery Docs

Files such as [swarm.md](./swarm.md), [beads.md](./beads.md), and [customization.md](./customization.md) document the repository's internal AI delivery workflow. They are useful for maintainers, but they are not the product entrypoint for understanding Xuanwu itself.

---

[← Back to README](../README.md)
