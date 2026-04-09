# interfaces/api — API Driving Adapters

`interfaces/api/` 是 workspace 的 **API adapter implementation layer**。它把外部同步需求整理成契約、query/action adapter、facade 與 runtime composition，但真正對外公開的 cross-module boundary 仍是 `modules/workspace/api/`。

> 新增內容一律以 driving adapter 責任為準；不要把 use case 或 infrastructure 邏輯散落在 query/action 檔案裡。

---

## 目錄結構

```txt
interfaces/api/
	contracts/   -> public contracts split by concern
	facades/     -> thin outward entrypoints grouped by concern
	queries/     -> read adapters backed by WorkspaceQueryPort
	actions/     -> write adapters backed by WorkspaceCommandPort
	runtime/     -> adapter composition and session context
	ui.ts        -> public web-composition re-export
	index.ts     -> aggregate export for interfaces/api
```

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Adapter contracts | `contracts/workspace.contract.ts` |
| Thin outward facades | `facades/workspace.facade.ts` |
| Read adapters | `queries/workspace.query.ts` |
| Write adapters | `actions/workspace.command.ts` |
| Runtime composition | `runtime/workspace-runtime.ts` |
| Session context | `runtime/workspace-session-context.ts` |

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Domain rule / invariant / policy | 放 `domain/` |
| Use case 內部流程本體 | 放 `application/use-cases/` |
| Repository / Database / Genkit concrete call（除 `runtime/` 外） | 應透過 `ports/input/` / `ports/output/` 間接協作 |
| React component / hooks | 放 `interfaces/web/` |

---

## 依賴箭頭

```txt
interfaces/api/contracts
	-> application/dtos | domain public types
interfaces/api/{queries,actions,facades}
	-> ports/input
interfaces/api/runtime
	-> application/services | infrastructure adapters
```

只有 `runtime/` 可以做 adapter composition；其餘 `interfaces/api` 檔案 **不可**直接依賴 `infrastructure/firebase/`、`infrastructure/events/`。