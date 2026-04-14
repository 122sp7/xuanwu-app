# Semantic Model — Domains & Subdomains

> **Authority**: This document is derived from `docs/bounded-contexts.md`, `docs/subdomains.md`,
> `docs/ubiquitous-language.md`, and live code inspection of `modules/`. It records the canonical
> semantic name for every main domain and every implemented or planned subdomain, together with
> a mapping table that aligns folder names, strategic document names, and the most business-expressive
> alternative label where the current folder name is under-descriptive.
>
> **Status key**
> - ✅ Implemented — directory present in `modules/` and linked to application code
> - 📋 Planned — declared in strategic docs as baseline or gap subdomain; not yet implemented
> - ⚠️ Name-drift — folder exists but name diverges from strategic language; canonical name listed in _Semantic Name_ column

---

## 1. Main Domain Semantic Map

| Folder Name | Semantic Name | Strategic Role | Upstream | Key Published-Language Tokens |
|---|---|---|---|---|
| `iam` | **Identity & Access Management** | 身份、租戶、存取治理上游 | — | `actor reference`, `tenant scope`, `access decision` |
| `billing` | **Billing & Entitlement** | 商業權益上游 | iam | `entitlement signal`, `subscription capability signal` |
| `ai` | **Shared AI Capability** | 共享 AI orchestration 上游 | iam, billing | `ai capability signal`, `model policy`, `safety result` |
| `analytics` | **Analytics & Read-Model** | 分析下游 sink | all domains (event producers) | `metric`, `projection`, `report` |
| `platform` | **Platform Operational Services** | 平台帳號、組織、運維支撐 | iam, billing | `account scope`, `organization surface`, `operational service signal` |
| `workspace` | **Collaboration Workspace** | 協作容器與工作區範疇 | platform, iam, billing | `workspaceId`, `membership scope`, `share scope` |
| `notion` | **Canonical Knowledge Content** | 正典知識內容生命週期 | workspace, ai | `knowledge artifact reference`, `taxonomy hint`, `attachment reference` |
| `notebooklm` | **Conversational Reasoning & Synthesis** | 對話、來源處理與推理輸出 | workspace, notion, ai | `notebook reference`, `grounding evidence`, `synthesis output` |

---

## 2. Subdomain Semantic Map

### 2.1 `iam` — Identity & Access Management

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `identity` | **Identity Governance** | 主體身份治理 | ✅ | 已驗證主體、身份信號 |
| `authentication` | **Authentication** | 身份驗證 | ✅ | 驗證流程與憑證校驗 |
| `authorization` | **Authorization** | 授權判定 | ✅ | policy 執行與存取判定 |
| `access-control` | **Access Control** | 存取控制 | ✅ | RBAC/ABAC rule 管理 |
| `session` | **Session Lifecycle** | Session 生命週期 | ✅ | token、refresh、失效治理 |
| `tenant` | **Tenant Isolation** | 多租戶隔離 | ✅ | tenant-scoped 規則治理 |
| `security-policy` | **Security Policy** | 安全政策治理 | ✅ | 規則定義、版本化、發佈 |
| `federation` | **Identity Federation** | 聯合身份 | ✅ | OAuth / OIDC / SSO 整合 |
| `consent` | **Consent & Data Authorization** | 同意與資料授權 | 📋 Gap | 切開 compliance 的同意治理 |
| `secret-governance` | **Secret Governance** | 機密治理 | 📋 Gap | credential / rotation / access policy |

### 2.2 `billing` — Billing & Entitlement

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `subscription` | **Subscription Management** | 訂閱管理 | ✅ | 方案、配額、續期治理 |
| `entitlement` | **Entitlement Resolution** | 權益解算 | ✅ | 有效功能可用性統一解算 |
| `billing` | **Billing Ledger** | 帳務帳本 | 📋 Baseline | 計費狀態、費率與財務證據 |
| `referral` | **Referral & Reward** | 推薦與獎勵 | 📋 Baseline | 推薦關係追蹤 |
| `pricing` | **Pricing Policy** | 定價政策 | 📋 Gap | 價格模型與方案矩陣 |
| `invoice` | **Invoice & Settlement** | 發票與對帳 | 📋 Gap | 帳單、請款、對帳 |
| `quota-policy` | **Quota Policy** | 配額政策 | 📋 Gap | 可量化商業限制規則 |

