# Context Map — workspace

## 上游（依賴）

### account / organization → workspace（Customer/Supplier）

- `workspace.accountId` 關聯 account 或 organization
- workspace 查詢時驗證 accountId 歸屬

---

## 下游（被依賴）

`workspace` 是多個 workspace-* 子模組的**組合宿主**：

### workspace → workspace-flow（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceFlowTab`（Tasks tab）
- 傳入 `workspaceId`, `currentUserId`

### workspace → workspace-scheduling（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceSchedulingTab`

### workspace → workspace-audit（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceAuditTab`

### workspace → workspace-feed（Conformist）
- `WorkspaceDetailScreen` 組合 feed 動態牆 tab

### workspace → knowledge（Customer/Supplier）
- 知識頁面（WikiPage）隸屬於 workspaceId
- Wiki 內容樹（WikiContentTree）按工作區組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → workspace | account | workspace | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| workspace → workspace-flow | workspace | workspace-flow | Conformist（workspaceId） |
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| workspace → workspace-audit | workspace | workspace-audit | Conformist |
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
