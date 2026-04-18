# 4303 Semantic Drift — Workspace Event Discriminants Use Underscore Instead of Kebab-Case

- Status: Resolved
- Resolved: 2026-04-14
- Date: 2026-04-14
- Category: Architectural Smells > Semantic Drift

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

## Context

ADR 3201（Duplication — event discriminant format）和 ADR 4302（Semantic Drift — notion/notebooklm event discriminant format）確立了全域規範：

> **所有 domain event discriminant 使用 kebab-case 格式：`<module>.<kebab-action>`**

例如：
- `platform.context-registered` ✅
- `subscription.agreement-activated` ✅
- `notion.knowledge.page-approved` ✅
- `notebooklm.source.file-uploaded` ✅

### 違規發現

`modules/workspace/domain/events/workspace.events.ts` 中的兩個 event discriminant 使用了**下劃線（underscore `_`）**作為單詞分隔符，違反 kebab-case 規範：

```typescript
// modules/workspace/domain/events/workspace.events.ts
export const WORKSPACE_CREATED_EVENT_TYPE =
  "workspace.created" as const;                           // ✅ kebab

export const WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE =
  "workspace.lifecycle_transitioned" as const;            // ❌ 應為 workspace.lifecycle-transitioned

export const WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE =
  "workspace.visibility_changed" as const;                // ❌ 應為 workspace.visibility-changed
```

此外，`modules/workspace/subdomains/audit/domain/events/AuditDomainEvent.ts` 也有相同問題：

```typescript
// modules/workspace/subdomains/audit/domain/events/AuditDomainEvent.ts
export interface AuditEntryRecordedEvent extends AuditDomainEvent {
  readonly type: "workspace.audit.entry_recorded";        // ❌ 應為 workspace.audit.entry-recorded
}

export interface CriticalAuditDetectedEvent extends AuditDomainEvent {
  readonly type: "workspace.audit.critical_detected";     // ❌ 應為 workspace.audit.critical-detected
}
```

以及 `modules/workspace/subdomains/audit/domain/aggregates/AuditEntry.ts` 中的 inline 字串：

```typescript
type: "workspace.audit.entry_recorded",    // ❌
type: "workspace.audit.critical_detected", // ❌
```

### 違規統計

| 文件 | 違規 discriminant | 應改為 |
|------|-----------------|--------|
| `workspace/domain/events/workspace.events.ts` | `workspace.lifecycle_transitioned` | `workspace.lifecycle-transitioned` |
| `workspace/domain/events/workspace.events.ts` | `workspace.visibility_changed` | `workspace.visibility-changed` |
| `workspace/subdomains/audit/domain/events/AuditDomainEvent.ts` | `workspace.audit.entry_recorded` | `workspace.audit.entry-recorded` |
| `workspace/subdomains/audit/domain/events/AuditDomainEvent.ts` | `workspace.audit.critical_detected` | `workspace.audit.critical-detected` |
| `workspace/subdomains/audit/domain/aggregates/AuditEntry.ts` | `workspace.audit.entry_recorded` | `workspace.audit.entry-recorded` |
| `workspace/subdomains/audit/domain/aggregates/AuditEntry.ts` | `workspace.audit.critical_detected` | `workspace.audit.critical-detected` |

### 消費者影響

工廠函式 `createWorkspaceLifecycleTransitionedEvent` / `createWorkspaceVisibilityChangedEvent` 被以下文件使用：

```
workspace/subdomains/lifecycle/domain/index.ts
workspace/subdomains/lifecycle/application/use-cases/update-workspace-settings.use-case.ts
workspace/subdomains/lifecycle/api/index.ts
```

discriminant 字串值的更改需要確認這些消費者及任何依賴 string match 的 event handler / Firestore listener。

## Decision

1. **將 4 個違規 discriminant 改為 kebab-case**：
   - `workspace.lifecycle_transitioned` → `workspace.lifecycle-transitioned`
   - `workspace.visibility_changed` → `workspace.visibility-changed`
   - `workspace.audit.entry_recorded` → `workspace.audit.entry-recorded`
   - `workspace.audit.critical_detected` → `workspace.audit.critical-detected`
2. **同步更新所有 inline 字串**：`AuditEntry.ts` aggregate 中的 inline 字串需與 `AuditDomainEvent.ts` interface 宣告保持一致。
3. **Consumer 掃描**：執行全域搜尋確認 no event handler / Firestore listener / UI 使用 hardcoded 下劃線格式字串。

## Consequences

正面：
- workspace domain event discriminant 與 platform/notion/notebooklm 三個主域完全一致，消除系列異常。
- Event handler 和 log aggregation 工具（如 BigQuery / Pub/Sub）中可以用統一的 kebab pattern filter。

代價：
- 若有 Firestore 記錄或 Pub/Sub subscription 使用舊的下劃線格式字串作為 filter，需要 migration window 和雙格式相容期。
- `workspace.lifecycle_transitioned` 等字串在 git history 的所有引用需追蹤（`git log -S "lifecycle_transitioned"`）。

## 關聯 ADR

- **ADR 3201** (Duplication — event discriminant format) — 確立全域 kebab-case 規範（platform 域）
- **ADR 4302** (Semantic Drift — notion/notebooklm event discriminant format) — notion/notebooklm 域的同類遷移
- **ADR 4300** (Semantic Drift) — 系列入口文件
- **ADR 0006** (Domain Event Discriminant Format) — 架構規範根源

## Resolution

Changed 4 event discriminants to kebab-case:
- `workspace.lifecycle_transitioned` → `workspace.lifecycle-transitioned` (WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE constant)
- `workspace.visibility_changed` → `workspace.visibility-changed` (WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE constant)
- `workspace.audit.entry_recorded` → `workspace.audit.entry-recorded` (AuditDomainEvent.ts interface + AuditEntry.ts inline string)
- `workspace.audit.critical_detected` → `workspace.audit.critical-detected` (AuditDomainEvent.ts interface + AuditEntry.ts inline string)

Files changed:
- `modules/workspace/domain/events/workspace.events.ts`
- `modules/workspace/subdomains/audit/domain/events/AuditDomainEvent.ts`
- `modules/workspace/subdomains/audit/domain/aggregates/AuditEntry.ts`
