# 6108 Migration Gap — platform API contracts

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > platform

## Context

`xuanwu-app-skill` 快照的 `modules/platform/api/` 包含三個完整的合約定義文件，共同定義了 platform 模組的 Infrastructure API（低階）與 Service API（高階）邊界。

ADR 0015 已決定移除 `api/` 目錄，但其中的**合約設計語意**在 `src/modules/platform/index.ts` 中尚未完整重現。

### 遺失的合約文件

#### `contracts.ts`（218 lines）

跨域 API 合約的完整定義，包含：

```typescript
// Infrastructure API — 低階，限 notion/notebooklm 使用
export interface FirestoreAPI { get, set, query }
export interface StorageAPI { upload, getUrl, delete }
export interface GenkitAPI { runFlow }

// Service API — 高階，所有模組可用
export interface AuthAPI { getSession, requireAuth }
export interface PermissionAPI { can }
export interface FileAPI { uploadUserFile, deleteFile }
export interface AIAPI { summarize, ... }

// Cross-domain capability call table:
// workspace: Auth✅ Permission✅ File✅ AI✅ Firestore❌ Storage❌
// notion:    Auth✅ Permission✅ File✅* AI✅ Firestore✅ Storage✅
// notebooklm: Auth✅ Permission✅ File✅* AI✅ Firestore✅ Storage✅
```

此文件是 API Call Rules 的實作依據，亦是 `.github/copilot-instructions.md` 中 API Architecture 章節的原始來源。

#### `infrastructure-api.ts`（87 lines）

Infrastructure API 設計規格，說明：
- 三個 infrastructure port（Firestore、Storage、Genkit）的職責邊界
- notion/notebooklm 使用 infrastructure API 的合法場景（domain-local 持久化）
- 禁止 workspace 直接觸碰 infrastructure API 的規則

#### `service-api.ts`（51 lines）

Service API 設計規格，說明：
- 四個 service port（Auth、Permission、File、AI）的語意邊界
- 跨域 API 的 ownership（由 platform 提供）
- File API (`uploadUserFile`) 與 raw `StorageAPI.upload` 的語意差異

### 現狀：`src/modules/platform/index.ts` 的差距

`src/modules/platform/index.ts` 目前只有 4 行 re-export，沒有完整的 API 介面宣告。`contracts.ts`、`infrastructure-api.ts`、`service-api.ts` 的型別語意尚未遷移至任何 `src/modules/` 下的文件。

## Decision

**不實施**。僅記錄缺口。

由於 ADR 0015 已移除 `api/` 目錄，這三份文件的內容應以 `index.ts` 中的型別宣告形式在 `src/modules/platform/` 下重現，而非恢復 `api/` 目錄。

## Consequences

- `FileAPI`、`PermissionAPI`、`AuthAPI` 型別未在 `src/modules/platform/index.ts` 宣告，消費者無合約可引用。
- AI Architecture 規則（`copilot-instructions.md`）所描述的 API Call Table 沒有對應的 TypeScript 型別支撐。

## 關聯 ADR

- **0015** api/ 層移除：合約內容應從 `api/contracts.ts` 遷移至 `src/modules/platform/index.ts`。
- **6107** platform domain model：`PermissionAPI` 的 `can()` 方法依賴 `PermissionDecision` value object。
