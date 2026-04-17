# 0007 Infrastructure Wiring in api/ Layer

- Status: Superseded by ADR 0015
- Date: 2026-04-13
- Superseded by: [ADR 0015 – api/ Layer Removal](./0015-api-layer-removal.md)

## Context

架構指引要求 `api/` 只暴露**語意契約**（類型、DTO、服務介面），不得包含任何基礎設施配線（Firebase 適配器實例化、資料庫工廠函式）。infrastructure adapter 的組裝應在 `interfaces/composition/` 內完成，這樣才能保持 api/ 邊界的語意穩定性、讓測試可以替換實現。

platform 子域已正確遵守此規則：每個子域的 composition root 位於 `interfaces/composition/*-service.ts`，api/ 僅重新匯出服務合約。

掃描後發現以下 10 個文件直接在 `api/` 層實例化 Firebase 適配器，共 28 個 `new Firebase*()` 呼叫：

### 違規文件清單

| 文件 | 說明 |
|------|------|
| `modules/workspace/api/runtime/factories.ts` | 在 workspace 主域 api/ 內直接實例化 `FirebaseWorkspaceRepository`、`FirebaseWorkspaceQueryRepository`、`FirebaseWikiWorkspaceRepository` |
| `modules/workspace/subdomains/audit/api/factories.ts` | 實例化 `FirebaseAuditRepository` |
| `modules/workspace/subdomains/feed/api/factories.ts` | 實例化 `FirebaseWorkspaceFeedPostRepository`、`FirebaseWorkspaceFeedInteractionRepository` |
| `modules/workspace/subdomains/feed/api/workspace-feed.facade.ts` | facade 建構子預設參數直接使用 `new FirebaseWorkspaceFeedPostRepository()` |
| `modules/workspace/subdomains/scheduling/api/factories.ts` | 實例化 `FirebaseDemandRepository` |
| `modules/workspace/subdomains/workspace-workflow/api/factories.ts` | 實例化 4 個 Firebase 倉儲 |
| `modules/workspace/subdomains/workspace-workflow/api/listeners.ts` | 在 listener 初始化時直接 `new FirebaseTaskRepository()`、`new FirebaseInvoiceRepository()` |
| `modules/workspace/subdomains/workspace-workflow/api/workspace-flow.facade.ts` | facade 依賴直接構建的 Firebase 倉儲 |
| `modules/platform/api/platform-service.ts` | 頂層 api/ 有 singleton 管理與 9 個 Firebase 適配器實例化 |
| `modules/notebooklm/subdomains/synthesis/api/server.ts` | 實例化 `FirebaseKnowledgeContentAdapter`、`FirebaseRagRetrievalAdapter` |

### 違規影響分析

- `api/runtime/factories.ts` 暴露 `OrganizationDirectoryGateway` inline interface，這個 port 應定義在 `domain/ports/`。
- workspace 子域（feed、scheduling、workspace-workflow、audit）完全沒有 `interfaces/composition/` 目錄，導致 DI 組裝散落在 `api/factories.ts`。
- `workspace-feed.facade.ts` 的預設參數注入 Firebase 倉儲，讓 facade 在任何 import 時都可能觸發 Firebase 初始化副作用。

## Decision

確立以下規則作為全庫基礎設施配線的唯一位置準則：

1. **`api/` 層禁止**持有 `let _singleton` 狀態、`new Firebase*()` 呼叫、或任何 infrastructure import。
2. **composition root 唯一位置**：`modules/<context>/(subdomains/<sub>/)interfaces/composition/*-service.ts`。
3. **api/ 允許的內容**：類型匯出、DTO、服務 facade 的型別簽名、`api/server.ts` 為 server-only 薄殼（可 import composition root，不可直接 import Firebase SDK）。
4. **factory function 位置**：若子域需要工廠，應在 `interfaces/composition/` 而非 `api/factories.ts`。
5. **inline port interface**：如 `OrganizationDirectoryGateway`，應移入 `domain/ports/`。

### 修復路徑（優先順序）

| 優先 | 文件 | 行動 |
|------|------|------|
| 高 | `workspace/api/runtime/factories.ts` | 移至 `workspace/interfaces/composition/workspace-service.ts` |
| 高 | `workspace/subdomains/*/api/factories.ts` (4 個) | 各別移至同子域 `interfaces/composition/` |
| 高 | `workspace-workflow/api/listeners.ts` | 從 api/ 分離 Firebase 初始化，移至 composition root |
| 中 | `platform/api/platform-service.ts` | 遵循 platform 子域 composition root 模式重構 |
| 中 | `notebooklm/synthesis/api/server.ts` | 保留 server.ts 薄殼，但 Firebase 組裝移至 `interfaces/composition/synthesis-service.ts` |

## Consequences

正面影響：

- `api/` 邊界真正成為語意穩定的合約層，測試可以注入 mock 而無需觸碰 Firebase。
- Import 時不再觸發 Firebase 初始化副作用。
- 遵循 platform 子域已建立的 composition root 模式，全庫一致。

代價與限制：

- workspace 子域需新建 `interfaces/composition/` 目錄並遷移所有工廠邏輯。
- 遷移期間需確保所有消費端（interfaces/_actions、queries）從 composition root 而非 api/factories.ts import。
- `workspace-feed.facade.ts` 的預設參數模式需重寫為顯式 DI。

## Conflict Resolution

- 若有消費端因移除 `api/factories.ts` 而 import 失敗，統一改為從 `api/index.ts` re-export composition root 的服務函式（不是工廠）。
- `platform/api/platform-service.ts` 的修改需確保現有 `api/index.ts` 匯出合約不變，只移動內部實作。
