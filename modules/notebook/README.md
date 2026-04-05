# notebook — Notebook 對話上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/notebook/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notebook` 是 Xuanwu 的 NotebookLM-like 互動層，將檢索結果、知識內容與圖譜脈絡轉成對話、摘要、洞察與可引用回答。它是最接近使用者 AI 推理體驗的上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 對話 Thread 管理 | 維護對話串與訊息歷史 |
| 摘要 / 問答互動 | 把檢索結果轉成可閱讀、可追問的回答 |
| 引用式輸出 | 保留 citation / source trace，支撐可信回答 |

## 與其他 Bounded Context 協作

- `search` 是主要上游，提供語意檢索與引用資料。
- `knowledge` 與 `wiki` 提供被推理的內容與結構脈絡；`ai` 提供底層攝入能力。

## 核心聚合 / 核心概念

- **`Thread`**
- **`Message`**
- **`Summary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
