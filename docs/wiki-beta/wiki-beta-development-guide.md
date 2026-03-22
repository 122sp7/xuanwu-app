# Wiki-Beta 開發指南

## 文件一致性（單一真實來源）

- 本文件與設計規格、使用手冊，皆以 [docs/wiki-beta/wiki-beta-runtime-flow.mermaid](docs/wiki-beta/wiki-beta-runtime-flow.mermaid) 為準。
- 若文字敘述與 runtime-flow 圖不一致，優先修正文檔文字，使其回到 runtime-flow 的語意。
- 任何對 runtime boundary、資料流、資料模型的調整，必須同步更新三份文件。

## 目的

本文件定義 /wiki-beta 的開發方式，目標是讓 Wiki-Beta 具備與 /dev-tools 同等級的文件操作能力，並遵守既有 runtime boundary：

- Next.js Runtime：頁面組裝、互動 UI、前端狀態
- Firebase Functions Runtime (py_fn)：解析、重整、RAG worker 流程
- Firestore：帳號範圍資料索引與狀態

## Context7 企業知識庫基準

本指南依據 Context7 查詢的官方文件建立，重點如下：

- Next.js App Router：Server Component 預設、Client Component 僅在需要互動時使用
- Next.js 建議：Server-side data 不要繞一圈 HTTP 呼叫自己，應直接在適當層取資料
- Firebase Storage Web：使用 uploadBytes 上傳 File/Blob
- Firebase Storage Web：可用 customMetadata 寫入 account_id、workspace_id
- Firebase Firestore：資料模型需在高讀寫下保持可擴展，避免不必要敏感欄位

## 模組責任

### 1) UI 與頁面

- 路由入口：app/(shell)/wiki-beta
- UI 組件：modules/wiki-beta/interfaces/components
- 應用協調：modules/wiki-beta/application

### 2) 基礎設施

- Firestore + Functions + Storage 連線：modules/wiki-beta/infrastructure
- callable 僅可使用：
  - rag_query
  - rag_reindex_document

### 3) Worker

- py_fn 處理：
  - Storage trigger ingestion
  - rag_reindex_document
  - rag_query

## 與 /dev-tools 對齊的必備能力

/wiki-beta 必備能力矩陣：

- 檔案拖曳上傳（含 MIME 驗證）
- 上傳時攜帶 account_id；若有 workspace context 同步攜帶 workspace_id
- 文件列表（account 全覽）
- 文件列表（workspace 篩選）
- RAG 重整按鈕
- 顯示 parse/rag 狀態
- 顯示 documents 總數與 ready/error 摘要
- 錯誤提示（toast + console 可追蹤）

建議能力（可分期）：

- 原始檔連結預覽
- 解析 JSON 預覽
- 文件刪除（需配合權限與稽核）

## 資料範圍原則

- 所有讀寫必須是 accounts/{accountId}/... 範圍
- documents 為目前主集合
- workspace 視角用欄位篩選，不改變 account 主範圍
- 嚴禁 global fallback collection

## 開發流程

### Step 1. 先定義能力映射

每個功能先標註對應 /dev-tools 哪一能力，避免需求語意漂移。

### Step 2. 實作 UI

- 先在 interfaces/components 實作互動
- page 只保留薄協調，不放業務流程

### Step 3. 實作 application use-case

- 建立可測試的 use-case 函式
- 不在 use-case 內直接碰 React 狀態

### Step 4. 實作 infrastructure adapter

- uploadBytes
- Firestore account-scoped query
- httpsCallable

### Step 5. worker 對齊

若有新增 metadata 或狀態欄位，必須同步 py_fn handler 與 firestore service。

### Step 6. 驗證

- Playwright MCP 走完整 UI 流程
- 檢查 console errors
- 驗證 /wiki-beta/documents 在 account 全覽與 workspace 篩選都正確

## Namespace 方針

Namespace 在 wiki-beta 視角為背景能力：

- 不提供獨立 UI 入口
- 可作為路由與資料 scope 的內部機制
- 不應在側邊欄暴露為主要功能

## 驗收清單

- /wiki-beta/documents 可拖曳上傳
- 上傳後可在 account 全覽看到文件
- 帶 workspaceId 時可正確篩選
- RAG reindex 可正常觸發
- 無 accountId required 類型的初始化錯誤
- 無跨 wiki / wiki-beta 邊界 import 違規
- 與 runtime-flow 文件一致（流程、命名、狀態）
