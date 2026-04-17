# 6119 Migration Gain — workspace 新子域

- Status: Recorded
- Date: 2026-04-17
- Category: Migration Gain > workspace

## Context

`xuanwu-skill`（新）在 `src/modules/workspace/subdomains/` 中新增了 5 個子域，這些子域在 `xuanwu-app-skill`（舊）中不存在：`activity`、`api-key`、`invitation`、`resource`、`schedule`。

### 新增的 5 個子域

#### 1. `activity`

```
workspace/subdomains/activity/
  domain/     — ActivityRecord aggregate（workspace 活動記錄）
  application/ — RecordActivity.use-case.ts
```

職責：追蹤 workspace 內的用戶活動（文件建立、成員邀請、設定變更等），為 Analytics 提供 event stream。

#### 2. `api-key`

```
workspace/subdomains/api-key/
  domain/     — ApiKey aggregate（API 金鑰生命週期管理）
  application/ — CreateApiKey, RevokeApiKey, ListApiKeys use cases
```

職責：管理 workspace 層級的 API 金鑰（供外部整合使用），含過期機制與使用量追蹤。

#### 3. `invitation`

```
workspace/subdomains/invitation/
  domain/     — Invitation aggregate（成員邀請生命週期）
  application/ — SendInvitation, AcceptInvitation, DeclineInvitation, RevokeInvitation
```

職責：管理 workspace 成員邀請流程，含邀請碼生成、有效期驗證、接受/拒絕狀態機。

#### 4. `resource`

```
workspace/subdomains/resource/
  domain/     — Resource aggregate（workspace 資源配額管理）
  application/ — TrackResourceUsage, CheckResourceLimit use cases
```

職責：管理 workspace 內的資源使用量（儲存空間、成員數、API 呼叫數），與 billing Entitlement 對接。

#### 5. `schedule`

```
workspace/subdomains/schedule/
  domain/     — ScheduledTask aggregate（排程任務定義）
  application/ — CreateSchedule, PauseSchedule, DeleteSchedule use cases
```

職責：管理 workspace 層級的排程任務（定期報告、自動化觸發等），對接 QStash schedule API。

### 現狀

這 5 個子域目前是骨架（只有 index.ts stub），無實際 domain 內容。

## Decision

此為已規劃但尚未實作的功能骨架，**不需要立即動作**。

蒸餾優先順序建議：
1. `invitation`（成員邀請流程與 UX 直接掛鉤）
2. `activity`（為 Analytics 提供事件來源）
3. `api-key`（外部整合需求）
4. `resource`（依賴 billing Entitlement 設計穩定後再實作）
5. `schedule`（依賴 QStash 整合設計）

## Consequences

- 這 5 個子域骨架存在但內容為空，任何引用 workspace 新子域的程式碼均無法正常執行。
- `invitation` 的缺失導致成員邀請功能（WorkspaceMemberInviteDialog，ADR 6109）無業務邏輯支撐。

## 關聯 ADR

- **6109** workspace interfaces 層：WorkspaceMemberInviteDialog 需要 invitation 子域 use cases。
- **6113** 消失的 packages：`@shared-events` 的 `workspace.events.ts` 應包含 `WorkspaceMemberInvited` 等新事件。