### 2.3 `ai` — Shared AI Capability

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `prompt-pipeline` | **Prompt & Flow Pipeline** | 提示與流程管線 | ✅ | 單一 AI 能力邊界，容納多個 prompt families、template variants 與 flow orchestration；不因模板變多而改成 plural folder |
| `safety-guardrail` | **Safety Guardrail** | 安全護欄 | ✅ | 內容保護與限制 |
| `evaluation-policy` | **Evaluation Policy** | 評估政策 | ✅ | AI 品質與回歸評估政策 |
| `model-observability` | **Model Observability** | 模型可觀測性 | ✅ | 使用量、成本、效能監測 |
| `content-distillation` | **Content Distillation** | 內容蒸餾 | ✅ | AI 驅動的內容摘要與提煉 |
| `content-generation` | **Content Generation** | 內容生成 | ✅ | AI 驅動的文本生成 |
| `context-assembly` | **Context Assembly** | 上下文組裝 | ✅ | 為 AI 推理組裝 context window |
| `memory-context` | **Memory Context** | 記憶上下文 | ✅ | 跨對話記憶與持久化 context |
| `provider-routing` | **Provider Routing** | 供應商路由 | 📋 Baseline | 模型供應商選擇與路由 |
| `model-policy` | **Model Policy** | 模型政策 | 📋 Baseline | 模型版本、能力與使用政策 |

### 2.4 `analytics` — Analytics & Read-Model

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `metrics` | **Metrics Aggregation** | 指標聚合 | ✅ | 指標定義與聚合 |
| `event-ingestion` | **Event Ingestion** | 事件擷取 | ✅ | analytics 事件接收管線 |
| `event-projection` | **Event Projection** ✅ | 事件投影 | ✅ | 事件轉換與 read model 投影；已從 `event-processing` 改名為 `event-projection`（DDD projection 術語） |
| `event-contracts` | **Analytics Event Contracts** | 事件契約 | ✅ | 跨域事件 schema 定義 |
| `insights` | **Insights** | 洞察輸出 | ✅ | 批次/歷史分析結果輸出 |
| `realtime-insights` | **Realtime Insights** | 即時洞察 | ✅ | 串流/即時資料流分析 |
| `reporting` | **Reporting** | 報表輸出 | 📋 Baseline | 報表查詢整理 |
| `dashboards` | **Dashboards** | 儀表板 | 📋 Baseline | 儀表板呈現語義 |
| `telemetry-projection` | **Telemetry Projection** | 遙測投影 | 📋 Baseline | 事件投影與 read model 匯總 |
| `experimentation` | **Experimentation** | 實驗分析 | 📋 Gap | 實驗分析與對照觀測 |
| `decision-support` | **Decision Support** | 決策輔助 | 📋 Gap | 決策輔助與洞察輸出 |

### 2.5 `platform` — Platform Operational Services

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `account` | **Account Lifecycle** | 帳號生命週期 | ✅ | 帳號聚合根與生命週期 |
| `account-profile` | **Account Profile** | 帳號屬性設定 | ✅ | 主體屬性、偏好與治理設定 |
| `organization` | **Organization Management** | 組織管理 | ✅ | 組織、成員與角色邊界 |
| `team` | **Team Management** | 團隊管理 | ✅ | Organization 內部成員分組 |
| `notification` | **Notification Routing & Preferences** | 通知路由與偏好 | ✅ | 通知投遞、偏好、工作區訂閱（合併後唯一擁有者） |
| `platform-config` | **Platform Configuration** | 平台設定管理 | ✅ | 設定輪廓與配置管理 |
| `background-job` | **Background Job Management** | 背景任務管理 | ✅ | 任務提交、排程與監控 |
| `search` | **Cross-Domain Search** | 跨域搜尋 | ✅ | 搜尋路由與查詢協調 |
| `observability` | **Platform Observability** | 平台可觀測性 | ✅ | 健康量測、追蹤與告警 |
| `feature-flag` | **Feature Flag** | 功能開關 | 📋 Baseline | 功能開關策略與發佈節點 |
| `onboarding` | **Onboarding** | 新主體引導 | 📋 Baseline | 初始設定與引導流程 |
| `compliance` | **Compliance** | 合規治理 | 📋 Baseline | 資料保留、稽核與法規執行 |
| `integration` | **External Integration** | 外部整合 | 📋 Baseline | 外部系統整合邊界 |
| `workflow` | **Platform Workflow** | 平台流程編排 | 📋 Baseline | 平台級狀態驅動執行（≠ workspace-workflow） |
| `content` | **Platform Content Assets** | 平台內容資產 | 📋 Baseline | 平台級內容資產管理與發布 |
| `audit-log` | **Audit Log** | 永久稽核軌跡 | 📋 Baseline | 不可否認稽核證據 |
| `support` | **Support & Ticketing** | 客服工單 | 📋 Baseline | 工單、知識與處理流程 |
| `consent` | **Consent Management** | 同意管理 | 📋 Gap | 從 compliance 切開的同意授權 |
| `secret-management` | **Secret Management** | 機密管理 | 📋 Gap | 從 integration 切開的憑證 rotation |
| `operational-catalog` | **Operational Catalog** | 運維資產目錄 | 📋 Gap | 平台營運資產與配置字典 |

