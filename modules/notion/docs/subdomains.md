# Subdomains — notion

本文件是 notion 的正式子域 inventory。這份清單是 **closed by default** 的：後續開發必須先把能力映射到既有子域，而不是再新增新的子域名稱。

## Subdomain Rule in Hexagonal DDD

- 每個子域描述的是知識內容核心能力，不是資料夾便利分類
- `來源模組` 欄位記錄計畫合并的前身獨立模組（若有）
- 子域之間共享語言時，應先落地到 `ubiquitous-language.md`、`context-map.md` 與相關 ports 文件

## Canonical Inventory

| 子域 | 核心問題 | 主要語言 | 來源模組 |
|---|---|---|---|
| `knowledge` | 頁面如何被建立、組織、版本化與交付 | `KnowledgePage`, `ContentBlock`, `ContentVersion`, `KnowledgeCollection` | `modules/knowledge/` |
| `authoring` | 組織知識庫文章如何被建立、驗證與分類 | `Article`, `Category`, `VerificationState`, `ArticleOwner`, `Backlink` | `modules/knowledge-base/` |
| `collaboration` | 如何協作留言、管理細粒度權限與版本快照 | `Comment`, `Permission`, `PermissionLevel`, `Version`, `NamedVersion` | `modules/knowledge-collaboration/` |
| `database` | 結構化資料如何以多視圖管理 | `Database`, `Field`, `Record`, `Property`, `View`, `ViewType` | `modules/knowledge-database/` |
| `knowledge-analytics` | 知識使用行為如何被量測 | `PageViewEvent`, `KnowledgeMetric` | — |
| `attachments` | 附件與媒體如何被關聯與儲存 | `Attachment`, `MediaRef` | — |
| `automation` | 哪些知識事件應觸發自動化動作 | `AutomationRule`, `TriggerCondition` | — |
| `knowledge-integration` | 知識如何與外部系統雙向整合 | `IntegrationSource`, `SyncPolicy` | — |
| `notes` | 個人輕量筆記如何與正式知識協作 | `Note`, `NoteRef` | — |
| `templates` | 頁面範本如何被管理與套用 | `PageTemplate`, `TemplateApplication` | — |
| `knowledge-versioning` | 全域版本快照策略如何被管理 | `VersionPolicy`, `RetentionRule` | — |

> ⚠️ **Code Migration Required**
> - `ai` 子域已從 notion 移除。`platform.ai` 提供通用 AI 能力；notion 消費，不擁有。
>   `subdomains/ai/` 目錄（目前含 stub `.gitkeep` 檔）應予刪除。
> - `subdomains/analytics/` → 已重命名為 `subdomains/knowledge-analytics/`。
> - `subdomains/integration/` → 已重命名為 `subdomains/knowledge-integration/`。
> - `subdomains/versioning/` → 已重命名為 `subdomains/knowledge-versioning/`。

## Capability Groups

### 核心知識內容

- `knowledge` ← `modules/knowledge/`
- `authoring` ← `modules/knowledge-base/`

### 結構化與協作

- `database` ← `modules/knowledge-database/`
- `collaboration` ← `modules/knowledge-collaboration/`

### AI 與分析

- `knowledge-analytics`

### 內容豐富與自動化

- `attachments`
- `automation`
- `templates`

### 整合與個人

- `knowledge-integration`
- `notes`
- `knowledge-versioning`

## Migration-Pending Subdomains

以下四個子域目前在 repository 中存在對應的**獨立模組**。這些獨立模組是子域的**前身實作**，計畫在未來重構中合并進 notion。

| 子域 | 對應獨立模組 | 合并方向說明 |
|---|---|---|
| `knowledge` | `modules/knowledge/` | `KnowledgePage`, `ContentBlock`, `ContentVersion`, `KnowledgeCollection` → 吸收進 `knowledge` 子域；D1/D2/D3 決策語言保持 |
| `authoring` | `modules/knowledge-base/` | `Article`, `Category`, `VerificationState`, `Backlink`, `Promote 協議` → 吸收進 `authoring` 子域 |
| `collaboration` | `modules/knowledge-collaboration/` | `Comment`, `Permission`, `Version`, `NamedVersion` → 吸收進 `collaboration` 子域 |
| `database` | `modules/knowledge-database/` | `Database`, `Field`, `Record`, `View`, `ViewType` → 吸收進 `database` 子域；D1 決策完整由此子域擁有 |

**重構規則：** 合并前，notion 的語言、port 契約與事件命名以本 blueprint 文件為準；合并後，獨立模組應廢棄並指向 `modules/notion/`。

## Inventory Freeze Rule

後續若有人想新增 notion 子域，必須先證明以下三件事都成立：

1. 既有 11 個子域沒有任何一個能吸收該能力
2. 新能力需要獨立的語言、port 焦點與責任邊界
3. `README.md`、`bounded-context.md`、`context-map.md`、本文件都已先被更新

若無法同時滿足這三件事，預設不允許新增子域。
