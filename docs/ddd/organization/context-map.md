# Context Map — organization

## 上游（依賴）

### account → organization（Customer/Supplier）

- `organization.members[]` 中的 `MemberReference.id` 參照 `account` 的 accountId
- 查詢成員 profile 時呼叫 `account/api`

---

## 下游（被依賴）

### organization → workspace（Customer/Supplier）

- `Workspace.accountId + accountType="organization"` 關聯至 Organization
- 工作區列表依 organizationId 篩選

### organization → workspace-audit（Published Language）

- 成員加入/移除事件供 `workspace-audit` 消費（未來事件 sink 完成後）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → organization | account | organization | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| organization → workspace-audit | organization | workspace-audit | Published Language (Events) |
