# Files

## File: modules/ai/domain/shared/DomainError.ts
````typescript

````

## File: modules/ai/domain/shared/Result.ts
````typescript

````

## File: modules/ai/infrastructure/llm/built-in-tools.ts
````typescript
/**
 * Built-in Genkit tool definitions for the ai bounded context.
 *
 * All tools are registered on the shared `aiClient` from `genkit-shared.ts`.
 * Adapters that need to use these tools in `aiClient.generate({ tools: [...] })`
 * must import the instances from here — do NOT re-define tools on a separate instance.
 */
⋮----
import { z } from "genkit";
⋮----
import type { ToolDescriptor } from "../../subdomains/tool-runtime/domain/ports/ToolRuntimePort";
⋮----
import { aiClient } from "./genkit-shared";
⋮----
// ── Tool definitions ──────────────────────────────────────────────────────────
⋮----
/**
 * Tool: ai.getCurrentDatetime
 *
 * Returns the current date and time in ISO 8601 format together with the
 * server IANA timezone identifier.  Use whenever the prompt involves
 * "today", "now", or any relative date/time calculation.
 */
⋮----
/**
 * Tool: ai.evaluateMathExpression
 *
 * Safely evaluates an arithmetic expression that contains only digits, spaces,
 * and the operators +, -, *, /, and parentheses. The inputSchema regex
 * enforces this constraint so arbitrary code execution is not possible.
 */
⋮----
// Safe: expression is validated by inputSchema regex to contain only
// digits, spaces, and arithmetic operators (+, -, *, /, ., ())
// eslint-disable-next-line @typescript-eslint/no-implied-eval
⋮----
// ── Registry ──────────────────────────────────────────────────────────────────
⋮----
export interface RegisteredBuiltInTool {
  readonly descriptor: ToolDescriptor;
  // Tool instance type varies across Genkit versions; typed as unknown to avoid
  // coupling to Genkit internals while remaining compatible.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly instance: any;
}
⋮----
// Tool instance type varies across Genkit versions; typed as unknown to avoid
// coupling to Genkit internals while remaining compatible.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
⋮----
/**
 * Complete list of built-in tools registered on the shared aiClient.
 * Use `BUILT_IN_TOOLS` to look up tool instances by descriptor name when
 * passing tools to `aiClient.generate()`.
 */
````

## File: modules/ai/infrastructure/llm/genkit-shared.ts
````typescript
/**
 * Shared Genkit client for the ai bounded context.
 *
 * All Genkit adapters within modules/ai must import `aiClient` from this
 * module rather than creating their own `genkit()` instances. This ensures
 * that tool definitions and generation calls are bound to the same registry,
 * which is required for tool-calling to work correctly in Genkit.
 */
⋮----
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
⋮----
/** Resolved model name: env override or default. */
⋮----
/** True when the Google Generative AI API key is present in the environment. */
⋮----
/**
 * Shared Genkit instance for the ai bounded context.
 *
 * Do NOT call `genkit()` in subdomain infrastructure adapters.
 * Import this singleton instead so all adapters share one registry.
 */
````

## File: modules/ai/interfaces/index.ts
````typescript
/** ai/interfaces — reserved for future AI UI and route composition. */
````

