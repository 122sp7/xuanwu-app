# Context Map — workspace-flow

## 上游（依賴）

### knowledge → workspace-flow（Published Language）

**這是 workspace-flow 最重要的上游整合。**

- `workspace-flow` 的 `KnowledgeToWorkflowMaterializer` 訂閱 `knowledge.page_approved`
- 從 `extractedTasks[]` 建立 MaterializedTask
- 從 `extractedInvoices[]` 建立 Invoice
- 每個物化實體中記錄 `sourceReference`（pageId + causationId）

```
knowledge.page_approved ──► KnowledgeToWorkflowMaterializer
                            ├─► Task.create（extractedTask）
                            └─► Invoice.create（extractedInvoice）
```

### workspace → workspace-flow（Conformist）

- Task/Issue/Invoice 都隸屬 `workspaceId`
- `WorkspaceFlowTab` 接收 `workspaceId` + `currentUserId` 作為 props

---

## 下游（被依賴）

### workspace-flow → notification（Published Language）

- 狀態變更事件觸發通知（如 task_assigned）

### workspace-flow → workspace-audit（Published Language）

- 狀態轉換事件供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| workspace → workspace-flow | workspace | workspace-flow | Conformist |
| workspace-flow → notification | workspace-flow | notification | Published Language |
| workspace-flow → workspace-audit | workspace-flow | workspace-audit | Published Language |
