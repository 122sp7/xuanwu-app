# src/modules — Agent Guide

## Purpose

`src/modules/` 是 Xuanwu 系統的**唯一業務模組實作層**。每個子目錄對應一個 bounded context，遵循 Hexagonal Architecture + DDD 分層結構。

## Module Map

| 模組 | 主域角色 | 狀態 |
|---|---|---|
| `iam/` | 身份、存取、帳號、組織（含原 platform/account、platform/org）| ✅ 完成 |
| `billing/` | 訂閱、授權、計費 | 🔨 進行中 |
| `ai/` | 共享 AI 能力（generation、retrieval、orchestration、safety）| 🔨 進行中 |
| `analytics/` | 事件投影、指標、洞察報表 | 🔨 進行中 |
| `platform/` | 平台設定、通知、搜尋、背景排程（account / org 已遷至 iam）| ✅ 完成 |
| `workspace/` | 工作區、任務、議題、排程、協作流程 | 🔨 進行中 |
| `notion/` | 知識頁面（Page / Block / Database / View）、協作、模板 | 🔨 進行中 |
| `notebooklm/` | 筆記本、對話、來源、合成 | 🔨 進行中 |
| `template/` | 可複製骨架（非業務模組，供新模組建立使用）| ✅ 完整骨架 |

## Navigation Rules

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/<context>/AGENTS.md` |
| 撰寫新 use case / entity / adapter | `src/modules/<context>/`（以 `src/modules/template/` 為骨架）|
| 跨模組 API boundary | `src/modules/<context>/index.ts` |
| 模組清單與實作進度 | `src/modules/README.md` |
| 新模組骨架起點 | 複製 `src/modules/template/`，取代 Template→YourEntity |

## Route Here When

- 需要新增或修改任何業務邏輯、use case、entity、adapter 的**實作**。
- 需要確認某個功能屬於哪個 bounded context（查對應模組的 `AGENTS.md`）。
- 需要定義跨模組發布語言（查 `index.ts` 公開邊界）。

## Route Elsewhere When

- 共享 UI 元件 → `packages/ui-shadcn/`
- 共享 Firebase 客戶端 → `packages/integration-firebase/`
- 重度 Ingestion / Embedding / Parsing pipeline → `py_fn/`
- 路由組合 / Shell UI / Next.js App Router → `src/app/`
- 戰略架構邊界與術語 → `docs/structure/domain/` + `docs/structure/contexts/<context>/`

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` 是框架無關、純業務邏輯層。
- 跨模組協作只能透過 `src/modules/<context>/index.ts` 公開邊界。

## Hard Prohibitions

- ❌ `domain/` 匯入 React、Firebase SDK、HTTP client、ORM
- ❌ barrel 使用 `export *`（必須具名匯出）
- ❌ 跨模組直接 import 內部路徑（必須只走 `index.ts`）
- ❌ 在 `platform/` 新增 account / org 相關程式碼（已遷入 `iam/`）
- ❌ 新建或恢復 `workspace-workflow` 子域（已拆解，禁止回歸）
- ❌ 在 `notion/` 使用舊子域名稱 `knowledge-database`、`knowledge`（已重命名為 `database`、`page`）
- ❌ 在 `ai/` 定義使用者對話 UX（屬 `notebooklm/`）

## Document Network

- [README.md](README.md) — 模組清單與子域對照表
- [template/AGENTS.md](template/AGENTS.md) — 骨架使用規則（Copilot / Agent 專用）
- [template/README.md](template/README.md) — 骨架目錄樹、barrel 表、複製步驟
- [docs/structure/domain/bounded-contexts.md](../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
- [docs/structure/domain/subdomains.md](../../docs/structure/domain/subdomains.md) — 子域清單（戰略層）
- [docs/structure/domain/ubiquitous-language.md](../../docs/structure/domain/ubiquitous-language.md) — 術語權威
- [docs/README.md](../../docs/README.md) — 架構文件索引
