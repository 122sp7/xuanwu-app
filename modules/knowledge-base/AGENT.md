# AGENT.md — knowledge-base BC

## 模組定位

`knowledge-base` 是 **Core Domain**，負責組織級知識管理，對應 Notion 的 **Wiki / Knowledge Base** 功能。管理公司或團隊的知識文章（Article）與分類（Category）。

**這個 BC 負責：**
- Article（知識文章）的建立、編輯、審批、歸檔
- Category（分類目錄）的層級管理
- 知識文章的 Backlink、標籤（Tag）、版本管理
- SOP 流程文件、共享知識參考手冊
- 頁面驗證狀態（verified / needs_review）與頁面負責人（Owner）

**不歸屬這個 BC：**
- 個人筆記（Page + Block） → `knowledge`
- 留言與協作 → `knowledge-collaboration`
- 表格 / 資料庫 View → `knowledge-database`

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Article` | Page、Document（在此 BC 中） |
| `Category` | Folder、Tag（作為分類時） |
| `ArticleStatus` | Status |
| `VerificationState` | State |
| `ArticleOwner` | Owner |

## 邊界規則

### ✅ 允許
```typescript
import { createArticle } from "@/modules/knowledge-base/api";
```

### ❌ 禁止
```typescript
import anything from "@/modules/knowledge-base/domain/..."; // 走 api/ 邊界
```

## 驗證命令

```bash
npm run lint
npm run build
```
