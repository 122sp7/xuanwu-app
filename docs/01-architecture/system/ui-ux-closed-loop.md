# UI/UX Closed-Loop Design

## Purpose

本文件說明 Xuanwu App 各 UI tab 之間的**資料閉環設計**（Closed-Loop UX），確保每個功能入口都能明確告知使用者：「這個頁面的資料從哪裡來？」以及「這個頁面的輸出將流向哪裡？」。

閉環設計的核心目標：**使用者在任何一個 tab 都能看到完整的上下游脈絡，而不是孤立的功能孤島。**

---

## 閉環全景圖

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Xuanwu App — 資料閉環全景                              │
│                                                                             │
│  [入口] 來源文件 ──────────────────────────────────────────────────────────┐ │
│   notebooklm.sources                                                       │ │
│   • 用戶上傳 PDF / 圖片                                                     │ │
│   • fn Storage Trigger 自動執行 parse + RAG index                        │ │
│   └──────────────────────────────────────────────────────────────────────► │ │
│                                                                             │ │
│  [知識結構] notion.pages / notion.database                               │ │
│   • 從文件解析提取或手動撰寫的知識頁面                                         │ │
│   • 結構化資料（需求清單、人員表、里程碑等）                                    │ │
│   └──────────────────────────────────────────────────────────────────────► │ │
│                                                                             │ │
│  [AI 分析] notebooklm.notebook / notebooklm.research                       │ │
│   • RAG 查詢針對已索引來源文件做語意問答                                       │ │
│   • 研究合成 = 全工作區文件主題萃取 + 關鍵結論                                 │ │
│   └──────────────────────────────────────────────────────────────────────► │ │
│                                                                             │ │
│  [任務形成] workspace.task-formation                              ◄──────── ┘ │
│   • 選擇來源：頁面 / 資料庫 / AI 研究摘要                                     │
│   • AI 萃取任務候選清單                                                       │
│   • 使用者確認後進入任務管道                                                   │
│   └──────────────────────────────────────────────────────────────────────► │
│                                                                             │
│  [執行管道] workspace.tasks → workspace.quality → workspace.approval        │
│            → workspace.settlement                                           │
│   └──────────────────────────────────────────────────────────────────────► │
│                                                                             │
│  [回饋閉環] workspace.issues → workspace.daily → workspace.schedule        │
│   • 問題單反映品質缺口                                                        │
│   • 每日 standup 更新任務狀態                                                 │
│   • 回饋至下一個迭代的任務形成                                         ─────►  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 各 Tab 的上下游關係

### 1. notebooklm.sources（來源文件）

| 項目 | 說明 |
|------|------|
| **上游** | 使用者手動上傳，或從外部系統匯入 |
| **處理** | fn Storage Trigger → `parse_document` → `rag_reindex_document` |
| **下游** | → `notebooklm.notebook`（可查詢）<br>→ `notebooklm.research`（可合成）<br>→ `notion.pages`（知識頁面草稿）|
| **閉環 CTA** | 上傳後提示「文件已索引，可前往 RAG 查詢或研究合成」 |

### 2. notion.pages / notion.database（知識結構）

| 項目 | 說明 |
|------|------|
| **上游** | 用戶手動撰寫，或從 notebooklm 文件解析結果提取 |
| **下游** | → `workspace.task-formation`（作為任務生成的知識來源）|
| **閉環 CTA** | 每個頁面 / 資料庫旁顯示「→ 發送至任務形成」 |

### 3. notebooklm.research（研究摘要）

| 項目 | 說明 |
|------|------|
| **上游** | 所有已索引來源文件 |
| **處理** | AI 全文合成：萃取主題、關鍵發現、重要結論 |
| **下游** | → `workspace.task-formation`（AI 摘要可作為任務形成的輸入）|
| **閉環 CTA** | 合成結果底部顯示「→ 從研究摘要生成任務」 |

### 4. workspace.task-formation（任務形成）

| 項目 | 說明 |
|------|------|
| **上游** | notion.pages / notion.database / notebooklm.research |
| **處理** | AI 從選定來源萃取任務候選 → 使用者確認 → 任務建立 |
| **下游** | → `workspace.tasks` |
| **閉環 CTA** | 顯示來源選擇器；各來源 tab 快速導覽 |

### 5. workspace.tasks → quality → approval → settlement

| 項目 | 說明 |
|------|------|
| **上游** | `workspace.task-formation` |
| **處理** | 任務執行 → 質檢 → 驗收 → 結算 |
| **下游** | → `workspace.issues`（問題回饋）|

### 6. workspace.issues → daily → schedule（回饋閉環）

| 項目 | 說明 |
|------|------|
| **上游** | 任務執行過程中發現的問題 |
| **處理** | 問題歸因 → 每日 standup 追蹤 → 排程調整 |
| **下游** | → 下一個迭代的 `workspace.task-formation` |
| **閉環意義** | 問題單提供改善輸入，驅動下一輪任務形成 |

---

## UI 閉環設計原則

1. **每個 tab 都應顯示來源提示**：「此資料來自哪裡？」用輕量的 info banner 或 description 說明。
2. **每個 tab 都應顯示下游 CTA**：「接下來可以做什麼？」用按鈕或 link 引導至下一步。
3. **知識 → 任務的橋樑必須明確**：`notion.pages`、`notion.database`、`notebooklm.research` 都應有「→ 任務形成」的進入點。
4. **任務形成的來源選擇器是閉環的入口**：讓使用者在 task-formation tab 能一眼看到可用的知識來源（頁面數量、資料庫數量、AI 研究狀態）。
5. **上傳文件的處理狀態要可見**：`notebooklm.sources` 應顯示每份文件的處理鏈狀態（上傳 → 解析 → 索引 → 就緒）。

---

## 架構邊界合規

閉環 UI 必須遵守 [source-to-task-flow.md](./source-to-task-flow.md) 中的邊界規則：

- UI 層只顯示狀態，不內嵌 business rule
- 跨 module 導覽（如 pages → task-formation）通過 URL 查詢參數實現，不通過直接 import
- task-formation 的來源選擇器僅存 reference（pageId、databaseId），不複製知識內容
- AI 摘要進入任務形成前，必須通過 `WorkspaceTaskFormationSection` 的確認步驟

---

## 關聯文件

- [source-to-task-flow.md](./source-to-task-flow.md) — 技術邊界與組裝路徑
- [context-map.md](./context-map.md) — 主域關係圖
- [architecture-overview.md](./architecture-overview.md) — 全域架構概述
