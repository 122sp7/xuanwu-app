# NotebookLM

本文件整理 notebooklm 主域內部的本地 bounded contexts。全域四主域地圖見 [../../bounded-contexts.md](../../bounded-contexts.md)；本文件只描述 notebooklm 主域之下的 AI 對話與 synthesis 子域切分。

## Domain Role

notebooklm 是 Supporting Domain，專注於 AI 對話、來源追蹤與 synthesis。它的中心價值是把來源材料轉化為對話、摘要與洞察，而不是成為正典知識內容或平台治理的來源。

## Local Bounded Context Clusters

| Cluster | Subdomains | Responsibility |
|---|---|---|
| Interaction Core | notebook, conversation, note | 管理 notebook 工作單位、對話流程與輕量筆記 |
| Source and Reasoning | source, ai, synthesis | 管理引用材料、模型推理與綜合輸出 |
| Continuity | versioning | 管理 notebook 與 conversation 的歷史快照與版本連續性 |

## Boundary Rules

- notebooklm 擁有 Notebook、Conversation、Source、Synthesis、Note 等對話與推理語意。
- notebooklm 不擁有 Knowledge Page、Article、Database、Template 等 notion 內容語意。
- notebooklm 不擁有 Actor、Organization、Access Control、Subscription 等平台治理語意。
- notebooklm 不擁有 Workspace 容器生命週期、活動流、排程或工作區流程語意。
- notebooklm 輸出的是衍生產物；若要成為正典知識，必須經過 notion 語言吸收。

## Ownership Guardrails

- AI 對話、來源引用、摘要、洞察與 synthesis 優先路由到 notebooklm。
- 正式知識內容建立、編輯、結構化資料與模板優先路由到 notion。
- 身份、組織、授權、政策、商業權益優先路由到 platform。
- 工作區容器、活動流、排程與工作流優先路由到 workspace。