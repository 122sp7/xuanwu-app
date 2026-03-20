# ADR 009: RAG Firestore Index Matrix

## 狀態 (Status)
Accepted

## 背景 (Context)

RAG 查詢若沒有明確 index matrix，常見問題是：

1. 查詢模式持續增加，但索引規劃落後。
2. vector search 可執行，但 filter 條件在高併發下失效或延遲。
3. 部署時才發現缺索引，導致功能不可用。

## 決策 (Decision)

建立 Firestore index matrix 作為 RAG 查詢與狀態轉移的部署前置檢核標準。

## Required Technology Stack

1. Firebase Firestore（含 vector search 能力）
2. Firebase CLI / Firebase Console（索引部署）
3. Cloud Functions for Firebase (Python)（ingestion write path）
4. Next.js 16 + TypeScript 5（query read path）

## 設計細節 (Design)

### 1. Query patterns and index targets

#### Pattern A: Query-time vector retrieval

- Collection: `chunks`
- Required fields: `embedding`, `organizationId`, `workspaceId`, `taxonomy`
- Purpose: Top-K + organization/workspace/taxonomy filter

#### Pattern B: Document readiness lookup

- Collection: `documents`
- Required fields: `organizationId`, `workspaceId`, `status`, `updatedAt`
- Purpose: 只查可用於 query 的 `ready` 文件

#### Pattern C: Retry/backfill queue scan

- Collection: `documents`
- Required fields: `status`, `failedAt`, `processingStartedAt`
- Purpose: worker retry / maintenance scan

#### Pattern D: Cache lookup

- Collection: `queryCache`
- Required fields: `organizationId`, `workspaceId`, `queryHash`, `expiresAt`

### 2. Index matrix

```text
Collection: chunks
- Vector index: embedding
- Filter fields: organizationId, workspaceId, taxonomy
- Optional order field: updatedAt

Collection: documents
- Composite candidates:
  (organizationId, workspaceId, status)
  (status, failedAt)
  (organizationId, workspaceId, updatedAt)

Collection: queryCache
- Composite candidates:
  (organizationId, workspaceId, queryHash)
  (expiresAt)
```

### 3. Deployment checks

每次部署前必須確認：

1. `chunks.embedding` vector index 已建立。
2. 主要 filter 所需 composite indexes 已完成部署。
3. 新增查詢模式有對應索引規格與回退計畫。

### 4. Failure prevention rules

1. 不允許在未建索引前上線新 query pattern。
2. 不允許在 production 以臨時查詢繞過 organization/workspace filter。
3. index 變更必須附部署步驟與驗證結果。

## 與 functions-python ADR 協作與不衝突規則

1. 本 ADR 定義跨 runtime 的索引需求。
2. `libs/firebase/functions-python/docs/adr/ADR-007-firestore-rag-data-model-and-indexing.md` 定義 worker 側資料模型與索引語意。
3. 若命名或欄位有差異，以雙方共同交集為優先：`documents` / `chunks` / `embedding` / `organizationId` / `workspaceId`。
4. 不得在本 ADR 引入與 functions-python ADR 相衝突的 collection 角色。

## 後果 (Consequences)

### 正面影響

1. 查詢模式與索引配置可一一對應。
2. 部署前可檢查是否缺索引。
3. query latency 與失敗率更可控。

### 負面影響

1. 每次新增查詢都需同步維護 matrix。
2. 索引數量增加時需要治理成本。

## Operational Notes

- index matrix 應與部署腳本或 runbook 一併維護。
- 若改用外部向量資料庫，需新增 superseding ADR。
