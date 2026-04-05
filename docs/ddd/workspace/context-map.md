# Context Map ??workspace

## 銝虜嚗?鞈湛?

### account / organization ??workspace嚗ustomer/Supplier嚗?

- `workspace.accountId` ? account ??organization
- workspace ?亥岷??霅?accountId 甇詨惇

---

## 銝虜嚗◤靘陷嚗?

`workspace` ?臬???workspace-* 摮芋蝯?**蝯?摰蹂蜓**嚗?

### workspace ??workspace-flow嚗onformist嚗?
- `WorkspaceDetailScreen` 蝯? `WorkspaceFlowTab`嚗asks tab嚗?
- ?喳 `workspaceId`, `currentUserId`

### workspace ??workspace-scheduling嚗onformist嚗?
- `WorkspaceDetailScreen` 蝯? `WorkspaceSchedulingTab`

### workspace ??workspace-audit嚗onformist嚗?
- `WorkspaceDetailScreen` 蝯? `WorkspaceAuditTab`

### workspace ??workspace-feed嚗onformist嚗?
- `WorkspaceDetailScreen` 蝯? feed ????tab

### workspace ??knowledge嚗ustomer/Supplier嚗?
- ?亥??嚗ikiPage嚗撅祆 workspaceId
- Wiki ?批捆璅對?WikiContentTree嚗?撌乩??蝯?

---

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| account ??workspace | account | workspace | Customer/Supplier |
| organization ??workspace | organization | workspace | Customer/Supplier |
| workspace ??workspace-flow | workspace | workspace-flow | Conformist嚗orkspaceId嚗?|
| workspace ??workspace-scheduling | workspace | workspace-scheduling | Conformist |
| workspace ??workspace-audit | workspace | workspace-audit | Conformist |
| workspace ??workspace-feed | workspace | workspace-feed | Conformist |
