# ADR 0001 — platform `audit-log` vs workspace `audit` 邊界澄清

## Status

Accepted

## Date

2025-02-11

## Context

系統目前存在兩個「稽核」相關子域：

1. **`workspace/subdomains/audit/`**：已存在，負責工作區操作日誌。
2. **`platform/subdomains/`**：無 `audit-log`，但 `docs/structure/domain/subdomains.md` 的 platform baseline 定義包含 `audit-log`。

問題：兩者語意重疊，導致：
- 不清楚某類操作記錄（如成員加入工作區、刪除頁面）應存在 `workspace/audit` 還是 `platform/audit-log`
- 不清楚 `platform/audit-log` 是否應在現有 workspace/audit 之外額外建立

此外，`docs/structure/domain/ubiquitous-language.md` 定義了兩個不同層級的稽核概念：

- **workspace/audit**：工作區操作的活動證據（team 內可見）
- **platform/audit-log**：永久不可否認日誌（系統管理員、合規用途）

## Decision

### 邊界定義

| 維度 | workspace/audit | platform/audit-log |
|---|---|---|
| 所有權 | workspace bounded context | platform bounded context |
| 對象 | 工作區參與者（Membership） | 系統管理員、合規審計員 |
| 範圍 | 單一 workspace 內的操作 | 跨主域的系統級操作 |
| 可見性 | Workspace 成員可查（依權限） | 僅管理員/合規層可查 |
| 保留期 | 業務需要（如 90 天） | 永久（不可否認性） |
| 可刪除性 | 可能依 GDPR 刪除 | 不可刪除（防篡改） |
| 典型事件 | 任務建立、評論、狀態變更 | IAM 角色變更、資料刪除、安全政策更新 |

### 建立 `platform/subdomains/audit-log/`

```
src/modules/platform/subdomains/audit-log/
  README.md
  domain/
    entities/
      AuditLogEntry.ts         # 不可變 log entry 聚合根
    value-objects/
      AuditAction.ts           # create / update / delete / access / system
      AuditActorRef.ts         # actorId + actorType（user / system / service）
      AuditResourceRef.ts      # resourceType + resourceId
    events/
      AuditLogEntryCreated.ts  # 永久記錄已建立（供合規 sink 消費）
    repositories/
      AuditLogRepository.ts    # 介面（write-only + append-only）
  application/
    use-cases/
      append-audit-log.use-case.ts
    dtos/
      AppendAuditLogInput.ts
```

### workspace/audit 維持現狀

`workspace/audit` 繼續負責工作區活動記錄，不需遷移。兩者透過事件橋接：

- workspace/audit 的高敏感操作（如：刪除 workspace、批次移除成員）可同時觸發 `platform/audit-log` 的 `append-audit-log`。
- platform/audit-log 不直接讀取 workspace/audit 的 Firestore collection。

## Consequences

**正面：** 消除「稽核」雙頭混亂；platform 取得符合合規要求的不可否認日誌能力。  
**負面：** 高敏感操作需同時寫入兩個位置，需確保 Outbox 或事件機制確保一致性。  
**中性：** platform/audit-log 的 Firestore collection 應設計為 append-only（Firestore 本身不強制，需 Security Rules 配合）。

## References

- `docs/structure/domain/subdomains.md` — platform audit-log baseline
- `src/modules/workspace/subdomains/audit/` — 現有 workspace 稽核
- `docs/structure/domain/ubiquitous-language.md` — AuditLog vs AuditTrail 命名規則
- `firestore.rules` — 待更新：audit-log collection 需 write-only rules
