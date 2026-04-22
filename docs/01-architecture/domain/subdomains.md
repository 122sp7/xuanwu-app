# Subdomains

> 本文件以 `src/modules/` 實際目錄為基線，分為「已實作」與「計劃中」兩欄，取代原先的「Baseline / Gap」框架。
> 詳細每域說明見各 `docs/01-architecture/contexts/<context>/subdomains.md`。

## Main Domain Inventory

| Main Domain | Implemented Subdomains（程式碼已存在） | Planned Subdomains（尚未實作） |
|---|---|---|
| iam | identity, access-control, authentication, authorization, federation, tenant, security-policy, session, account, organization | consent, secret-governance |
| billing | entitlement, subscription, usage-metering | billing, referral, pricing, invoice, quota-policy |
| ai | chunk, citation, context, embedding, evaluation, generation, memory, pipeline, retrieval, safety, tool-calling | orchestration, distillation, reasoning, conversation, tracing, provider-routing, model-policy |
| analytics | event-contracts, event-ingestion, event-projection, experimentation, insights, metrics, realtime-insights | reporting, dashboards, decision-support |
| platform | audit-log, background-job, cache, feature-flag, file-storage, notification, platform-config, search | onboarding, compliance, integration, workflow, content, observability, support, secret-management |
| workspace | activity, api-key, approval, audit, feed, invitation, issue, lifecycle, membership, orchestration, quality, resource, schedule, settlement, share, task, task-formation | presence |
| notion | block, collaboration, database, knowledge, page, template, view | knowledge-engagement, attachments, automation, external-knowledge-sync, notes, knowledge-versioning, taxonomy, relations, publishing |
| notebooklm | conversation, notebook, source, synthesis | note, conversation-versioning |

## Detailed Subdomain Catalog

### iam

#### Implemented Subdomains

| Subdomain | 功能註解 |
|---|---|
| identity | 已驗證主體與身份信號治理 |
| access-control | 主體現在能做什麼的授權判定（policy 執行） |
| authentication | sign-in、registration、credential recovery、provider bootstrap |
| authorization | 高層政策編排與決策語意 |
| federation | 外部 identity provider 連結、SSO 與信任委派 |
| tenant | 多租戶隔離與 tenant-scoped 規則治理 |
| security-policy | 安全規則定義、版本化與發佈 |
| session | session、token 與 identity lifecycle（原 gap，現已實作） |
| account | 帳號聚合根與帳號生命週期（從 platform 遷入） |
| organization | 組織、成員與角色邊界（從 platform 遷入） |

#### Planned Subdomains

| Subdomain | 功能註解 |
|---|---|
| consent | 同意與資料使用授權治理收斂 |
| secret-governance | secret 與 credential access policy 收斂 |

### billing

#### Baseline Subdomains

| Subdomain | 功能註解 |
|---|---|
| billing | 計費狀態、費率與財務證據 |
| subscription | 方案、配額與續期治理 |
| entitlement | 有效權益與功能可用性統一解算 |
| referral | 推薦關係與獎勵追蹤 |

#### Recommended Gap Subdomains

| Subdomain | 功能註解 |
|---|---|
| pricing | 價格模型與方案矩陣治理 |
| invoice | 帳單、請款與對帳流程 |
| quota-policy | 可量化配額與商業限制規則 |

### ai

#### Baseline Subdomains

| Subdomain | 功能註解 |
|---|---|
| generation | AI 驅動的文本生成與回覆輸出（Genkit 接縫） |
| orchestration | 執行圖與多步驟 AI workflow 協調 |
| distillation | 將長輸出或多來源濃縮為精煉知識片段 |
| retrieval | 向量搜尋、相似度查詢與上下文抓取 |
| memory | 對話歷史與跨輪次狀態保存 |
| context | prompt 上下文組裝與 token 預算管理 |
| safety | 安全護欄、有害內容過濾與合規保護 |
| tool-calling | 外部工具調用協調與結果回注 |
| reasoning | 推理步驟管理（chain-of-thought、反思） |
| conversation | AI 互動輪次追蹤與歷史管理 |
| evaluation | 輸出品質評估與回歸基準 |
| tracing | AI 執行觀測、span 紀錄與成本追蹤 |

#### Recommended Gap Subdomains

| Subdomain | 功能註解 |
|---|---|
| provider-routing | 模型供應商選擇與路由治理 |
| model-policy | 模型能力、版本與使用政策 |

### analytics

