# 4101 Change Amplification — UUID 生成策略變更需觸及 43+ 個 Domain 文件

- Status: Resolved
- Date: 2026-04-13
- Resolved: 2026-04-13
- Category: Maintainability Smells > Change Amplification

## Context

變更放大（Change Amplification）指對單一概念的修改必須在多個不相關的位置重複執行。
理想狀態下，改變「UUID 生成策略」（如從 v4 升級到 v7、新增冪等前綴、加入 trace context）只需修改一個地方。

掃描結果顯示（見 ADR 1101）：`crypto.randomUUID()` 和 `node:crypto` 直接調用散佈在：

```
受影響文件統計：
  domain aggregates 中的 crypto.randomUUID() : 43 處（跨 4 個主域）
  application use-cases 中的 node:crypto import : 6 個文件

主域分佈：
  platform   : 43 個 aggregates 中的 ~30 處
  notion     : KnowledgePage, KnowledgeCollection, ContentBlock, Article
  workspace  : Workspace, AuditEntry
  notebooklm : 4 個 application use-cases
```

### 假設情境：從 UUIDv4 升級到 UUIDv7

UUIDv7 提供時間排序（time-ordered），對 Firestore 文件 ID、分頁查詢有性能優勢。
若決定升級，以下所有文件都需要修改：

```
modules/platform/subdomains/account/domain/aggregates/Account.ts       (5 處)
modules/platform/subdomains/organization/domain/aggregates/Organization.ts (7 處)
modules/platform/subdomains/identity/domain/aggregates/UserIdentity.ts  (6 處)
modules/platform/subdomains/subscription/domain/aggregates/Subscription.ts (5 處)
modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts  (11 處)
modules/notion/subdomains/knowledge/domain/aggregates/KnowledgeCollection.ts (4 處)
... (共 43 個 domain 文件 + 6 個 use-case 文件)
```

一次策略決定 → 49 個文件變更 → 49 個 PR diff hunks → 49 個 code review 審查點。

### 對比正確模式

`@lib-uuid` 套件（已存在）是 UUID 生成的集中點：

```
packages/lib-uuid/     ← 唯一需要修改的地方
  index.ts              ← 改這一個文件
```

若全部 aggregates 使用 `@lib-uuid`，UUID 策略升級只需修改 `packages/lib-uuid/index.ts`，
所有 43 個 aggregates 自動受益，**0 個 domain 文件需要修改**。

### 其他 UUID 策略變更場景

1. **加入 trace context 到 eventId**：`eventId: traceId + '-' + uuid()` — 修改 49 個文件 vs 修改 1 個
2. **為測試環境使用序列性 ID**（`uuid-001`, `uuid-002`）：需要 global mock 49 處 vs mock 1 個 `@lib-uuid`
3. **冪等 ID（基於內容雜湊）**：某些 aggregate 決定改用 content-hash ID — 需要知道哪些文件使用了 randomUUID

## Decision

1. **`@lib-uuid` 作為唯一 UUID 來源**（同 ADR 1101、2101 的技術決定）。
2. **Change Control Point 原則**：任何「跨多個 domain 文件使用的基礎設施能力」（UUID、時間戳、雜湊、亂數）必須集中在 `packages/lib-*/` 或 port/adapter 中，禁止在 domain 層直接調用。
3. **記錄已知的 Change Amplification 風險點**：
   - UUID 生成 → 遷移至 `@lib-uuid`（本 ADR）
   - `new Date().toISOString()` 在 domain aggregates 中（尚未系統掃描）— 應集中到 `@lib-datetime` 或 Clock port

## Consequences

正面：
- UUID 策略升級：O(1) 修改（1 個 package）vs O(n) 修改（n 個 aggregates）。
- Domain aggregates 的變更集中在業務邏輯，不被基礎設施工具的版本升級汙染。

代價：
- 初始遷移需要 34 個文件的機械性 import 替換（無邏輯變更，可批量執行）。

## Resolution

**已解決（2026-04-13）**

所有 34 個文件（14 domain + 13 application + 7 infra/interfaces/api）已遷移至 `@lib-uuid`。UUID 策略升級現在只需修改 `packages/lib-uuid/index.ts` 一處。

### 原始證據修正

原 ADR 記錄「49 個文件」，實際為 **34 個文件**。

## 關聯 ADR

- **1101** (Layer Violation)：crypto 在 domain 是層次違規（已解決）
- **2101** (Tight Coupling)：crypto 是緊耦合（已解決）
- **ADR 0001** (Hexagonal Architecture)：Change Amplification 是違反 DIP 的直接後果