## File: modules/ai/subdomains/content-distillation/application/use-cases/distill-content.use-case.ts
````typescript
import type { DistillContentInput, DistillationPort, DistillationResult } from "../../domain/ports/DistillationPort";
⋮----
export class DistillContentUseCase {
⋮----
constructor(private readonly distillationPort: DistillationPort)
⋮----
async execute(input: DistillContentInput): Promise<DistillationResult>
````

## File: modules/ai/subdomains/content-distillation/application/use-cases/extract-tasks-from-content.use-case.ts
````typescript
import type {
  TaskExtractionInput,
  TaskExtractionOutput,
  TaskExtractionPort,
} from "../../domain/ports/DistillationPort";
⋮----
export class ExtractTasksFromContentUseCase {
⋮----
constructor(private readonly taskExtractionPort: TaskExtractionPort)
⋮----
async execute(input: TaskExtractionInput): Promise<TaskExtractionOutput>
````

## File: modules/ai/subdomains/content-distillation/domain/index.ts
````typescript

````

## File: modules/ai/subdomains/content-generation/api/server.ts
````typescript
/**
 * AI generation — server-only API.
 *
 * Composition root + functions that depend on server-only packages such as Genkit.
 * Must only be imported in Server Actions, route handlers, or server-side
 * infrastructure adapters.
 */
⋮----
import { GenerateAiTextUseCase } from "../application/use-cases/generate-ai-text.use-case";
import { GenkitAiTextGenerationAdapter } from "../../../infrastructure/generation/genkit/GenkitAiTextGenerationAdapter";
import type { GenerateAiTextInput, GenerateAiTextOutput } from "../domain/ports/AiTextGenerationPort";
⋮----
function getUseCase(): GenerateAiTextUseCase
⋮----
export async function generateAiText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>
⋮----
export async function summarize(text: string, model?: string): Promise<string>
````

## File: modules/ai/subdomains/content-generation/application/index.ts
````typescript

````

## File: modules/ai/subdomains/content-generation/application/use-cases/generate-ai-text.use-case.ts
````typescript
import type {
  AiTextGenerationPort,
  GenerateAiTextInput,
  GenerateAiTextOutput,
} from "../../domain/ports/AiTextGenerationPort";
⋮----
export class GenerateAiTextUseCase {
⋮----
constructor(private readonly generationPort: AiTextGenerationPort)
⋮----
execute(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>
````

## File: modules/ai/subdomains/content-generation/domain/index.ts
````typescript

````

## File: modules/ai/subdomains/content-generation/domain/ports/AiTextGenerationPort.ts
````typescript
export interface GenerateAiTextInput {
  readonly prompt: string;
  readonly system?: string;
  readonly model?: string;
}
⋮----
export interface GenerateAiTextOutput {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
⋮----
export interface AiTextGenerationPort {
  generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>;
}
⋮----
generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>;
````

## File: modules/ai/subdomains/context-assembly/api/index.ts
````typescript
/** ai/context/api — minimal public boundary stub. */
````

## File: modules/ai/subdomains/context-assembly/application/index.ts
````typescript
/** ai/context/application — minimal orchestration stub. */
````

## File: modules/ai/subdomains/context-assembly/domain/index.ts
````typescript
/** ai/context/domain — minimal domain stub. */
````

## File: modules/ai/subdomains/conversations/README.md
````markdown
# conversations — 對話群組與上下文歷史視窗

## 子域目的

管理對話群組（Thread）的生命週期，以及上下文歷史視窗（Context History Window）的組裝與裁切邏輯。此子域是 `ai` bounded context 對「多輪對話的連續性與範圍」的正典知識邊界。

## 業務能力邊界

**負責：**
- Thread 的建立、封存與狀態追蹤
- Context History Window 的組裝（哪些訊息進入當前推理的 context）
- 視窗裁切策略（sliding window、summarization threshold）
- Thread 與 Notebook / Workspace 的關聯追蹤

**不負責：**
- 單次訊息的原子寫入（屬於 `messages` 子域）
- 實際推理執行（屬於 `inference` 子域）
- Conversation 的 UI 呈現（屬於 `notebooklm/interfaces/` 層）
- Notebook 的正典所有者（屬於 `notebooklm` bounded context）

## conversations vs messages 分工

| 關注點 | conversations | messages |
|--------|---------------|---------|
| Thread 生命週期 | ✅ 正典所有者 | 不關心 |
| Context Window 組裝 | ✅ 正典所有者 | 不關心 |
| 單次訊息原子寫入 | 消費訊息列表 | ✅ 正典所有者 |
| 訊息角色（User/Assistant）| 不關心 | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Thread | 對話群組聚合根，攜帶狀態、關聯 scope 與訊息參考清單 |
| ContextHistoryWindow | 從 Thread 中選取、排序後送入推理的訊息視窗 |
| WindowPolicy | 視窗裁切策略值對象（max tokens、message count、strategy） |
| ThreadStatus | `active` / `archived` / `summarized` |

## 架構層級

```
conversations/
  api/              ← 對外公開 Thread 查詢與 Context Window 組裝能力
  domain/
    entities/       ← Thread
    value-objects/  ← ContextHistoryWindow, WindowPolicy, ThreadStatus
    repositories/   ← ThreadRepository（介面）
    events/         ← ThreadCreated, ThreadArchived, ContextWindowAssembled
  application/
    use-cases/      ← CreateThread, ArchiveThread, AssembleContextWindow
```

## Ubiquitous Language

- **Thread**：對話群組的聚合根，不直接持有訊息內容（持有訊息 ID 引用）
- **ContextHistoryWindow**：推理前的訊息視窗快照，是短暫的組裝產物
- **WindowPolicy**：決定哪些訊息進入 context 的裁切策略（不是 UI 分頁設定）
- **ThreadArchived**：Thread 完成對話後進入不可再寫入的終態事實
````

## File: modules/ai/subdomains/datasets/README.md
````markdown
# datasets — 訓練集、驗證集與合成資料存儲

## 子域目的

定義 Training/Validation Set 的結構契約、資料清洗後的快照（Data Snapshot），以及蒸餾過程（Distillation）生成的合成資料存儲（Synthetic Data Store）。此子域是 `ai` bounded context 對「AI 訓練材料與合成輸出的正典資料結構」的知識邊界。

## 業務能力邊界

**負責：**
- Training Set 與 Validation Set 的結構定義與版本化
- 資料清洗後快照（Snapshot）的建立、追蹤與不可變性保護
- 蒸餾過程生成的合成資料（Synthetic Data）存儲與目錄管理
- Dataset 的 lineage 追溯（從來源到快照的可追溯鏈）

**不負責：**
- 資料清洗與正規化的執行（屬於 `py_fn/` runtime 的 ingestion pipeline）
- 模型訓練的觸發與監控（外部系統，非本 bounded context 職責）
- 原始來源文件管理（屬於 `notebooklm/source` 子域）
- Embedding 向量的生成與存儲（屬於 `embeddings` 子域）
- Chunking 策略（屬於 `py_fn/` runtime）

## datasets vs embeddings vs py_fn 分工

| 關注點 | datasets | embeddings | py_fn |
|--------|----------|------------|-------|
| 訓練/驗證集結構 | ✅ 正典所有者 | 不關心 | 消費者 |
| 清洗後快照 | ✅ 正典所有者 | 不關心 | 寫入者 |
| 合成資料存儲 | ✅ 正典所有者 | 不關心 | 不關心 |
| Embedding 向量 | 不關心 | ✅ 正典所有者 | 寫入者 |
| Chunking 執行 | 不關心 | 不關心 | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Dataset | 訓練或驗證用的資料集聚合根，含 split 類型、版本與 lineage 引用 |
| DataSplit | `training` / `validation` / `test` 的資料集分割標記 |
| DataSnapshot | 資料清洗完成後的不可變快照；攜帶清洗版本、來源引用與時間戳 |
| SyntheticRecord | 蒸餾過程生成的合成資料單筆記錄，含生成模型版本與品質分數 |
| DataLineage | 從原始來源到快照的可追溯鏈值對象 |

## 架構層級

```
datasets/
  api/              ← 對外公開 Dataset 查詢與 Snapshot 上架能力
  domain/
    entities/       ← Dataset, DataSnapshot, SyntheticRecord
    value-objects/  ← DataSplit, DataLineage, SnapshotVersion, QualityScore
    repositories/   ← DatasetRepository, DataSnapshotRepository（介面）
    events/         ← DataSnapshotCreated, SyntheticDataStored, DatasetVersioned
  application/
    use-cases/      ← RegisterDataSnapshot, StoreSyntheticData, GetDataset, ListSnapshots
```

## py_fn 邊界說明

- `py_fn` 的 ingestion pipeline 負責執行清洗並**寫入** `DataSnapshot`
- 本子域定義 `DataSnapshot` 的**結構合約**，`py_fn` 依此合約寫入，不自行定義結構
- 交接點：`py_fn` 寫完後發出 Firestore 事件或直接呼叫 `RegisterDataSnapshot` use case

## Ubiquitous Language

- **Dataset**：訓練材料的正典聚合根（不是 Firestore collection 名稱）
- **DataSnapshot**：清洗完成後的不可變事實記錄（不是 DB backup）
- **SyntheticRecord**：蒸餾輸出的合成資料單元，攜帶生成可追溯性（不是隨機生成資料）
- **DataLineage**：從原始來源 → 清洗 → 快照的完整追溯路徑（不等於 audit log）
- **DataSplit**：資料集的語意用途分割（training/validation/test），不是技術分頁
````

## File: modules/ai/subdomains/embeddings/README.md
````markdown
# embeddings — 向量化結果與索引

## 子域目的

管理文本與圖像的向量化結果（Embedding）、維度（Dimensions）規範，以及向量索引實體的生命週期。此子域是 `ai` bounded context 對「已向量化知識」的正典知識邊界，為下游的 retrieval 工作流提供穩定的索引契約。

## 業務能力邊界

**負責：**
- Embedding 向量的生成請求協調與結果持久化
- 向量維度（Dimensions）規範與一致性保護
- 向量索引實體（Index Entry）的 CRUD 與版本化
- Embedding 模型識別符與版本追蹤

**不負責：**
- 向量搜尋與召回（屬於 `notebooklm/retrieval` 子域）
- Knowledge Artifact 的原始內容（屬於 `notion` bounded context）
- Chunking 策略（屬於 `py_fn/` 工作流）
- Embedding 模型的供應商路由（屬於 `models` 子域）

## 核心概念

| 概念 | 說明 |
|------|------|
| EmbeddingVector | 已向量化的浮點數組，攜帶維度與模型來源 |
| IndexEntry | 可定址的向量索引實體（含 chunk ID、向量、metadata）|
| EmbeddingModel | 向量化所使用的模型識別符與維度規範 |
| Dimensions | 向量維度數值；同一索引內必須一致 |

## 架構層級

```
embeddings/
  api/              ← 對外公開 Embedding 能力（generate、lookup）
  domain/
    entities/       ← IndexEntry
    value-objects/  ← EmbeddingVector, EmbeddingModel, Dimensions
    repositories/   ← IndexEntryRepository（介面）
    ports/          ← EmbeddingProviderPort（外部模型呼叫抽象）
  application/
    use-cases/      ← GenerateEmbedding, UpsertIndexEntry
```

## 與 py_fn 的邊界

- `py_fn/` 擁有 chunking 與 embedding pipeline 的執行端
- 執行完成後透過 Firestore 寫入 index entry；本子域定義索引實體的 schema 合約
- 本子域不直接呼叫 `py_fn/`；`py_fn/` 透過事件或 Firestore 觸發寫入

## Ubiquitous Language

- **EmbeddingVector**：特定模型在特定維度下生成的向量表示（不是模型物件）
- **IndexEntry**：可被 retrieval 消費的向量化單元，包含 chunk 追溯資訊
- **Dimensions**：維度一致性約束；跨 IndexEntry 維度不一致即為 invariant 違反
- **EmbeddingModel**：向量化時使用的模型版本，影響維度與語意空間
````

## File: modules/ai/subdomains/evaluation-policy/api/index.ts
````typescript
/** ai/evaluation/api — minimal public boundary stub. */
````

## File: modules/ai/subdomains/evaluation-policy/application/index.ts
````typescript
/** ai/evaluation/application — minimal orchestration stub. */
````

## File: modules/ai/subdomains/evaluation-policy/domain/index.ts
````typescript
/** ai/evaluation/domain — minimal domain stub. */
````

## File: modules/ai/subdomains/memory-context/api/index.ts
````typescript
/** ai/memory/api — minimal public boundary stub. */
````

## File: modules/ai/subdomains/memory-context/application/index.ts
````typescript
/** ai/memory/application — minimal orchestration stub. */
````

## File: modules/ai/subdomains/memory-context/domain/index.ts
````typescript
/** ai/memory/domain — minimal domain stub. */
````

## File: modules/ai/subdomains/messages/README.md
````markdown
# messages — 對話訊息原子單位

## 子域目的

管理單次對話的原子訊息實體，涵蓋四種角色：`User`、`Assistant`、`System`、`Tool Return`。此子域是 `ai` bounded context 對「每一條訊息的身份、內容與可追溯性」的正典知識邊界。

## 業務能力邊界

**負責：**
- 訊息實體的建立、版本化與不可變性保護
- 訊息角色（Role）的正典分類與語意區分
- Tool Return 訊息的結構化格式與工具呼叫追溯
- 訊息的持久化契約與查詢

**不負責：**
- Thread 的組裝或 Context Window 的裁切（屬於 `conversations` 子域）
- 推理執行（屬於 `inference` 子域）
- Tool 定義（屬於 `tools` 子域）
- 訊息的 UI 渲染（屬於 `interfaces/` 層）

## 四種訊息角色

| 角色 | 說明 |
|------|------|
| `user` | 使用者輸入；通常是自然語言提問或指令 |
| `assistant` | 模型回覆；可能包含 tool call 請求 |
| `system` | 系統提示詞；設定行為邊界與 persona |
| `tool` | Function Calling 的工具回傳結果 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Message | 訊息聚合根；包含 role、content、timestamp 與 traceId |
| MessageRole | `user` / `assistant` / `system` / `tool` 的值對象枚舉 |
| ToolCallPayload | `assistant` 訊息中的 Function Calling 請求結構 |
| ToolReturnPayload | `tool` 角色訊息的工具回傳結構 |

## 架構層級

```
messages/
  api/              ← 對外公開訊息讀寫能力
  domain/
    entities/       ← Message
    value-objects/  ← MessageRole, ToolCallPayload, ToolReturnPayload, MessageContent
    repositories/   ← MessageRepository（介面）
    events/         ← MessageCreated, ToolCallDispatched, ToolReturnReceived
  application/
    use-cases/      ← CreateUserMessage, RecordAssistantMessage, RecordToolReturn
```

## 不變條件（Invariants）

- `Message.role` 建立後不可變更
- `tool` 角色的訊息必須攜帶有效的 `toolCallId` 以追溯呼叫來源
- `Message.content` 建立後視為事實，不可靜默覆寫（需建立新版本訊息）

## Ubiquitous Language

- **Message**：不可變的對話原子事實（不是 UI 訊息泡泡）
- **MessageRole**：訊息的語意身份，不是顯示名稱
- **ToolCallPayload**：`assistant` 請求工具執行的結構化意圖
- **ToolReturnPayload**：工具執行完成後的結構化事實回傳
````

## File: modules/ai/subdomains/model-observability/api/index.ts
````typescript
/** ai/tracing/api — minimal public boundary stub. */
````

## File: modules/ai/subdomains/model-observability/application/index.ts
````typescript
/** ai/tracing/application — minimal orchestration stub. */
````

## File: modules/ai/subdomains/model-observability/domain/index.ts
````typescript
/** ai/tracing/domain — minimal domain stub. */
````

## File: modules/ai/subdomains/models/README.md
````markdown
# models — LLM 模型供應商適配器

## 子域目的

管理 LLM 供應商的適配器定義、支援的 Context Window 上限，以及模型端點（Endpoint）配置。此子域是 `ai` bounded context 對「哪些模型可用、各自的能力邊界在哪」的正典知識邊界。

## 業務能力邊界

**負責：**
- LLM 供應商（Google Gemini、OpenAI、Anthropic 等）的 Adapter 定義
- 每個模型支援的 Context Window（輸入/輸出 token 上限）
- API 端點（Endpoint）地址與版本配置
- 模型識別符（model ID）的正典命名與版本化

**不負責：**
- 模型的實際呼叫執行（屬於 `inference` 或 `tool-runtime` 子域）
- Provider 路由策略（屬於 `model-observability` 子域的監測信號）
- 計費與 token 用量計算（屬於 `tokens` 子域）
- Prompt 內容（屬於 `prompt-pipeline` / `prompts` 子域）

## 核心概念

| 概念 | 說明 |
|------|------|
| ModelDescriptor | 模型識別符、Provider、Context Window、支援能力的值對象 |
| ProviderAdapter | 供應商 SDK 邊界抽象；Infrastructure 層實作 |
| Endpoint | 模型 API 端點配置，包含 URL、版本與認證方式 |
| ContextWindow | 輸入/輸出 token 上限的值對象 |

## 架構層級

```
models/
  api/          ← 對外公開模型目錄查詢能力（只讀）
  domain/
    entities/   ← ModelDescriptor
    value-objects/ ← ContextWindow, Endpoint
    repositories/  ← ModelRepository（介面）
  application/
    use-cases/  ← ListAvailableModels, GetModelCapabilities
```

## 依賴方向

- 本子域不依賴其他 AI 子域的 domain 層
- 消費者（`content-generation`、`tool-runtime`、`inference`）透過 `api/` 查詢模型能力
- Provider SDK 只存在於 `infrastructure/` 的 Adapter 實作中

## Ubiquitous Language

- **ModelDescriptor**：模型的完整能力描述（不是 SDK 物件）
- **Provider**：LLM 服務供應商，如 `googleai`、`openai`
- **Context Window**：一次推理請求可處理的最大 token 邊界
- **Endpoint**：模型 API 的可定址端點配置
````

## File: modules/ai/subdomains/personas/README.md
````markdown
# personas — 系統人設與語氣約束

## 子域目的

管理系統級人設（Persona）、語氣約束（Tone Constraint），以及特定領域知識配置（Domain Knowledge Profile）。此子域是 `ai` bounded context 對「AI 如何呈現自己、以什麼語氣與知識框架回應」的正典知識邊界。

## 業務能力邊界

**負責：**
- Persona 實體的定義、版本化與發布
- 語氣約束（正式/非正式、簡潔/詳細、主動/被動）的宣告
- 特定領域知識配置（如：法律、醫療、工程）的範疇標記
- Persona 的啟用/停用狀態管理

**不負責：**
- 系統提示詞的組裝執行（屬於 `prompt-pipeline` 子域）
- 模型安全性過濾（屬於 `safety-guardrail` 子域）
- 跨對話的記憶持久化（屬於 `memory-context` 子域）
- AI 實際回覆的內容生成（屬於 `content-generation` 子域）

## personas vs prompts 分工

| 關注點 | personas | prompts |
|--------|----------|---------|
| 行為身份與語氣 | ✅ 正典所有者 | 不關心 |
| 領域知識配置 | ✅ 正典所有者 | 不關心 |
| 提示詞版本控制 | 消費 Persona 配置 | ✅ 正典所有者 |
| 輸入變數定義 | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| Persona | AI 的行為身份宣告，含 name、tone、domain 與 system instruction 片段 |
| ToneConstraint | 語氣約束值對象（formality、verbosity、voice 等維度）|
| DomainKnowledgeProfile | 領域知識配置，標記哪些 domain 範疇被啟用 |
| PersonaVersion | 語意版本化的 Persona 版本，保護依賴此 Persona 的 Prompt 相容性 |

## 架構層級

```
personas/
  api/              ← 對外公開 Persona 查詢能力
  domain/
    entities/       ← Persona
    value-objects/  ← ToneConstraint, DomainKnowledgeProfile, PersonaVersion
    repositories/   ← PersonaRepository（介面）
    events/         ← PersonaPublished, PersonaDeprecated
  application/
    use-cases/      ← PublishPersona, GetActivePersona, ListPersonas
```

## 設計備註

- `Persona` 只宣告「AI 是誰」，不直接等於 system prompt 字串
- `prompt-pipeline` 在組裝時將 `Persona` 的 `systemInstructionFragment` 注入 prompt 模板
- 多個 `ToneConstraint` 維度可同時作用（如：`formality: formal` + `verbosity: concise`）

## Ubiquitous Language

- **Persona**：AI 行為身份的正典宣告（不是角色扮演劇本）
- **ToneConstraint**：語言風格的多維度約束（不是 UI 的主題風格）
- **DomainKnowledgeProfile**：知識框架的範疇宣告（不是訓練資料集描述）
- **PersonaDeprecated**：Persona 進入不可再新建依賴的終態事實
````

## File: modules/ai/subdomains/prompts/README.md
````markdown
# prompts — 系統提示詞模板管理

## 子域目的

管理系統提示詞模板的版本控制、輸入變數定義，以及靜態約束（tone、format、safety boundary）。此子域是「提示詞作為第一級資產」的正典知識邊界，與執行時期的 prompt 組裝（`prompt-pipeline`）形成分工。

## 業務能力邊界

**負責：**
- 系統提示詞模板的版本化儲存與發布
- 模板輸入變數（Variables）的型別與必填規範定義
- 靜態約束宣告：語氣（tone）、輸出格式（format）、安全邊界（safety boundary）
- 模板的查詢與召回（依 family、version、intent）

**不負責：**
- 動態 prompt 組裝與 context window 填充（屬於 `prompt-pipeline` 子域）
- 模型呼叫執行（屬於 `inference` 子域）
- 模板品質評估（屬於 `evaluation-policy` 子域）
- Safety guardrail 執行（屬於 `safety-guardrail` 子域）

## prompts vs prompt-pipeline 分工

| 關注點 | prompts | prompt-pipeline |
|--------|---------|-----------------|
| 模板儲存 | ✅ 正典所有者 | 消費者 |
| 版本控制 | ✅ 正典所有者 | 不關心 |
| 動態組裝 | ❌ | ✅ 正典所有者 |
| Tool binding | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| PromptTemplate | 含版本號、family、輸入變數定義與靜態約束的值對象 |
| TemplateVariable | 模板輸入變數的名稱、型別與必填規範 |
| StaticConstraint | tone、output format、safety boundary 的宣告 |
| TemplateVersion | 語義版本化的版本識別符（major.minor.patch）|

## 架構層級

```
prompts/
  api/              ← 對外公開模板查詢能力
  domain/
    entities/       ← PromptTemplate
    value-objects/  ← TemplateVersion, TemplateVariable, StaticConstraint
    repositories/   ← PromptTemplateRepository（介面）
  application/
    use-cases/      ← GetPromptTemplate, ListPromptTemplates, PublishPromptTemplate
```

## Ubiquitous Language

- **PromptTemplate**：帶版本與靜態約束的提示詞資產（不是裸字串）
- **TemplateFamily**：同一業務意圖下的模板族群（如 `task-extraction`、`summarization`）
- **StaticConstraint**：編譯時期決定的語氣與格式邊界，不依賴執行時期 context
- **TemplateVariable**：組裝時必須填入的具名佔位符
````

## File: modules/ai/subdomains/safety-guardrail/api/index.ts
````typescript
/** ai/safety/api — minimal public boundary stub. */
````

## File: modules/ai/subdomains/safety-guardrail/application/index.ts
````typescript
/** ai/safety/application — minimal orchestration stub. */
````

## File: modules/ai/subdomains/safety-guardrail/domain/index.ts
````typescript
/** ai/safety/domain — minimal domain stub. */
````

## File: modules/ai/subdomains/tokens/README.md
````markdown
# tokens — 計費權重與使用量配額

## 子域目的

管理 AI 請求的 token 計費權重、使用量配額，以及每個模型端點的最大請求上限（Max Requests）配置。此子域是 `ai` bounded context 對「AI 資源消耗的可量化治理」的正典知識邊界。

## 業務能力邊界

**負責：**
- Token 的計費權重（pricing weight）定義與版本化
- Per-model / per-workspace / per-actor 的使用量配額設定
- 模型端點的 Max Requests 上限配置（rate limiting contract）
- Token 用量的記錄與配額核減

**不負責：**
- 財務計費與帳單生成（屬於 `billing` bounded context）
- 模型呼叫的實際執行（屬於 `inference` 子域）
- 供應商帳戶的 API key 管理（屬於 `platform/integration` 子域）
- Token 超限時的 UI 呈現（屬於 `interfaces/` 層）

## tokens vs billing 分工

| 關注點 | tokens | billing |
|--------|--------|---------|
| Token 計費權重 | ✅ 正典所有者 | 消費信號 |
| 使用量配額 | ✅ 正典所有者 | 消費信號 |
| 帳單生成 | ❌ | ✅ 正典所有者 |
| Entitlement 判定 | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| TokenUsageRecord | 單次 AI 請求的 input/output token 用量記錄 |
| TokenQuota | Per-scope（workspace/actor）可用 token 配額實體 |
| PricingWeight | 每個模型的 token 計費倍率值對象 |
| MaxRequests | 模型端點的請求頻率上限配置 |

## 架構層級

```
tokens/
  api/              ← 對外公開配額查詢與用量記錄入口
  domain/
    entities/       ← TokenQuota, TokenUsageRecord
    value-objects/  ← PricingWeight, MaxRequests, TokenCount
    repositories/   ← TokenQuotaRepository（介面）
    events/         ← TokenQuotaExceeded, TokenUsageRecorded
  application/
    use-cases/      ← RecordTokenUsage, CheckQuotaAvailability, UpdateModelPricing
```

## 事件合約

- `TokenQuotaExceeded` → 下游 `safety-guardrail` 可訂閱以阻擋後續請求
- `TokenUsageRecorded` → 下游 `billing/analytics` 消費計費信號

## Ubiquitous Language

- **TokenQuota**：在特定 scope 下可消耗的 token 上限（不是帳單金額）
- **PricingWeight**：模型使用的計費倍率（業務概念，非財務計算）
- **MaxRequests**：API 端點的速率上限，是模型端點的靜態配置
- **TokenUsageRecord**：不可變的用量事實記錄，不是即時計數器
````

## File: modules/ai/subdomains/tool-runtime/api/index.ts
````typescript
/**
 * Public API boundary for the AI tool-runtime subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions live in ./server.ts.
 */
⋮----
export interface ToolRuntimeAPI {
  generateWithTools(
    input: import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationInput,
  ): Promise<import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationOutput>;
  listAvailableTools(): ReadonlyArray<
    import("../domain/ports/ToolRuntimePort").ToolDescriptor
  >;
}
⋮----
generateWithTools(
    input: import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationInput,
  ): Promise<import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationOutput>;
listAvailableTools(): ReadonlyArray<
````

## File: modules/ai/subdomains/tool-runtime/application/index.ts
````typescript

````

## File: modules/ai/subdomains/tool-runtime/application/tool-runtime.test.ts
````typescript
import { describe, expect, it, vi } from "vitest";
⋮----
import { GenerateWithToolsUseCase } from "./use-cases/generate-with-tools.use-case";
import type { ToolRuntimePort } from "../domain/ports/ToolRuntimePort";
⋮----
function buildMockPort(overrides?: Partial<ToolRuntimePort>): ToolRuntimePort
````

## File: modules/ai/subdomains/tool-runtime/application/use-cases/generate-with-tools.use-case.ts
````typescript
import type {
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "../../domain/ports/ToolRuntimePort";
⋮----
export class GenerateWithToolsUseCase {
⋮----
constructor(private readonly toolRuntimePort: ToolRuntimePort)
⋮----
async execute(
    input: ToolEnabledGenerationInput,
): Promise<ToolEnabledGenerationOutput>
````

## File: modules/ai/subdomains/tool-runtime/domain/ports/TaskExtractionPort.ts
````typescript
/**
 * @module ai/subdomains/tool-runtime
 * @file domain/ports/TaskExtractionPort.ts
 * @description Domain port for AI-powered task extraction from content.
 * Framework-agnostic. No Genkit, Firebase, or HTTP client imports permitted here.
 */
⋮----
export interface ExtractedTaskItem {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
}
⋮----
export interface TaskExtractionInput {
  readonly content: string;
  readonly maxCandidates?: number;
}
⋮----
export interface TaskExtractionOutput {
  readonly tasks: ReadonlyArray<ExtractedTaskItem>;
}
⋮----
export interface TaskExtractionPort {
  extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
}
⋮----
extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
````

## File: modules/ai/subdomains/tool-runtime/domain/ports/ToolRuntimePort.ts
````typescript
/**
 * Tool Runtime domain port — framework-free contract for AI tool registration
 * and tool-enabled generation.
 *
 * This layer is intentionally framework-agnostic. No Genkit, Firebase, or
 * HTTP client imports are permitted here.
 */
⋮----
export interface ToolDescriptor {
  readonly name: string;
  readonly description: string;
}
⋮----
export interface ToolEnabledGenerationInput {
  readonly prompt: string;
  readonly system?: string;
  /** Names of registered tools to expose to the model during generation. */
  readonly toolNames: ReadonlyArray<string>;
  readonly model?: string;
}
⋮----
/** Names of registered tools to expose to the model during generation. */
⋮----
export interface ToolEnabledGenerationOutput {
  readonly text: string;
  /** Number of tool invocations that occurred during generation. */
  readonly toolCallsCount: number;
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}
⋮----
/** Number of tool invocations that occurred during generation. */
⋮----
export interface ToolRuntimePort {
  /**
   * Run AI generation with access to the specified registered tools.
   * The model may invoke zero or more tools during the generation loop.
   */
  generateWithTools(
    input: ToolEnabledGenerationInput,
  ): Promise<ToolEnabledGenerationOutput>;

  /** Returns metadata for all tools registered in this runtime. */
  listAvailableTools(): ReadonlyArray<ToolDescriptor>;
}
⋮----
/**
   * Run AI generation with access to the specified registered tools.
   * The model may invoke zero or more tools during the generation loop.
   */
generateWithTools(
    input: ToolEnabledGenerationInput,
  ): Promise<ToolEnabledGenerationOutput>;
⋮----
/** Returns metadata for all tools registered in this runtime. */
listAvailableTools(): ReadonlyArray<ToolDescriptor>;
````

## File: modules/ai/subdomains/tool-runtime/infrastructure/genkit/GenkitTaskExtractionAdapter.ts
````typescript
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
⋮----
import type {
  TaskExtractionInput,
  TaskExtractionOutput,
  TaskExtractionPort,
} from "../../domain/ports/TaskExtractionPort";
⋮----
export class GenkitTaskExtractionAdapter implements TaskExtractionPort {
⋮----
async extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>
````

## File: modules/ai/subdomains/tool-runtime/README.md
````markdown
# tool-runtime subdomain

## Purpose

The tool-runtime subdomain owns the registration and execution of AI tools
within the `ai` bounded context. It provides tool-enabled generation — the
ability to run `generate()` with one or more callable tools available to the
model.

## Responsibility

- define the `ToolRuntimePort` domain contract (framework-free)
- implement `GenkitToolRuntimeAdapter` with a registry of built-in tools
- expose `generateWithTools()` for downstream AI flows that need tool access
- expose `listAvailableTools()` for discovery and validation

## Built-in tools

| Tool name                    | Description                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| `ai.getCurrentDatetime`      | Returns current ISO 8601 datetime and IANA timezone                |
| `ai.evaluateMathExpression`  | Evaluates a safe arithmetic expression (regex-validated input)     |

## Non-Responsibility

- no flow definitions (`defineFlow`) — tool execution only
- no prompt registry (see `prompt-pipeline`)
- no content distillation (see `content-distillation`)
- no UI composition
- no cross-domain state mutation

## Extending the tool registry

Add a new tool in `infrastructure/genkit/GenkitToolRuntimeAdapter.ts`:

1. Define the tool with `aiClient.defineTool({ name: 'ai.<action>', ... })`
2. Add an entry to `REGISTERED_TOOLS` with `descriptor` + `instance`
3. Update this README's built-in tool table

Tool name convention: `<module>.<action>` in camelCase lower + `.` separator.

## Dependency direction

```
api → application → domain ← infrastructure
```
````

## File: modules/ai/subdomains/tools/README.md
````markdown
# tools — Function Calling 工具定義

## 子域目的

管理 Function Calling 的 JSON Schema 規範、工具描述檔（Tool Descriptor），以及工具的正典目錄。此子域是 `ai` bounded context 對「哪些工具存在、各自的輸入/輸出合約是什麼」的正典知識邊界。

> **注意**：此子域管理工具的**定義與目錄**；工具的**執行引擎**屬於 `tool-runtime` 子域。

## 業務能力邊界

**負責：**
- 工具的 JSON Schema 規範（`parameters`、`returns`）定義與版本化
- 工具描述檔（name、description、category）的正典管理
- 工具目錄（Tool Catalog）的查詢與發布
- 工具 schema 的相容性驗證（backward compatibility）

**不負責：**
- 工具的實際執行（屬於 `tool-runtime` 子域）
- AI 模型決定要呼叫哪個工具（屬於推理流程）
- Tool Return 訊息的持久化（屬於 `messages` 子域）
- 工具與 Prompt 的綁定（屬於 `prompt-pipeline` 子域）

## tools vs tool-runtime 分工

| 關注點 | tools | tool-runtime |
|--------|-------|--------------|
| JSON Schema 定義 | ✅ 正典所有者 | 消費者 |
| 工具目錄查詢 | ✅ 正典所有者 | 消費者 |
| 工具執行引擎 | ❌ | ✅ 正典所有者 |
| 執行結果回傳 | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| ToolDescriptor | 工具的完整宣告：name、description、parameters schema、returns schema |
| ToolCatalog | 已發布工具的聚合目錄，支援依 name、category 查詢 |
| ParametersSchema | 工具輸入的 JSON Schema 定義（Zod 轉換後的 OpenAPI 格式）|
| ToolVersion | 工具 schema 的語意版本，保護下游相容性 |

## 架構層級

```
tools/
  api/              ← 對外公開工具目錄查詢能力
  domain/
    entities/       ← ToolDescriptor
    value-objects/  ← ToolVersion, ParametersSchema, ToolCategory
    repositories/   ← ToolCatalogRepository（介面）
    events/         ← ToolDescriptorPublished, ToolDescriptorDeprecated
  application/
    use-cases/      ← PublishToolDescriptor, ListAvailableTools, GetToolDescriptor
```

## 與 Genkit 的邊界

- Genkit `defineTool()` 是 `tool-runtime` 的 Infrastructure 實作細節
- 本子域的 `ToolDescriptor` 是平台無關的正典定義，不依賴 Genkit SDK
- `tool-runtime` 在初始化時從本子域的 `ToolCatalog` 載入需要執行的工具描述

## Ubiquitous Language

- **ToolDescriptor**：工具的靜態合約（不是執行實體）
- **ToolCatalog**：已發布可用工具的正典目錄（不是執行佇列）
- **ParametersSchema**：輸入驗證的 JSON Schema（Zod 是實作，Schema 是合約）
- **DeprecatedTool**：已標記棄用但可能仍在執行中的工具狀態
````

## File: modules/ai/index.ts
````typescript
/**
 * modules/ai — public barrel.
 *
 * Client-safe types only. Server-only functions live in ./api/server.ts.
 * Cross-module consumers must import through this entry point.
 */
````

## File: modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts
````typescript
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
⋮----
import type {
  AiTextGenerationPort,
  GenerateAiTextInput,
  GenerateAiTextOutput,
} from "../../../subdomains/content-generation/domain/ports/AiTextGenerationPort";
⋮----
export class GenkitAiTextGenerationAdapter implements AiTextGenerationPort {
⋮----
async generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>
````

## File: modules/ai/subdomains/content-distillation/api/server.ts
````typescript
import { DistillContentUseCase } from "../application/use-cases/distill-content.use-case";
import { ExtractTasksFromContentUseCase } from "../application/use-cases/extract-tasks-from-content.use-case";
import { GenkitDistillationAdapter } from "../infrastructure/llm/GenkitDistillationAdapter";
import type {
  DistillContentInput,
  DistillationResult,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../domain/ports/DistillationPort";
⋮----
function getDistillUseCase(): DistillContentUseCase
⋮----
function getTaskExtractionUseCase(): ExtractTasksFromContentUseCase
⋮----
export async function distillContent(input: DistillContentInput): Promise<DistillationResult>
⋮----
export async function extractTasksFromContent(
  input: TaskExtractionInput,
): Promise<TaskExtractionOutput>
````

## File: modules/ai/subdomains/content-distillation/application/index.ts
````typescript

````

## File: modules/ai/subdomains/content-distillation/README.md
````markdown
# content-distillation subdomain

## Purpose

The content-distillation subdomain owns the reduction of large or multi-source content into reusable, structured knowledge fragments.
It turns noisy or long-form material into concise outputs suitable for downstream AI and product workflows.

## Responsibility

- distill source material into overview and structured items
- provide schema-oriented output contracts
- preserve traceability metadata for downstream reuse

## Non-Responsibility

- no raw provider routing ownership
- no UI composition
- no cross-domain state mutation

## Dependency direction

`api -> application -> domain`
````

## File: modules/ai/subdomains/content-generation/api/index.ts
````typescript
/**
 * Public API boundary for the AI content-generation subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions live in ./server.ts.
 */
⋮----
import type { GenerateAiTextInput, GenerateAiTextOutput } from "../domain/ports/AiTextGenerationPort";
⋮----
export interface AIAPI {
  summarize(text: string, model?: string): Promise<string>;
  generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>;
}
⋮----
summarize(text: string, model?: string): Promise<string>;
generateText(input: GenerateAiTextInput): Promise<GenerateAiTextOutput>;
````

## File: modules/ai/subdomains/content-generation/README.md
````markdown
# content-generation subdomain

## Purpose

The content-generation subdomain owns provider-agnostic text generation capabilities for the AI bounded context.
It focuses on producing summaries, drafts, and free-form generated output from validated inputs.

## Responsibility

- define content-generation contracts in domain language
- expose generation use cases through application and api boundaries
- support summarization and structured text generation inputs

## Non-Responsibility

- no prompt orchestration ownership
- no safety policy ownership
- no persistence or UI concerns

## Dependency direction

`api -> application -> domain`
````

## File: modules/ai/subdomains/context-assembly/README.md
````markdown
# context-assembly subdomain

## Purpose

The context-assembly subdomain owns the preparation of ranked, bounded, model-ready context packages.
It selects and shapes input context so downstream generation and distillation can run with predictable quality and token cost.

## Responsibility

- assemble token-budgeted context inputs
- rank and combine candidate evidence
- produce model-ready context payloads for downstream use cases

## Non-Responsibility

- no final content generation ownership
- no policy evaluation ownership
- no observability storage responsibilities

## Dependency direction

`api -> application -> domain`
````

## File: modules/ai/subdomains/evaluation-policy/README.md
````markdown
# evaluation-policy subdomain

## Purpose

The evaluation-policy subdomain owns AI quality rules, score interpretation, and regression evaluation criteria.
It provides the semantic policy layer for deciding whether outputs are acceptable, comparable, and safe to advance.

## Responsibility

- define evaluation criteria and quality thresholds
- compare outputs against expected policy checks
- support repeatable AI regression assessment

## Non-Responsibility

- no model execution ownership
- no provider telemetry implementation
- no UI or route concerns

## Dependency direction

`api -> application -> domain`
````

## File: modules/ai/subdomains/memory-context/README.md
````markdown
# memory-context subdomain

## Purpose

The memory-context subdomain owns reusable AI memory and contextual carry-forward semantics.
It helps preserve distilled, relevant prior context for future reasoning and generation without leaking product-specific conversation ownership.

## Responsibility

- define memory-context contracts and relevance rules
- keep reusable contextual state available for downstream AI workflows
- prefer distilled or bounded context over uncontrolled raw history

## Non-Responsibility

- no chat product ownership
- no notebook-local conversation lifecycle ownership
- no storage adapter implementation in the domain layer

## Dependency direction

`api -> application -> domain`
````

## File: modules/ai/subdomains/model-observability/README.md
````markdown
# model-observability subdomain

## Purpose

The model-observability subdomain owns visibility into model execution quality, cost, latency, and runtime traces.
It exists to make AI behavior measurable without changing the decision logic itself.

## Responsibility

- define observability signals and trace metadata expectations
- track model behavior such as latency, token usage, and failures
- support diagnostic visibility for AI runtime operations

## Non-Responsibility

- no generation or distillation ownership
- no safety policy authoring
- no UI dashboard composition at the domain core

## Dependency direction

`api -> application -> domain`
````

## File: modules/ai/subdomains/safety-guardrail/README.md
````markdown
# safety-guardrail subdomain

## Purpose

The safety-guardrail subdomain owns AI safety rules, content protection constraints, and execution boundaries.
It ensures downstream AI capabilities remain policy-aligned and risk-aware.

## Responsibility

- define safety constraints and guardrail decisions
- validate risky or policy-sensitive AI interactions
- provide a bounded safety capability to downstream consumers

## Non-Responsibility

- no full prompt orchestration ownership
- no provider telemetry ownership
- no product-specific workflow state mutation

## Dependency direction

`api -> application -> domain`
````

## File: modules/ai/subdomains/tool-runtime/domain/index.ts
````typescript

````

## File: modules/ai/subdomains/tool-runtime/infrastructure/genkit/GenkitToolRuntimeAdapter.ts
````typescript
import { v4 as uuid } from "@lib-uuid";
⋮----
import type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "../../domain/ports/ToolRuntimePort";
import { BUILT_IN_TOOLS } from "../../../../infrastructure/llm/built-in-tools";
import { aiClient, configuredModel } from "../../../../infrastructure/llm/genkit-shared";
⋮----
// ── Tool registry (delegated to shared built-in-tools) ────────────────────────
⋮----
// ── Adapter ───────────────────────────────────────────────────────────────────
⋮----
export class GenkitToolRuntimeAdapter implements ToolRuntimePort {
⋮----
listAvailableTools(): ReadonlyArray<ToolDescriptor>
⋮----
async generateWithTools(
    input: ToolEnabledGenerationInput,
): Promise<ToolEnabledGenerationOutput>
⋮----
// Count tool invocations by inspecting conversation messages.
// Each message with a toolRequest part represents one model-initiated call.
````

## File: modules/ai/application/index.ts
````typescript
/** ai/application — shared AI orchestration use cases. */
````

## File: modules/ai/domain/index.ts
````typescript
/** ai/domain — shared AI domain contracts. */
````

## File: modules/ai/infrastructure/index.ts
````typescript
/** ai/infrastructure — shared AI adapters and Genkit singletons. */
````

## File: modules/ai/subdomains/content-distillation/api/index.ts
````typescript
/**
 * Public API boundary for the AI content-distillation subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions live in ./server.ts.
 */
⋮----
import type {
  DistillContentInput,
  DistillationResult,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../domain/ports/DistillationPort";
⋮----
export interface DistillationAPI {
  distillContent(input: DistillContentInput): Promise<DistillationResult>;
  extractTasksFromContent(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
}
⋮----
distillContent(input: DistillContentInput): Promise<DistillationResult>;
extractTasksFromContent(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
````

## File: modules/ai/subdomains/prompt-pipeline/README.md
````markdown
# prompt-pipeline subdomain

## Purpose

The prompt-pipeline subdomain owns reusable prompt, flow, and tool-calling semantics for AI-assisted workflows.
It is a pure bounded-context capability inside `modules/ai` and does not call any provider SDK directly.

## Responsibility

- define prompt-pipeline intents in domain language
- provide a typed registry for prompt families, template keys, and manual vs workflow variants
- resolve prompt text for downstream consumers such as workspace and notebooklm

A single prompt-pipeline subdomain may contain many prompt templates. The capability stays singular because the business boundary is shared prompt orchestration, not one folder per prompt.

## Non-Responsibility

- no Genkit runtime calls in this prompt-pipeline root
- no React components
- no Firebase or storage access
- no domain-state mutation in workspace or notebooklm

## Current prompt-pipeline capabilities

- `source-ocr`
- `source-rag-index`
- `source-knowledge-page`
- `source-task-materialization`

## Dependency direction

`api -> application -> domain`

Outer runtimes may consume this prompt-pipeline subdomain through the public API only:

- workspace UI may read prompt metadata for button hints
- notebooklm flows may resolve prompt payloads before calling provider adapters
````

## File: modules/ai/subdomains/tool-runtime/api/server.ts
````typescript
import { GenerateWithToolsUseCase } from "../application/use-cases/generate-with-tools.use-case";
import { GenkitToolRuntimeAdapter } from "../infrastructure/genkit/GenkitToolRuntimeAdapter";
import { extractTasksFromContent as extractTasksFromDistillation } from "../../content-distillation/api/server";
import type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
} from "../domain/ports/ToolRuntimePort";
import type {
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../domain/ports/TaskExtractionPort";
⋮----
function getUseCase(): GenerateWithToolsUseCase
⋮----
export async function generateWithTools(
  input: ToolEnabledGenerationInput,
): Promise<ToolEnabledGenerationOutput>
⋮----
export function listAvailableTools(): ReadonlyArray<ToolDescriptor>
⋮----
/**
 * @deprecated Task extraction ownership has moved to ai/content-distillation.
 * Keep this wrapper temporarily to preserve the stable server API.
 */
export async function extractTasksFromContent(
  input: TaskExtractionInput,
): Promise<TaskExtractionOutput>
````

## File: modules/ai/AGENT.md
````markdown
# AI Module Agent Guide

## Purpose

modules/ai 是共享 AI capability 的唯一邊界。它擁有 content-generation、content-distillation、context-assembly、evaluation-policy、memory-context、model-observability、prompt-pipeline、safety-guardrail 與 provider policy，向下游模組輸出能力接縫。

## Boundary Rules

- 把 provider routing、model policy、safety-guardrail 與 prompt-pipeline 放在這裡。
- content-distillation（長輸出蒸餾）與 context-assembly（上下文組裝）的通用能力屬於此模組。
- 不放 workspace UI 組合、billing policy、identity governance。
- 跨模組消費者只能透過 `modules/ai/api`（types）或 `modules/ai/api/server`（functions）存取。
- Genkit 與 LLM SDK 只能在 `infrastructure/` 層，domain 層必須框架無關。

## Route Here When

- 需要呼叫 LLM、選擇模型、路由 provider。
- 需要 content-distillation 長輸出或多來源內容為精煉片段。
- 需要 context-assembly、多步驟 prompt flow 或 memory-context。
- 需要 safety-guardrail 護欄或 model-observability 觀測。

## Route Elsewhere When

- 身份與存取治理 → iam。
- 訂閱、配額商業政策 → billing。
- 正典知識內容 → notion。
- 推理輸出、notebook synthesis → notebooklm。

## Delivery Style

- 優先擴展 content-generation 與 content-distillation 子域（已有實作），再決定是否需要補強 context-assembly、prompt-pipeline 或 memory-context。
- 新子域只有在業務語義真的不同時才建立；骨架存在不代表需要立即實作。
- 奧卡姆剃刀：一個 port + use case 能解決就不要新增 service。
````

## File: modules/ai/ai.instructions.md
````markdown
---
description: Rules for the AI bounded context.
applyTo: 'modules/ai/**/*.{ts,tsx,js,jsx,md}'
---

# AI Instructions

## Ownership

- modules/ai 擁有共享 AI capability：generation、orchestration、distillation、retrieval、memory、context、safety、tool-calling、reasoning、conversation、evaluation、tracing。
- provider routing 與 model policy 在此模組定義，不在下游模組重建。

## Dependency Rules

- Genkit 與 provider SDK import 只能出現在 `modules/ai/infrastructure/`。
- 下游消費者只能透過 `modules/ai/api`（client-safe types）或 `modules/ai/api/server`（server functions）存取。
- domain 層不得依賴任何框架、SDK 或傳輸層。
- 子域之間透過 ports 或 orchestration application 協調，不直接互相 import domain 層。

## Naming

- 生成輸出型別用 `GenerationResult` 或 `GenerateAiTextOutput`，不用 `Response`。
- 蒸餾輸出型別用 `DistillationResult`，不用 `SummarizedText` 或 `Summary`。
- 搜尋輸出型別用 `RetrievalResult`，不用 `SearchResult` 泛稱。

## Anti-Patterns

- 不在 ai 內定義 KnowledgeArtifact、Notebook、Conversation（notebooklm 正典）等他域型別。
- 不混入 identity governance 或 billing policy。
- 不讓其他模組繞過 api 邊界直接 import subdomain internals。
````

## File: modules/ai/subdomains/content-distillation/domain/ports/DistillationPort.ts
````typescript
export interface DistillationSource {
  readonly title?: string | null;
  readonly text: string;
}
⋮----
export interface DistillContentInput {
  readonly sources: readonly DistillationSource[];
  readonly objective?: string;
  readonly model?: string;
}
⋮----
export interface DistillationItem {
  readonly title: string;
  readonly summary: string;
  readonly sourceTitle?: string | null;
}
⋮----
export interface DistillationResult {
  readonly overview: string;
  readonly distilledItems: readonly DistillationItem[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}
⋮----
export interface ExtractedTaskItem {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  /**
   * Family-specific structured data that does not fit the generic task shape.
   * Examples: `{ itemNumber, workCategory, quantity, unit, estimatedAmount }` for
   * procurement documents; `{ obligation, penaltyClause }` for compliance docs.
   * Consumers should remain agnostic to its shape; use a narrowing guard if needed.
   */
  readonly metadata?: Record<string, unknown>;
}
⋮----
/**
   * Family-specific structured data that does not fit the generic task shape.
   * Examples: `{ itemNumber, workCategory, quantity, unit, estimatedAmount }` for
   * procurement documents; `{ obligation, penaltyClause }` for compliance docs.
   * Consumers should remain agnostic to its shape; use a narrowing guard if needed.
   */
⋮----
export interface TaskExtractionPromptContext {
  readonly filename?: string;
  readonly mimeType?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly jsonReady?: boolean;
  readonly pageCount?: number;
  readonly sourceGcsUri?: string;
  readonly jsonGcsUri?: string;
  /**
   * Optional prompt family override.  When omitted the adapter defaults to
   * `"task-extraction"`.  Supported values correspond to extraction families:
   * `"task-extraction"` | `"procurement-extraction"` | `"compliance-extraction"`.
   */
  readonly promptFamily?: string;
}
⋮----
/**
   * Optional prompt family override.  When omitted the adapter defaults to
   * `"task-extraction"`.  Supported values correspond to extraction families:
   * `"task-extraction"` | `"procurement-extraction"` | `"compliance-extraction"`.
   */
⋮----
export interface TaskExtractionInput {
  readonly content: string;
  readonly maxCandidates?: number;
  readonly model?: string;
  readonly promptContext?: TaskExtractionPromptContext;
}
⋮----
export interface TaskExtractionOutput {
  readonly tasks: readonly ExtractedTaskItem[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}
⋮----
export interface TaskExtractionPort {
  extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
}
⋮----
extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
⋮----
export interface DistillationPort extends TaskExtractionPort {
  distill(input: DistillContentInput): Promise<DistillationResult>;
}
⋮----
distill(input: DistillContentInput): Promise<DistillationResult>;
````

## File: modules/ai/subdomains/content-distillation/infrastructure/llm/GenkitDistillationAdapter.ts
````typescript
import { v4 as uuid } from "@lib-uuid";
import { z } from "genkit";
⋮----
import {
  resolveComplianceExtractionPrompt,
  resolveProcurementExtractionPrompt,
  resolveTaskExtractionPrompt,
} from "../../../prompt-pipeline/api";
import { BUILT_IN_TOOLS } from "../../../../infrastructure/llm/built-in-tools";
import { aiClient, configuredModel } from "../../../../infrastructure/llm/genkit-shared";
import type {
  DistillContentInput,
  DistillationPort,
  DistillationResult,
  TaskExtractionInput,
  TaskExtractionOutput,
} from "../../domain/ports/DistillationPort";
⋮----
// ── Output schemas ────────────────────────────────────────────────────────────
⋮----
// ── Extraction family helpers ─────────────────────────────────────────────────
⋮----
type ExtractionFamily = "task-extraction" | "procurement-extraction" | "compliance-extraction";
⋮----
function resolveExtractionFamily(promptFamily?: string): ExtractionFamily
⋮----
interface BuiltPrompt {
  readonly text: string;
  readonly family: ExtractionFamily;
  readonly recommendedTools: readonly string[];
}
⋮----
function buildExtractionPrompt(input: TaskExtractionInput): BuiltPrompt
⋮----
// ── Tool selection ────────────────────────────────────────────────────────────
⋮----
/** Returns Genkit tool instances for the names present in recommendedTools. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function selectTools(recommendedTools: readonly string[]): any[]
⋮----
// ── Distillation prompt ───────────────────────────────────────────────────────
⋮----
function buildDistillationPrompt(input: DistillContentInput): string
⋮----
// ── Adapter ───────────────────────────────────────────────────────────────────
⋮----
export class GenkitDistillationAdapter implements DistillationPort {
⋮----
async distill(input: DistillContentInput): Promise<DistillationResult>
⋮----
async extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>
⋮----
// Default: task-extraction
````

## File: modules/ai/subdomains/subdomains.instructions.md
````markdown
---
description: "AI subdomains architecture rules: capability-based subdomains, strict hexagonal boundaries, orchestration as application kernel, and infrastructure isolation."
applyTo: "modules/ai/subdomains/**/*.{ts,tsx,md}"
---
```

# AI Subdomains Layer (Canonical)

This document defines structural rules for `modules/ai/subdomains/*`.

It must align with AI execution architecture principles and remain consistent with DDD + Hexagonal + AI pipeline separation.

---

# 1️⃣ Core Principle

Subdomains represent **capabilities inside a single AI execution engine**, NOT services.

* ❌ NOT microservices
* ❌ NOT independent APIs
* ❌ NOT cross-service bus participants
* ✔ ARE internal capability modules

---

# 2️⃣ Standard Subdomain Structure (Hexagonal Capability Module)

Each subdomain MUST follow this structure:

```
api/
application/
domain/
infrastructure/
interfaces/
ports/        (preferred for external contracts)
README.md
```

---

## Layer Responsibilities

### domain/

* Pure business logic
* No SDKs, no LLM calls, no Firebase
* Deterministic rules only

### application/

* Use cases
* Coordination logic within the subdomain
* Can call ports/interfaces

### interfaces/

* DTOs
* Input/output contracts
* Boundary definitions

### ports/

* Abstract external dependencies
* LLM, DB, retrieval, tools, etc.

### infrastructure/

* Implements ports
* Firebase / LLM SDK / vector DB / APIs

### api/

* External entry point ONLY
* HTTP / Firebase Functions / Edge endpoints

---

# 3️⃣ System-Level Architecture Rule

## 3.1 API is NOT internal bus

* ❌ subdomain-to-subdomain MUST NOT communicate via `api/`
* ✔ api is ONLY external boundary

---

## 3.2 Internal communication model

Subdomains communicate via:

```
application → ports → application
```

or via orchestration kernel:

```
orchestration (application) → subdomain application
```

---

# 4️⃣ Dependency Rules (Strict Direction)

Inside each subdomain:

```
interfaces → application → domain ← infrastructure
```

Rules:

* domain is pure and independent
* application depends only on domain + ports
* infrastructure implements ports only
* interfaces define contracts only

---

# 5️⃣ Cross-Subdomain Communication Rule

### Allowed:

* orchestration application calls other subdomain application via interfaces/ports

### Forbidden:

* ❌ direct domain-to-domain coupling
* ❌ infrastructure-to-infrastructure coupling
* ❌ api-to-api internal routing

---

# 6️⃣ AI Capability Subdomain Definitions

## 6.1 orchestration (system kernel)

* Owns execution graph
* Controls workflow sequencing
* Calls subdomains via application layer
* Does NOT perform inference itself

---

## 6.2 context

* Builds request-time context
* Stateless per execution
* No persistence logic

---

## 6.3 memory

* Persistent state across sessions
* Read/write via ports only
* No prompt construction logic

---

## 6.4 retrieval

* Fetches and ranks candidates
* No final answer generation
* May use scoring models but no synthesis

---

## 6.5 reasoning

* Structured inference logic
* Operates on prepared inputs only
* No data fetching responsibility

---

## 6.6 generation

* Produces final output
* Consumes reasoning + context
* No retrieval or orchestration logic

---

## 6.7 tool-calling

* Defines tool schemas and invocation contracts
* Execution is handled in infrastructure/adapters
* Stateless logic only

---

## 6.8 safety

* Policy enforcement layer
* Pre/post generation guardrails
* Cannot modify domain logic

---

## 6.9 evaluation

* Quality scoring and regression checks
* Offline/online evaluation logic
* No telemetry aggregation

---

## 6.10 distillation

* Produces training datasets
* Downstream-only from evaluation/generation

---

## 6.11 tracing

* Observability only
* Execution logs, latency, graph tracing
* Must NOT affect decisions

---

# 7️⃣ AI Execution Flow (Canonical Model)

```
context
   ↓
retrieval
   ↓
reasoning
   ↓
tool-calling (optional)
   ↓
generation
   ↓
evaluation (async)
```

Controlled by:

```
orchestration (application kernel)
```

---

# 8️⃣ Event Convention

```
ai.<subdomain>.<event>
```

Examples:

* ai.orchestration.started
* ai.retrieval.completed
* ai.reasoning.finished
* ai.generation.completed
* ai.evaluation.scored

Rules:

* domain/application emit events
* infrastructure publishes events
* events are immutable contracts

---

# 9️⃣ Subdomain Activation Rule

A subdomain is ACTIVE only if:

* README defines responsibility
* application layer contains real use cases
* at least one port is implemented
* infrastructure integration exists

Otherwise:

* treated as capability stub
* cannot be referenced by orchestration

---

# 🔟 Critical Semantic Constraints (Non-Negotiable)

* context ≠ memory
* retrieval ≠ generation
* reasoning ≠ orchestration
* evaluation ≠ telemetry
* tool-calling ≠ execution engine
* api ≠ internal communication layer

---

# 🧠 Final Model

This architecture represents:

> AI Execution Engine with Capability-Based Modular Subdomains

NOT:

* microservices
* API mesh
* distributed services system

---

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/ai/subdomains/prompt-pipeline/application/index.ts
````typescript
import type {
  ComplianceExtractionPromptInput,
  ComplianceExtractionPromptIntent,
  KnowledgeSynthesisPromptInput,
  KnowledgeSynthesisPromptIntent,
  ProcurementExtractionPromptInput,
  ProcurementExtractionPromptIntent,
  PromptExecutionMode,
  PromptRegistryPort,
  PromptTemplateDescriptor,
  PromptTemplateFamily,
  PromptTemplateKey,
  RagPreparationPromptInput,
  RagPreparationPromptIntent,
  ResolvedPrompt,
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../domain";
⋮----
// ── Shared definition type ────────────────────────────────────────────────────
⋮----
type PromptTemplateDefinition<TIntent extends PromptTemplateKey, TInput> = {
  readonly family: PromptTemplateFamily;
  readonly templateKey: TIntent;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
  readonly version: string;
  readonly scenario: string;
  readonly system: string;
  /** Tool names from tool-runtime that this prompt benefits from. */
  readonly recommendedTools: readonly string[];
  readonly promptBuilder: (input: TInput, mode: PromptExecutionMode) => string;
};
⋮----
/** Tool names from tool-runtime that this prompt benefits from. */
⋮----
// ── Shared helpers ────────────────────────────────────────────────────────────
⋮----
function toDescriptor<TIntent extends PromptTemplateKey, TInput>(
  template: PromptTemplateDefinition<TIntent, TInput>,
  mode: PromptExecutionMode,
): PromptTemplateDescriptor
⋮----
function toResolvedPrompt<TIntent extends PromptTemplateKey, TInput>(
  template: PromptTemplateDefinition<TIntent, TInput>,
  input: TInput,
  mode: PromptExecutionMode,
): ResolvedPrompt
⋮----
// ── Family: task-extraction ───────────────────────────────────────────────────
⋮----
// ── Family: procurement-extraction ───────────────────────────────────────────
⋮----
// ── Family: knowledge-synthesis ──────────────────────────────────────────────
⋮----
// ── Family: rag-preparation ───────────────────────────────────────────────────
⋮----
// ── Family: compliance-extraction ────────────────────────────────────────────
⋮----
// ── Registry service ──────────────────────────────────────────────────────────
⋮----
class PromptRegistryService implements PromptRegistryPort {
⋮----
listPromptFamilies(): ReadonlyArray<PromptTemplateFamily>
⋮----
// task-extraction
listTaskExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
resolveTaskExtractionPrompt(intent: TaskExtractionPromptIntent, input: TaskExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
// procurement-extraction
listProcurementExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
resolveProcurementExtractionPrompt(intent: ProcurementExtractionPromptIntent, input: ProcurementExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
// knowledge-synthesis
listKnowledgeSynthesisPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
resolveKnowledgeSynthesisPrompt(intent: KnowledgeSynthesisPromptIntent, input: KnowledgeSynthesisPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
// rag-preparation
listRagPreparationPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
resolveRagPreparationPrompt(intent: RagPreparationPromptIntent, input: RagPreparationPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
// compliance-extraction
listComplianceExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
resolveComplianceExtractionPrompt(intent: ComplianceExtractionPromptIntent, input: ComplianceExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
// ── Public free functions ─────────────────────────────────────────────────────
⋮----
export function listPromptFamilies(): ReadonlyArray<PromptTemplateFamily>
⋮----
export function listTaskExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
export function resolveTaskExtractionPrompt(intent: TaskExtractionPromptIntent, input: TaskExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
export function listProcurementExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
export function resolveProcurementExtractionPrompt(intent: ProcurementExtractionPromptIntent, input: ProcurementExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
export function listKnowledgeSynthesisPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
export function resolveKnowledgeSynthesisPrompt(intent: KnowledgeSynthesisPromptIntent, input: KnowledgeSynthesisPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
export function listRagPreparationPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
export function resolveRagPreparationPrompt(intent: RagPreparationPromptIntent, input: RagPreparationPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
⋮----
export function listComplianceExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor>
export function resolveComplianceExtractionPrompt(intent: ComplianceExtractionPromptIntent, input: ComplianceExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt
````

## File: modules/ai/subdomains/prompt-pipeline/api/index.ts
````typescript
/**
 * AI prompt-pipeline subdomain public API.
 *
 * Semantic prompt-registry boundary only.
 * No provider SDKs, UI exports, or infrastructure leakage.
 */
````

## File: modules/ai/subdomains/prompt-pipeline/domain/index.ts
````typescript
/**
 * AI prompt-pipeline subdomain — domain contracts.
 *
 * Each PromptTemplateFamily maps to a distinct document class with its own
 * input schema, output schema, and optional tool requirements.
 */
⋮----
// ── Families ─────────────────────────────────────────────────────────────────
⋮----
export type PromptTemplateFamily =
  | "task-extraction"
  | "procurement-extraction"
  | "knowledge-synthesis"
  | "rag-preparation"
  | "compliance-extraction";
⋮----
// ── Execution mode ────────────────────────────────────────────────────────────
⋮----
export type PromptExecutionMode = "manual" | "workflow" | "preview";
⋮----
// ── Intent keys per family ────────────────────────────────────────────────────
⋮----
export type TaskExtractionPromptIntent = "document-task-candidates";
export type ProcurementExtractionPromptIntent =
  | "procurement-line-items"
  | "compliance-obligations";
export type KnowledgeSynthesisPromptIntent = "knowledge-page-draft";
export type RagPreparationPromptIntent = "rag-chunk-annotation";
export type ComplianceExtractionPromptIntent = "contract-obligations";
⋮----
export type PromptTemplateKey =
  | TaskExtractionPromptIntent
  | ProcurementExtractionPromptIntent
  | KnowledgeSynthesisPromptIntent
  | RagPreparationPromptIntent
  | ComplianceExtractionPromptIntent;
⋮----
// ── Prompt input types (one per family) ──────────────────────────────────────
⋮----
export interface TaskExtractionPromptInput {
  readonly filename: string;
  readonly mimeType?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly jsonReady?: boolean;
  readonly pageCount?: number;
  readonly contentPreview?: string;
  readonly maxCandidates?: number;
}
⋮----
/** Input descriptor for structured procurement / purchase-order documents. */
export interface ProcurementExtractionPromptInput {
  readonly filename: string;
  readonly mimeType?: string;
  /** ISO 4217 currency code, e.g. "TWD". */
  readonly currency?: string;
  /** BCP 47 locale of the document source, e.g. "zh-TW". */
  readonly documentLocale?: string;
  readonly pageCount?: number;
  readonly maxLineItems?: number;
  readonly contentPreview?: string;
}
⋮----
/** ISO 4217 currency code, e.g. "TWD". */
⋮----
/** BCP 47 locale of the document source, e.g. "zh-TW". */
⋮----
/** Input descriptor for producing a Knowledge Page draft from reference material. */
export interface KnowledgeSynthesisPromptInput {
  readonly filename: string;
  readonly objectiveSummary?: string;
  readonly targetAudience?: string;
  readonly pageCount?: number;
  readonly contentPreview?: string;
}
⋮----
/** Input descriptor for annotating document chunks for RAG indexing. */
export interface RagPreparationPromptInput {
  readonly filename: string;
  /**
   * Broad document type hint, e.g. "procurement", "technical-spec", "contract".
   * Used to choose annotation depth; does not gate which prompt is selected.
   */
  readonly docType?: string;
  readonly chunkStrategy?: "sentence" | "paragraph" | "section";
  readonly pageCount?: number;
  readonly contentPreview?: string;
}
⋮----
/**
   * Broad document type hint, e.g. "procurement", "technical-spec", "contract".
   * Used to choose annotation depth; does not gate which prompt is selected.
   */
⋮----
/** Input descriptor for extracting legal / contractual obligations. */
export interface ComplianceExtractionPromptInput {
  readonly filename: string;
  /** ISO 3166-1 alpha-2 jurisdiction code, e.g. "TW", "US". */
  readonly jurisdiction?: string;
  readonly contractType?: string;
  readonly parties?: readonly string[];
  readonly pageCount?: number;
  readonly contentPreview?: string;
}
⋮----
/** ISO 3166-1 alpha-2 jurisdiction code, e.g. "TW", "US". */
⋮----
// ── Shared descriptors ────────────────────────────────────────────────────────
⋮----
export interface PromptTemplateDescriptor {
  readonly family: PromptTemplateFamily;
  readonly templateKey: PromptTemplateKey;
  readonly intent: PromptTemplateKey;
  readonly mode: PromptExecutionMode;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
  readonly version: string;
  readonly scenario: string;
}
⋮----
export interface ResolvedPrompt {
  readonly family: PromptTemplateFamily;
  readonly templateKey: PromptTemplateKey;
  readonly intent: PromptTemplateKey;
  readonly mode: PromptExecutionMode;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
  readonly version: string;
  readonly scenario: string;
  readonly system: string;
  readonly prompt: string;
  /**
   * Tool names this prompt recommends activating during generation.
   * Names match the `ToolDescriptor.name` values registered in tool-runtime.
   * An empty array means no tools are needed.
   */
  readonly recommendedTools: readonly string[];
}
⋮----
/**
   * Tool names this prompt recommends activating during generation.
   * Names match the `ToolDescriptor.name` values registered in tool-runtime.
   * An empty array means no tools are needed.
   */
⋮----
// ── Registry port ─────────────────────────────────────────────────────────────
⋮----
export interface PromptRegistryPort {
  listPromptFamilies(): ReadonlyArray<PromptTemplateFamily>;

  listTaskExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveTaskExtractionPrompt(
    intent: TaskExtractionPromptIntent,
    input: TaskExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listProcurementExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveProcurementExtractionPrompt(
    intent: ProcurementExtractionPromptIntent,
    input: ProcurementExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listKnowledgeSynthesisPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveKnowledgeSynthesisPrompt(
    intent: KnowledgeSynthesisPromptIntent,
    input: KnowledgeSynthesisPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listRagPreparationPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveRagPreparationPrompt(
    intent: RagPreparationPromptIntent,
    input: RagPreparationPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listComplianceExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveComplianceExtractionPrompt(
    intent: ComplianceExtractionPromptIntent,
    input: ComplianceExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
}
⋮----
listPromptFamilies(): ReadonlyArray<PromptTemplateFamily>;
⋮----
listTaskExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
resolveTaskExtractionPrompt(
    intent: TaskExtractionPromptIntent,
    input: TaskExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
⋮----
listProcurementExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
resolveProcurementExtractionPrompt(
    intent: ProcurementExtractionPromptIntent,
    input: ProcurementExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
⋮----
listKnowledgeSynthesisPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
resolveKnowledgeSynthesisPrompt(
    intent: KnowledgeSynthesisPromptIntent,
    input: KnowledgeSynthesisPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
⋮----
listRagPreparationPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
resolveRagPreparationPrompt(
    intent: RagPreparationPromptIntent,
    input: RagPreparationPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
⋮----
listComplianceExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
resolveComplianceExtractionPrompt(
    intent: ComplianceExtractionPromptIntent,
    input: ComplianceExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
````

## File: modules/ai/api/server.ts
````typescript
/**
 * ai — server-only API barrel.
 *
 * Exports that depend on server-only packages such as Genkit.
 * Must only be imported in Server Actions, route handlers, or server-side
 * infrastructure adapters.
 */
````

## File: modules/ai/docs/README.md
````markdown
# AI Module Docs

模組本地架構筆記。此文件描述 **目前已落地的 infrastructure baseline**，並用 Context7 驗證過的 Genkit 模式補齊本地說明。

## Current Baseline

- content-generation 子域持有 Genkit-backed 文字生成接縫，實作位於 [modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts](modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts)。
- content-distillation 子域已提供結構化蒸餾能力，實作位於 [modules/ai/subdomains/content-distillation/infrastructure/llm/GenkitDistillationAdapter.ts](modules/ai/subdomains/content-distillation/infrastructure/llm/GenkitDistillationAdapter.ts)。
- `generateAiText`、`summarize`、`distillContent` 是目前對外可用的 server functions。
- Notion 與 NotebookLM 都只能透過 AI 公開邊界消費能力，不擁有 provider 或 Genkit runtime。

## Infrastructure Layout

| Path | Responsibility |
|---|---|
| [modules/ai/api/index.ts](modules/ai/api/index.ts) | client-safe types 與 capability contracts |
| [modules/ai/api/server.ts](modules/ai/api/server.ts) | server-only public functions |
| [modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts](modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts) | content-generation 與 summarization |
| [modules/ai/subdomains/content-distillation/infrastructure/llm/GenkitDistillationAdapter.ts](modules/ai/subdomains/content-distillation/infrastructure/llm/GenkitDistillationAdapter.ts) | schema-validated content-distillation |

## Content Distillation

content-distillation 子域負責將長輸出或多段內容濃縮為精煉知識片段（`DistillationResult`）。

它與 content-generation 的 `summarize` 差異如下：

- content-generation/summarize：回傳單一摘要字串，偏向快速文字結果。
- content-distillation：接收 `objective + sources[]`，回傳 `overview + distilledItems[] + trace metadata`，適合下游主域重用。

目前實作的輸出欄位包含：
- `overview`
- `distilledItems`
- `model`
- `traceId`
- `completedAt`

根據 Context7 驗證的官方 Genkit 文件，這個能力使用了：
- `generate()` 作為標準模型呼叫入口
- 結構化輸出 schema 驗證
- prompt/flow 作為可觀測、可調試的執行單位

## Public API Surface

```ts
// client-safe types
import type {
  AIAPI,
  DistillationAPI,
  DistillContentInput,
  DistillationResult,
  GenerateAiTextInput,
  GenerateAiTextOutput,
  AiTextGenerationPort,
} from "@/modules/ai/api";

// server-only functions
import { distillContent, generateAiText, summarize } from "@/modules/ai/api/server";
```

## Architecture Notes

- provider plugin 與 Genkit client 只能存在於 infrastructure adapter。
- 預設模型為 `googleai/gemini-2.5-flash`，可透過 `GENKIT_MODEL` 覆蓋。
- distillation 輸出屬於 **AI capability signal**，不是 KnowledgeArtifact 或 Notebook 的正典模型。
- 子域之間的協調仍由 application / orchestration 控制，不直接跨子域 domain 依賴。

## Distilled Rule Sentences

- context-assembly 應提供 token-budgeted、ranked、可直接送入模型的輸入，而不是把所有 raw 資料直接交給 content-generation。
- content-distillation 不等於單純 summary；它應優先產出可重用的 overview、highlights 與其他 schema-ready knowledge fragments。
- memory-context 若需要長期保存內容，應優先保存 distilled output，避免 raw content 無限制膨脹成本。
- context-assembly 若可選擇資料來源，應優先組裝 distilled chunks 或 structured knowledge，而不是直接倚賴未整理的 raw text。
- evaluation-policy 應把 content-distillation 視為正式質量對象，至少檢查 compression ratio、information retention 與 hallucination risk。
- 大文件或多來源蒸餾應優先走 async pipeline，避免同步請求承擔過高延遲與成本。
- model-observability 應記錄 traceId、model、latency、token usage 與 errors，讓 flow 可觀測但不干預決策。

## References

- [modules/ai/README.md](modules/ai/README.md)
- [docs/contexts/ai/README.md](docs/contexts/ai/README.md)
- [docs/contexts/ai/subdomains.md](docs/contexts/ai/subdomains.md)
- [docs/contexts/ai/ubiquitous-language.md](docs/contexts/ai/ubiquitous-language.md)
````

## File: modules/ai/README.md
````markdown
# AI

共享 AI capability bounded context：content-generation、content-distillation、context-assembly、evaluation-policy、memory-context、model-observability、prompt-pipeline、safety-guardrail。

## Intended Ownership

- provider routing 與 model policy
- safety-guardrail：風險限制與安全護欄
- prompt-pipeline：prompt、flow 與 tool-calling orchestration
- content-generation：共享文字生成與 summarization 能力
- content-distillation：將長輸出濃縮為精煉知識片段
- context-assembly：組裝 token-budgeted、模型可用的上下文
- evaluation-policy：輸出品質與回歸評估規則
- model-observability：AI 執行觀測與 trace metadata
- memory-context：可重用的 AI 記憶與脈絡保留

## Active Baseline

- content-generation 子域持有 Genkit-backed 文字生成接縫（`generateAiText`、`summarize`）
- content-distillation 子域現在提供結構化蒸餾能力（`distillContent`）
- 下游模組透過 `modules/ai/api`（client-safe types）與 `modules/ai/api/server`（server-only functions）消費
- 其餘子域為語意骨架，依需求逐步實作

## Capability Rules

- context-assembly 應先聚合、排序並壓縮上下文，再把可用輸入交給 content-generation 或 content-distillation。
- content-generation 應透過 provider-agnostic adapter 產生最終文字或結構化輸出，且輸出必須先經 schema 驗證。
- memory-context 應優先保存 distilled knowledge，而不是無限制累積 raw content。
- content-distillation 應作為 AI domain 的 knowledge compiler，把 raw 或多來源內容轉為低 token、可重用、可結構化的知識訊號。
- prompt-pipeline 應控制多步 flow、retry、fallback 與 tool-calling orchestration，不承載下游業務語義。
- evaluation-policy 應覆蓋 content-generation 與 content-distillation，至少量測 compression、retention 與 hallucination 風險。
- safety-guardrail 可以在任何步驟阻斷執行；model-observability 只負責觀測，不得改變業務決策。

## Subdomains

| Subdomain | Status | Notes |
|---|---|---|
| content-generation | active | GenkitAiTextGenerationAdapter 已實作 |
| content-distillation | active | GenkitDistillationAdapter 已實作 |
| context-assembly | semantic skeleton | 模型上下文組裝 |
| evaluation-policy | semantic skeleton | 輸出品質評估規則 |
| memory-context | semantic skeleton | 可重用 AI 記憶脈絡 |
| model-observability | semantic skeleton | 執行觀測與 trace metadata |
| prompt-pipeline | active baseline | prompt、flow、tool-calling orchestration |
| safety-guardrail | semantic skeleton | 安全護欄與限制 |

## Public API

```ts
// client-safe types
import type {
  AIAPI,
  DistillationAPI,
  DistillContentInput,
  DistillationResult,
  GenerateAiTextInput,
  GenerateAiTextOutput,
  AiTextGenerationPort,
} from "@/modules/ai/api";

// server-only functions
import { distillContent, generateAiText, summarize } from "@/modules/ai/api/server";
```

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- domain 不得依賴任何 SDK 或框架。
- Genkit 與 provider SDK 只能在 `infrastructure/` 層。
- 跨模組消費只能透過 `api/` 邊界。
````

## File: modules/ai/api/index.ts
````typescript
/**
 * Public API boundary for the AI bounded context.
 *
 * Cross-module consumers must import shared AI contracts through this entry point.
 * Server-only helpers live in ./server.ts.
 */
````