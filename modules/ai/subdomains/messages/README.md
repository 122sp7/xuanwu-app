# messages — 對話訊息原子單位

## 子域目的

管理單次對話的原子訊息實體，涵蓋四種角色：`User`、`Assistant`、`System`、`Tool Return`。此子域是 `ai` bounded context 對「每一條訊息的身份、內容與可追溯性」的正典知識邊界。

## 業務能力邊界

**負責：**
- 訊息實體的建立、版本化與不可變性保護
- 訊息角色（Role）的正典分類與語意區分
- Tool Return 訊息的結構化格式與工具呼叫追溯
- 訊息的持久化契約與查詢

**不負責：**
- Thread 的組裝或 Context Window 的裁切（屬於 `conversations` 子域）
- 推理執行（屬於 `inference` 子域）
- Tool 定義（屬於 `tools` 子域）
- 訊息的 UI 渲染（屬於 `interfaces/` 層）

## 四種訊息角色

| 角色 | 說明 |
|------|------|
| `user` | 使用者輸入；通常是自然語言提問或指令 |
| `assistant` | 模型回覆；可能包含 tool call 請求 |
| `system` | 系統提示詞；設定行為邊界與 persona |
| `tool` | Function Calling 的工具回傳結果 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Message | 訊息聚合根；包含 role、content、timestamp 與 traceId |
| MessageRole | `user` / `assistant` / `system` / `tool` 的值對象枚舉 |
| ToolCallPayload | `assistant` 訊息中的 Function Calling 請求結構 |
| ToolReturnPayload | `tool` 角色訊息的工具回傳結構 |

## 架構層級

```
messages/
  api/              ← 對外公開訊息讀寫能力
  domain/
    entities/       ← Message
    value-objects/  ← MessageRole, ToolCallPayload, ToolReturnPayload, MessageContent
    repositories/   ← MessageRepository（介面）
    events/         ← MessageCreated, ToolCallDispatched, ToolReturnReceived
  application/
    use-cases/      ← CreateUserMessage, RecordAssistantMessage, RecordToolReturn
```

## 不變條件（Invariants）

- `Message.role` 建立後不可變更
- `tool` 角色的訊息必須攜帶有效的 `toolCallId` 以追溯呼叫來源
- `Message.content` 建立後視為事實，不可靜默覆寫（需建立新版本訊息）

## Ubiquitous Language

- **Message**：不可變的對話原子事實（不是 UI 訊息泡泡）
- **MessageRole**：訊息的語意身份，不是顯示名稱
- **ToolCallPayload**：`assistant` 請求工具執行的結構化意圖
- **ToolReturnPayload**：工具執行完成後的結構化事實回傳