### 2.6 `workspace` — Collaboration Workspace

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `audit` | **Workspace Audit Trail** | 工作區稽核軌跡 | ✅ | 操作稽核與證據追蹤 |
| `feed` | **Activity Feed** | 活動摘要流 | ✅ | 工作區活動摘要與事件流呈現 |
| `lifecycle` | **Workspace Lifecycle** | 工作區生命週期 | ✅ | 建立、封存、復原（已從 gap 升為 implemented） |
| `membership` | **Workspace Membership** | 工作區參與關係 | ✅ | 角色、加入、移除（已從 gap 升為 implemented） |
| `scheduling` | **Workspace Scheduling** | 工作區排程協調 | ✅ | 排程、時序與提醒協調 |
| `sharing` | **Workspace Sharing** | 工作區共享範圍 | ✅ | 共享範圍與可見性規則（已從 gap 升為 implemented） |
| `workspace-workflow` | **Workspace Workflow** | 工作區流程執行 | ✅ | 流程編排與執行治理（≠ platform/workflow） |
| `presence` | **Collaborative Presence** | 協作存在感 | 📋 Gap | 即時共同編輯訊號 |

### 2.7 `notion` — Canonical Knowledge Content

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `knowledge` | **Knowledge Page Lifecycle** | 知識頁面生命週期 | ✅ | 頁面建立、組織、版本化與交付 |
| `authoring` | **Knowledge Authoring** | 知識撰寫 | ✅ | 文章建立、驗證與分類 |
| `collaboration` | **Knowledge Collaboration** | 知識協作 | ✅ | 協作留言、細粒度權限、版本快照 |
| `knowledge-database` | **Structured Knowledge Database** ✅ | 結構化知識資料庫 | ✅ | 結構化資料多視圖管理；已從 `database` 改名為 `knowledge-database`（移除技術術語） |
| `taxonomy` | **Knowledge Taxonomy** | 知識分類法 | ✅ | 分類法與語義組織（已從 gap 升為 implemented） |
| `relations` | **Knowledge Relations** | 知識關聯 | ✅ | 內容關聯與 backlink（已從 gap 升為 implemented） |
| `knowledge-analytics` | **Knowledge Engagement Analytics** ⚠️ | 知識使用行為量測 | 📋 Baseline | 與 analytics domain 語意重疊；建議改名為 `knowledge-engagement` |
| `attachments` | **Knowledge Attachments** | 知識附件 | 📋 Baseline | 附件與媒體關聯儲存 |
| `automation` | **Knowledge Automation** | 知識自動化 | 📋 Baseline | 知識事件觸發自動化 |
| `knowledge-integration` | **External Knowledge Sync** ⚠️ | 知識外部整合 | 📋 Baseline | 與 platform/integration 語意重疊；建議改名為 `external-knowledge-sync` |
| `notes` | **Personal Notes** | 個人筆記 | 📋 Baseline | 個人輕量筆記 |
| `templates` | **Knowledge Templates** | 知識範本 | 📋 Baseline | 頁面範本管理 |
| `knowledge-versioning` | **Knowledge Version Snapshot** | 知識版本快照 | 📋 Baseline | 保留 domain prefix 以防與 notebooklm conversation-versioning 混名 |
| `publishing` | **Knowledge Publishing** | 知識正式發布 | 📋 Gap | 正式發布與對外交付 |

### 2.8 `notebooklm` — Conversational Reasoning & Synthesis

