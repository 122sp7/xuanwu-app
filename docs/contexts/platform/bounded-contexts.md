# Platform

本文件整理 platform 主域內部的本地 bounded contexts。全域四主域地圖見 [../../bounded-contexts.md](../../bounded-contexts.md)；本文件只描述 platform 主域之下的治理型子域切分。

## Domain Role

platform 是 Generic 主域，負責所有跨切面治理與營運支撐能力。它的價值在於提供穩定 published language 與治理能力，而不是承載 workspace、notion 或 notebooklm 的業務正典。

## Local Bounded Context Clusters

| Cluster | Subdomains | Responsibility |
|---|---|---|
| Subject and Directory | identity, account, account-profile, organization | 管理平台主體、帳號、屬性與組織治理邊界 |
| Governance and Security | access-control, security-policy, platform-config, feature-flag, onboarding, compliance | 管理授權、政策、設定、啟用與法規遵循 |
| Commercial and Entitlements | billing, subscription, referral | 管理方案、配額、金流證據與推薦獎勵 |
| Orchestration and Delivery | integration, workflow, notification, background-job | 管理整合、流程、訊息投遞與背景任務 |
| Content and Discovery | content, search | 管理平台級內容資產與跨域搜尋能力 |
| Audit and Insight | audit-log, observability, analytics, support | 管理永久稽核、觀測、分析與支援流程 |

## Boundary Rules

- platform 擁有 Actor、Organization、Access Control、Subscription 等治理語意。
- platform 不擁有 workspace 容器生命週期。
- platform 不擁有 notion 的 Knowledge Page、Article、Database 等知識內容生命週期。
- platform 不擁有 notebooklm 的 Notebook、Conversation、Source、Synthesis 等 AI 對話生命週期。
- 其他主域只能透過 API 或 published events 消費 platform 能力，不能繞過治理邊界直取內部模型。

## Ownership Guardrails

- 若問題在身份、帳號、組織、授權、政策、商業權益、通知、搜尋或觀測，優先路由到 platform。
- 若問題在工作區容器、活動流、排程或流程協作，路由到 workspace。
- 若問題在知識內容建立、編輯、結構化資料或範本，路由到 notion。
- 若問題在 AI 對話、來源追蹤、摘要與 synthesis，路由到 notebooklm。