# AGENT.md — knowledge BC

## 模組定位

`knowledge` 是 **Core Domain**，負責個人筆記與頁面管理。對應 Notion 的 **Page + Block** 核心體驗。

目前程式已落地的主軸是：
- Page tree / child page / archive / move / rename
- Block CRUD 與極簡編輯器
- approval / verification / owner assignment 的部分 page metadata
- `KnowledgeCollection` 過渡能力仍留在本模組

**這個 BC 負責：**
- Page（頁面內容與層級結構）
- Block（頁面內最小內容單位：文字、標題、清單、程式碼、圖片、待辦事項等）
- Block 排序、草稿與暫存
- Page approval / verification / owner metadata
- `KnowledgeCollection` 過渡能力：把 Page 聚成 database/wiki space

**不歸屬這個 BC：**
- 組織級知識庫文章 → `knowledge-base`
- 留言、版本歷史、權限控制 → `knowledge-collaboration`
- 資料庫 / Table / Board / View → `knowledge-database`

**邊界提醒：**
- `knowledge-base` 擁有 `Article`、`Category`
- `knowledge-collaboration` 擁有 `Comment`、`Permission`、`Version`
- `knowledge-database` 是 `Database / Record / View` 的最終歸屬；`KnowledgeCollection` 是目前仍在 `knowledge` 內的過渡實作

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Page` | Document、Note |
| `Block` | Node、Element、Item |
| `BlockType` | ContentType、Type |
| `KnowledgeCollection` | Database（跨 BC 定義時） |

> `Article` 為 `knowledge-base` BC 術語。`Database` / `Record` / `View` 為 `knowledge-database` BC 術語。若程式碼內看到 `KnowledgeCollection`，應視為本模組尚未完成抽離的過渡面。

## 邊界規則

### ✅ 允許
```typescript
import { createKnowledgePage } from "@/modules/knowledge/api";
```

### ❌ 禁止
```typescript
import { KnowledgeCollection } from "@/modules/knowledge/domain/..."; // 搬去 knowledge-database
import { ContentVersion } from "@/modules/knowledge/domain/...";     // 搬去 knowledge-collaboration
```

### 實作入口

- Public boundary: `modules/knowledge/index.ts`、`modules/knowledge/api/index.ts`
- Write-side: `interfaces/_actions/knowledge.actions.ts`
- Read-side: `interfaces/queries/knowledge.queries.ts`
- Minimal editor state: `interfaces/store/block-editor.store.ts`（Zustand）

## 驗證命令

```bash
npm run lint
npm run build
```
