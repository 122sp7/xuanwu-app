# Wiki-Beta 開發指南

> **單一真實來源**：[docs/wiki-beta/wiki-beta-runtime-flow.mermaid](docs/wiki-beta/wiki-beta-runtime-flow.mermaid)
> 若文字敘述與 runtime-flow 圖不一致，優先修正文檔文字使其回到 runtime-flow 的語意。任何對 runtime boundary、資料流、資料模型的調整，必須同步更新三份文件（runtime-flow、設計規格、使用手冊）。

---

## 目的

本文件定義 `/wiki-beta` 的開發方式，目標是讓 Wiki-Beta 具備與 `/dev-tools` 同等級的文件操作能力，同時嚴守既有 runtime boundary：

| Runtime | 職責 |
|---|---|
| Next.js | 頁面組裝、互動 UI、前端狀態管理 |
| Firebase Functions (py_fn) | 解析、重整、RAG worker 流程 |
| Firestore | 帳號範圍資料索引與狀態追蹤 |

---

## 技術基準

本指南依據以下官方文件建立：

| 技術 | 關鍵規則 |
|---|---|
| Next.js App Router | Server Component 預設；Client Component 僅在需要互動時加 `"use client"` |
| Next.js 資料取用 | Server-side data 直接在適當層取用，不繞 HTTP 呼叫自己 |
| Firebase Storage Web | 使用 `uploadBytes` 上傳 File/Blob |
| Firebase Storage Metadata | 以 `customMetadata` 寫入 `account_id`、`workspace_id` |
| Firestore | 資料模型需在高讀寫下保持可擴展，避免不必要敏感欄位 |

---

## 模組責任

### 1. UI 與頁面

```
app/(shell)/wiki-beta/           ← 路由入口（薄協調）
modules/wiki-beta/interfaces/    ← UI 元件與 Server Actions
modules/wiki-beta/application/   ← use-case 協調
```

**原則**：page 檔案只做組裝與 Server Action 呼叫，不直接放業務邏輯。

### 2. 基礎設施

```
modules/wiki-beta/infrastructure/    ← Firestore + Storage + callable 連線
```

可用 callable（限此兩個）：

- `rag_query`
- `rag_reindex_document`

### 3. Worker（py_fn）

```
py_fn/
├── Storage trigger ingestion    ← 解析 → 清洗 → 分類 → 切塊 → 嵌入
├── rag_reindex_document         ← 單文件重整
└── rag_query                    ← RAG 問答
```

**禁止**：py_fn 不持有 UI 狀態或 session；Next.js 不執行 parse/chunk/embed。

---

## 必備能力矩陣

| 能力 | 優先級 | 實作位置 |
|---|---|---|
| 檔案拖曳上傳（含 MIME 驗證） | P0 | `interfaces/components` + Storage |
| 上傳時攜帶 `account_id`（`workspace_id` 選填） | P0 | Storage `customMetadata` |
| 文件列表（account 全覽） | P0 | Firestore account-scoped query |
| 文件列表（workspace 篩選） | P0 | Firestore + `workspaceId` 欄位篩選 |
| 顯示 parse/rag 狀態 | P0 | Firestore `status` / `rag.status` 欄位 |
| RAG 重整按鈕 | P0 | `rag_reindex_document` callable |
| 顯示文件總數與 ready/error 摘要 | P0 | 列表統計欄 |
| 錯誤提示（toast + console 可追蹤） | P0 | toast + console.error |
| 原始檔連結預覽 | P1 | Storage signedURL |
| 解析 JSON 預覽 | P1 | Storage JSON signedURL |
| 文件刪除（需配合權限與稽核） | P2 | Server Action + py_fn callable |

---

## 資料範圍原則

1. **強制 account scope**：所有 Firestore 讀寫必須是 `accounts/{accountId}/...` 路徑。
2. **documents 是主集合**：`accounts/{accountId}/documents/{documentId}`。
3. **workspace 只是篩選**：用 `spaceId` 欄位篩選，不另開頂層集合。
4. **禁止 global fallback**：不可查詢 `/documents` 頂層集合。

---

## 開發流程

### Step 1：定義能力映射（Why first）

先標註每個功能對應 `/dev-tools` 的哪一能力，確保語意不漂移。

