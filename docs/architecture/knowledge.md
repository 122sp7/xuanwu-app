---
title: Knowledge architecture
description: Target metadata, versioning, and retrieval architecture for the enterprise knowledge base, plus the currently shipped contract and UI entrypoint.
---

# 企業知識庫元數據與版本管理規範

> **文件編號**：XUANWU-KB-SPEC-001
> **適用系統**：xuanwu-app — 多代理 AI 知識庫平台
> **版本**：v1.0.0
> **最後更新**：2026-03-19
> **維護責任方**：Docs Manager Agent / 平台架構委員會

---

> **⚠️ 已整合至 `modules/wiki`**
> `modules/knowledge` 已於 2026-03-21 全數遷移至 `modules/wiki` 並刪除。
> - 領域類型（`WorkspaceKnowledgeSummary` 等）、`GetWorkspaceKnowledgeSummaryUseCase`：`@/modules/wiki`
> - 跨模組 adapter：`modules/wiki/infrastructure/default/DefaultWorkspaceKnowledgeRepository`
> - 查詢函數 `getWorkspaceKnowledgeSummary`：`modules/wiki/interfaces/queries/knowledge.queries.ts`
> 本文件保留作目標架構記錄；新開發請直接操作 `modules/wiki`。

---

## 0. 目前已上線範圍

目前 knowledge 功能已整合至 wiki 模組：

- **可見 UI**：`modules/workspace/interfaces/components/WorkspaceWikiTab.tsx`
- **掛載位置**：`modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx`
- **開發契約**：`docs/reference/development-contracts/wiki-contract.md`

此頁仍是**目標架構規範**；目前產品已上線的是 read-side Summary + Workspace Tab，可用來驗證 file / parser / knowledge 的責任分界。

### 0.1 交付 MVP（本輪開始實作）

本輪開始交付的 MVP，不再只停留在 read-side Summary，而是先把最小可運作的 write-side 路徑校正為一致契約：

1. **Upload registration**
   - `modules/file` 負責註冊已上傳文件 metadata
   - Firestore 寫入路徑：`/knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}`
2. **Ingestion worker**
   - `functions-python` 負責 `uploaded → processing → ready|failed`
   - 同一路徑回寫文件狀態與處理時間欄位
3. **Chunk persistence**
   - Firestore 寫入路徑：`/knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId}`
   - 與 document 同步保存 `organizationId`、`workspaceId`、`taxonomy`、`chunkIndex`
4. **Retrieval**
   - `modules/ai` 先以 Firestore collection-group query 讀取 `documents` / `chunks`
   - 強制過濾 `organizationId`、`workspaceId`（可選）、`status=ready`、`taxonomy`（可選）

### 0.2 MVP 不在本輪交付的範圍

以下仍屬後續階段，**本輪不假裝已完成**：

- 從 Cloud Storage blob 直接觸發 parser 的正式 event-driven pipeline
- 真正的向量相似搜尋（目前 retrieval 仍是 skeleton metadata filter）
- `files` 版本群組與 `documents`/`chunks` 之間的完整 version lineage 對映
- Knowledge governance（archive / restore / audit log）完整 UI
- 以 `knowledge` 模組作為完整 write-side aggregate 的最終落位

### 0.3 MVP 儲存邊界

MVP 的實際儲存邊界先明確如下：

| 邊界 | 儲存位置 | 說明 |
|------|----------|------|
| 原始檔二進位 | Cloud Storage `organizations/{organizationId}/workspaces/{workspaceId}/files/{fileId}/{filename}` | 由 file upload 路徑管理 |
| 文件 metadata | Firestore `/knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}` | upload registration 與 ingestion lifecycle 共同使用 |
| 切塊與 embedding | Firestore `/knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId}` | ingestion worker 寫入，retrieval 讀取 |
| 可見 read-side 狀態 | `modules/knowledge` summary/UI | 僅做 posture 呈現，不直接持有 write-side 真實來源 |

---

## 1. 核心設計原則

