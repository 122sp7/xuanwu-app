# Notion Module

## 子域清單（名詞域）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體。  
> **子域不重複原則：** 分類法（標籤）整合至 `page` / `database` metadata；關聯圖以 `view` 呈現。

| 子域 | 狀態 | 說明 |
|---|---|---|
| `page` | 🔨 骨架建立，實作進行中 | Page 實體（知識文件創作、版本、metadata）|
| `block` | 🔨 骨架建立，實作進行中 | Block 實體（Page 內容區塊：文字、圖片、代碼、嵌入等）|
| `database` | 🔨 骨架建立，實作進行中 | Database 實體（結構化知識庫、欄位定義）|
| `view` | 🔨 骨架建立，實作進行中 | View 實體（Database / Page 關聯的顯示方式、篩選、排序）|
| `collaboration` | 🔨 骨架建立，實作進行中 | Collaboration 實體（協作評論、共編、提及通知）|
| `template` | 🔨 骨架建立，實作進行中 | Template 實體（Page / Database 的可重用模板）|

---

## 預期目錄結構

```
src/modules/notion/
  index.ts
  README.md
  AGENT.md
  orchestration/
    NotionFacade.ts
  shared/
    domain/index.ts             ← PageRef / BlockRef（跨子域共用 reference VO）
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    page/
      domain/
      application/
      adapters/outbound/
    block/
    database/
    view/
    collaboration/
    template/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 讓其他模組直接修改 `Page` / `Block` / `Database` | notion 是唯一可寫的所有者 |
| 使用 `knowledge-database` / `authoring` / `relations` / `taxonomy` 作為子域名 | 已整合至名詞域（`database` / `page` / `view` / `template`）|
| 在 barrel 使用 `export *` | 破壞可追蹤性 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
