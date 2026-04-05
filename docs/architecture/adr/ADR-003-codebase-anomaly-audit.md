# ADR-003: 代碼庫異常審計與修正計畫

*(Codebase Anomaly Audit & Remediation Plan)*

**狀態（Status）：** 已接受（Accepted）  
**日期（Date）：** 2026-04-05  
**提案者（Proposers）：** Architecture Audit  
**影響範圍（Scope）：** `modules/knowledge`, `modules/ai`, `modules/notebook`, `modules/source`, `modules/workspace-flow`, `modules/workspace-audit`, `modules/workspace-feed`, `app/(shell)/notebook`

---

## 背景

在對 Xuanwu App 進行全域靜態分析（ESLint）、代碼結構審查、與 DDD 邊界合規性掃描後，發現四類具體異常。這些異常均不影響目前的生產行為（lint 零錯誤），但會在下列情況下產生技術債或運行時錯誤：

- 新開發者加入並依賴錯誤欄位名稱
- 事件匯流排（QStash / pub-sub）需要跨模組消費領域事件
- Firebase SDK 版本升級時，未通過適配器層的直接 import 可能破壞封裝

> **版本說明（2026-04-05）：** 本 ADR 的所有異常均已通過 ESLint、grep、與目錄結構掃描三重驗證，確認與代碼庫現狀相符。

---

## 異常清單

### 異常 A — `occurredAtISO` 與 `occurredAt` 欄位名稱不一致

**嚴重程度：** 中（Medium）  
**類型：** 通用語言（Ubiquitous Language）不一致、Domain Event 合約破壞

**問題描述：**

`modules/shared/domain/events.ts` 定義的 `DomainEvent` 基礎介面使用 `occurredAt`（ISO 字串），但以下五個模組的領域事件使用 `occurredAtISO`：

| 模組 | 違規檔案 |
|------|---------|
| `knowledge` | `modules/knowledge/domain/events/knowledge.events.ts` |
| `workspace-flow` | `domain/events/TaskEvent.ts`, `InvoiceEvent.ts`, `IssueEvent.ts` |
| `workspace-audit` | `domain/entities/AuditLog.ts`, `interfaces/components/AuditStream.tsx` |
| `workspace-feed` | `domain/events/workspace-feed.events.ts` |
| `source` | `domain/entities/AuditRecord.ts` |

**影響：**

- 若事件消費者（如 QStash webhook handler）依照 `shared/DomainEvent` 介面解包事件，將無法讀取 `occurredAtISO` 欄位（欄位名稱不匹配）。
- 違反通用語言規則：同一概念（事件發生時間）有兩個名稱（`occurredAt` / `occurredAtISO`）。
- 注意：`KnowledgePageApprovedEvent`（`modules/knowledge/domain/events/knowledge.events.ts`）也使用 `occurredAtISO`，ADR-001 的事件結構圖已標注此已知不一致。

**修正方向：** 見下方修正計畫 P1-A。

---

### 異常 B — `app/(shell)/notebook/rag-query/page.tsx` 導入 `@/modules/search` 根桶

**嚴重程度：** 低（Low）  
**類型：** 模組邊界規則（ESLint `no-restricted-imports` warning）與根桶設計意圖的歧義

**問題描述：**

```
app/(shell)/notebook/rag-query/page.tsx
  6:1  warning  '@/modules/search' import is restricted from being used by a pattern.
                Module imports must use `@/modules/<module>/api` only
```

`page.tsx` 直接 import `@/modules/search`（根桶 `index.ts`），而非 `@/modules/search/api`。

然而，`modules/search/index.ts` 的註解明確說明：

> `"use client" code and route files can import from here.`

這造成 **ESLint 規則與模組設計意圖之間的矛盾**：
- ESLint pattern `^@/modules/(?!system$)[^/]+$` 阻止所有根桶 import
- `search/index.ts` 設計上允許 route files 使用根桶

**影響：**

- 目前 lint 為 warning（不阻擋 CI），但有誤導性。
- 若未來收緊為 error，`rag-query/page.tsx` 將需修改。

**修正方向：** 見下方修正計畫 P1-B。

---

### 異常 C — Deprecated 殭屍檔案殘留（ai 與 notebook 模組）

**嚴重程度：** 低（Low）  
**類型：** 技術債——已廢棄的空殼檔案尚未清理

