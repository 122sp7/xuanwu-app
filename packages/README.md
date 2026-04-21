# packages

`packages/` 是共享 infra primitive、外部整合封裝與 UI package 的目錄。這份索引只維護實際子套件清單。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Infra subgroup: [infra/README.md](infra/README.md) / [infra/AGENTS.md](infra/AGENTS.md)

## Package Index（actual directories）

| Package | Overview | Agent entry | Public boundary |
|---|---|---|---|
| `infra/` | [README.md](infra/README.md) | [AGENTS.md](infra/AGENTS.md) | — |
| `integration-ai/` | [README.md](integration-ai/README.md) | [AGENTS.md](integration-ai/AGENTS.md) | [index.ts](integration-ai/index.ts) |
| `integration-firebase/` | [README.md](integration-firebase/README.md) | [AGENTS.md](integration-firebase/AGENTS.md) | [index.ts](integration-firebase/index.ts) |
| `integration-queue/` | [README.md](integration-queue/README.md) | [AGENTS.md](integration-queue/AGENTS.md) | [index.ts](integration-queue/index.ts) |
| `ui-components/` | [README.md](ui-components/README.md) | [AGENTS.md](ui-components/AGENTS.md) | [index.ts](ui-components/index.ts) |
| `ui-dnd/` | [README.md](ui-dnd/README.md) | [AGENTS.md](ui-dnd/AGENTS.md) | [index.ts](ui-dnd/index.ts) |
| `ui-editor/` | [README.md](ui-editor/README.md) | [AGENTS.md](ui-editor/AGENTS.md) | [index.ts](ui-editor/index.ts) |
| `ui-markdown/` | [README.md](ui-markdown/README.md) | [AGENTS.md](ui-markdown/AGENTS.md) | — |
| `ui-shadcn/` | [README.md](ui-shadcn/README.md) | [AGENTS.md](ui-shadcn/AGENTS.md) | [index.ts](ui-shadcn/index.ts) |
| `ui-vis/` | [README.md](ui-vis/README.md) | [AGENTS.md](ui-vis/AGENTS.md) | [index.ts](ui-vis/index.ts) |
| `ui-visualization/` | [README.md](ui-visualization/README.md) | [AGENTS.md](ui-visualization/AGENTS.md) | — |

## Pair Contract

- `README.md` 維護 packages 層的實際索引。
- `AGENTS.md` 維護 routing / placement 決策。
