# 6110 Migration Gap — ai `prompt-pipeline` 子域


> ⚠️ **本文件為「僅記錄」文件 — 不執行實施**
> 此 ADR 的唯一目的是記錄遷移缺口，作為未來蒸餾工作的基線參考。
> **任何 agent 或開發者不得依據本文件直接新增、修改或刪除任何程式碼。**

- Status: ⛔ 僅記錄 — 不實施（Record Only — Do Not Implement）
- Date: 2026-04-17
- Category: Migration Gap > ai

## Context

`xuanwu-app-skill` 快照的 `modules/ai/subdomains/prompt-pipeline/` 包含 PromptTemplate 完整 domain model（224 lines）與 Pipeline use cases（104 lines）。

對應的 `src/modules/ai/subdomains/pipeline/` 的 use cases 檔案只有 **1 行**（空 stub），損失率接近 100%。

### 遺失的 Domain Model（domain/index.ts — 224 lines）

```typescript
// PromptTemplate 完整 domain model 包含：

export interface PromptTemplate {
  id: PromptTemplateId;
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: PromptVariable[];
  version: number;
  targetModel: ModelIdentifier;
  category: PromptCategory;
}

export type PromptVariable = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  required: boolean;
  defaultValue?: string;
};

export type PromptCategory =
  | 'synthesis'
  | 'extraction'
  | 'classification'
  | 'summarization'
  | 'transformation';

export interface PipelineStep {
  stepId: PipelineStepId;
  promptTemplateId: PromptTemplateId;
  inputMapping: Record<string, string>;
  outputMapping: Record<string, string>;
  retryPolicy: RetryPolicy;
}

export interface Pipeline {
  id: PipelineId;
  name: string;
  steps: PipelineStep[];
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}
// ... 加上相關 value objects、domain events（共 224 lines）
```

### 遺失的 Application Use Cases（application/index.ts — 104 lines）

```
CreatePromptTemplate.use-case.ts      — 新建 prompt template
UpdatePromptTemplate.use-case.ts      — 更新（版本化）
DeletePromptTemplate.use-case.ts      — 刪除
ClonePromptTemplate.use-case.ts       — 從現有模板複製
ExecutePipeline.use-case.ts           — 執行多步驟 pipeline
ValidatePipelineSchema.use-case.ts    — 驗證 input/output schema
```

### 現狀對比

```
舊（xuanwu-app-skill）:
  modules/ai/subdomains/prompt-pipeline/domain/index.ts    → 224 lines（完整 domain）
  modules/ai/subdomains/prompt-pipeline/application/index.ts → 104 lines（6 use cases）

新（xuanwu-skill）:
  src/modules/ai/subdomains/pipeline/application/PipelineUseCases.ts → 1 line（空 stub）
```

## Decision

**不實施**。僅記錄缺口。

`PromptTemplate` domain model（224 lines）包含 AI prompt 管理的完整語意，是 notebooklm synthesis flow 的基礎。應在 ai 子域蒸餾時以此為參考。

## Consequences

- platform.ai 無法提供 prompt template 管理能力給 notebooklm/notion 消費。
- Genkit flow 定義中的 prompt 目前只能以硬編碼字串存在，無版本化管理。

## 關聯 ADR

- **6102** notebooklm synthesis 子域：RagPromptBuilder 使用 prompt-pipeline 提供的模板。
- **6111** ai 缺失子域：prompt-pipeline 與 personas 子域有設計重疊（persona 可持有預設 prompt template）。
