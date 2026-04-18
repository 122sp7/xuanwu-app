# 1101 Layer Violation — `crypto.randomUUID()` in Domain Layer

- Status: Resolved
- Date: 2026-04-13
- Resolved: 2026-04-13
- Category: Architectural Smells > Layer Violation

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

## Context

`domain/` 層必須做到「技術無關（runtime-agnostic）」，不能直接依賴 Node.js 內建模組或任何執行環境 API。
這是 Hexagonal Architecture 的核心要求：Domain 是最內層，所有技術依賴都必須由外層（infrastructure）注入。

掃描後發現 **43 個 domain 聚合根** 與 **6 個 application use-case** 直接呼叫 `crypto.randomUUID()`
或透過 `import { randomUUID } from "node:crypto"` 引入 Node.js 內建模組，
而非使用已建立的 `@infra/uuid` 套件別名。

> 對照：`modules/platform/subdomains/organization/domain/aggregates/OrganizationTeam.ts`
> 是唯一正確使用 `import { v4 as randomUUID } from "@infra/uuid"` 的聚合根。

### 受影響的 domain 層（`crypto.randomUUID()` 直呼叫）

```
modules/workspace/domain/aggregates/Workspace.ts:182
modules/workspace/subdomains/audit/domain/aggregates/AuditEntry.ts:68, 85
modules/notion/subdomains/authoring/domain/aggregates/Article.ts:72, 102, 114
modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts:68, 99, 117, 136, 159, 168, 169, 186, 202, 213, 228, 243
modules/notion/subdomains/knowledge/domain/aggregates/KnowledgeCollection.ts:62, 83, 109, 156
modules/notion/subdomains/knowledge/domain/aggregates/ContentBlock.ts:52, 69, 84
modules/platform/subdomains/access-control/domain/aggregates/AccessPolicy.ts:48, 77, 89
modules/platform/subdomains/account-profile/domain/aggregates/AccountProfileAggregate.ts:67
modules/platform/subdomains/account/domain/aggregates/Account.ts:50, 85, 106, 130, 220
modules/platform/subdomains/entitlement/domain/aggregates/EntitlementGrant.ts:43, 68, 82, 93
modules/platform/subdomains/identity/domain/aggregates/UserIdentity.ts:53, 76, 89, 107, 121, 135
modules/platform/subdomains/notification/domain/aggregates/NotificationAggregate.ts:45, 66
modules/platform/subdomains/organization/domain/aggregates/Organization.ts:80, 123, 153, 184, 210, 313, 322, 330
modules/platform/subdomains/subscription/domain/aggregates/Subscription.ts:49, 79, 99, 117, 128
```

### 受影響的 application 層（`node:crypto` 直接 import）

```
modules/notebooklm/subdomains/source/application/use-cases/upload-init-source-file.use-case.ts:11
  import { randomBytes, randomUUID } from "node:crypto";
modules/notebooklm/subdomains/source/application/use-cases/upload-complete-source-file.use-case.ts:14
  import { randomUUID } from "node:crypto";
modules/notebooklm/subdomains/source/application/use-cases/register-rag-document.use-case.ts:10
  import { randomUUID } from "node:crypto";
modules/notebooklm/subdomains/synthesis/application/use-cases/answer-rag-query.use-case.ts:13
  import { randomUUID } from "node:crypto";
modules/platform/subdomains/background-job/application/use-cases/background-job.use-cases.ts:12
  import { randomUUID } from "node:crypto";
```

### 問題說明

1. **可攜性**：`crypto` global 在 Web Worker 環境與 Node.js 環境行為不同，domain 直呼叫使 domain 暗中依賴 Node.js 執行環境。
2. **測試困難**：無法在 Jest/Vitest 的瀏覽器模擬模式下直接 mock `crypto.randomUUID`，需要全域 polyfill。
3. **一致性**：`@infra/uuid` 已存在並正確用於 `OrganizationTeam`，其他 43 個 aggregates 卻繞過它，造成混亂。
4. **ADR 規範破壞**：命名慣例記憶（citations: `modules/platform/subdomains/organization/domain/aggregates/OrganizationTeam.ts`）明確要求使用 `@infra/uuid`，但 43 個地方違反了這條規範。

## Decision

1. **Domain 層禁止直接使用 `crypto` global 或 `node:crypto`**：所有聚合根中的 `crypto.randomUUID()` 必須替換為 `import { v4 as uuid } from "@infra/uuid"` 的 `uuid()`。
2. **Application 層的 `node:crypto` import**：`randomUUID` 用途同樣替換為 `@infra/uuid`；`randomBytes` 若確實需要加密安全隨機，可保留 `node:crypto` 用於 infrastructure 層，但 application 層的 `randomBytes` 用途應透過 port 注入。
3. **建議 lint rule**：在 `eslint.config.mjs` 中加入 `no-restricted-imports` 規則，禁止 `modules/*/domain/**` 和 `modules/*/application/**` 從 `node:crypto`、`crypto` 直接 import `randomUUID`。

## Consequences

正面：
- Domain 層從 Node.js runtime 解耦，可在任意 JS 環境（瀏覽器、Edge、Deno）下執行。
- UUID 生成策略（v4 → v7 等）只需修改 `@infra/uuid` 一個地方，43 個 aggregates 自動受益（見 ADR 4101）。
- 測試不需要全域 crypto polyfill。

代價：
- 需在 14 個 domain 文件和 13 個 application 文件中進行 import 替換（機械性，無邏輯變更）。

## Resolution

**已解決（2026-04-13）**

所有 domain 層和 application 層的 `crypto.randomUUID()` 已替換為 `import { v4 as uuid } from "@infra/uuid"`：

- **14 個 domain aggregate 文件**：Account, UserIdentity, Organization, Subscription, EntitlementGrant, AccessPolicy, NotificationAggregate, AccountProfileAggregate, Workspace, AuditEntry, KnowledgePage, KnowledgeCollection, ContentBlock, Article
- **13 個 application 文件**：use-case 和 service 文件中的 `crypto.randomUUID()` global 和 `import { randomUUID } from "node:crypto"` 均已替換
- **7 個 infrastructure/interfaces/api 文件**：service-api, repositories, stores, actions 中的 `crypto.randomUUID()` 也已一併替換
- **唯一保留**：`upload-init-source-file.use-case.ts` 中的 `import { randomBytes } from "node:crypto"` 保留，因為 `randomBytes` 用途為加密強度隨機（非 UUID），屬基礎設施關注點。

### 原始證據修正

原 ADR 記錄「43 個 domain aggregates」，實際掃描為 **14 個 domain aggregate 文件**。差異來自原始掃描包含了多行匹配（同一文件多次出現）被誤計為不同文件。

## 關聯 ADR

- **2101**：crypto 直接使用是緊耦合的另一表現（同步解決）
- **4101**：UUID 策略分散導致 Change Amplification（解決後策略集中於 `@infra/uuid`）
