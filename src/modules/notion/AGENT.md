# Notion Module — Agent Guide

## Purpose

`src/modules/notion` 是 **Notion 知識內容能力蒸餾骨架**，為 Xuanwu 系統提供知識頁面（Page）、內容區塊（Block）、資料庫（Database）、視圖（View）、協作（Collaboration）、模板（Template）等正典知識能力的新實作落點。

**蒸餾來源：** `modules/notion/`  
**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

> **⚠ 邊界警示：** notion 是 `KnowledgeArtifact`（Page / Block / Database）的**唯一可寫所有者**。notebooklm 只能透過 `src/modules/notion/index.ts` 唯讀引用；workspace 不直接修改 notion 內容。

## 子域清單（名詞域）

| 子域 | 說明 | 對應 modules/ 來源 | 蒸餾狀態 |
|---|---|---|---|
| `page` | Page 實體（知識文件創作、編輯、版本）| `authoring` + `knowledge` | 📋 待蒸餾 |
| `block` | Block 實體（Page 內內容區塊：文字、圖片、代碼等）| `authoring`（區塊層）| 📋 待蒸餾 |
| `database` | Database 實體（結構化知識庫）| `knowledge-database` | 📋 待蒸餾 |
| `view` | View 實體（Database 的顯示方式 / 篩選 / 排序）| `relations` | 📋 待蒸餾 |
| `collaboration` | Collaboration 實體（協作評論、共編、提及）| `collaboration` | 📋 待蒸餾 |
| `template` | Template 實體（Page / Database 模板）| `taxonomy`（部分）+ 新增 | 📋 待蒸餾 |

> **子域不重複原則：**  
> - `taxonomy`（分類/標籤）的標籤能力整合至 `page` / `database` 的 metadata；不設獨立 taxonomy 子域  
> - `relations`（關聯圖）以 `view` 呈現；Page 間的關聯是 View 的一種形式  

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- `Page` 與 `Block` 是 notion 核心 Aggregate；`Database` 是另一個 Aggregate。
- 其他模組（notebooklm、workspace）只能透過 `src/modules/notion/index.ts` 唯讀引用 notion 內容。
- `database` 是 `knowledge-database` 的語意化名稱（已完成重命名）；禁止使用舊名。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 notion 的新 use case、entity、adapter 實作。
- 實作 page authoring、database CRUD、collaboration、template 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/notion/AGENT.md`
- 跨模組 API boundary → `src/modules/notion/index.ts`
- RAG / 知識檢索 → `src/modules/notebooklm/`（notebooklm 消費 notion 內容）
- AI 生成輔助 → `src/modules/ai/index.ts`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/notion/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/notion/`（本層）|
| 跨模組 API boundary | `src/modules/notion/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 把 `modules/notion/infrastructure/` 直接搬到 `src/modules/notion/domain/`
- ❌ 讓 notebooklm 或 workspace 直接修改 `Page` / `Block` / `Database`（只可讀取）
- ❌ 在 barrel 使用 `export *`
- ❌ 使用 `database` 以外的舊名（`knowledge-database`、`knowledge` 已整合至 `page`）
- ❌ 在 notion 模組定義 AI 生成能力（屬 ai）

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/notion/](../../../modules/notion/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
