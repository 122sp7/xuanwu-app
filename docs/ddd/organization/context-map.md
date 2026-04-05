# Context Map ??organization

## 銝虜嚗?鞈湛?

### account ??organization嚗ustomer/Supplier嚗?

- `organization.members[]` 銝剔? `MemberReference.id` ? `account` ??accountId
- ?亥岷? profile ???`account/api`

---

## 銝虜嚗◤靘陷嚗?

### organization ??workspace嚗ustomer/Supplier嚗?

- `Workspace.accountId + accountType="organization"` ???Organization
- 撌乩???”靘?organizationId 蝭拚

### organization ??workspace-audit嚗ublished Language嚗?

- ??/蝘駁鈭辣靘?`workspace-audit` 瘨祥嚗靘?隞?sink 摰?敺?

---

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| account ??organization | account | organization | Customer/Supplier |
| organization ??workspace | organization | workspace | Customer/Supplier |
| organization ??workspace-audit | organization | workspace-audit | Published Language (Events) |
