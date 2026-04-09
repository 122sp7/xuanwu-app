# platform — 平台層六邊形架構藍圖

`platform` 是平台基礎能力的本地六邊形架構藍圖。它的目的不是承載產品差異化內容，而是把主體、治理、商業限制、流程交付與診斷能力收斂成一套穩定可演化的基礎層。

## 這份藍圖處理的問題

platform 處理的是以下問題：

- 主體如何被辨識、對映與治理
- 存取控制與安全政策如何被評估與發佈
- 平台設定、能力開關與方案限制如何共同決定能力是否可用
- 平台如何把內部事實轉成外部整合、流程、通知與證據
- 平台如何量測健康、追蹤因果鏈並保留稽核紀錄

## Hexagonal Core

這份藍圖採用 ports and adapters 的核心結構：

```text
Driving Adapters
    -> Input Ports
        -> Application Services / Use Case Handlers
            -> Domain Aggregates + Domain Services
                -> Output Ports
                    -> Driven Adapters
```

## 目標結構

```text
modules/platform/
  domain/           # aggregates, value objects, domain services, domain events
  application/      # orchestration, handlers, projections
  ports/            # input/output contracts
  adapters/         # preferred home for adapter implementations in this blueprint
  infrastructure/   # compatibility/runtime scaffolding when adapter placement must follow repo constraints
  docs/             # deeper local notes and follow-up design docs
  subdomains/       # canonical closed inventory of platform capability slices
```

`adapters/` 是這份藍圖偏好的六邊形命名；`infrastructure/` 仍保留在目錄中，作為與既有 repo 慣例對接的相容層。未來若兩者同時存在，必須由文件明確說明分工，不能隱性混用。

## 核心聚合

- `PlatformContext`
- `PolicyCatalog`
- `IntegrationContract`
- `SubscriptionAgreement`

## Canonical Subdomain Inventory

platform 的子域清單已封板為 14 個名稱，後續開發預設必須映射到這些既有子域，而不是新增新的子域：

- `identity`
- `account-profile`
- `organization`
- `access-control`
- `security-policy`
- `platform-config`
- `feature-flag`
- `integration`
- `workflow`
- `notification`
- `audit-log`
- `observability`
- `billing`
- `subscription`

## Closed Inventory Rule

這份 inventory 的預設規則是 closed by default：

1. 新需求先映射到既有 14 個子域之一
2. 只有在既有子域的語言、責任與 ports 都無法吸收時，才允許討論新增子域
3. 討論新增前，必須先更新 `subdomains.md`、`context-map.md` 與 `AGENT.md` 的治理說明

## 設計承諾

- domain model 不依賴 HTTP、資料庫、訊息匯流排或監控 SDK
- application services 只做協調，不承載基礎設施細節
- 所有外部輸入都先進 input ports，再進入 use case handlers
- 所有對外依賴都先表達成 output ports，再由 adapters / infrastructure 實作
- 事件永遠描述事實，不描述請求
- 子域名稱必須能讓 Copilot 直接理解用途，不保留模糊或重複的資料夾別名

## 文件導覽

| 文件 | 用途 |
|---|---|
| `AGENT.md` | platform 根層工作規則、最終子域清單與禁用別名 |
| `aggregates.md` | 核心聚合、值物件與不變數 |
| `application-services.md` | use case handlers 與 orchestration 邏輯 |
| `bounded-context.md` | platform 邊界與責任分類 |
| `context-map.md` | 14 個子域之間的協作方向 |
| `domain-events.md` | 發出事件、訂閱事件與事件擁有者 |
| `domain-services.md` | 跨聚合的純領域規則 |
| `repositories.md` | repository、support store 與 delivery ports |
| `subdomains.md` | 14 個子域的正式 inventory 與責任對照 |
| `ubiquitous-language.md` | platform 通用語言與 port 詞彙表 |

## 使用方式

若後續要在 platform 層新增實作，先依序回答：

1. 它屬於哪一個既有子域
2. 它需要新的 input port、output port，還是既有 port 的新 adapter
3. 它是否改變共享語言、事件名稱或責任邊界
4. 它是否會迫使 closed inventory 失效

若第三與第四題回答不清楚，先修正文件，再寫實作。

modules/platform/subdomains/
├── access-control        # 權限控管
├── account-profile       # 帳號個人檔案
├── analytics             # 數據分析
├── audit-log             # 稽核日誌
├── billing               # 帳務計費
├── compliance            # 合規管理
├── content-management    # 內容管理
├── feature-flag          # 功能開關
├── identity              # 身份識別
├── integration           # 外部整合
├── notification          # 通知發送
├── observability         # 可觀測性
├── organization          # 組織目錄
├── platform-config       # 平台設定
├── security-policy       # 安全政策
├── subscription          # 用戶訂閱
├── support               # 客服支援
├── background-job        # 背景排程
└── workflow              # 流程工作流