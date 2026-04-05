# Context Map — workspace-scheduling

## 上游（依賴）

### workspace → workspace-scheduling（Conformist）

- WorkDemand 隸屬 `workspaceId`
- `WorkspaceSchedulingTab` 接收 `workspaceId` 作為 props

### account → workspace-scheduling（Customer/Supplier）

- `AccountSchedulingView` 按 `accountId` 聚合跨工作區排程視圖

---

## 下游（被依賴）

### workspace-scheduling → notification（Published Language）

- 需求建立/狀態變更事件觸發通知

### workspace-scheduling → workspace-audit（Published Language）

- 排程操作供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| account → workspace-scheduling | account | workspace-scheduling | Customer/Supplier |
| workspace-scheduling → notification | workspace-scheduling | notification | Published Language |
| workspace-scheduling → workspace-audit | workspace-scheduling | workspace-audit | Published Language |
