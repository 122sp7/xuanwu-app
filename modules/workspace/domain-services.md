# workspace — Domain Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

目前 workspace 已建立 `domain/services/` 目錄，並以該目錄作為純業務規則的正式位置。即使目前具體 service 檔案仍少，文件上已將此處定義為未來代碼必須遵守的邊界。

在 workspace 中，Domain Service（領域服務）是類別 / 函式，用來承載不自然屬於 aggregate、entity、value object 的純領域規則。

從六邊形架構看，Domain Service 位於 domain model 內核，而不是 `interfaces/` 或 `infrastructure/` adapter。它可以被 application layer 協作呼叫，但不應反向依賴外部技術。

從 strategic design 看，Domain Service 服務的是 `workspace` 這個 bounded context 的語言，不是跨整個 Xuanwu domain 的共用雜項工具。

它也不等同於 event subscriber、pipeline filter、long-running process executive；那些概念若存在，通常屬於應用層協調或邊界整合，而不是先天就是 Domain Service。

## Domain Service = 邏輯

`domain/services/` 的核心原則只有一個：**Domain Service = 邏輯**。

也就是說，這裡只放：

- 業務規則
- invariant 補助規則
- guard / policy / rule objects
- 不自然屬於單一 aggregate 的純 domain 計算

這裡不放：

- 流程協調
- 多 use case orchestration
- React / Route Handler / CLI adapter
- Firestore / event dispatcher / Genkit 呼叫

流程協調屬於 `application/services/`，不是 `domain/services/`。

## 與 Ports / Adapters / Drivers / Read Models 的區別

- Port 宣告協作接縫；它不是業務規則本身
- Adapter 轉譯外部系統或 driver；它不是 domain service
- Driver 觸發工作開始；它不是 domain model 元件
- Projection / Read Model 服務讀取；它不是領域規則容器

## 與 Application Service 的區別

| | Domain Service | Application Service |
|---|---|---|
| 核心責任 | 邏輯 | 流程 |
| 是否可直接碰 infrastructure | 不可 | 不可直接碰 implementation，應透過 ports |
| 典型內容 | policy、guards、rules | process manager、orchestrator、cross-use-case flow |
| 依賴方向 | 只依賴 domain | 可依賴 domain、use-cases、ports |

## 目前狀態

- 單一 aggregate 內的規則，優先留在 `Workspace` aggregate 與 supporting domain objects
- 讀模型組裝與外部資料翻譯，優先留在 query-side repository / application orchestration
- `domain/services/` 已是正式預留位置；只有當規則穩定成為純領域語言時才放入

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
- Route Handlers / CLI handlers
- query wrappers
- UI draft factories
- 只服務單一 page 的 tab composition helper
