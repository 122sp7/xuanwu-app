# 6115 Migration Gap — `docs/discussions/` 架構設計討論文件

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > docs

## Context

`xuanwu-app-skill` 快照包含 `docs/discussions/` 目錄，共 8 份架構設計討論文件，總計 ~1,300 lines。

此目錄**已在遷移過程中完全刪除**，現行 `docs/` 沒有對應的討論目錄。

### 遺失的 8 份討論文件

#### `01-rag-retrieval-strategy.md`（~180 lines）

RAG 檢索策略討論，涵蓋：
- Sparse（BM25）vs Dense（vector）vs Hybrid 策略比較
- notebooklm namespace 設計（per-workspace vs per-notebook isolation）
- Chunk size 與 overlap 的 trade-off 分析
- Rerank 模型的使用時機（Cohere Rerank vs cross-encoder）

#### `02-event-driven-cross-domain.md`（~160 lines）

跨域事件驅動設計討論：
- Firestore onSnapshot vs QStash 的選擇依據
- At-least-once vs Exactly-once 語意的實作選擇
- 各主域事件的 Pub/Sub topic 設計提案
- 事件版本化（schema evolution）策略

#### `03-billing-entitlement-model.md`（~145 lines）

Billing/Entitlement 模型討論：
- Feature flag vs Entitlement signal 的邊界
- billing ↔ workspace Conformist vs ACL 的選擇依據
- Quota enforcement 時機（eager vs lazy）
- Free/Pro/Team tier 的能力差異定義

#### `04-ai-provider-routing.md`（~170 lines）

AI provider 路由策略討論：
- Google Gemini vs OpenAI 的路由決策（model type、cost、latency）
- Fallback 策略（primary provider 失效時的降級）
- platform.ai 作為唯一路由層的理由
- Genkit model plugin vs direct API call 的取捨

#### `05-workspace-isolation-model.md`（~130 lines）

Workspace 隔離模型討論：
- Firestore security rules 的 workspace isolation 設計
- multi-tenant vs single-tenant 隔離邊界
- VectorStore namespace 與 workspaceId 對齊方案
- Actor 在不同 workspace 中的 membership 模型

#### `06-knowledge-page-vs-article.md`（~155 lines）

KnowledgePage vs Article 語意邊界討論：
- KnowledgePage（notion/knowledge）與 Article（notion/authoring）的差異
- 何時用 KnowledgePage、何時用 Article 的業務規則
- Block editor 與 markdown-only 編輯模式的適用範圍
- 未來合並 vs 保持分離的 trade-off

#### `07-source-to-knowledge-pipeline.md`（~170 lines）

Source → KnowledgeArtifact 管線討論：
- py_fn 解析結果如何觸發 notion 的 KnowledgePage 建立
- Task materialization workflow 的設計（見 ADR 0012）
- MarkItDown 轉換品質驗證策略
- ingestion 失敗時的 retry 與 dead-letter 處理

#### `08-platform-service-api-design.md`（~190 lines）

platform Service API 設計討論：
- FileAPI.uploadUserFile vs StorageAPI.upload 的語意分離原因
- PermissionAPI.can() 的 resource path 設計
- Cross-domain API 版本化策略
- Service API 測試策略（mock boundary testing）

## Decision

**不實施**。僅記錄缺口。

`06-knowledge-page-vs-article.md` 與 `07-source-to-knowledge-pipeline.md` 是優先重建候選，因為對應的 notion 與 notebooklm 子域蒸餾（ADR 6104-6106）需要這兩份討論作為設計依據。

## Consequences

- 跨域邊界決策缺乏討論背景，後進開發者無法理解設計取捨原因。
- RAG 策略（討論 01）與 AI 路由策略（討論 04）是生產關鍵決策，缺失後只能靠 ADR 0012 和 copilot-instructions.md 的片段規則推斷。

## 關聯 ADR

- **0012** Source-To-Task Orchestration：討論 07 是 ADR 0012 的詳細設計背景。
- **6108** platform API contracts：討論 08 是 contracts.ts 的設計背景。
- **6114** docs/semantic-model.md：討論 05 的 workspace isolation 模型是 semantic model 的語意約束來源。
