<!-- Purpose: Subdomain scaffold overview for platform 'workflow'. -->

## workflow — 事件驅動流程自動化

**Subdomain**: `platform.workflow`  
**Bounded Context**: `modules/platform`  
**Classification**: Generic Subdomain  
**Responsibility**: 事實轉可執行流程；事件觸發與動作編排

### Core Concepts

- **Workflow**: 由事件或排程觸發的自動化動作序列
- **Trigger**: 事件或時間條件
- **Action**: 執行的單一操作（通知、更新狀態、呼叫外部系統）
- **Execution State**: 執行進度與失敗恢復

### Key Aggregates

| Aggregate | Responsibility |
|-----------|---|
| `Workflow` | 流程定義、觸發條件、動作清單 |
| `WorkflowExecution` | 單次流程執行的狀態與結果 |
| `WorkflowAction` | 原子操作單位（可重試） |

### Domain Events

- `WorkflowCreated` — 流程定義已建立
- `WorkflowTriggered` — 觸發條件滿足
- `WorkflowExecutionStarted` — 開始執行流程
- `WorkflowActionExecuted` — 單一動作已完成
- `WorkflowExecutionCompleted` — 流程全部完成或失敗

### Cross-Module Contracts

- **Inbound**: 接收其他子域的事件作為觸發源
- **Outbound**: 發布流程執行結果事件；呼叫通知、內容等子域 API

### Typical Integrations

- `platform.notification` — 發送通知動作
- `platform.background-job` — 非同步排程
- `other-contexts` — 事件訂閱與觸發源

### Implementation Notes

- 使用事件驅動架構避免循環依賴
- 動作失敗應遵循重試原則（exponential backoff）
- 保存執行歷史以供稽核與回溯
