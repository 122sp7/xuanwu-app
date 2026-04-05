# Domain Events — notification

## 發出事件

`notification` 域不發出 DomainEvent（通知本身是事件的結果，而非事件的來源）。

## 訂閱事件

`notification` 是各 BC 事件的**消費端**，訂閱業務事件並轉換為使用者通知：

| 來源 BC | 訂閱事件 | 通知內容 |
|---------|---------|---------|
| `workspace` | `workspace.member_joined` | 新成員加入通知 |
| `workspace-flow` | `workspace-flow.task_status_changed` | 任務狀態變更通知 |
| `workspace-audit` | 稽核紀錄變化 | 重要稽核事件通知（未來） |

## 說明

通知系統的角色是「事件翻譯器」：
1. 其他 BC 發出領域事件
2. notification 訂閱並翻譯為使用者可讀的通知
3. 通知推送給對應的 recipientId

這是典型的 **Published Language** 模式，notification 作為 Conformist 消費者。