| Folder Name | Semantic Name | Chinese Label | Status | Notes |
|---|---|---|---|---|
| `conversation` | **Conversation Thread** | 對話執行緒 | ✅ | Thread 與 Message 生命週期 |
| `notebook` | **Notebook Management** | Notebook 管理 | ✅ | Notebook 組合與管理 |
| `source` | **Source Document Tracking** | 來源文件追蹤 | ✅ | 來源引用、擷取、parse/index 編排 |
| `synthesis` | **RAG Synthesis** | RAG 合成 | ✅ | RAG 合成、摘要與洞察生成 |
| `note` | **Ephemeral Note** | 輕量筆記 | 📋 Baseline | 輕量筆記與知識連結 |
| `conversation-versioning` | **Conversation Version Snapshot** | 對話版本快照 | 📋 Baseline | 保留 domain prefix 以防與 notion knowledge-versioning 混名 |
| `ingestion` | **Source Ingestion Pipeline** | 來源擷取管線 | 📋 Gap | 匯入、正規化、前處理 |
| `retrieval` | **Semantic Retrieval** | 語意召回 | 📋 Gap | 查詢召回與排序策略 |
| `grounding` | **Grounding & Citation** | 引用接地 | 📋 Gap | 引用對齊與可追溯證據 |
| `evaluation` | **Synthesis Evaluation** | 合成品質評估 | 📋 Gap | 品質評估與回歸比較 |

---

## 3. Naming Drift & Disambiguation Map

下表列出所有需要特別注意的命名衝突、重疊或語意漂移，以及建議的解決方向。

| Current Name | Drift Type | Canonical Semantic Name | Disambiguation Rule |
|---|---|---|---|
| `notion/knowledge-database` ✅ | ~~技術術語遮蔽業務語意~~ | **Knowledge Database** | ✅ 已完成：`database` → `knowledge-database`（2026-04-15） |
| `analytics/event-projection` ✅ | ~~技術動詞遮蔽 DDD projection 語意~~ | **Event Projection** | ✅ 已完成：`event-processing` → `event-projection`（2026-04-15） |
| `platform/background-job` 資料夾 ✅ vs 原內部實體名稱 | ~~資料夾語意（通用）與實體語意（攝取特定）不一致~~ | **Background Job Management** (folder) | ✅ 已完成：實體已通用化 `IngestionJob` → `BackgroundJob`、`IngestionDocument` → `JobDocument`、`IngestionChunk` → `JobChunk`（2026-04-15） |
| `notion/knowledge-analytics` | 與 `analytics` domain 語意重疊 | **Knowledge Engagement** | analytics domain 擁有指標、投影與報表；notion 此子域只量測知識頁面使用行為，建議改名為 `knowledge-engagement` |
| `notion/knowledge-integration` | 與 `platform/integration` 語意重疊 | **External Knowledge Sync** | platform integration 擁有外部系統整合契約；notion 此子域只做知識雙向同步，建議改名為 `external-knowledge-sync` |
| `platform/workflow` | 與 `workspace/workspace-workflow` 語意重疊 | **Platform Workflow** | platform 只擁有平台級狀態驅動執行；workspace 使用 `workspace-workflow` 作為正典名稱，兩者不得互換；建立時應以 `platform-workflow` 命名 |
| `notion/knowledge-versioning` vs `notebooklm/conversation-versioning` | 同語意前綴、不同主域 | 各自保留完整名稱 | 兩者都應保留 domain prefix（`knowledge-` / `conversation-`）以防跨域混名 |
| `ai/content-distillation` vs `notebooklm/synthesis` | 跨主域語意可能重疊 | **Content Distillation** (ai) / **RAG Synthesis** (notebooklm) | `content-distillation` 屬 ai domain（共享 AI 能力）；`synthesis` 屬 notebooklm（消費者，RAG 推理輸出），層級不同 |
| `ai/prompt-pipeline` vs `prompts-pipelines` | 單複數命名誤導 | **Prompt & Flow Pipeline** | 子域命名應表達能力邊界而非模板數量；多個 prompts / variants 仍屬同一 prompt orchestration capability |
| `analytics/insights` vs `analytics/realtime-insights` | 重複語意前綴 | **Insights** (批次) / **Realtime Insights** (串流) | `insights` 為批次/歷史洞察；`realtime-insights` 為串流/即時洞察，時效性是唯一區分軸 |
| `platform/notification` (merged) | 曾有 workspace 重複宣稱 | **Notification Routing & Preferences** | workspace/subdomains/notification 已刪除並合併至 platform；所有 workspace notification 能力由 platform notification 統一擁有 |
| `iam/authorization` vs `iam/access-control` | 同一主域內語意重疊 | **Authorization** (execution) / **Access Control** (management) | `authorization` 負責執行時的存取判定；`access-control` 負責管理 RBAC/ABAC 規則與政策集合 |