| 原則 | 說明 |
|------|------|
| **物理與邏輯分離** | Cloud Storage 僅存 UUID 命名的物理檔案；原始檔名、顯示名稱、版本資訊統一存於 Firestore，防止儲存層與業務層耦合 |
| **版本群組化** | 以 `versionGroupId` 串聯同一份文件的所有歷史版本，確保版本血緣可追溯 |
| **檢索優先設計** | 所有欄位設計以支援向量搜尋 Pre-filtering（預過濾）為優先考量，避免廢棄版本污染 RAG 結果 |
| **單一真實來源** | 同一 `versionGroupId` 內，任何時刻只允許一份 `isLatest: true` 的記錄存在，由寫入事務強制保證 |
| **最小權限存取** | `accessControl` 採 Role-Based Access Control (RBAC)，預設拒絕所有存取，明確授權後才開放 |

---

## 2. Firestore 資料模型

### 2.1 檔案版本集合 (`files`)

**Collection Path**：`/knowledge_base/{organizationId}/workspaces/{workspaceId}/files/{fileId}`

| 欄位名 | 類型 | 必填 | 說明 | 範例值 |
|--------|------|------|------|--------|
| `fileId` | `string` | ✅ | 唯一識別碼，UUID v4，由系統生成（Primary Key） | `"f7a3c1d2-8e4b-4f9a-b2c5-1d3e5f7a9b0c"` |
| `organizationId` | `string` | ✅ | 所屬組織 ID，關聯 `OrganizationEntity.id` | `"org_abc123"` |
| `workspaceId` | `string` | ✅ | 所屬工作區 ID，與路徑中的 `{workspaceId}` 一致 | `"ws_xyz456"` |
| `versionGroupId` | `string` | ✅ | 同系列文件的群組識別碼，首次上傳時建立，後續版本沿用 | `"vg_hr_employee_handbook"` |
| `displayName` | `string` | ✅ | 使用者可見的檔案名稱，保留原始語意 | `"2026員工手冊_v2.pdf"` |
| `storagePath` | `string` | ✅ | Cloud Storage 完整路徑 | `"organizations/org_abc123/workspaces/ws_xyz456/files/f7a3c1d2.pdf"` |
| `mimeType` | `string` | ✅ | 檔案 MIME 類型，用於解析器路由 | `"application/pdf"` |
| `sizeBytes` | `number` | ✅ | 檔案大小（位元組），用於配額管理 | `2048576` |
| `checksum` | `string` | ✅ | 檔案內容 SHA-256 雜湊值，防止重複上傳與資料損毀驗證 | `"e3b0c44298fc1c149afb..."` |
| `versionNumber` | `number` | ✅ | 版本序號，從 `1` 開始遞增，同群組內唯一 | `3` |
| `isLatest` | `boolean` | ✅ | 是否為當前生效版本，同 `versionGroupId` 內只能有一個 `true` | `true` |
| `status` | `string` (enum) | ✅ | 處理狀態流轉（見下方狀態機定義） | `"ready"` |
| `statusMessage` | `string` | ❌ | 當 `status: "failed"` 時，記錄錯誤詳情 | `"Page 5 OCR timeout"` |
| `category` | `string` | ✅ | 文件分類 Taxonomy，需符合預定義分類表 | `"規章制度"` |
| `department` | `string` | ✅ | 所屬部門，與 Firestore `departments` 集合外鍵關聯 | `"人力資源部"` |
| `tags` | `string[]` | ❌ | 自由標籤，支援多值過濾 | `["特休", "勞基法", "2026版"]` |
| `language` | `string` | ✅ | 文件主要語言，ISO 639-1 格式 | `"zh-TW"` |
| `accessControl` | `string[]` | ✅ | 允許存取的 `OrganizationRole` 值或 accountId 列表，空陣列代表僅限 `Admin` | `["Admin", "Member"]` |
| `accountId` | `string` | ✅ | 上傳者帳號 ID，關聯 Firebase Auth UID | `"uid_abc123"` |
| `updateLog` | `string` | ✅ | 本版本更新說明，新增版本時必填 | `"修正第5頁特休計算規則"` |
| `chunkCount` | `number` | ❌ | 切塊完成後回寫，記錄總切塊數 | `47` |
| `createdAtISO` | `string` | ✅ | 本版本上傳時間，ISO-8601 格式 | `"2026-03-19T11:00:00.000Z"` |
| `indexedAtISO` | `string` | ❌ | 向量索引完成時間，由後端回寫 | `"2026-03-19T11:05:30.000Z"` |
| `expiresAtISO` | `string` | ❌ | 文件到期時間，到期後自動標記為 `archived` | `"2027-12-31T00:00:00.000Z"` |

