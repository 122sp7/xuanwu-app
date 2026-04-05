# source — 文件來源上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/source/`  
> **開發狀態:** 🚧 Developing

## 在 Knowledge Platform / Second Brain 中的角色

`source` 是 Knowledge Platform 的文件入口，承接 Notion-like 內容系統之外的外部文件、附件與來源治理。它負責讓知識進入平台，並安全地交給 `ai` 攝入管線處理。

## 主要職責

| 能力 | 說明 |
|---|---|
| 來源文件生命週期 | 管理上傳初始化、上傳完成、版本快照與保留政策 |
| 來源集合管理 | 維護文件集合、library 與 workspace 範圍的來源視圖 |
| 攝入交接 | 把已完成上傳的來源資料交付 `ai` 進入攝入流程 |

## 與其他 Bounded Context 協作

- `workspace` 提供來源文件的歸屬邊界；`knowledge` 可能引用或轉寫來源內容。
- `ai` 接收來源文件並建立 ingestion job；`knowledge-base` 與 `search` 最終消費來源衍生的結構與索引。

## 核心聚合 / 核心概念

- **`SourceDocument`**
- **`SourceCollection`**
- **`WikiLibrary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
