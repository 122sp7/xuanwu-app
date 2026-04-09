# notion/subdomains/automation

## 子域職責

`automation` 子域負責知識事件驅動的自動化動作：

- `AutomationRule` 的定義（觸發條件 + 動作）
- 知識事件（頁面建立、文章發布等）與自動化規則的匹配
- 自動化執行記錄與狀態追蹤

## 核心語言

| 術語 | 說明 |
|---|---|
| `AutomationRule` | 一條自動化規則（觸發條件 + 一組動作） |
| `TriggerCondition` | 觸發規則的事件條件（事件類型 + 篩選條件） |
| `AutomationAction` | 規則觸發後執行的動作（通知、標籤、推送等） |
| `AutomationRun` | 一次自動化規則執行記錄 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateAutomationRule`、`EvaluateTrigger`、`ExecuteAutomationAction`）
- `domain/`: `AutomationRule`、`TriggerCondition`、`AutomationAction`
- `infrastructure/`: 事件訂閱適配器 + QStash 工作佇列
- `interfaces/`: server action 接線

## 整合規則

- `automation` 訂閱 `knowledge.*`、`authoring.*` 等 `notion` 領域事件
- 複雜動作（如通知）委託給 `platform/notification` 子域
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
