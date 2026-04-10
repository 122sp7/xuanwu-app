# notion

`notion` 是 Xuanwu 的 Notion-like 知識內容平台，採用 Hexagonal Architecture with Domain-Driven Design 設計。它把目前分散在 `modules/knowledge`、`modules/knowledge-base`、`modules/knowledge-collaboration`、`modules/knowledge-database` 四個獨立模組的能力，收斂為一個具備統一語言、邊界與 port 契約的知識內容 bounded context。

> **Domain Type：** Core Domain（核心域）
> **目前狀態：** 🗂️ Planning — 規劃文件完成，程式碼骨架待填充

## 邊界定位

- 維持 `driving adapters → application → domain ← driven adapters` 的依賴方向
- `domain/` 保持 framework-free，不引入 HTTP、DB SDK、訊息匯流排或 React
- 所有外部輸入先表達成 `ports/input`
- 所有外部依賴先表達成 `ports/output`，再由 `infrastructure/` 實作
- `api/` 是對外 public boundary，只做投影與 re-export
- `index.ts` 只是模組匯出便利入口，不是邊界規格來源

## Hexagonal Mapping

| Hexagonal concept | notion 位置 | 說明 |
|---|---|---|
| Public boundary | `api/` | 跨模組公開契約投影 |
| Driving adapters | `core/adapters/` | web、CLI 等輸入端 |
| Application | `core/application/` | use case orchestration、DTO、command/query 處理 |
| Domain core | `core/domain/` | 聚合、值物件、domain services、domain events |
| Input ports | `core/ports/input/` | 進入 application 的穩定契約 |
| Output ports | `core/ports/output/` | repositories、stores、gateways、sinks |
| Driven adapters | `core/infrastructure/` | 對 output ports 的具體實作 |
| Published language | `core/domain/events/`, `core/application/dtos/` | 事件與穩定 application contracts |

## 模組骨架

```text
modules/notion/
    core/
        adapters/
        application/
        domain/
        infrastructure/
        ports/
    subdomains/
        knowledge/          ← modules/knowledge 遷移目標
        authoring/          ← modules/knowledge-base 遷移目標
        collaboration/      ← modules/knowledge-collaboration 遷移目標
        database/           ← modules/knowledge-database 遷移目標
        knowledge-analytics/
        attachments/
        automation/
        knowledge-integration/
        notes/
        templates/
        knowledge-versioning/
    docs/
    README.md
    AGENT.md
```

## Canonical Subdomain Inventory (11)

- `knowledge` — 核心頁面、區塊、集合（← `modules/knowledge`）
- `authoring` — 組織知識庫文章（← `modules/knowledge-base`）
- `collaboration` — 留言、權限、版本（← `modules/knowledge-collaboration`）
- `database` — 結構化資料庫視圖（← `modules/knowledge-database`）
- `knowledge-analytics` — 知識使用行為量測
- `attachments` — 附件與媒體
- `automation` — 自動化觸發規則
- `knowledge-integration` — 知識與外部系統雙向整合
- `notes` — 個人筆記快取
- `templates` — 頁面範本
- `knowledge-versioning` — 全域版本快照策略管理

> ⚠️ **Code Migration Required**
> - `ai` 子域已從 notion 移除。通用 AI 模型調用能力由 `platform.ai` 提供；notion 子域消費 `platform.ai`，不擁有 `ai` 子域所有權。
>   `subdomains/ai/` 目錄（含 stub 檔案）應予刪除。
> - `subdomains/analytics/` → 已重命名為 `subdomains/knowledge-analytics/`。
> - `subdomains/integration/` → 已重命名為 `subdomains/knowledge-integration/`。
> - `subdomains/versioning/` → 已重命名為 `subdomains/knowledge-versioning/`。

此 inventory 採 closed by default；新增子域前必須先完成文件治理與邊界論證。

## 計畫吸收模組

以下四個現有獨立模組的能力計畫在重構中合并進 notion：

| 獨立模組 | 目標子域 | 現有狀態 | 合并備注 |
|---|---|---|---|
| `modules/knowledge/` | `knowledge` | 🚧 Developing | 核心頁面、區塊、集合；保留 Promote 協議語言 |
| `modules/knowledge-base/` | `authoring` | 🚧 Developing | Article、Category；VerificationState 語言對齊 |
| `modules/knowledge-collaboration/` | `collaboration` | 🚧 Developing | Comment、Permission、Version；PermissionLevel 保持 |
| `modules/knowledge-database/` | `database` | 🚧 Developing | Database、Record、View、Field；D1 決策語言保持 |

**合并優先序：** `knowledge` → `database` → `collaboration` → `authoring`

合并前，notion blueprint 定義語言與 port 契約規範；獨立模組保持現有 API 介面不中斷。合并後，獨立模組的 `api/index.ts` 應指向 `modules/notion/api`，並標記為 deprecated。

詳細語言映射見 [docs/ubiquitous-language.md](./docs/ubiquitous-language.md)，計畫吸收的事件見 [docs/domain-events.md](./docs/domain-events.md)，計畫吸收的倉儲見 [docs/repositories.md](./docs/repositories.md)。

## 文件導覽

- [docs/README.md](./docs/README.md): 文件索引與 Hexagonal DDD 閱讀路徑
- [docs/bounded-context.md](./docs/bounded-context.md): 邊界責任、public boundary 與封板規則
- [docs/subdomains.md](./docs/subdomains.md): 12 子域正式責任表
- [docs/context-map.md](./docs/context-map.md): 子域協作與共享語言
- [docs/ubiquitous-language.md](./docs/ubiquitous-language.md): 通用語言詞彙
- [docs/aggregates.md](./docs/aggregates.md): 核心聚合與不變數
- [docs/domain-services.md](./docs/domain-services.md): 跨聚合純規則
- [docs/application-services.md](./docs/application-services.md): use case orchestration
- [docs/repositories.md](./docs/repositories.md): repositories 與 output ports
- [docs/domain-events.md](./docs/domain-events.md): 事件命名與收發清單
