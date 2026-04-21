# src/modules

`src/modules/` 是唯一的 bounded-context 實作層。此檔只保留實際目錄索引，避免與各模組文件漂移。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## Module Index（actual directories）

| Module | Overview | Agent entry | Public boundary | Actual subdomains |
|---|---|---|---|---|
| `ai/` | [README.md](ai/README.md) | [AGENTS.md](ai/AGENTS.md) | [index.ts](ai/index.ts) | `chunk`, `citation`, `context`, `embedding`, `evaluation`, `generation`, `memory`, `pipeline`, `retrieval`, `safety`, `tool-calling` |
| `analytics/` | [README.md](analytics/README.md) | [AGENTS.md](analytics/AGENTS.md) | [index.ts](analytics/index.ts) | `event-contracts`, `event-ingestion`, `event-projection`, `experimentation`, `insights`, `metrics`, `realtime-insights` |
| `billing/` | [README.md](billing/README.md) | [AGENTS.md](billing/AGENTS.md) | [index.ts](billing/index.ts) | `entitlement`, `subscription`, `usage-metering` |
| `iam/` | [README.md](iam/README.md) | [AGENTS.md](iam/AGENTS.md) | [index.ts](iam/index.ts) | `access-control`, `account`, `authentication`, `authorization`, `federation`, `identity`, `organization`, `security-policy`, `session`, `tenant` |
| `notebooklm/` | [README.md](notebooklm/README.md) | [AGENTS.md](notebooklm/AGENTS.md) | [index.ts](notebooklm/index.ts) | `conversation`, `notebook`, `source`, `synthesis` |
| `notion/` | [README.md](notion/README.md) | [AGENTS.md](notion/AGENTS.md) | [index.ts](notion/index.ts) | `block`, `collaboration`, `database`, `knowledge`, `page`, `template`, `view` |
| `platform/` | [README.md](platform/README.md) | [AGENTS.md](platform/AGENTS.md) | [index.ts](platform/index.ts) | `audit-log`, `background-job`, `cache`, `feature-flag`, `file-storage`, `notification`, `platform-config`, `search` |
| `template/` | [README.md](template/README.md) | [AGENTS.md](template/AGENTS.md) | [index.ts](template/index.ts) | `document`, `generation`, `ingestion`, `workflow` |
| `workspace/` | [README.md](workspace/README.md) | [AGENTS.md](workspace/AGENTS.md) | [index.ts](workspace/index.ts) | `activity`, `api-key`, `approval`, `audit`, `feed`, `invitation`, `issue`, `lifecycle`, `membership`, `orchestration`, `quality`, `resource`, `schedule`, `settlement`, `share`, `task`, `task-formation` |

## Pair Contract

- `README.md` 只維護模組層實際索引。
- `AGENTS.md` 提供 AI routing 與 nested index。
- 模組內細節由各自的 `AGENTS.md` / `README.md` 維護。
