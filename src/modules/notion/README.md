# Notion Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/notion/` 正在從 `modules/notion/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（名詞域 → modules/ 來源）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體。  
> **子域不重複原則：** 分類法（標籤）整合至 `page` / `database` metadata；關聯圖以 `view` 呈現。

| 子域 | 蒸餾來源（modules/notion/subdomains/）| 狀態 | 說明 |
|---|---|---|---|
| `page` | `authoring` + `knowledge` | 📋 待蒸餾 | Page 實體（知識文件創作、版本、metadata）|
| `block` | `authoring`（區塊層）| 📋 待蒸餾 | Block 實體（Page 內容區塊：文字、圖片、代碼、嵌入等）|
| `database` | `knowledge-database` | 📋 待蒸餾 | Database 實體（結構化知識庫、欄位定義）|
| `view` | `relations` | 📋 待蒸餾 | View 實體（Database / Page 關聯的顯示方式、篩選、排序）|
| `collaboration` | `collaboration` | 📋 待蒸餾 | Collaboration 實體（協作評論、共編、提及通知）|
| `template` | `taxonomy`（部分）+ 新增 | 📋 待蒸餾 | Template 實體（Page / Database 的可重用模板）|

---

## 預期目錄結構（蒸餾後）

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
    page/                       ← 優先蒸餾（Page 是核心 Aggregate）
      domain/
      application/
      adapters/outbound/
    block/                      ← 優先蒸餾（Block 是 Page 內核心實體）
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
| 把 `modules/notion/infrastructure/` 直接複製到 `src/modules/notion/domain/` | 層次混淆 |
| 在 barrel 使用 `export *` | 破壞可追蹤性 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/notion/](../../../modules/notion/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
