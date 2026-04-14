# Context Map

本文件在本次任務限制下，僅依 Context7 驗證的 context map 與 strategic design 原則重建，不主張反映現況實作。

## System Landscape

主域級關係只採用 directed upstream-downstream 模型。

## Directed Relationships

| Upstream | Downstream | Published Language |
|---|---|---|
| iam | billing | actor reference、tenant scope、access policy baseline |
| iam | platform | actor reference、tenant scope、access decision |
| iam | workspace | actor reference、tenant scope、access decision |
| iam | notion | actor reference、tenant scope、access decision |
| iam | notebooklm | actor reference、tenant scope、access decision |
| billing | workspace | entitlement signal、subscription capability signal |
| billing | notion | entitlement signal、subscription capability signal |
| billing | notebooklm | entitlement signal、subscription capability signal |
| ai | notion | ai capability signal、model policy、safety result |
| ai | notebooklm | ai capability signal、model policy、safety result |
| platform | workspace | account scope、organization surface、operational service signal |
| workspace | notion | workspaceId、membership scope、share scope |
| workspace | notebooklm | workspaceId、membership scope、share scope |
| notion | notebooklm | knowledge artifact reference、attachment reference、taxonomy hint |
| iam / billing / platform / workspace / notion / notebooklm | analytics | domain event、projection input、usage signal |

## Detailed Language Crosswalk

| Relationship | Upstream Canonical Terms | Published Language | Downstream Protected Terms |
|---|---|---|---|
| iam -> workspace | Actor, Identity, Tenant, AccessDecision | actor reference, tenant scope, access decision | Workspace, Membership, ShareScope |
| iam -> notion | Actor, Identity, Tenant, AccessDecision | actor reference, tenant scope, access decision | KnowledgeArtifact, Taxonomy, Relation, Publication |
| iam -> notebooklm | Actor, Identity, Tenant, AccessDecision | actor reference, tenant scope, access decision | Notebook, Ingestion, Retrieval, Grounding, Synthesis, Evaluation |
| billing -> workspace | Subscription, Entitlement | entitlement signal, subscription capability signal | Workspace, Membership, ShareScope |
| billing -> notion | Subscription, Entitlement | entitlement signal, subscription capability signal | KnowledgeArtifact, Taxonomy, Relation |
| billing -> notebooklm | Subscription, Entitlement | entitlement signal, subscription capability signal | Notebook, Retrieval, Grounding, Synthesis |
| ai -> notion | AICapability, ModelPolicy, SafetyGuardrail | ai capability signal, model policy, safety result | KnowledgeArtifact, Publication |
| ai -> notebooklm | AICapability, ModelPolicy, SafetyGuardrail | ai capability signal, model policy, safety result | Retrieval, Grounding, Synthesis, Evaluation |
| platform -> workspace | AccountScope, OrganizationSurface, NotificationRoute | account scope, organization surface, operational service signal | Workspace, Membership, ShareScope |
| workspace -> notion | Workspace, Membership, ShareScope | workspaceId, membership scope, share scope | KnowledgeArtifact, Taxonomy, Relation |
| workspace -> notebooklm | Workspace, Membership, ShareScope | workspaceId, membership scope, share scope | Notebook, Retrieval, Grounding, Synthesis |
| notion -> notebooklm | KnowledgeArtifact, Taxonomy, Relation | knowledge artifact reference, attachment reference, taxonomy hint | Notebook, Retrieval, Grounding, Synthesis, Evaluation |
| all business and operational contexts -> analytics | DomainEvent, UsageSignal, ProjectionInput | domain event, usage signal, projection input | Metrics, Reporting, Dashboard |

## Relationship Notes

- `iam` 只提供身份、租戶與 access decision，不接管商業、內容或推理語言。
- `billing` 只提供 entitlement 與 subscription capability signal，不接管 workspace、knowledge 或 notebook 的正典模型。
- `ai` 提供共享 AI capability、model policy 與 safety result，但不移轉內容或推理所有權。
- `platform` 保留 account、organization 與 operational surface，不再作為所有治理能力的總擁有者。
- `workspace -> notion` 與 `workspace -> notebooklm` 只提供 scope 與 membership 邊界，不輸出 workspace 內部模型。
- `notion -> notebooklm` 僅提供可引用內容語言，不允許 notebooklm 直接回寫 notion 正典內容。
- `analytics` 只消費投影與訊號，不反向成為上游 canonical owner。

## Pattern Rules

- ACL 與 Conformist 只允許出現在 downstream 端。
- ACL 與 Conformist 互斥，不能同時套用在同一整合。
- Shared Kernel 與 Partnership 不用於主域級關係。
- 若未來真的需要共享模型，必須先抽出新的 bounded context，而不是把對稱關係塞回主域之間。

## Dependency Direction Guardrail

- 主域級方向只允許 upstream -> downstream，不允許同時宣稱對稱依賴。
- downstream 整合上游時，先決定 published language，再決定 ACL 或 Conformist。
- 上游提供語言與能力，下游決定如何保護自己的語言。

## Strategic Consequences

- 關係方向清楚後，published language、local DTO 與 ACL 才能一致。
- 主域級文檔可以避免同時出現互相矛盾的 supplier / consumer 敘事。

## Contradictions Removed

- 不再同時把主域級關係描述成 directed relationship 與 symmetric relationship。
- 不再把 ACL 寫成 upstream 的責任。
- 不再把 shared technical libraries 誤寫為主域級 Shared Kernel。

## Forbidden Relationship Patterns

- 不得把 Shared Kernel / Partnership 與 ACL / Conformist 混寫在同一關係。
- 不得把 direct model sharing 寫成 published language。
- 不得把下游的轉譯責任倒灌回上游。

## Copilot Generation Rules

- 生成程式碼時，先畫清 upstream / downstream，再安排 API boundary、published language、ACL 或 Conformist。
- 奧卡姆剃刀：若單一 published language 與單一 translation step 足夠，就不要再加第二層整合流程。
- 不確定關係方向時，先修正文檔，不直接生成跨主域耦合程式碼。

## Dependency Direction Flow

```mermaid
flowchart LR
	Upstream["Upstream"] -->|PL / OHS| Downstream["Downstream"]
	Downstream -->|ACL or Conformist| LocalModel["Local domain model"]
```

## Correct Interaction Flow

```mermaid
flowchart LR
	Platform["platform"] --> Workspace["workspace"]
	Platform --> Notion["notion"]
	Platform --> NotebookLM["notebooklm"]
	Workspace --> Notion
	Workspace --> NotebookLM
	Notion --> NotebookLM
```

## Document Network

- [architecture-overview.md](./architecture-overview.md)
- [integration-guidelines.md](./integration-guidelines.md)
- [strategic-patterns.md](./strategic-patterns.md)
- [bounded-context-subdomain-template.md](./bounded-context-subdomain-template.md)
- [project-delivery-milestones.md](./project-delivery-milestones.md)
- [decisions/0003-context-map.md](./decisions/0003-context-map.md)
- [decisions/0005-anti-corruption-layer.md](./decisions/0005-anti-corruption-layer.md)