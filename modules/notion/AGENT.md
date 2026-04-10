# AGENT.md — notion

本文件提供代理人（Copilot / AI agent）在 `modules/notion/` 工作時的背景知識、邊界規則與決策路徑。

## 模組定位

`notion` 是 Xuanwu 的 **Core Domain**，對應 Notion-like 知識內容平台的核心能力。它整合頁面編輯、區塊管理、結構化資料庫、文章知識庫、協作留言與版本歷史，為整個 Knowledge Platform / Second Brain 提供知識內容語言的唯一真相來源。

## 計畫吸收模組（Migration-Pending Modules）

以下四個獨立模組**計畫重構進 notion**。代理人在這些子域工作時，應把 notion blueprint 的語言定義視為目標規範，獨立模組的現有實作視為前身實作。

| 獨立模組 | 目標子域 | 術語映射重點 |
|---|---|---|
| `modules/knowledge/` | `knowledge` | `KnowledgePage` 保持；`ContentBlock` 保持；`KnowledgeCollection` 保持；`CollectionSpaceType` 保持 |
| `modules/knowledge-base/` | `authoring` | `Article` 保持；`Category` 保持；`VerificationState` 保持；`Promote 協議` 保持 |
| `modules/knowledge-collaboration/` | `collaboration` | `Comment` 保持；`Permission` / `PermissionLevel` 保持；`Version` / `NamedVersion` 保持；`contentId` opaque reference 保持 |
| `modules/knowledge-database/` | `database` | `Database` 保持；`Field` 保持（≠ Column）；`Record` 保持（≠ Row）；`View` 保持；`D1 決策` 保持 |

**合并優先序：** `knowledge` → `database` → `collaboration` → `authoring`

**代理人注意事項：**
- 合并前不要把獨立模組的術語直接搬進 notion domain；先確認與 notion 語言的映射
- 合并完成後，獨立模組的 `api/index.ts` 應重新 export 自 `modules/notion/api`，模組本身標記 deprecated
- 若跨獨立模組與 notion 之間有協作需求，仍須透過 `modules/notion/api` 公開邊界，不得直接依賴對方 domain/application 層

## 重要架構決策

### D1：knowledge-database 擁有 spaceType="database" 的完整 Schema + Record + View

`knowledge` 的 `KnowledgeCollection` 在 `spaceType="database"` 時，只保留 opaque ID，不擁有 Database 結構化欄位。合并進 notion 後，此決策語意由 `notion/subdomains/database` 接管，`knowledge` 子域維持只持有集合識別。

### D2：歸檔頁面時子頁面級聯歸檔

歸檔父頁面時，所有子頁面同步歸檔，可恢復。`knowledge.page_archived` 事件帶 `childPageIds`。

### D3：Page → Article 提升（Promote 協議）

`knowledge-base` 是 Promote 協議的業務規則擁有者。合并後，`authoring` 子域接管。`knowledge` 子域負責頁面驗證並發出 `notion.page_promoted`（合并後事件命名調整），`authoring` 子域訂閱後建立 Article。

## Hexagonal 邊界規則

- `core/domain/` 必須 framework-free
- 跨子域的協作只能透過 `core/domain/events/` 發布的事件或 `api/` 公開邊界
- `subdomains/<name>/` 裡的能力只能透過該子域的 `index.ts` 或 `api/` 暴露給外部
- 嚴禁直接 import `subdomains/<a>/domain/` 到 `subdomains/<b>/`

## Canonical Subdomain Inventory

### 核心內容

| 子域 | 核心問題 | 來源模組 |
|---|---|---|
| `knowledge` | 頁面如何被建立、編輯、版本化與交付 | `modules/knowledge/` |
| `authoring` | 知識庫文章如何被建立、驗證與分類 | `modules/knowledge-base/` |
| `collaboration` | 如何協作留言、管理細粒度權限與版本快照 | `modules/knowledge-collaboration/` |
| `database` | 結構化資料如何以多視圖管理 | `modules/knowledge-database/` |

### 擴展能力

| 子域 | 核心問題 |
|---|---|
| `knowledge-analytics` | 知識使用行為如何被量測 |
| `attachments` | 附件與媒體如何被關聯與儲存 |
| `automation` | 哪些知識事件應觸發自動化動作 |
| `knowledge-integration` | 知識如何與外部系統雙向整合 |
| `notes` | 個人輕量筆記如何與正式知識協作 |
| `templates` | 頁面範本如何被管理與套用 |
| `knowledge-versioning` | 版本快照策略如何在全域層級被管理 |

> ⚠️ **Code Migration Required**
> - `ai` 子域已從 notion 移除。通用 AI 能力由 `platform.ai` 提供；notion 消費，不擁有。
>   `subdomains/ai/` 目錄（stubs）應予刪除。
> - `subdomains/analytics/` → 已重命名為 `subdomains/knowledge-analytics/`。
> - `subdomains/integration/` → 已重命名為 `subdomains/knowledge-integration/`。
> - `subdomains/versioning/` → 已重命名為 `subdomains/knowledge-versioning/`。

## 邊界測試問題

1. 這個變更屬於哪個既有子域
2. 它需要的是新語言、既有語言的細化，還是新的 port contract
3. 它是 domain rule、application orchestration、adapter concern，還是 public boundary projection
4. 它是否會破壞 closed inventory 或 dependency direction
5. 若涉及四個計畫吸收模組，是否與合并方向一致

若第 1 題答不出來，表示 notion 邊界尚未被正確理解。

## 主要文件入口

| 文件 | 用途 |
|---|---|
| [README.md](./README.md) | 模組概覽與合并計畫 |
| [docs/bounded-context.md](./docs/bounded-context.md) | 邊界定義與封板規則 |
| [docs/subdomains.md](./docs/subdomains.md) | 11 子域清單 |
| [docs/context-map.md](./docs/context-map.md) | 與外部 BC 的協作關係 |
| [docs/ubiquitous-language.md](./docs/ubiquitous-language.md) | 術語定義 |
| [docs/aggregates.md](./docs/aggregates.md) | 聚合根設計 |
| [docs/domain-events.md](./docs/domain-events.md) | 事件清單 |
| [docs/repositories.md](./docs/repositories.md) | Port 契約 |
| [docs/application-services.md](./docs/application-services.md) | Use cases |
| [docs/domain-services.md](./docs/domain-services.md) | Domain services |
