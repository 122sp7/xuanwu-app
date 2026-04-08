# workspace — Domain Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

目前 workspace 沒有獨立的 `domain/services/*` 檔案。這是刻意的 tactical 選擇，不是遺漏。

在 workspace 中，Domain Service（領域服務）是類別 / 函式，用來承載不自然屬於 aggregate、entity、value object 的純領域規則。

從六邊形架構看，Domain Service 位於 domain model 內核，而不是 `interfaces/` 或 `infrastructure/` adapter。它可以被 application layer 協作呼叫，但不應反向依賴外部技術。

從 strategic design 看，Domain Service 服務的是 `workspace` 這個 bounded context 的語言，不是跨整個 Xuanwu domain 的共用雜項工具。

它也不等同於 event subscriber、pipeline filter、long-running process executive；那些概念若存在，通常屬於應用層協調或邊界整合，而不是先天就是 Domain Service。

## 與 Ports / Adapters / Drivers / Read Models 的區別

- Port 宣告協作接縫；它不是業務規則本身
- Adapter 轉譯外部系統或 driver；它不是 domain service
- Driver 觸發工作開始；它不是 domain model 元件
- Projection / Read Model 服務讀取；它不是領域規則容器

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

## 若未來引入長流程

- 若只是協調多個事件處理步驟，優先建模為 application-level process orchestration
- 若流程狀態本身成為業務真相，才考慮引入 tracker aggregate，而不是先把它塞成 Domain Service

## 明確不是 Domain Service 的內容

- React hooks
- Server Actions
- query wrappers
- UI draft factories
- 只服務單一 page 的 tab composition helper
