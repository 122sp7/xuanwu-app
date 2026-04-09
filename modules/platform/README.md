# platform — 平台層六邊形架構藍圖

`platform` 目錄在這份藍圖中代表平台基礎能力的六邊形架構入口。它不描述任何既有實作狀態，而是定義未來平台層在 ports and adapters 模式下應如何切分責任、穩定語言與管理子域協作。

## 這份藍圖處理的問題

平台層負責的不是產品特色本身，而是讓特色能力能被安全、可替換、可觀測地運作的基礎能力，包括：

- 主體識別與帳戶輪廓
- 組織邊界與權限決策
- 配置、訂閱與能力開關
- 工作流觸發與外部整合
- 通知派送、稽核追蹤與可觀測性訊號

## Hexagonal Core

Context7 範例共同呈現的核心結構是：驅動端透過輸入介面進入 application layer，由 application layer 協調 domain model，再透過輸出介面把持久化、事件發佈與外部呼叫交給可替換的 adapters。

```text
Driving Adapters
	-> Input Ports
		-> Application Services / Use Case Handlers
			-> Domain Aggregates + Domain Services
				-> Output Ports
					-> Driven Adapters
```

## 目標結構

這份藍圖採用以下目標結構來描述平台層：

```text
modules/platform/
  domain/         # aggregates, value objects, domain services, domain events
  application/    # command/query orchestration and use-case handlers
  ports/          # input and output contracts
  adapters/       # persistence, messaging, API, webhook, scheduler adapters
  subdomains/     # platform capability slices
  docs/           # deeper local notes when blueprint grows
```

## 核心聚合

- `PlatformContext`：平台範圍、能力開關與狀態邊界
- `PolicyCatalog`：權限、通知、工作流與稽核政策的版本化集合
- `IntegrationContract`：外部系統整合契約與交付規則
- `SubscriptionAgreement`：方案、權益、限制與生命週期

## 平台子域

platform blueprint 目前包含 11 個本地子域：

- `account`
- `audit`
- `config`
- `identity`
- `integration`
- `notification`
- `observability`
- `organization`
- `permission`
- `subscription`
- `workflow`

這些子域不是用來混寫在同一層的資料夾名稱，而是用來界定共享語言、事件名稱與 ports/adapters 的責任焦點。

## 設計承諾

- domain model 不依賴 HTTP、資料庫、訊息匯流排或監控 SDK
- application services 只做協調，不承載基礎設施細節
- 所有 I/O 都必須先表達成 output ports，再由 adapters 實作
- 所有外部輸入都必須先經過 input ports，再進入 use case handlers
- 事件是已發生的事實，不是命令的別名

## 核心輸入介面

這份藍圖目前使用三組 input port 語言作為進入點：

- `PlatformCommandPort`：建立、啟用、發布、套用、觸發、派送、記錄等命令型入口
- `PlatformQueryPort`：平台總覽、權益、能力與規則摘要等查詢入口
- `PlatformEventIngressPort`：外部或相鄰子域傳入的事件型訊號入口

## 核心輸出介面

這份藍圖目前以四類 output port 表達對外依賴：

- aggregate repositories：保存與載入聚合狀態
- support stores / policy repositories：提供配置輪廓、workflow policy、subject directory 等支援資料
- delivery gateways：通知、工作流、外部系統交付
- evidence sinks：event publishing、audit 與 observability

若未來新增 handler 或子域能力，應先確認它落在哪一類 output port，而不是直接把 SDK 或 client 寫進 application layer。

## 文件導覽

| 文件 | 用途 |
|---|---|
| `AGENT.md` | 代理人工作規則、術語守則與修改邊界 |
| `aggregates.md` | 核心聚合、值物件與不變數 |
| `application-services.md` | use case handlers 與 orchestration 邏輯 |
| `bounded-context.md` | 平台層本地邊界與排除範圍 |
| `context-map.md` | 平台子域與周邊協作關係 |
| `domain-events.md` | 發出事件、訂閱事件與事件欄位 |
| `domain-services.md` | 純領域規則與跨聚合決策 |
| `repositories.md` | repository ports 與 driven adapters 邏輯 |
| `subdomains.md` | 11 個平台子域的能力切分 |
| `ubiquitous-language.md` | 穩定術語與禁用替代詞 |

## 使用方式

如果後續要在 platform 層新增實作，先決定它屬於哪個子域，再決定：

1. 是否需要新的 aggregate 或只是既有 aggregate 的行為
2. 是否需要新的 input port 或 output port
3. 是否需要新的 driven adapter
4. 是否會改變事件語言、權限語言或整合契約

這份 README 只是入口。具體語意以同層的其他文件為準。