---

## 4. Status Summary

| Main Domain | Implemented ✅ | Planned Baseline 📋 | Planned Gap 📋 |
|---|---|---|---|
| `iam` | 8 | 0 | 2 |
| `billing` | 2 | 2 | 3 |
| `ai` | 8 | 2 | 0 |
| `analytics` | 6 | 3 | 2 |
| `platform` | 9 | 8 | 3 |
| `workspace` | 7 | 0 | 1 |
| `notion` | 6 | 6 | 1 |
| `notebooklm` | 4 | 2 | 4 |
| **Total** | **50** | **23** | **16** |

---

## 5. Canonical Cross-Reference (Folder → Semantic Name)

| Folder Path | Canonical Semantic Name |
|---|---|
| `modules/iam` | Identity & Access Management |
| `modules/iam/subdomains/identity` | Identity Governance |
| `modules/iam/subdomains/authentication` | Authentication |
| `modules/iam/subdomains/authorization` | Authorization |
| `modules/iam/subdomains/access-control` | Access Control |
| `modules/iam/subdomains/session` | Session Lifecycle |
| `modules/iam/subdomains/tenant` | Tenant Isolation |
| `modules/iam/subdomains/security-policy` | Security Policy |
| `modules/iam/subdomains/federation` | Identity Federation |
| `modules/billing` | Billing & Entitlement |
| `modules/billing/subdomains/subscription` | Subscription Management |
| `modules/billing/subdomains/entitlement` | Entitlement Resolution |
| `modules/ai` | Shared AI Capability |
| `modules/ai/subdomains/prompt-pipeline` | Prompt & Flow Pipeline |
| `modules/ai/subdomains/safety-guardrail` | Safety Guardrail |
| `modules/ai/subdomains/evaluation-policy` | Evaluation Policy |
| `modules/ai/subdomains/model-observability` | Model Observability |
| `modules/ai/subdomains/content-distillation` | Content Distillation |
| `modules/ai/subdomains/content-generation` | Content Generation |
| `modules/ai/subdomains/context-assembly` | Context Assembly |
| `modules/ai/subdomains/memory-context` | Memory Context |
| `modules/analytics` | Analytics & Read-Model |
| `modules/analytics/subdomains/metrics` | Metrics Aggregation |
| `modules/analytics/subdomains/event-ingestion` | Event Ingestion |
| `modules/analytics/subdomains/event-projection` ✅ | **Event Projection** (renamed from `event-processing` 2026-04-15) |
| `modules/analytics/subdomains/event-contracts` | Analytics Event Contracts |
| `modules/analytics/subdomains/insights` | Insights |
| `modules/analytics/subdomains/realtime-insights` | Realtime Insights |
| `modules/platform` | Platform Operational Services |
| `modules/platform/subdomains/account` | Account Lifecycle |
| `modules/platform/subdomains/account-profile` | Account Profile |
| `modules/platform/subdomains/organization` | Organization Management |
| `modules/platform/subdomains/team` | Team Management |
| `modules/platform/subdomains/notification` | Notification Routing & Preferences |
| `modules/platform/subdomains/platform-config` | Platform Configuration |
| `modules/platform/subdomains/background-job` | Background Job Management |
| `modules/platform/subdomains/search` | Cross-Domain Search |
| `modules/platform/subdomains/observability` | Platform Observability |
| `modules/workspace` | Collaboration Workspace |
| `modules/workspace/subdomains/audit` | Workspace Audit Trail |
| `modules/workspace/subdomains/feed` | Activity Feed |
| `modules/workspace/subdomains/lifecycle` | Workspace Lifecycle |
| `modules/workspace/subdomains/membership` | Workspace Membership |
| `modules/workspace/subdomains/scheduling` | Workspace Scheduling |
| `modules/workspace/subdomains/sharing` | Workspace Sharing |
| `modules/workspace/subdomains/workspace-workflow` | Workspace Workflow |
| `modules/notion` | Canonical Knowledge Content |
| `modules/notion/subdomains/knowledge` | Knowledge Page Lifecycle |
| `modules/notion/subdomains/authoring` | Knowledge Authoring |
| `modules/notion/subdomains/collaboration` | Knowledge Collaboration |
| `modules/notion/subdomains/knowledge-database` ✅ | **Structured Knowledge Database** (renamed from `database` 2026-04-15) |
| `modules/notion/subdomains/taxonomy` | Knowledge Taxonomy |
| `modules/notion/subdomains/relations` | Knowledge Relations |
| `modules/notebooklm` | Conversational Reasoning & Synthesis |
| `modules/notebooklm/subdomains/conversation` | Conversation Thread |
| `modules/notebooklm/subdomains/notebook` | Notebook Management |
| `modules/notebooklm/subdomains/source` | Source Document Tracking |
| `modules/notebooklm/subdomains/synthesis` | RAG Synthesis |