#### 狀態機定義 (`status`)

```
uploaded → processing → ready
                ↓          ↓
             failed      archived  (手動或到期觸發)
                ↓
           processing  (retry)
```

| 狀態值 | 說明 |
|--------|------|
| `uploaded` | 檔案已上傳至 Cloud Storage，待後端處理 |
| `processing` | 後端正在解析、切塊及生成向量嵌入 |
| `ready` | 已完整索引，可供 RAG 查詢 |
| `failed` | 處理失敗，詳見 `statusMessage`，可重新觸發 |
| `archived` | 已封存，不參與任何搜尋 |

---

### 2.2 向量切塊集合 (`chunks`)

**Collection Path**：`/knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId}`

> 此集合亦可儲存於 Firestore Vector Search 或外部向量資料庫（如 Pinecone），但元數據欄位定義須一致。

| 欄位名 | 類型 | 必填 | 說明 | 檢索用途 |
|--------|------|------|------|----------|
| `chunkId` | `string` | ✅ | 切塊唯一 ID，格式：`{fileId}_c{chunkIndex}` | 檢索結果主鍵 |
| `fileId` | `string` | ✅ | 所屬檔案的 `fileId`，用於關聯溯源 | 精確關聯至特定版本 |
| `organizationId` | `string` | ✅ | 所屬組織 ID，繼承自 `files.organizationId` | 組織隔離 |
| `workspaceId` | `string` | ✅ | 所屬工作區 ID，繼承自 `files.workspaceId` | 工作區隔離 |
| `versionGroupId` | `string` | ✅ | 所屬系列 ID，從 `files` 繼承 | 跨版本追蹤與分析 |
| `isLatest` | `boolean` | ✅ | 與 `files` 層級同步，確保只索引最新版切塊 | **核心過濾：僅搜尋最新版** |
| `category` | `string` | ✅ | 繼承自 `files.category` | 業務分類過濾 |
| `department` | `string` | ✅ | 繼承自 `files.department` | 部門範圍過濾 |
| `accessControl` | `string[]` | ✅ | 繼承自 `files.accessControl`，切塊層級獨立執行權限過濾 | 向量搜尋前的權限過濾 |
| `language` | `string` | ✅ | 繼承自 `files.language` | 多語言環境下的語言過濾 |
| `content` | `string` | ✅ | 切塊原文文本，輸入 LLM 的 Context | RAG 上下文 |
| `contentSummary` | `string` | ❌ | 切塊摘要（可由 LLM 生成），用於混合搜尋場景 | 關鍵字補充搜尋 |
| `pageNumber` | `number` | ✅ | 所在頁碼（從 1 開始），用於使用者溯源顯示 | 來源引用：「第 12 頁」 |
| `chunkIndex` | `number` | ✅ | 切塊在文件內的全域順序序號（從 0 開始） | 組合前後文上下文 |
| `charCount` | `number` | ✅ | 切塊字元數，用於 Token 估算與切塊品質監控 | 效能分析 |
| `embeddingModel` | `string` | ✅ | 生成此向量所用的嵌入模型名稱 | 模型版本追蹤 |
| `vector` | `vector` | ✅ | 向量數值（維度依嵌入模型而定，如 1536 維） | 語義相似度比對 |
| `createdAtISO` | `string` | ✅ | 切塊建立時間，ISO-8601 格式 | 資料新鮮度監控 |

