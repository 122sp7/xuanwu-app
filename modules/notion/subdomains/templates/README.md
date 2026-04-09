# notion/subdomains/templates

## 子域職責

`templates` 子域負責頁面範本的管理與套用：

- 範本（`PageTemplate`）的建立、分類與發布
- 範本套用至新頁面（`TemplateApplication`）的流程
- 範本版本管理與組織內共享

## 核心語言

| 術語 | 說明 |
|---|---|
| `PageTemplate` | 可復用的頁面結構範本（含預設 ContentBlocks） |
| `TemplateApplication` | 將範本套用至新頁面的操作記錄 |
| `TemplateCategory` | 範本的分類標籤（Meeting、SOP、Wiki 等） |
| `TemplateOwner` | 範本的擁有者（個人或組織） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateTemplate`、`ApplyTemplate`、`PublishTemplate`）
- `domain/`: `PageTemplate`、`TemplateApplication`
- `infrastructure/`: Firestore repository 實作
- `interfaces/`: server action 接線 + 範本選擇 UI 元件

## 整合規則

- `ApplyTemplate` 套用後，`knowledge` 子域負責建立實際 `KnowledgePage`
- 組織範本的 `TemplateOwner` 需要 `platform/organization` 的組織 ID 驗證
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
