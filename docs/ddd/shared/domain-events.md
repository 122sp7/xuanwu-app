# Domain Events — shared

## 說明

`shared` 是 Shared Kernel，本身不發出或訂閱業務領域事件。

它提供的是**所有 BC 發出事件所需的基礎介面**：

```typescript
// 所有模組的領域事件都遵循此結構
interface DomainEvent {
  readonly type: string;        // "module.entity.action" 格式
  readonly occurredAt: string;  // ISO 8601
}
```

## 事件命名規範（全域）

| 規則 | 範例 |
|------|------|
| 格式 | `<module>.<entity>.<action>` 或 `<module>.<action>` |
| 大小寫 | 全小寫，底線分隔 |
| 時態 | **過去式**（代表已發生的事實） |

```typescript
// ✅ 正確命名
"knowledge.page_created"
"workspace.member_joined"
"workspace-flow.task_status_changed"

// ❌ 錯誤命名
"CreatePage"         // 現在式、大寫
"PageCreatedEvent"   // 有 Event 後綴
```
