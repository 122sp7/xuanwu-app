# 6103 Migration Gap — notebooklm interfaces 層

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > notebooklm

## Context

`xuanwu-app-skill` 快照的 `modules/notebooklm/` 包含完整的 interfaces（React 元件、Server Actions、hooks、composition）層，約 30 個文件。

對應的 `src/modules/notebooklm/` 沒有任何 interfaces 層文件。

### 遺失的 React 元件（interfaces/web/components/）

```
source/
  FileProcessingDialog.tsx     (37 lines) — 文件處理進度對話框
  LibrariesPanel.tsx           (26 lines) — Wiki Library 清單面板
  LibraryTablePanel.tsx        (37 lines) — Library 表格視圖
  SourceDocumentsPanel.tsx     (27 lines) — Source Documents 面板
  WorkspaceFilesTab.tsx        (31 lines) — Workspace 文件標籤頁

synthesis/
  RagQueryPanel.tsx            (41 lines) — RAG 查詢輸入 + 結果展示面板

conversation/
  ConversationPanel.tsx        (35 lines) — AI 對話主面板
```

### 遺失的 Server Actions（interfaces/web/actions/）

```
source-file.actions.ts         (43 lines) — upload init/complete Server Actions
source-processing.actions.ts   (90 lines) — document processing Server Actions
  ← processSourceDocument, retrySourceProcessing, cancelProcessing
rag-query.actions.ts           (17 lines) — RAG 查詢 Server Action
```

### 遺失的 Hooks（interfaces/web/hooks/）

```
useAiChatThread.ts             (43 lines) — AI 對話 thread 狀態管理 hook
  ← messages, sendMessage, isStreaming, clearThread
useSourceDocumentStatus.ts     — Source Document 處理狀態訂閱
```

### 遺失的 Composition（interfaces/composition/）

```
use-cases.ts                   (67 lines) — notebooklm use case 工廠函數
wiki-library-facade.ts         (43 lines) — WikiLibrary facade（應用層 composition helper）
```

## Decision

**不實施**。僅記錄缺口。

優先順序建議：
1. `source-file.actions.ts` + `source-processing.actions.ts`（接通 upload → process 流程）
2. `ConversationPanel.tsx` + `useAiChatThread.ts`（接通 AI 對話 UX）
3. `RagQueryPanel.tsx`（接通 synthesis 查詢入口）

## Consequences

- notebooklm 功能在 `src/app/` 路由下無任何可掛載的 UI 入口。
- `useAiChatThread` 缺失導致對話功能無法在前端使用。

## 關聯 ADR

- **6101** notebooklm source 子域：Server Actions 呼叫 source use cases。
- **6102** notebooklm synthesis 子域：RagQueryPanel 呼叫 synthesis use cases。
