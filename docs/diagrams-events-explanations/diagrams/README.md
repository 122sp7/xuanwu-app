# Diagrams Index

這個目錄收斂 Xuanwu App 的系統架構圖、資料模型圖、流程圖與狀態機圖。

原則：

- 每張圖只負責一個視角
- 避免在不同圖之間重複相同層次的資訊
- 優先讓產品、架構、實作三種閱讀需求都能快速找到對應圖

## 1. System Structure

### [ai-knowledge-platform-architecture.png](./ai-knowledge-platform-architecture.png)

用途：

- 提供 AI 知識平台的整體概念架構圖
- 對齊 Notion × Wiki × NotebookLM 的三層融合視角
- 可作為 [ai-knowledge-platform-architecture.md](../../decision-architecture/architecture/ai-knowledge-platform-architecture.md) 與 [modules-implementation-guide.md](../../development-reference/development/modules-implementation-guide.md) 的配圖

適合閱讀者：

- Architect
- Product Designer
- Tech Lead

### [system-multi-workspace-hierarchy.mermaid](./system-multi-workspace-hierarchy.mermaid)

用途：

- 說明 System → Account → Workspace 的多工作區層級
- 表達 Workspace 是資料隔離邊界
- 補充三欄式 UI 的 left / middle / right 對應

適合閱讀者：

- PM
- UX / IA
- Solution Architect

### [system-architecture-overview-combined.mermaid](./system-architecture-overview-combined.mermaid)

用途：

- 提供整體系統總覽
- 把多 Workspace hierarchy 與單一 Workspace canonical domains 接起來
- 作為簡報或總體設計文件的主圖

適合閱讀者：

- Architect
- Tech Lead
- Stakeholder

## 2. Workspace Model

### [workspace-internal-data-model.mermaid](./workspace-internal-data-model.mermaid)

用途：

- 說明單一 Workspace 內部的 entity / data model
- 聚焦 Space、Page、Block、Database、Row、File、Tag、Member、Settings
- 用 ER Mermaid 表達核心實體與關聯

適合閱讀者：

- Backend Engineer
- Data Model Designer
- Firestore / schema owner

### [workspace-interaction-flow.mermaid](./workspace-interaction-flow.mermaid)

用途：

- 說明使用者在 Workspace 內的完整操作流程
- 涵蓋 Page、Database、Files、Search、Members、Settings
- 聚焦行為流與 decision points，不重做資料模型

適合閱讀者：

- Product Designer
- Frontend Engineer
- QA

## 3. Runtime And API

### [api-data-flow.mermaid](./api-data-flow.mermaid)

用途：

- 描述 Browser → Next.js → Firestore / Storage / Python worker 的資料流
- 表達 Server Actions、Route Handlers、Use Cases、Repositories、RAG orchestration
- 聚焦 API 與 runtime 邊界

適合閱讀者：

- Full-stack Engineer
- Platform Engineer
- Runtime owner

### [firestore-collection-path-structure.mermaid](./firestore-collection-path-structure.mermaid)

用途：

- 說明 Firestore collections / subcollections 路徑拓撲
- 區分 active collections、legacy path、canonical file model target
- 適合作為資料落點與命名地圖

適合閱讀者：

- Firestore schema owner
- Backend Engineer
- Security rules author

### [security-rules-decision-flow.mermaid](./security-rules-decision-flow.mermaid)

用途：

- 說明 Firestore Security Rules 的決策流程
- 對齊 auth、tenant boundary、role、policy deny、resource ACL、mutation capability
- 補充目前開發模式與目標 production 模式差異

適合閱讀者：

- Security reviewer
- Backend Engineer
- Platform Engineer

## 4. Routing And Session

### [nextjs-app-router-structure.mermaid](./nextjs-app-router-structure.mermaid)

用途：

- 說明 Next.js App Router 的 route groups、layout、page 結構
- 對齊 app/ 目錄下的實際路由檔案
- 適合作為前端資訊架構與 route map

適合閱讀者：

- Frontend Engineer
- UX / IA
- QA

### [auth-state-machine.mermaid](./auth-state-machine.mermaid)

用途：

- 說明 AuthProvider 的 client-side auth lifecycle
- 對齊 Firebase auth listener、bootstrap timeout、dev demo fallback、token refresh handshake
- 聚焦 session state transitions

適合閱讀者：

- Frontend Engineer
- Identity owner
- QA

## 5. Knowledge And Events

### [kb-ingestion-pipeline-state-machine.mermaid](./kb-ingestion-pipeline-state-machine.mermaid)

用途：

- 說明 Knowledge Base ingestion pipeline 的狀態轉移
- 對齊 GCS upload、Document AI parsing、JSON persistence、RAG chunking、embedding、indexing
- 聚焦 ingestion lifecycle，不重做 API flow

適合閱讀者：

- AI / RAG engineer
- Python worker owner
- Platform engineer

### [event-bus-message-flow.mermaid](./event-bus-message-flow.mermaid)

用途：

- 說明 DomainEvent capture、event store、dispatch、retry、projection consumer、audit sink 的訊息流
- 對齊 Event Core contract 與 outbox / bus 架構方向
- 區分 current noop bus 與 future real bus

適合閱讀者：

- Architect
- Event-driven systems designer
- Module owners

## 6. Agent Workflow

### [agent-architecture-commander-subagents.mermaid](./agent-architecture-commander-subagents.mermaid)

用途：

- 說明 Commander + 6 Sub-agents 的協作拓撲
- 聚焦 planning、implementation、review、QA、exploration、agent design 的分工
- 不涉及應用系統本身，而是 AI delivery workflow

適合閱讀者：

- AI workflow owner
- Repo maintainer
- Copilot customization designer

## 7. Reading Order

如果你是第一次讀這套圖，建議順序：

1. [system-multi-workspace-hierarchy.mermaid](./system-multi-workspace-hierarchy.mermaid)
2. [ai-knowledge-platform-architecture.png](./ai-knowledge-platform-architecture.png)
3. [system-architecture-overview-combined.mermaid](./system-architecture-overview-combined.mermaid)
4. [workspace-internal-data-model.mermaid](./workspace-internal-data-model.mermaid)
5. [workspace-interaction-flow.mermaid](./workspace-interaction-flow.mermaid)
6. [api-data-flow.mermaid](./api-data-flow.mermaid)
7. [firestore-collection-path-structure.mermaid](./firestore-collection-path-structure.mermaid)
8. [security-rules-decision-flow.mermaid](./security-rules-decision-flow.mermaid)
9. [nextjs-app-router-structure.mermaid](./nextjs-app-router-structure.mermaid)
10. [auth-state-machine.mermaid](./auth-state-machine.mermaid)
11. [kb-ingestion-pipeline-state-machine.mermaid](./kb-ingestion-pipeline-state-machine.mermaid)
12. [event-bus-message-flow.mermaid](./event-bus-message-flow.mermaid)

## 8. Notes

- 這些圖以目前程式與文件狀態為基準，不等於未來最終 production 架構。
- 若模組命名、集合命名、權限策略、event bus adapter 有變更，應同步更新對應圖。
- 若未來新增 deployment、infra、queue、cache、storage naming 等主題，建議繼續維持單圖單視角原則。