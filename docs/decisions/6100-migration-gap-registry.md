# 6100 Migration Gap Registry


> ⚠️ **6100 系列為「僅記錄」文件系列 — 不執行實施**
> 所有 6101–6121 文件的唯一目的是記錄遷移缺口與新增能力，作為未來蒸餾工作的基線參考。
> **任何 agent 或開發者不得依據這些文件直接修改任何程式碼。**

- Status: ⛔ 僅記錄系列 — 不實施（Record Only — Do Not Implement）
- Date: 2026-04-17
- Category: Migration Gap Registry

## Context

在 `modules/` → `src/modules/` 蒸餾過程中，以舊技能快照（`xuanwu-app-skill`）對比現行技能快照（`xuanwu-skill`）後，發現大量實作內容未被帶入新路徑。

6100 系列 ADR 的目的是**僅記錄缺口，不實施修復**。每份文件對應一個獨立的遷移缺口或新增能力，讓後續蒸餾工作有明確的參考基線。

## 缺口總覽

### 損失統計（舊 → 新）

| 模組 | 舊 skill 行數 | 新 skill 行數 | 損失行數 | 損失率 |
|---|---|---|---|---|
| notebooklm | 4,563 | 510 | 4,053 | 88% |
| notion | 5,728 | 682 | 5,046 | 88% |
| platform | 6,074 | 1,854 | 4,220 | 69% |
| workspace | 8,750 | 2,869 | 5,881 | 67% |
| ai | 2,093 | 958 | 1,135 | 54% |
| iam | 3,232 | 2,676 | 556 | 17% |
| packages | 1,751 | 1,140 | 611 | 35% |

**iam 是唯一蒸餾接近完整（損失 17%）的模組。**

### 缺口文件索引（LOST — 舊有但新技能缺失）

| ADR | 缺口描述 |
|---|---|
| [6101](./6101-lost-notebooklm-source-subdomain.md) | notebooklm `source` 子域：10 個 use case、8 個 domain ports、6 個 DTOs |
| [6102](./6102-lost-notebooklm-synthesis-subdomain.md) | notebooklm `synthesis` 子域：RAG domain entities、VectorStore port、CitationBuilder |
| [6103](./6103-lost-notebooklm-interfaces-layer.md) | notebooklm interfaces 層：ConversationPanel、SourceDocumentsPanel、Server Actions、hooks |
| [6104](./6104-lost-notion-authoring-subdomain.md) | notion `authoring` 子域：Article/Category aggregates + events + repos + UI panels |
| [6105](./6105-lost-notion-knowledge-database-subdomain.md) | notion `knowledge-database` 子域：Database/View/Automation aggregates + UI panels |
| [6106](./6106-lost-notion-knowledge-subdomain.md) | notion `knowledge` 子域：KnowledgePage aggregate + BlockEditorPanel + Zustand store |
| [6107](./6107-lost-platform-domain-model.md) | platform domain model：4 aggregates、20+ output ports、25+ value objects、9 domain services |
| [6108](./6108-lost-platform-api-contracts.md) | platform API contracts：contracts.ts (218 lines)、infrastructure-api.ts、service-api.ts |
| [6109](./6109-lost-workspace-interfaces-layer.md) | workspace interfaces 層：screens、tabs、dialogs、facades、hooks |
| [6110](./6110-lost-ai-prompt-pipeline-subdomain.md) | ai `prompt-pipeline` 子域：PromptTemplate domain (224 lines) + pipeline use cases (104 lines) |
| [6111](./6111-lost-ai-missing-subdomains.md) | ai 5 個缺失子域：conversations、datasets、personas、safety-guardrail、model-observability |
| [6112](./6112-lost-ai-governance-docs.md) | ai `subdomains.instructions.md`（313 lines governance spec）已刪除無替代 |
| [6113](./6113-lost-packages.md) | 消失 packages：ui-vis (205 lines)、shared-events (139 lines)、shared-types (107 lines) 等 20 個 |
| [6114](./6114-lost-docs-semantic-model.md) | docs/semantic-model.md（344 lines 跨域語意模型）已刪除 |
| [6115](./6115-lost-docs-discussions.md) | docs/discussions/ 8 份架構設計討論文件（~1,300 lines）已刪除 |

### 新增文件索引（GAINED — 新技能有但舊技能沒有）

| ADR | 新增描述 |
|---|---|
| [6116](./6116-gained-shell-ui-components.md) | Shell UI 元件：ShellRootLayout、ShellAppRail、AccountSwitcher、ShellGuard 等 13 個 |
| [6117](./6117-gained-packages-ui-shadcn.md) | packages/ui-shadcn：70+ shadcn/ui 元件 |
| [6118](./6118-gained-modules-template.md) | src/modules/template：新模組骨架模板 |
| [6119](./6119-gained-workspace-new-subdomains.md) | workspace 新子域：activity、api-key、invitation、resource、schedule |
| [6120](./6120-gained-platform-new-subdomains.md) | platform 新子域：cache、file-storage |
| [6121](./6121-gained-ai-restructured-subdomains.md) | ai 重組後子域：chunk、citation、context、embedding、evaluation、generation、memory、pipeline、retrieval、tool-calling |

## Decision

**不實施**，僅記錄缺口供後續蒸餾規劃使用。

每份子文件的 Status 為 `Recorded — Pending Implementation`，直到對應缺口被補回才更改為 `Resolved`。

## Consequences

- 後續每次蒸餾工作可查閱此索引，確認缺口是否已覆蓋。
- 修復某缺口後，對應文件的 Status 更新為 `Resolved`，並加入 Resolution 段落。
- `xuanwu-app-skill` 快照在對應文件被 Resolved 之前仍是唯一的參考來源。
