# 6114 Migration Gap — `docs/semantic-model.md`


> ⚠️ **本文件為「僅記錄」文件 — 不執行實施**
> 此 ADR 的唯一目的是記錄遷移缺口，作為未來蒸餾工作的基線參考。
> **任何 agent 或開發者不得依據本文件直接新增、修改或刪除任何程式碼。**

- Status: ⛔ 僅記錄 — 不實施（Record Only — Do Not Implement）
- Date: 2026-04-17
- Category: Migration Gap > docs

## Context

`xuanwu-app-skill` 快照包含 `docs/semantic-model.md`（344 lines），這是一份跨域語意模型的系統級文件，記錄了八個主域之間的核心概念關係。

此文件**已在遷移過程中完全刪除，現行 `docs/` 目錄下沒有任何替代文件**。

### 文件所涵蓋的關鍵內容

#### 1. Cross-Domain Object Graph（~80 lines）

以物件圖方式定義了跨域的核心概念連結：

```
Actor (iam)
  └── is a member of → Organization (iam/platform)
  └── has role in → Workspace (workspace)
  └── owns → Account (iam)

Account (iam)
  └── scopes → Workspace (workspace)
  └── has → Entitlement (billing)
  └── has → Subscription (billing)

Workspace (workspace)
  └── contains → KnowledgeArtifact (notion)
  └── scoped by → Account (iam)
  └── governed by → Entitlement (billing)

KnowledgeArtifact (notion)
  └── sourced from → SourceDocument (notebooklm)
  └── is indexed as → RagDocument (notebooklm)

SourceDocument (notebooklm)
  └── processed by → py_fn pipeline
  └── yields → EmbeddedChunk (notebooklm)

EmbeddedChunk (notebooklm)
  └── stored in → VectorStore (notebooklm synthesis)
  └── retrieved by → SynthesisResult (notebooklm synthesis)
```

#### 2. Published Language Token Map（~60 lines）

定義跨域傳遞時使用的 Published Language token（而非直接傳遞 aggregate）：

```
ActorReference   = { actorId: string; tenantId: string }  // iam → downstream
WorkspaceId      = branded string UUID                    // workspace → notion/notebooklm
KnowledgeArtifactRef = { artifactId; workspaceId }        // notion → notebooklm
EntitlementSignal = { featureFlag; tier; expiresAt }      // billing → workspace/notion
FileId           = branded string UUID                    // platform → all consumers
```

#### 3. Semantic Invariants（~100 lines）

記錄了跨域語意約束（並非程式碼層面的 invariant，而是業務語意的正確性規則）：

```
INVARIANT-01: KnowledgeArtifact 只在 Workspace scope 內存在
INVARIANT-02: Entitlement 由 billing 決定，workspace/notion 不自行判斷
INVARIANT-03: Actor identity 只由 iam 提供，其他域接受 ActorReference
INVARIANT-04: VectorStore index 的 namespace 必須對齊 WorkspaceId
INVARIANT-05: SourceDocument 處理後才可建立對應的 KnowledgeArtifact
INVARIANT-06: FileId 生命週期由 platform FileAPI 管理，不由 notion/notebooklm 自持
...（共 ~20 條）
```

#### 4. Context Map Alignment（~50 lines）

與 `docs/structure/system/context-map.md` 的主域關係圖對齊，說明哪些跨域關係是 Conformist（消費者遵從 upstream 模型）、哪些是 ACL（消費者建立轉換層）。

#### 5. Naming Disambiguation（~54 lines）

解決跨域同名但語意不同的概念：

```
「File」：
  - platform.FileAPI.FileId → 平台級文件所有權 token
  - notebooklm.SourceFile  → 上傳來源文件（未處理）
  - notion.AttachmentFile  → 附件（不通過 FileAPI）

「Status」：
  - SourceDocument.status  → processing/ready/failed
  - Workspace.status       → active/archived/suspended
  - Article.status         → draft/published/archived
```

## Decision

**不實施**。僅記錄缺口。

此文件應重建至 `docs/semantic-model.md`（保持原始路徑）。INVARIANT 條目是最高優先順序，因為它們是 domain implementation 的語意約束根基。

## Consequences

- 跨域概念關係（如 KnowledgeArtifact ↔ SourceDocument）只能靠 `docs/structure/domain/bounded-contexts.md` 推斷，缺乏明確的物件圖視角。
- Published Language token 型別缺乏集中的文件定義來源，開發者需查閱多份文件才能理解跨域傳遞規範。

## 關聯 ADR

- **0004** Ubiquitous Language：語意模型是 Ubiquitous Language 的系統級可視化。
- **6113** 消失的 packages：`@shared-types/published-language.ts` 是 Semantic Model 的 TypeScript 實作層。
