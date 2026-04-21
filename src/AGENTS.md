# src — Agent Guide

## Immediate Index

- Parent: [AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Route layer: [app/AGENTS.md](app/AGENTS.md)
- Module layer: [modules/AGENTS.md](modules/AGENTS.md)

## Node Map

| Node | Role | Agent entry | Human overview |
|---|---|---|---|
| `src/app/` | Next.js App Router composition layer | [app/AGENTS.md](app/AGENTS.md) | [app/README.md](app/README.md) |
| `src/modules/` | bounded-context implementation layer | [modules/AGENTS.md](modules/AGENTS.md) | [modules/README.md](modules/README.md) |

## Drift Guard

- `src/AGENTS.md` 只負責 routing，不重複模組或路由細節。
- `src/README.md` 保留簡短概覽；深入規則交給子節點。
