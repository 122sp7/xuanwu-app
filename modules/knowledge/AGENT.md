# AGENT.md — knowledge BC

## 模組定位

`knowledge` 是 **Core Domain**，負責個人筆記與頁面管理。對應 Notion 的 **Page + Block** 核心體驗。

**這個 BC 負責：**
- Page（頁面內容與層級結構）
- Block（頁面內最小內容單位：文字、標題、清單、程式碼、圖片、待辦事項等）
- Block 巢狀結構、排序、草稿與暫存

**不歸屬這個 BC：**
- 組織級知識庫文章 → `knowledge-base`
- 留言、版本歷史、權限控制 → `knowledge-collaboration`
- 資料庫 / Table / Board / View → `knowledge-database`

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Page` | Document、Note |
| `Block` | Node、Element、Item |
| `BlockType` | ContentType、Type |

> `Article` 為 `knowledge-base` BC 術語。`Database` / `Record` / `View` 為 `knowledge-database` BC 術語。

## 邊界規則

### ✅ 允許
```typescript
import { createPage } from "@/modules/knowledge/api";
```

### ❌ 禁止
```typescript
import { KnowledgeCollection } from "@/modules/knowledge/domain/..."; // 搬去 knowledge-database
import { ContentVersion } from "@/modules/knowledge/domain/...";     // 搬去 knowledge-collaboration
```

## 驗證命令

```bash
npm run lint
npm run build
```