---

## 3. 業務邏輯規範

### 3.1 上傳新文件（首次）

```
1. 接收檔案 → 計算 SHA-256 checksum
2. 查詢 files 集合：是否存在相同 checksum？
   └─ 若存在 → 拒絕上傳，返回 409 Conflict + 既有 fileId
3. 生成新 fileId (UUID v4)
4. 生成新 versionGroupId (格式：vg_{語意識別碼})
5. 上傳檔案至 Cloud Storage → 取得 storagePath
6. 寫入 Firestore files 文件：
   versionNumber = 1, isLatest = true, status = "uploaded"
7. 觸發後端解析 Pipeline（非同步）
```

### 3.2 上傳新版本（已有 version_group_id）

```
1. 接收檔案 + 指定 versionGroupId
2. 計算 SHA-256 checksum → 查重（同上）
3. Firestore 事務（Transaction）內執行：
   a. 查詢該 versionGroupId 內 isLatest = true 的記錄
   b. 批次更新所有舊版 isLatest → false
   c. 批次更新舊版對應 chunks 的 isLatest → false
   d. 寫入新版 files 文件：
      versionNumber = 舊最大版本號 + 1
      isLatest = true
      status = "uploaded"
4. 事務提交後，觸發後端解析 Pipeline
```

> ⚠️ **事務原子性要求**：步驟 3 的 a～d 必須在單一 Firestore 事務內完成，防止查詢期間出現雙 `isLatest: true` 的髒資料。

### 3.3 版本回滾

```
1. 指定目標 versionNumber 進行回滾
2. Firestore 事務內執行：
   a. 將當前 isLatest = true 的版本 → isLatest = false
   b. 將目標版本 → isLatest = true
   c. 同步更新各版本對應 chunks 的 isLatest 欄位
3. 記錄回滾操作至 audit_log 集合
```

---

## 4. RAG 查詢標準規範

### 4.1 必要過濾條件

所有 RAG 查詢請求**必須**帶上以下過濾參數，缺少任一項視為不合規查詢，應拒絕執行：

```python
# Python 後端 RAG 查詢標準模板
from typing import Literal

def build_rag_query(
    user_query_embedding: list[float],
    user_roles: list[str],
    department: str | None = None,
    category: str | None = None,
    language: str = "zh-TW",
    top_k: int = 5,
) -> dict:
    """
    建構標準 RAG 查詢參數。
    所有查詢必須包含 is_latest 與 access_control 過濾，其餘為可選業務過濾。
    """
    required_filters = {
        "isLatest": True,                           # 強制：排除廢棄版本
        "accessControl": {"$in": user_roles},        # 強制：RBAC 權限過濾
    }

    optional_filters = {}
    if department:
        optional_filters["department"] = department
    if category:
        optional_filters["category"] = category
    if language:
        optional_filters["language"] = language

    return {
        "vector": user_query_embedding,
        "filter": {**required_filters, **optional_filters},
        "top_k": top_k,
        "include_metadata": True,
    }
```

### 4.2 查詢結果標準回傳格式

```typescript
// TypeScript 型別定義（Next.js API Route 使用）
interface ChunkSearchResult {
  chunkId: string;
  fileId: string;
  displayName: string;     // 從 files 集合 join
  pageNumber: number;
  content: string;
  score: number;           // 向量相似度分數 (0~1)
  department: string;
  category: string;
}

interface RagQueryResponse {
  results: ChunkSearchResult[];
  query_id: string;        // 用於查詢追蹤與 audit log
  total_found: number;
  latency_ms: number;
}
```

---

## 5. Firestore Security Rules

