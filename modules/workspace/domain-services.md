# workspace — Domain Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

目前 workspace 沒有獨立的 `domain/services/*` 檔案。這是刻意的 tactical 選擇，不是遺漏。

在 workspace 中，Domain Service（領域服務）是類別 / 函式，用來承載不自然屬於 aggregate、entity、value object 的純領域規則。

## 目前狀態

- 單一 aggregate 內的規則，優先留在 `Workspace` aggregate 與 supporting domain objects
- 讀模型組裝與外部資料翻譯，優先留在 query-side repository / application orchestration
- 還沒有出現足以穩定抽成 domain service 的跨 aggregate、純領域規則

## 何時應新增 Domain Service

只有在出現以下情況時，才應把規則抽成 domain service：

- 規則跨越多個 aggregate 或多個 supporting domain objects
- 規則不是單純的 repository 查詢，也不是 UI composition
- 規則不依賴 React、Firebase SDK、HTTP client 或 router
- 規則本身是穩定的領域語言，而不是暫時性的流程拼裝

## 可能的候選服務（尚未落地）

| 候選服務 | 何時需要 |
|---|---|
| `WorkspaceLifecyclePolicy` | 若生命週期轉移規則持續增加，超出 aggregate 本身可讀性時 |
| `WorkspaceAccessResolutionService` | 若 direct grant、team grant、personnel 解析邏輯需要在多個 use case 重複使用時 |
| `WorkspaceCapabilityMountPolicy` | 若 capability mounting 有穩定、可重用的領域規則時 |

## 明確不是 Domain Service 的內容

- React hooks
- Server Actions
- query wrappers
- UI draft factories
- 只服務單一 page 的 tab composition helper
