# knowledge — 知識內容上下文

> **Domain Type:** **Core Domain**（核心域）
> **模組路徑:** `modules/knowledge/`
> **開發狀態:** 🚧 Developing — 積極開發中

## 定位

`knowledge` 是 Xuanwu 知識平台的**最高策略重要性域**。它管理知識頁面（KnowledgePage）的完整生命週期：建立、Block 編輯、版本歷史，以及 AI 審批驅動的任務/發票物化流程。

這是用戶每天最高頻交互的域，決定平台的核心體驗。

## 職責

| 能力 | 說明 |
|------|------|
| KnowledgePage CRUD | 建立、讀取、更新（Block 編輯）、歸檔 |
| ContentBlock 管理 | 多型區塊內容（text/heading/image/code/bullet-list）的增刪改 |
| ContentVersion 歷史 | 手動觸發版本快照，保存頁面歷史 |
| Wiki 頁面整合 | WikiPage（wiki-page.types.ts）掛載於工作區 |
| AI 審批流 | 使用者審批 AI 生成草稿，發出 `knowledge.page_approved` 事件 |

## 核心聚合根

- **`KnowledgePage`** — 核心知識單元（title、parentPageId、blockIds）
- **`ContentBlock`** — 原子內容區塊（id、pageId、content、blockType、order）
- **`ContentVersion`** — 頁面歷史快照（snapshotBlocks、editSummary、authorId）

## 關鍵事件

`knowledge.page_approved` 是平台最重要的整合接縫：AI 生成內容被用戶審批後，此事件觸發 `workspace-flow` 的 ContentToWorkflowMaterializer 建立 Task 和 Invoice。

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | KnowledgePage 聚合根設計 |
| [domain-events.md](./domain-events.md) | 完整事件目錄 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