#### Baseline Subdomains

| Subdomain | 功能註解 |
|---|---|
| reporting | 報表輸出與查詢整理 |
| metrics | 指標定義與聚合 |
| dashboards | 儀表板呈現語義 |
| telemetry-projection | 事件投影與 read model 匯總 |

#### Recommended Gap Subdomains

| Subdomain | 功能註解 |
|---|---|
| experimentation | 實驗分析與對照觀測 |
| decision-support | 決策輔助與洞察輸出 |

### workspace

#### Implemented Subdomains

| Subdomain | 功能註解 |
|---|---|
| activity | 工作區活動流水帳與事件記錄 |
| api-key | API 金鑰生命週期與範圍治理 |
| approval | 任務驗收與問題單覆核審批流程（舊名 `approve`） |
| audit | 工作區操作日誌與不可否認證據追蹤 |
| feed | 工作區活動摘要與事件流呈現 |
| invitation | 工作區邀請流程與邀請令牌管理 |
| issue | 問題單生命週期與追蹤管理 |
| lifecycle | 工作區容器建立、封存與復原的生命週期語言（原 gap，現已實作） |
| membership | 工作區參與關係（角色、加入、移除）與 identity 邊界切分（原 gap，現已實作） |
| orchestration | 知識頁面→任務物化批次作業編排 |
| quality | 任務 QA 審查與質檢流程 |
| resource | 工作區資源綁定與容量管理 |
| schedule | 工作區排程、時序與提醒協調（舊名 `scheduling`） |
| settlement | 請款發票生命週期與財務對帳 |
| share | 對外共享與可見性規則（舊名 `sharing`，原 gap，現已實作） |
| task | 任務建立、指派與狀態轉換 |
| task-formation | AI 輔助任務候選抽取與批次匯入 |

#### Planned Subdomains

| Subdomain | 功能註解 |
|---|---|
| presence | 將即時協作存在感、共同編輯訊號收斂為本地語言 |

### platform

#### Implemented Subdomains

| Subdomain | 功能註解 |
|---|---|
| audit-log | 永久日誌軌跡與不可否認證據 |
| background-job | 背景任務提交、排程與監控 |
| cache | 跨域快取策略與快取層管理 |
| feature-flag | 功能開關策略與發佈節點 |
| file-storage | 檔案儲存邊界、路徑策略與存取控管 |
| notification | 通知路由、偏好與投遞 |
| platform-config | 平台設定輪廓與配置管理 |
| search | 跨域搜尋路由與查詢協調 |

> **遷出子域：** `account` / `account-profile` → `iam/subdomains/account/`；`organization` / `team` → `iam/subdomains/organization/`

#### Planned Subdomains

| Subdomain | 功能註解 |
|---|---|
| onboarding | 新主體初始設定與引導流程 |
| compliance | 資料保留、日誌與法規執行 |
| integration | 外部系統整合邊界與契約 |
| workflow | 平台級流程編排與狀態驅動執行 |
| content | 平台級內容資產管理與發布 |
| observability | 健康量測、追蹤與告警 |
| support | 客服工單、支援知識與處理流程 |
| secret-management | 將憑證、token、rotation 從 integration 中切開 |

### notion

#### Implemented Subdomains

| Subdomain | 功能註解 |
|---|---|
| block | 頁面內容區塊（段落、標題、媒體等）的結構與操作 |
| collaboration | 協作留言、細粒度權限與版本快照 |
| database | 結構化資料多視圖管理（原名 `knowledge-database`，已重命名）|
| knowledge | 頁面的高層語義容器（知識庫入口） |
| page | 知識庫文章建立、驗證、分類與版本（`authoring` 整合於此） |
| template | 頁面範本管理與套用（程式碼目錄名為 `template`，非 `templates`） |
| view | Database 多視圖能力（table、board、calendar 等） |

#### Planned Subdomains

| Subdomain | 功能註解 |
|---|---|
| knowledge-engagement | 知識使用行為量測 |
| attachments | 附件與媒體關聯儲存 |
| automation | 知識事件觸發自動化動作 |
| external-knowledge-sync | 知識與外部系統雙向整合 |
| notes | 個人輕量筆記與正式知識協作 |
| knowledge-versioning | 全域版本快照策略管理 |
| taxonomy | 分類法與語義組織的正典邊界 |
| relations | 內容之間關聯與 backlink 的正典邊界 |
| publishing | 正式發布與對外交付的正典邊界 |

