# Notion Module — Agent Guide

## Purpose

`src/modules/notion` 是 **Notion 知識內容能力蒸餾骨架**，為 Xuanwu 系統提供知識創作（Authoring）、協作（Collaboration）、知識庫（Knowledge / KnowledgeDatabase）、分類法（Taxonomy）等正典知識能力的新實作落點。

**蒸餾來源：** `modules/notion/`  
**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

## 蒸餾子域清單

| 子域 | 說明 | 蒸餾狀態 |
|---|---|---|
| `authoring` | 知識文件創作 / 編輯 | 📋 待蒸餾 |
| `collaboration` | 協作 / 評論 / 共編 | 📋 待蒸餾 |
| `knowledge` | 核心知識物件（KnowledgeArtifact）| 📋 待蒸餾 |
| `knowledge-database` | 知識庫（原 database 子域，已語意化）| 📋 待蒸餾 |
| `relations` | 知識關聯圖 | 📋 待蒸餾 |
| `taxonomy` | 標籤 / 分類法 | 📋 待蒸餾 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- `KnowledgeArtifact` 是 notion 獨有的可寫 Aggregate；其他模組（notebooklm、workspace）只能透過 `modules/notion/api/` 唯讀引用。
- `knowledge-database` 是 `database` 的語意化名稱（已完成重命名）。

## Route Here When

- 撰寫 notion 的新 use case、entity、adapter 實作。
- 實作 knowledge authoring、taxonomy、collaboration 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `modules/notion/AGENT.md`、`modules/notion/api/`
- 跨模組 API boundary → `modules/notion/api/index.ts`
- RAG / 知識檢索 → `modules/notebooklm/`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/notion/AGENT.md`、`modules/notion/api/` |
| 撰寫新 use case / adapter / entity | `src/modules/notion/`（本層）|
| 跨模組 API boundary | `modules/notion/api/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 把 `modules/notion/infrastructure/` 直接搬到 `src/modules/notion/domain/`
- ❌ 讓 notebooklm 或 workspace 直接修改 `KnowledgeArtifact`（只可讀取）
- ❌ 在 barrel 使用 `export *`
- ❌ 使用 `database` 作為子域名（已語意化為 `knowledge-database`）

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/notion/](../../../modules/notion/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
