# Context Map — workspace-audit

## 上游（依賴）

`workspace-audit` 訂閱所有業務 BC 的事件，但**不依賴**任何 BC 的 api。它是純事件消費者。

```
所有業務 BC ──[Domain Events]──► workspace-audit（Terminal Sink）
```

### 主要事件來源

| 來源 BC | 整合模式 |
|---------|---------|
| `workspace` | Published Language（被動消費） |
| `organization` | Published Language（被動消費） |
| `workspace-flow` | Published Language（被動消費） |
| `workspace-scheduling` | Published Language（被動消費） |
| `source` | Published Language（被動消費） |
| `ai` | Published Language（被動消費） |

---

## 下游（被依賴）

### workspace-audit → WorkspaceDetailScreen（Interfaces）

- `workspace-audit/api` 提供稽核查詢 API 給 `workspace` 的 WorkspaceDetailScreen tab

---

## Terminal Sink 原則

`workspace-audit` 是事件消費的**終點**，不向其他 BC 發出事件。業務流程不應等待或依賴稽核記錄的完成。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| 所有 BC → workspace-audit | 各 BC | workspace-audit | Published Language (Terminal Sink) |
| workspace-audit → workspace UI | workspace-audit | app/ | Customer/Supplier（查詢） |