### notebooklm

#### Implemented Subdomains

| Subdomain | 功能註解 |
|---|---|
| conversation | 對話 Thread 與 Message 生命週期 |
| notebook | Notebook 組合與管理 |
| source | 來源文件追蹤與引用 |
| synthesis | RAG 合成、摘要與洞察生成 |

#### Planned Subdomains

| Subdomain | 功能註解 |
|---|---|
| note | 輕量筆記與知識連結 |
| conversation-versioning | 對話版本與快照策略 |

#### Future Split Triggers（非獨立 Gap Subdomain）

ingestion 已整合至 source；retrieval、grounding、evaluation 現為 synthesis 內部 facets。僅當語言分歧或演化速率差異觸發時才拆分為獨立子域。完整觸發條件見 `contexts/notebooklm/subdomains.md`。

## Strategic Notes

- baseline subdomains 代表本架構基線中已確立的核心切分。
- recommended gap subdomains 代表依 Context7 推導出的合理補洞方向。
- recommended gap subdomains 不等於已驗證現況實作。

## Ownership Summary

- iam 關心身份、租戶、存取治理、account 與 organization 聚合根。
- billing 關心商業生命週期與有效權益。
- ai 關心共享 AI capability 與模型政策。
- analytics 關心下游分析、指標與 read model 投影。
- platform 關心 operational service（通知、搜尋、日誌、可觀測性等），不再擁有 account 與 organization。
- workspace 關心協作範疇。
- notion 關心正典知識內容。
- notebooklm 關心推理與衍生輸出。

## Cross-Domain Duplicate Resolution

| Original Term | Resolution |
|---|---|
| ai | `ai` context 擁有 generic AI capability；`notion` 與 `notebooklm` 僅為 consumer |
| analytics | `analytics` context 擁有 generic analytics；`notion` 保留 `knowledge-engagement` |
| entitlement | `billing` 擁有 entitlement；其他主域只消費 capability signal |
| identity | `iam` 擁有 identity 與 access-control；其他主域不再各自宣稱 |
| integration | `platform` 保留 generic `integration`；`notion` 保留 `external-knowledge-sync` |
| versioning | `notion` 改為 `knowledge-versioning`；`notebooklm` 改為 `conversation-versioning` |
| workflow | `platform` 保留 generic `workflow`；workspace 的流程能力已分解為 task、issue、settlement、approve、quality、orchestration 等獨立子域 |

## Subdomain Anti-Patterns

- 不把 baseline subdomains 與 recommended gap subdomains 混成同一種事實狀態。
- 不把主域缺口直接分攤到別的主域，造成所有權漂移。
- 不把子域名稱當成 UI 功能清單，而忽略其邊界責任。
- 不讓同一個 generic 子域名稱同時被多個主域擁有，造成 Copilot 與團隊語言歧義。

## Copilot Generation Rules

- 生成程式碼時，先確認需求屬於哪個主域與子域，再決定實作位置。
- 奧卡姆剃刀：能放進既有子域就不要創造新子域；能放進既有 use case 就不要新增第二條平行流程。
- gap subdomain 只表示架構缺口，不表示一定要立刻實作。
- 遇到 generic 名稱時，先套用本文件的 duplicate resolution，再決定是否新增或改名。

## Dependency Direction Flow

```mermaid
flowchart TD
	MainDomain["Main domain"] --> Baseline["Baseline subdomains"]
	MainDomain --> Gap["Recommended gap subdomains"]
	Baseline --> UseCase["Use case / boundary"]
```

## Correct Interaction Flow

```mermaid
flowchart LR
	Requirement["Requirement"] --> Domain["Choose main domain"]
	Domain --> Subdomain["Choose owning subdomain"]
	Subdomain --> Boundary["Choose boundary"]
	Boundary --> Code["Generate code"]
```

## Document Network

- [architecture-overview.md](../system/architecture-overview.md)
- [bounded-contexts.md](./bounded-contexts.md)
- [bounded-context-subdomain-template.md](./bounded-context-subdomain-template.md)
- [project-delivery-milestones.md](../system/project-delivery-milestones.md)
- [contexts/workspace/subdomains.md](../contexts/workspace/subdomains.md)
- [contexts/platform/subdomains.md](../contexts/platform/subdomains.md)
- [contexts/notion/subdomains.md](../contexts/notion/subdomains.md)
- [contexts/notebooklm/subdomains.md](../contexts/notebooklm/subdomains.md)