**問題描述：**

以下檔案標記了 `@deprecated` 且內容已遷移至其他模組，但原始殼檔案仍存在：

**`modules/ai/`（概念已遷移至 `modules/wiki/`）：**
- `modules/ai/domain/entities/graph-node.ts` → 已移至 `modules/wiki/domain/entities/graph-node.ts`
- `modules/ai/domain/entities/link.ts` → 已移至 `modules/wiki/domain/entities/link.ts`
- `modules/ai/domain/repositories/GraphRepository.ts` → 已移至 `modules/wiki/domain/repositories/GraphRepository.ts`
- `modules/ai/application/link-extractor.service.ts` → 已移至 `modules/wiki/application/link-extractor.service.ts`
- `modules/ai/infrastructure/InMemoryGraphRepository.ts`（deprecated wrapper）

**`modules/notebook/`（概念已遷移至 `modules/search/`）：**
- `modules/notebook/domain/entities/RagQuery.ts` → 重新導出至 `modules/search/api`
- `modules/notebook/domain/repositories/RagRetrievalRepository.ts` → 重新導出至 `modules/search/api`
- `modules/notebook/domain/repositories/RagGenerationRepository.ts` → 重新導出至 `modules/search/api`
- `modules/notebook/application/use-cases/answer-rag-query.use-case.ts` → 重新導出至 `modules/search/api/server`

**影響：**

- 無直接運行時影響（尚未確認有模組直接 import 這些 deprecated 路徑）。
- 造成新開發者困惑（看到兩個定義相同概念的模組）。
- 增加無效的代碼搜尋雜訊。

**修正方向：** 見下方修正計畫 P1-C。

---

### 異常 D — `source/interfaces/WorkspaceFilesTab.tsx` 直接 import 原始 Firebase SDK

**嚴重程度：** 中（Medium）  
**類型：** 基礎設施邊界違反——直接 import SDK 而非通過適配器層

**問題描述：**

```typescript
// modules/source/interfaces/components/WorkspaceFilesTab.tsx
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // ← 違規：直接 SDK import
import { getFirebaseStorage } from "@integration-firebase";            // ← 正確：通過 adapter
```

同一個檔案同時使用了正確的適配器模式（`@integration-firebase`）和直接 SDK import（`firebase/storage`）。

依照架構規範，只有 `infrastructure/` 層的適配器應直接接觸 Firebase SDK。`interfaces/` 層應通過適配器或 Server Actions 存取。

**影響：**

- Firebase SDK 版本升級或 adapter API 變更時，需同時修改多處而非只修改 `@integration-firebase` 適配器。
- 破壞「單一技術封裝點」原則，若未來切換 Storage 後端（如 AWS S3），需搜尋所有直接 SDK import。

**修正方向：** 見下方修正計畫 P2-A。

---

## 修正計畫

### P1 — 低風險清理（下一個 PR）

#### P1-A：統一領域事件時間戳欄位名稱

**目標：** 讓所有領域事件的時間戳欄位使用 `occurredAt`，與 `shared/DomainEvent` 基礎介面一致。

**步驟：**

1. 更新 `modules/knowledge/domain/events/knowledge.events.ts`：將所有 `occurredAtISO` → `occurredAt`
2. 更新 `modules/workspace-flow/domain/events/TaskEvent.ts`、`InvoiceEvent.ts`、`IssueEvent.ts`
3. 更新 `modules/workspace-feed/domain/events/workspace-feed.events.ts`
4. 更新 `modules/workspace-audit/domain/entities/AuditLog.ts`
5. 更新 `modules/workspace-audit/interfaces/components/AuditStream.tsx`（使用欄位的 UI 組件）
6. 更新 `modules/workspace-audit/interfaces/components/WorkspaceAuditTab.tsx`
7. 更新 `modules/source/domain/entities/AuditRecord.ts`
8. 更新 `modules/workspace-audit/infrastructure/firebase/FirebaseAuditRepository.ts`（Firestore 序列化欄位）

> **注意：** `workspace-audit` 的 Firestore 文件中若已存儲了 `occurredAtISO` 欄位，需要一個相容性讀取層（fallback）或資料遷移腳本。建議在 `FirebaseAuditRepository` 中保留兼容讀取：`data.occurredAt ?? data.occurredAtISO`。

**驗證：** `npm run lint && npm run build`