---

## 7. Active Rename Recommendations

> **依據**：Context7 驗證的 Domain-Driven Hexagon 命名原則：「模組名稱必須反映領域概念，而不是技術/架構術語」；跨境名稱應讓業務能力從目錄結構直接可見。
> 原則來源：`/sairyss/domain-driven-hexagon` — Modules section, Folder and File Structure section。

### 7.1 已實作資料夾 — 改名已完成（Renamed ✅）

下列子域已完成改名（2026-04-15）：資料夾、import path、comment header、interfaces/ 元件、docs 全部同步更新。

| 目前資料夾 | 建議新名稱 | 改名理由 | 影響範圍 |
|---|---|---|---|
| ~~`modules/notion/subdomains/database`~~ → **`modules/notion/subdomains/knowledge-database`** ✅ | **`knowledge-database`** | `database` 是技術術語；notion 所有其他子域以業務概念命名（knowledge、authoring、taxonomy、relations、collaboration）。此子域管理「結構化知識多視圖」，Domain aggregates 為 Database、DatabaseRecord、View、DatabaseAutomation，語意上是 knowledge database，應加 domain prefix 與兄弟子域一致 | **已完成 2026-04-15**：所有 import path、api/index.ts barrel、interfaces/ 元件均已更新 |
| ~~`modules/analytics/subdomains/event-processing`~~ → **`modules/analytics/subdomains/event-projection`** ✅ | **`event-projection`** | DDD Event Sourcing 中將 domain events 轉換為 read model 的能力稱為 **projection**；`event-processing` 是通用技術動詞，遮蔽了業務語意。此子域的職責是事件→read model 的投影轉換，`event-projection` 精確反映 DDD 術語 | **已完成 2026-04-15**：資料夾已改名，無 import path 受影響（stub 子域） |

### 7.2 已實作資料夾 — 內部語意不一致（Refactor Entities ✅）

下列子域已完成實體通用化（2026-04-15）：

| 資料夾 | 問題描述 | 已執行解法 |
|---|---|---|
| `modules/platform/subdomains/background-job` ✅ | 資料夾名稱 `background-job` 表達通用背景任務管理，原內部 domain entities 全以 `Ingestion*` 命名（IngestionDocument、IngestionChunk、IngestionJob），與資料夾語意不一致 | **已完成 2026-04-15**（Option A）：`IngestionJob` → `BackgroundJob`、`IngestionDocument` → `JobDocument`、`IngestionChunk` → `JobChunk`；`IngestionStatus` → `BackgroundJobStatus`；`IngestionJobRepository` → `BackgroundJobRepository`；`canTransitionIngestionStatus` → `canTransitionJobStatus`；`ingestionService` → `backgroundJobService`；所有 domain event discriminant、error code、use-case 類別名稱、composition service 全部同步更新。資料夾名稱保持 `background-job`。**2026-04-15（補完）**：所有 JSDoc 注釋中殘留的 `ingestion`（如 "ingestion pipeline"、"Ingestion document not found"）全部通用化為 `background job`/`document processing pipeline`；`SourceReference.ts` 中 `IngestionJob` 稽核鏈描述更新為 `BackgroundJob`。 |

### 7.4 Comment-Level Semantic Cleanup ✅

下列 comment header 與 namespace alias 已完成語意更新（2026-04-15）：