```javascript
// firestore.rules — 知識庫核心集合存取控制
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── 輔助函式 ──────────────────────────────────────────
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserRoles() {
      // OrganizationRole: "Owner" | "Admin" | "Member" | "Guest"
      return get(/databases/$(database)/documents/organizations/$(resource.data.organizationId)/members/$(request.auth.uid)).data.role;
    }

    function hasRole(role) {
      return getUserRoles() == role;
    }

    function isMemberOfOrg(organizationId) {
      return exists(/databases/$(database)/documents/organizations/$(organizationId)/members/$(request.auth.uid));
    }

    function canAccessDocument(docData) {
      return hasRole('Owner') || hasRole('Admin') ||
             request.auth.uid in docData.accessControl ||
             docData.accessControl.hasAny([getUserRoles()]);
    }

    // ── 知識庫文件集合 ─────────────────────────────────────
    match /knowledge_base/{organizationId}/workspaces/{workspaceId}/files/{fileId} {
      // 讀取：已認證 + 屬於組織 + 有存取權限
      allow read: if isAuthenticated() && isMemberOfOrg(organizationId) && canAccessDocument(resource.data);

      // 寫入：組織成員中的 Owner 或 Admin
      allow create: if isAuthenticated() && isMemberOfOrg(organizationId) &&
                       (hasRole('Owner') || hasRole('Admin'));

      // 更新：Owner/Admin 或上傳者本人（不可更改 fileId 與 checksum）
      allow update: if isAuthenticated() && isMemberOfOrg(organizationId) &&
                       (hasRole('Owner') || hasRole('Admin') || request.auth.uid == resource.data.accountId) &&
                       request.resource.data.fileId == resource.data.fileId &&
                       request.resource.data.checksum == resource.data.checksum;

      // 刪除：僅限 Owner 或 Admin
      allow delete: if isAuthenticated() && isMemberOfOrg(organizationId) &&
                       (hasRole('Owner') || hasRole('Admin'));
    }

    // ── 向量切塊集合 ───────────────────────────────────────
    match /knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId} {
      // 讀取：透過後端 Service Account，前端不直接存取 chunks
      allow read: if false;   // 所有讀取由後端 Admin SDK 處理

      // 寫入：僅允許後端 Service Account（透過 Admin SDK bypass rules）
      allow write: if false;
    }
  }
}
```

---

## 6. 索引設計建議

### 6.1 Firestore 複合索引（必要）

| Collection | 欄位組合 | 用途 |
|------------|----------|------|
| `files` | `versionGroupId ASC` + `versionNumber DESC` | 取得最新版本 |
| `files` | `department ASC` + `isLatest ASC` + `createdAtISO DESC` | 部門文件列表 |
| `files` | `status ASC` + `createdAtISO ASC` | 處理佇列監控 |
| `files` | `checksum ASC` | 重複檔案查重 |

### 6.2 向量資料庫索引（Pinecone / Firestore Vector Search）

```python
# Pinecone 索引建立範例（metadata 欄位需預先宣告以支援過濾）
import pinecone

index = pinecone.create_index(
    name="xuanwu-kb",
    dimension=1536,          # text-embedding-3-small
    metric="cosine",
    metadata_config={
        "indexed": [         # 宣告可過濾的 metadata 欄位
            "isLatest",
            "organizationId",
            "workspaceId",
            "department",
            "category",
            "language",
            "accessControl",
            "versionGroupId",
        ]
    }
)
```

---

## 7. 資料品質與監控規範

| 監控指標 | 告警閾值 | 負責代理 |
|----------|----------|----------|
| `status: "failed"` 比例 | > 5% 觸發告警 | Docs Manager Agent |
| 切塊平均 `charCount` | < 100 或 > 2000 視為異常 | Data Agent |
| `isLatest` 一致性檢查 | 同 group 出現多個 `true` | Data Agent（排程巡檢） |
| 向量索引延遲 (`indexedAtISO - createdAtISO`) | > 10 分鐘告警 | QA Agent |
| 孤立切塊（`fileId` 對應不到 `files` 記錄） | 任意數量觸發 | Data Agent |

---

## 8. 變更記錄

| 版本 | 日期 | 變更說明 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-03-19 | 初版建立，涵蓋完整 Firestore 模型、狀態機、RAG 查詢規範、Security Rules | xuanwu-app 架構委員會 |