---

#### P1-B：解決 `@/modules/search` 根桶 import 歧義

**選項 1（推薦）：** 在 `modules/search/index.ts` 中標記它為「已批准的例外」並加入 ESLint 覆寫規則，允許 `app/` route files 使用根桶 import。

**選項 2：** 將 `RagQueryView` 加入 `modules/search/api` 的 export，讓 `page.tsx` 改用 `@/modules/search/api`。

**步驟（選項 2）：**

1. 確認 `RagQueryView` 是否安全加入 `api/index.ts`（避免 `"use client"` 污染 server-only 消費者）
2. 若可行，在 `api/index.ts` 加入 `export { RagQueryView } from "../interfaces/components/RagQueryView"`
3. 更新 `app/(shell)/notebook/rag-query/page.tsx` 為 `import { RagQueryView } from "@/modules/search/api"`
4. 確認 lint warning 消失

---

#### P1-C：清除 Deprecated 殭屍檔案

**前置確認：**

```bash
# 確認無其他模組直接引用這些路徑
grep -r "modules/ai/domain\|modules/ai/application\|modules/ai/infrastructure/InMemoryGraph" . --include="*.ts" --include="*.tsx"
grep -r "modules/notebook/domain\|modules/notebook/application/use-cases/answer-rag" . --include="*.ts" --include="*.tsx"
```

**步驟（確認無引用後執行）：**

1. 刪除 `modules/ai/domain/entities/graph-node.ts`
2. 刪除 `modules/ai/domain/entities/link.ts`
3. 刪除 `modules/ai/domain/repositories/GraphRepository.ts`
4. 刪除 `modules/ai/application/link-extractor.service.ts`
5. 刪除 `modules/ai/infrastructure/InMemoryGraphRepository.ts`
6. 刪除 `modules/notebook/domain/entities/RagQuery.ts`
7. 刪除 `modules/notebook/domain/repositories/RagRetrievalRepository.ts`
8. 刪除 `modules/notebook/domain/repositories/RagGenerationRepository.ts`
9. 刪除 `modules/notebook/application/use-cases/answer-rag-query.use-case.ts`
10. 執行 `npm run lint && npm run build` 確認零錯誤

---

### P2 — 中風險修正（後續 Sprint）

#### P2-A：修正 `source/interfaces/WorkspaceFilesTab.tsx` 直接 SDK import

**目標：** 讓 `interfaces/` 層完全通過適配器或 Server Actions 存取 Firebase Storage，移除直接的 `firebase/storage` import。

**方案：**

- 將上傳邏輯（`uploadBytes`、`getDownloadURL`）封裝至 Server Action（`_actions/file.actions.ts`）或 `source/infrastructure/` 適配器。
- 若需要 client-side progress tracking，通過 `@integration-firebase/storage` 適配器封裝相關操作。

**步驟：**

1. 在 `modules/source/interfaces/_actions/file.actions.ts` 加入 `uploadFileToStorage` Server Action
2. 將 `WorkspaceFilesTab.tsx` 的上傳邏輯改為呼叫 Server Action
3. 移除 `import { getDownloadURL, ref, uploadBytes } from "firebase/storage"`
4. 執行 `npm run lint && npm run build` 確認

---

## 後續行動追蹤

| 項目 | 優先級 | 狀態 | 負責模組 |
|------|--------|------|---------|
| P1-A：統一 `occurredAt` 欄位名稱 | P1 | 📥 待處理 | `knowledge`, `workspace-flow`, `workspace-audit`, `workspace-feed`, `source` |
| P1-B：解決 `search` 根桶 import 歧義 | P1 | 📥 待處理 | `search`, `app/(shell)/notebook` |
| P1-C：清除 deprecated 殭屍檔案 | P1 | 📥 待處理 | `ai`, `notebook` |
| P2-A：修正 `source` 直接 Firebase SDK import | P2 | 📥 待處理 | `source` |

---

## 決策記錄

- **不修正 `workspace-audit` Firestore 已存儲資料欄位名稱**：Firestore 中現有文件的欄位遷移風險高，採相容性讀取層（`data.occurredAt ?? data.occurredAtISO`）作為過渡方案。
- **`search` 模組根桶的雙重政策**：暫時維持現況（lint warning，非 error），在 P1-B 中擇一方向統一後才升級為 error。
