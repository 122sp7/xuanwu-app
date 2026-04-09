# notebooklm/subdomains/conversation

## 子域職責

`conversation` 子域負責 AI 對話的持久化與生命週期管理：

- `Thread`（對話串）的建立、追加訊息與歸檔
- `Message`（訊息）的有序持久化，維護角色（user/assistant/system）
- 對話歷史的載入，支援 multi-turn context 構建

## 核心語言

| 術語 | 說明 |
|---|---|
| `Thread` | 一組有序 Message 的持久化對話串 |
| `Message` | Thread 中的單則訊息（role + content） |
| `MessageRole` | `"user" \| "assistant" \| "system"` |
| `ThreadHistory` | 提供給模型的對話歷史片段 |
| `ConversationContext` | 用於合成的對話上下文快照 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateThread`、`AppendMessage`、`LoadThreadHistory`）
- `domain/`: `Thread`、`Message`、`MessageRole` 聚合與值物件
- `infrastructure/`: Firestore repository 實作
- `interfaces/`: server action 接線

## 整合規則

- `Thread` 建立時自動關聯 `notebookId` 與 `workspaceId`
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點
