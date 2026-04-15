# 3201 Duplication — Domain Event 識別符號格式不一致（`snake_case` vs `kebab-case`）

- Status: Resolved
- Date: 2026-04-13
- Resolved: 2026-04-13
- Category: Modularity Smells > Duplication

## Context

本 repo 的 domain event 識別符號（discriminant）格式在不同模組之間存在兩種互不相容的慣例，
造成「同一概念有兩種寫法」的 **Logic Duplication**（邏輯複製）：
格式規則在兩處地方各自定義，但互不一致，未來任何事件處理器（switch/discriminated union）
都需要分別處理這兩種格式。

### 格式一：`<context>.<action_with_underscore>`（platform root domain events）

```typescript
// modules/platform/domain/events/index.ts
export const PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE = "platform.context_registered" as const;
export const PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE  = "platform.capability_enabled"  as const;
export const POLICY_CATALOG_PUBLISHED_EVENT_TYPE     = "policy.catalog_published"     as const;
export const BACKGROUND_JOB_ENQUEUED_EVENT_TYPE      = "background-job.enqueued"      as const;
// ^ 注意：context 名稱用 kebab（background-job）但 action 部分用 underscore（enqueued）
```

格式：`<context-kebab>.<action_underscore>`（混合：context 用 kebab，action 用 underscore）

### 格式二：`<context>.<subdomain>.<action-with-kebab>`（workspace / organization subdomains）

```typescript
// modules/workspace/subdomains/feed/domain/events/workspace-feed.events.ts（ADR 記憶引用）
export const POST_CREATED_EVENT_TYPE = "workspace.feed.post-created" as const;
export const POST_REPLIED_EVENT_TYPE = "workspace.feed.post-replied" as const;

// modules/platform/subdomains/organization/domain/events/OrganizationTeamDomainEvent.ts
// （已從 team 子域整併入 organization；discriminant 已修正為含完整主域前綴）
export const TEAM_CREATED_EVENT_TYPE        = "platform.organization.team_created"        as const;
export const TEAM_MEMBER_ADDED_EVENT_TYPE   = "platform.organization.team_member_added"   as const;
export const TEAM_MEMBER_REMOVED_EVENT_TYPE = "platform.organization.team_member_removed" as const;
```

格式：`<context>.<action-full-kebab>` 或 `<context>.<subdomain>.<action-full-kebab>`
（全部 kebab-case，含 action）

### 格式對比

| 事件 | 格式 | 模組 |
|------|------|------|
| `platform.context_registered` | `<ctx>.<underscore_action>` | platform root |
| `platform.capability_enabled` | `<ctx>.<underscore_action>` | platform root |
| `workspace.feed.post-created` | `<ctx>.<sub>.<kebab-action>` | workspace/feed |
| `team.created` | `<ctx>.<kebab-action>` | platform/team |
| `team.member-added` | `<ctx>.<kebab-action>` | platform/team |
| `background-job.enqueued` | `<ctx-kebab>.<underscore-action>` | platform root（混合） |

平台根層 events 使用 `underscore_action`，而 workspace feed 和 platform/team 使用 `kebab-action`——**同一個 repo 中兩種格式並存**。

### 已建立的 ADR 規範

ADR 0006 (`0006-domain-event-discriminant-format.md`) 定義了識別符號格式，但從掃描結果看，
`platform/domain/events/index.ts` 的格式未遵循目前 workspace/team 所使用的 kebab-case 格式，
存在格式漂移（見 ADR 4301）。

### 為何這是 Duplication？

1. **格式規則複製**：兩種格式都試圖表達「event discriminant」這個概念，但用了不同的約定，造成「format logic」被複製在兩個不一致的實作中。
2. **事件路由器複製**：任何需要匹配 event type string 的 handler（switch、discriminated union）必須同時處理兩種格式，導致比對邏輯複製。
3. **命名規則文件複製**：若要描述「如何命名 domain event」，需要兩段規則，而非一段。

## Decision

1. **統一採用 kebab-case** 格式：`<context>.<action-in-kebab>`（遵循 ADR 0006 方向）。
   - 例：`platform.context-registered`（非 `platform.context_registered`）
   - 例：`background-job.enqueued`（保持 context 部分 kebab，action 也改 kebab：`background-job.job-enqueued`）
2. **platform root domain events 遷移**：24 個 `platform.domain/events/index.ts` 的 event type 常數從 `underscore_action` 改為 `kebab-action`。但這些事件目前都是 TODO stubs（見 ADR 5101），不需要同時遷移 payload 類型，可在實作時直接以 kebab 格式定義。
3. **加入 lint 規則或 Zod schema 驗證**：`DomainEventSchema` 的 `type` 欄位加入 regex 驗證：`/^[a-z][a-z0-9-]+(\.[a-z][a-z0-9-]+)+$/`。

## Consequences

正面：
- 所有 domain event discriminants 格式一致，可用同一個 regex 驗證。
- 事件路由器只需處理一種格式。
- 新加入開發者只需學習一條規則。

代價：
- platform root 的 24 個 TODO stub event types 在實作時需使用新格式（低代價，因尚未實作）。
- 若已有生產資料儲存舊格式 event type，需要版本遷移計畫。

## Resolution

**已解決（2026-04-13）**

`modules/platform/domain/events/index.ts` 中的 21 個 event type 常數已從 `underscore_action` 格式統一為 `kebab-action` 格式：

- `platform.context_registered` → `platform.context-registered`
- `platform.capability_enabled` → `platform.capability-enabled`
- `subscription.agreement_activated` → `subscription.agreement-activated`
- ... 等 21 個常數全部遷移

同步更新：
- 2 個 application use-case 中的字串字面量引用
- 21 個 TODO stub 文件中的 JSDoc Event type 註解
- 4 個 domain aggregate 的 JSDoc 事件清單

所有 platform event discriminants 現在統一使用 `<context>.<kebab-action>` 格式，與 workspace/feed 和 platform/team 的 kebab 格式一致。

## 關聯 ADR

- **ADR 0006** (Domain Event Discriminant Format)：原始規範，需更新以反映此決定
- **4201** (Inconsistency)：格式不一致是 Inconsistency 的一種（已解決）
- **4301** (Semantic Drift)：underscore 格式偏離了 kebab 命名的初始意圖（已解決）
