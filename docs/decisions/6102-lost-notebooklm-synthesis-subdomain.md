# 6102 Migration Gap — notebooklm `synthesis` 子域

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > notebooklm

## Context

`xuanwu-app-skill` 快照的 `modules/notebooklm/subdomains/synthesis/` 包含完整的 RAG 問答與合成能力的 domain model。

對應的 `src/modules/notebooklm/` 沒有獨立的 synthesis 子域。

### 遺失的 Domain Entities（domain/entities/）

```
synthesis/domain/entities/
  SynthesisResult.ts        (45 lines) — 合成結果聚合
  rag-query.entities.ts     (43 lines) — RAG 查詢實體
  retrieval.entities.ts     (46 lines) — 向量檢索實體（chunk、score、source ref）
  generation.entities.ts    (47 lines) — LLM 生成實體（token usage、confidence）
```

### 遺失的 Domain Services（domain/services/）

```
synthesis/domain/services/
  CitationBuilder.ts         (27 lines) — 引用來源構建服務
  RagScoringService.ts       (24 lines) — 相關性評分服務
  RagPromptBuilder.ts        (14 lines) — RAG prompt 組裝服務
```

### 遺失的 Domain Ports（domain/ports/）

```
synthesis/domain/ports/
  VectorStore.ts             (69 lines) — 完整向量存儲介面
    methods: upsert, query, delete, getStats, listNamespaces
  RagGenerationPort.ts       — LLM 生成抽象介面
  RetrievalPort.ts           — 向量檢索抽象介面
```

### 遺失的 Domain Value Objects

```
synthesis/domain/value-objects/
  QueryVector.ts             — 查詢向量品牌型別
  RetrievalScore.ts          — 相關性分數（0.0–1.0）
  SynthesisContext.ts        — 合成上下文（grounding chunks + prompt）
  CitationReference.ts       — 引用文獻參考
```

### 遺失的 Application Use Cases

```
synthesis/application/use-cases/
  synthesize-answer.use-case.ts        — 主流程：query → retrieve → generate → cite
  retrieve-relevant-chunks.use-case.ts — 純檢索流程
  evaluate-synthesis-quality.use-case.ts — 評估合成品質
```

## Decision

**不實施**。僅記錄缺口。

`VectorStore.ts`（69 lines）是最關鍵的 port，需優先在 `src/modules/notebooklm/subdomains/synthesis/domain/ports/` 中還原。

## Consequences

- 沒有 VectorStore port，notebooklm 的向量檢索流程無 port 可注入適配器。
- `CitationBuilder` 與 `RagScoringService` 缺失導致合成結果無法帶有可信引用。

## 關聯 ADR

- **6101** notebooklm source 子域：ingestion 完成後寫入 VectorStore，synthesis 才能查詢。
- **6103** notebooklm interfaces 層：RagQueryPanel 呼叫 synthesis use case。
