# Notion

本文件整理 notion 主域內部的本地 bounded contexts。全域四主域地圖見 [../../bounded-contexts.md](../../bounded-contexts.md)；本文件只描述 notion 主域之下的知識內容子域切分。

## Domain Role

notion 是 Core Domain，專注於知識內容生命週期。它的中心價值是知識內容的建立、結構化、協作、演化與交付，而非平台治理或 AI 對話本身。

## Local Bounded Context Clusters

| Cluster | Subdomains | Responsibility |
|---|---|---|
| Knowledge Core | knowledge, authoring, collaboration, database | 管理頁面、文章、協作討論與結構化知識資料 |
| Intelligence and Automation | ai, automation, templates, versioning | 管理 AI 輔助、規則驅動演化、模板與版本治理 |
| Experience and Extension | attachments, integration, notes, analytics | 管理附件、外部整合、輕量筆記與知識量測 |

## Boundary Rules

- notion 擁有 Knowledge Page、Article、Database、Template、Attachment 等知識內容語意。
- notion 不擁有 Actor、Organization、Access Control、Subscription 等平台治理語意。
- notion 不擁有 Workspace 容器生命週期與工作區流程協作語意。
- notion 不擁有 Notebook、Conversation、Source、Synthesis 等 notebooklm 對話語意。
- 若外部產物要成為正典知識，必須先轉換為 notion 的 published language。

## Ownership Guardrails

- 知識建立、編輯、結構化資料與模板優先路由到 notion。
- 身份、組織、授權、政策、商業權益優先路由到 platform。
- 工作區容器、活動流、排程與工作流優先路由到 workspace。
- AI 對話、來源引用、摘要與 synthesis 優先路由到 notebooklm。