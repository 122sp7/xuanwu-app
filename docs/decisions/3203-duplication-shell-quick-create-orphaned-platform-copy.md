# 3203 Duplication — 兩個 `shell-quick-create` 實作（platform 版本孤兒化）

- Status: Accepted
- Date: 2026-04-14
- Category: Modularity Smells > Duplication

## Context

`quickCreateKnowledgePage` 功能在 codebase 中有兩個實作，各自獨立存在：

### 實作一：`modules/platform/application/services/shell-quick-create.ts`

```typescript
// platform/application/services/shell-quick-create.ts
export interface QuickCreatePageInput { accountId, workspaceId, createdByUserId }
export interface QuickCreatePageResult { success, error? }

export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
  createPage: (input: { ... }) => Promise<QuickCreatePageResult>,
): Promise<QuickCreatePageResult> {
  if (!input.accountId) { return { success: false, error: ... } }
  if (!input.workspaceId) { return { success: false, error: ... } }
  return createPage({ ... });
}
```

**特點：**
- 抽象設計：接受 `createPage` 函式作為參數（依賴注入），解耦 notion API
- 放置在 `platform/application/services/`，聲稱是「Application Service」
- 透過 `platform/application/services/index.ts` 匯出

### 實作二：`app/(shell)/_shell/shell-quick-create.ts`

```typescript
// app/(shell)/_shell/shell-quick-create.ts
import { createKnowledgePage } from "@/modules/notion/api";

export interface QuickCreatePageInput { accountId, workspaceId, createdByUserId }
export interface QuickCreatePageResult { success, error? }

export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
): Promise<QuickCreatePageResult> {
  if (!input.accountId) { return { success: false, error: ... } }
  if (!input.workspaceId) { return { success: false, error: ... } }
  return createKnowledgePage({ ... });
}
```

**特點：**
- 具體實作：直接 import `@/modules/notion/api` 的 `createKnowledgePage`
- 放置在 `app/(shell)/_shell/`，是「app 組合層」的 composition adapter
- 透過 `app/(shell)/_shell/index.ts` 匯出

### 使用情況分析

| 文件 | import 來源 | 說明 |
|------|-------------|------|
| `app/(shell)/_shell/index.ts` | `./shell-quick-create` | ✅ 使用 app 版本 |
| `modules/platform/application/services/index.ts` | `./shell-quick-create` | ⚠️ 匯出 platform 版本 |
| **platform 版本的外部消費者** | — | **❌ 無任何消費者** |

**`modules/platform/application/services/shell-quick-create.ts` 目前沒有任何外部調用者。**
`platform/application/services/index.ts` 匯出了它，但沒有任何其他文件從 platform/application/services import `quickCreateKnowledgePage`。

### 為什麼有兩個實作

根據 `app/(shell)/_shell/shell-quick-create.ts` 的注釋：
```typescript
/**
 * shell-quick-create — app/(shell)/_shell composition layer.
 * Moved from modules/platform because it imports notion's createKnowledgePage.
 * Kept as a composition adapter at the app boundary.
 */
```

這表明 `app/` 版本是**從 `modules/platform/` 遷移過來的**，但遷移後 `platform/` 的原始文件
沒有被刪除，形成了孤兒化（orphaned）的重複實作。

### 問題分析

1. **重複定義相同介面**：`QuickCreatePageInput`、`QuickCreatePageResult` 在兩個文件中各定義一次，
   語意相同但無共用來源。若未來更新欄位（如新增 `categoryId`），需要同步更新兩個文件。

2. **平台 Application 層承載 Shell 特定邏輯**：
   `platform/application/services/shell-quick-create.ts` 的命名包含 `shell-`，
   表示這是 Shell UI 觸發的特定功能。UI 觸發的組合邏輯屬於 `interfaces/` 或 `app/` 層，
   不應放在 `application/` 層。

3. **錯誤的 Abstraction Level**：platform 版本的 `createPage` 參數設計為了「解耦 notion API」，
   但解耦的動機是「platform/application 不應直接 import notion」——這恰好說明這個功能
   **不屬於 platform/application 層**（若屬於，則可在 application 層透過 Port 依賴 notion API）。

4. **混淆消費者**：若有開發者搜尋 `quickCreateKnowledgePage`，會同時找到兩個實作，
   不清楚「正確的」import 路徑在哪裡。

## Decision

1. **刪除 `modules/platform/application/services/shell-quick-create.ts`**：
   此文件已孤兒化，無外部消費者，且邏輯已在 `app/(shell)/_shell/shell-quick-create.ts` 中具體實作。

2. **從 `platform/application/services/index.ts` 移除對應 export**：
   ```typescript
   // 移除：
   export {
     quickCreateKnowledgePage,
     type QuickCreatePageInput,
     type QuickCreatePageResult,
   } from "./shell-quick-create";
   ```

3. **確認 `app/(shell)/_shell/shell-quick-create.ts` 是唯一且正確的實作**：
   - 此文件的位置（`app/(shell)/_shell/`）正確體現了「Shell 組合層的組合 adapter」語意。
   - 與 notion API 的直接耦合在 `app/` 層是可以接受的（app 是 composition owner）。

4. **platform/application/services/ 目錄清理**：
   刪除 `shell-quick-create.ts` 後，確認 `services/` 目錄只剩下真正屬於 application 服務的工具（
   `build-causation-id.ts`、`build-correlation-id.ts`）。若這兩個 util 函式也可考慮移至
   `packages/shared-utils` 或 `@lib-*` 包（它們不含業務邏輯，只是 ID 建構工具）。

## Consequences

正面：
- 消除重複定義，`quickCreateKnowledgePage` 只有一個來源，`app/(shell)` 的組合邏輯清晰。
- `platform/application/services/` 不再承載 Shell 特定邏輯，application 層職責更純粹。

代價：
- 若未來有人嘗試從 `platform/application` import `quickCreateKnowledgePage`，
  需要在 PR review 時提醒正確來源為 `app/(shell)/_shell`。

## 關聯 ADR

- **3200** (Duplication)：目錄命名和 use-case 位置的重複，此 ADR 是另一種形式的重複
- **5100** (Accidental Complexity)：platform/application/services/ 承載 shell 邏輯是偶然複雜性的一例
- **4300** (Semantic Drift)：`shell-quick-create.ts` 在 `platform/application/services/` 的語意與其實際 shell-layer 職責不符
