# 6111 Migration Gap — ai 5 個缺失子域

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > ai

## Context

`xuanwu-app-skill` 快照的 `modules/ai/subdomains/` 有 15 個子域。對應的 `src/modules/ai/subdomains/` 有 10 個子域，但其中有 5 個在舊版中存在的子域完全沒有對應。

### 遺失的 5 個子域

#### 1. `conversations`

```
conversations/domain/
  ConversationSession.ts    — 對話 session 聚合根
  Message.ts                — 訊息實體（role: user/assistant/system）
  ConversationContext.ts    — 對話上下文 value object
conversations/application/
  StartConversation.use-case.ts
  SendMessage.use-case.ts
  EndConversation.use-case.ts
  GetConversationHistory.use-case.ts
```

職責：管理 AI 對話的 session 生命週期。與 notebooklm 的 ConversationPanel（ADR 6103）直接關聯。

#### 2. `datasets`

```
datasets/domain/
  Dataset.ts                — 資料集聚合根（用於 fine-tuning / evaluation）
  DatasetRecord.ts          — 資料集記錄（input/expected_output pair）
  DatasetVersion.ts         — 版本化管理
datasets/application/
  CreateDataset.use-case.ts
  AddRecord.use-case.ts
  ExportDataset.use-case.ts
```

職責：管理訓練與評估資料集的生命週期。

#### 3. `personas`

```
personas/domain/
  Persona.ts                — AI 角色聚合根（name, description, defaultPromptTemplate）
  PersonaCapability.ts      — 角色能力 value object
personas/application/
  CreatePersona.use-case.ts
  UpdatePersona.use-case.ts
  AssignPersonaToConversation.use-case.ts
```

職責：管理 AI 角色（persona）的定義與分配，與 prompt-pipeline（ADR 6110）的 PromptTemplate 整合。

#### 4. `safety-guardrail`

```
safety-guardrail/domain/
  SafetyPolicy.ts           — 安全政策聚合根
  ContentFilterRule.ts      — 內容過濾規則 entity
  GuardrailViolation.ts     — 違規記錄 value object
safety-guardrail/application/
  EvaluateSafetyPolicy.use-case.ts
  RecordViolation.use-case.ts
  UpdateSafetyPolicy.use-case.ts
```

職責：AI 輸出的安全護欄，在 platform.ai adapter 層執行過濾。

#### 5. `model-observability`

```
model-observability/domain/
  ModelTrace.ts             — 模型呼叫追蹤記錄
  LatencyMetric.ts          — 延遲指標 value object
  TokenUsageRecord.ts       — Token 使用記錄
model-observability/application/
  RecordModelTrace.use-case.ts
  QueryModelMetrics.use-case.ts
```

職責：收集 AI 模型呼叫的可觀測性指標（trace、latency、token usage）。

## Decision

**不實施**。僅記錄缺口。

`safety-guardrail` 與 `model-observability` 具有最高業務優先順序，因為它們直接關係到 AI 安全合規與生產穩定性。`conversations` 次之（與 notebooklm UX 直接掛鉤）。

## Consequences

- 無 `conversations` 子域，ai 模組缺少對話 session 生命週期管理能力。
- 無 `safety-guardrail`，AI 輸出無安全護欄，違反 platform.ai 的 safety policy 治理規則。
- 無 `model-observability`，生產環境 AI 呼叫無 trace/latency 可觀測。

## 關聯 ADR

- **6103** notebooklm interfaces 層：useAiChatThread hook 依賴 `conversations` 子域。
- **6110** ai prompt-pipeline 子域：`personas` 子域引用 PromptTemplate。
- **6112** ai governance docs：舊版 `subdomains.instructions.md` 有這 5 個子域的設計規格。