| 位置 | 舊語意 | 新語意 |
|---|---|---|
| `notion/subdomains/knowledge-database/domain/services/index.ts` | `the database subdomain` | `the knowledge-database subdomain` |
| `notion/subdomains/knowledge-database/domain/ports/index.ts` | `notion/database domain/ports … database subdomain` | `notion/knowledge-database domain/ports … knowledge-database subdomain` |
| `notion/subdomains/knowledge-database/domain/value-objects/index.ts` | `the database subdomain` | `the knowledge-database subdomain` |
| `notion/subdomains/knowledge-database/application/dto/knowledge-database.dto.ts` | `the database subdomain` | `the knowledge-database subdomain` |
| `notion/subdomains/knowledge-database/api/server.ts` | `database subdomain — server-only API` | `knowledge-database subdomain — server-only API` |
| `notion/subdomains/knowledge-database/api/ui.ts` | `notion/database UI surface` | `notion/knowledge-database UI surface` |
| `notion/application/dto/index.ts` | `export * as databaseDtos` | `export * as knowledgeDatabaseDtos` |
| `notion/application/use-cases/index.ts` | `export * as databaseUseCases` | `export * as knowledgeDatabaseUseCases` |
| `workspace-workflow/domain/value-objects/SourceReference.ts` | `IngestionJob → source PDF` (audit chain) | `BackgroundJob → source PDF` |
| `platform/background-job/domain/entities/BackgroundJob.ts` | `RAG ingestion pipeline` | `document processing pipeline` |
| `platform/background-job/domain/entities/JobChunk.ts` | `ingestion pipeline` | `document processing pipeline` |
| `platform/background-job/domain/repositories/BackgroundJobRepository.ts` | `ingestion job persistence`, `Persist a new ingestion job` | `background job persistence`, `Persist a new background job` |
| `platform/background-job/application/use-cases/background-job.use-cases.ts` | `Ingestion Use Cases`, `Register Ingestion Document`, `Advance Ingestion Stage`, user-facing messages with `ingestion` | `Background Job Use Cases`, `Register Job Document`, `Advance Job Stage`, messages updated to `job` |
| `platform/background-job/interfaces/composition/background-job-service.ts` | `knowledge ingestion use cases`, `ingestion side-effects`, `ingestion pipeline`, `ingestion jobs` | `background job use cases`, `background job side-effects`, job-level descriptions |

### 7.3 計劃中子域 — 建立時使用正典名稱（Create With Canonical Name）

下列子域尚未實作，建立時必須使用此表所列的正典名稱，不得使用現有策略文件中的舊名稱。

| 舊/策略文件名稱 | 正典建立名稱 | 理由 |
|---|---|---|
| `notion/knowledge-analytics` | **`knowledge-engagement`** | 與 analytics domain 的 metrics/projection 語意重疊；notion 此子域只量測知識頁面使用行為，`knowledge-engagement` 準確描述業務能力 |
| `notion/knowledge-integration` | **`external-knowledge-sync`** | 與 platform/integration 語意重疊；notion 此子域只做知識雙向同步，`external-knowledge-sync` 準確描述業務能力 |
| `platform/workflow` | **`platform-workflow`** | 與 workspace/workspace-workflow 語意重疊；加 domain prefix 明確區分平台級流程編排（platform）與工作區流程執行（workspace） |

---

## 6. Document Authority

| Authority Source | Scope |
|---|---|
| `docs/bounded-contexts.md` | Main domain ownership, dependency direction, forbidden ownership moves |
| `docs/subdomains.md` | Baseline & gap subdomain inventory per main domain |
| `docs/ubiquitous-language.md` | Canonical term definitions, naming rules, anti-patterns |
| `docs/architecture-overview.md` | Strategic role, relationship baseline, system shape |
| `docs/context-map.md` | Published language token flow between contexts |
| `docs/semantic-model.md` (this file) | Folder → semantic name mapping, status, drift analysis |

> Last verified: 2026-04-15. Section 7.1 renames completed 2026-04-15. Section 7.2 entity rename completed 2026-04-15. Section 7.4 comment-level semantic cleanup completed 2026-04-15. All implemented subdomain folders and their internal code comments/namespace aliases now match the canonical semantic names in this document. Section 7.3 entries remain as governance rules for future subdomain creation. Section 7 added 2026-04-15 based on Context7 DDD Hexagon evidence (`/sairyss/domain-driven-hexagon`).