```
功能需求       → /dev-tools 對應能力
文件拖曳上傳   → dev-tools upload card
account 全覽   → dev-tools documents list (no workspace filter)
workspace 篩選 → dev-tools documents list (with workspace filter)
```

### Step 2：實作 UI

- 在 `interfaces/components` 實作互動元件。
- page 只保留薄協調（組裝元件、呼叫 Server Action），不放業務流程。
- 每個互動元件需定義完整狀態（idle / loading / error / empty / populated）。

```typescript
// ✅ page 薄協調
export default async function WikiBetaDocumentsPage() {
  return <WikiBetaDocumentsView />;
}

// ❌ page 內直接有業務邏輯（且違反 account scope：直接查詢頂層 collection）
export default async function WikiBetaDocumentsPage() {
  const docs = await getFirestore().collection("documents").get(); // Wrong: (1) 業務邏輯在 page，(2) 頂層 collection 無帳號隔離
  return <DocumentsList docs={docs} />;
}
```

### Step 3：實作 use-case

- 在 `application/use-cases/` 建立可測試的 use-case 函式。
- 依賴透過 repository interface 注入，不在 use-case 內直接 new Firebase SDK。

```typescript
// ✅ 依賴注入，可測試
export async function uploadDocument(input: UploadDocumentInput, repo: IDocumentRepository) {
  return repo.save({ ...input });
}

// ❌ 直接依賴 Firebase，不可測試
export async function uploadDocument(input: UploadDocumentInput) {
  return getFirestore().collection("documents").add(input); // Wrong
}
```

### Step 4：實作 infrastructure adapter

提供三類 adapter：

```typescript
// Storage 上傳
await uploadBytes(ref, file, { customMetadata: { account_id, workspace_id } });

// Firestore account-scoped 查詢
query(collection(db, `accounts/${accountId}/documents`), orderBy("uploadedAt", "desc"))

// Callable 觸發
const fn = httpsCallable(functions, "rag_reindex_document");
await fn({ account_id, doc_id, json_gcs_uri, source_gcs_uri, filename, page_count });
```

### Step 5：worker 對齊

若有新增 metadata 欄位或狀態欄位，必須同步更新：

- py_fn 的 handler（解析欄位寫入）
- Firestore service（狀態轉換邏輯）
- 設計規格（資料模型章節）

### Step 6：驗證

```bash
npm run lint      # 0 errors
npm run build     # 通過
# Playwright MCP 走完整 UI 流程
```

驗證清單：
- `/wiki-beta/documents` 上傳成功
- account 全覽正確顯示
- workspace 篩選正確生效
- RAG reindex 觸發成功
- console 無 error

---

## 常見錯誤（Anti-patterns）

| Anti-pattern | 正確做法 |
|---|---|
| page 檔直接 import Firebase SDK | 改為在 use-case 或 infrastructure adapter 處理 |
| 在 use-case 直接 `new FirebaseXxxRepository()` | 透過 constructor 注入，方便 unit test 替換 in-memory |
| 查詢 `documents` 頂層 collection | 改為 `accounts/{accountId}/documents` |
| `console.error(e)` 但不顯示 toast | 兩者並行：`console.error` 留 trace，toast 通知使用者 |
| py_fn 回傳 error 但 UI 靜默 | 在 callable handler 包 try/catch 並回傳錯誤 toast |
| workspace_id 作為資料邊界（不同 workspace = 不同 account） | workspace 只是篩選視角，account 才是資料邊界 |

---

## Namespace 方針

Namespace 在 wiki-beta 視角為背景能力：

- 不提供獨立 UI 入口
- 作為路由 slug 與資料 scope 的內部機制（由 `modules/namespace` 提供）
- 不應在側邊欄暴露為主要功能

---

## 驗收清單

- [ ] `/wiki-beta/documents` 可拖曳上傳
- [ ] 上傳後可在 account 全覽看到文件（不需手動刷新）
- [ ] 帶 `workspaceId` 時可正確篩選，且頁面顯示篩選提示
- [ ] RAG reindex 可正常觸發，`rag.status` 更新
- [ ] 無 `accountId required` 類型的初始化錯誤
- [ ] 無跨 `wiki` ↔ `wiki-beta` 邊界 import 違規
- [ ] 與 runtime-flow 文件一致（流程、命名、狀態）
- [ ] `npm run lint` 0 errors，`npm run build` 通過
