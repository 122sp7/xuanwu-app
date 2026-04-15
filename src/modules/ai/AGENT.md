# AI Module — Agent Guide

## Purpose

`src/modules/ai` 等價蒸餾 `modules/ai` 的 active AI capabilities：
content-generation、content-distillation、tool-runtime。
向下游模組輸出 LLM 生成、內容蒸餾與工具呼叫能力。

> **DDD 分類**: Core Domain ｜ **角色**: AI 能力中樞 — LLM / Genkit Flow 編排、prompt pipeline、tool calling

## Structure At a Glance

```
index.ts              ← 唯一對外入口（具名匯出）
domain/               ← 4 ports：AiTextGenerationPort、DistillationPort、TaskExtractionPort、ToolRuntimePort
application/          ← use-cases + dto
adapters/
  inbound/            ← http + rpc
  outbound/
    genkit/           ← 4 Genkit adapters（implements 4 ports）
    openai/           ← (future) fallback adapter
```

## Barrel & Named Export Rules

- 每層各有自己的 barrel：`domain/index.ts`、`application/index.ts`、`adapters/inbound/index.ts`、`adapters/outbound/index.ts`。
- Source 檔案之間 import 使用**直接相對路徑**，不依賴 barrel，確保 barrel 可獨立更改。
- 根 `index.ts` 只匯出對外穩定的 domain + application 符號。
- `adapters/outbound/genkit/*.ts` 的 import 使用 `../../../domain/...` 或 `../../../application/...`（三層上）。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## Boundary Rules

- `domain/` 禁止依賴 Genkit、OpenAI SDK、Firebase、React 或任何外部 SDK。
- `application/` 只依賴 `domain/` 的 port 抽象，不直接接觸 adapter 實作。
- Adapters 只負責 I/O 轉換，禁帶任何業務規則。
- Genkit SDK 只能出現在 `adapters/outbound/genkit/`。
- OpenAI SDK 只能出現在 `adapters/outbound/openai/`（未來備用）。
- 外部消費者只透過 `src/modules/ai/index.ts`（具名匯出）存取。

## 蒸餾規則

- 只移植 `modules/ai` 內 **active（已有 adapter 實作）** 的子域概念（3 ports）。
- stub-only 子域（evaluation-policy、memory-context、model-observability 等）不進 src/modules/ai。
- 每個 active domain port 對應一個 `adapters/outbound/genkit/` 的 adapter class。
- ToolRuntimePort 與 TaskExtractionPort 可共用同一 adapter 或分開（視 Genkit flow 邊界決定）。
- 實作之前先確認是否有現成 adapter 可以直接移植，避免重寫。

## Route Here When

- 需要呼叫 LLM 做文字生成（`generateAiText`）。
- 需要內容蒸餾 / 長輸出摘要（`distillContent`）。
- 需要從文本抽取任務候選（`extractTasksFromContent`）。
- 需要 tool calling 能力（`generateWithTools`）。

## Route Elsewhere When

| 需求 | 正確模組 |
|---|---|
| 身份、Session、存取治理 | `src/modules/iam` |
| 訂閱、配額、商業政策 | `src/modules/billing` |
| 正典知識頁面與內容 | `src/modules/notion` |
| Notebook、對話、synthesis | `src/modules/notebooklm` |
| 帳號、組織、通知 | `src/modules/platform` |
| 工作區生命週期、任務管理 | `src/modules/workspace` |

## Development Order

1. `domain/ports/`：定義 port 介面（AiTextGenerationPort、DistillationPort 等）。
2. `application/use-cases/`：定義 use case 流程與 DTO。
3. `application/`：補充 dto、port type aliases。
4. `adapters/outbound/genkit/`：實作 Genkit adapter（implements port）。
5. `adapters/inbound/http/` + `rpc/`：實作 HTTP / tRPC adapter。
6. 更新各層 barrel index，確保具名匯出完整。
7. 更新根 `index.ts` 補露新符號。

## Delivery Style

- 優先移植 `AiTextGenerationPort` + `DistillationPort`（最常被消費），再補 tool-runtime。
- 新 adapter 只實作所需的 port method，不預先埋 stub 或空 placeholder。
- 奧卡姆剃刀：一個 port + use case 能解決就不新增 application service。
- Genkit SDK 只能出現在 `adapters/outbound/genkit/`，測試時應 mock port 而非真實 Genkit。

---

## 已確立模式（Pattern Reference）

| 模式 | 說明 |
|---|---|
| **port-first domain** | ai 模組以 port 介面為核心，domain 層不含 Entity，僅定義 port contracts |
| **FirestoreLike adapter** | Outbound adapter 內嵌 `FirestoreLike` interface（`get/set/delete`），不直接匯入 Firebase SDK |
| **Port type alias** | `export type FooRepositoryPort = FooRepository`（type alias，不重新宣告）|
| **AI adapter stub** | `throw new Error('not yet implemented')` + TODO comment，待 Genkit wiring |
| **Adapter import depth** | `adapters/outbound/genkit/*.ts` 需用 `../../../domain/...`（三層上）|
| **Mock port in tests** | 測試時 mock port 介面，不需要真實 Genkit 環境 |

---

## 衝突防護（src/modules vs modules/）

`src/modules/ai` 屬於**蒸餾層（`src/modules/`）**，與 `modules/ai/`（完整 HEX+DDD 實作層）**職責不同，不可混用**。

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/ai/AGENT.md`、`modules/ai/api/` |
| 撰寫新 use case / adapter 實作 | `src/modules/ai/`（本模組） |
| 跨模組 API boundary | `modules/ai/api/index.ts`、`modules/ai/api/server.ts`（仍是權威） |
| 現有 Genkit adapter 參考 | `modules/ai/subdomains/tool-runtime/infrastructure/genkit/` |

**嚴禁事項：**
- ❌ 把 `modules/ai/infrastructure/` 的實作直接搬到 `src/modules/ai/domain/`
- ❌ 把 `src/modules/` 當成 `modules/` 的別名
- ❌ 在 `domain/` 匯入 Genkit、Firebase SDK、React
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組詳細說明（目錄樹、barrel 表、蒸餾範圍）
- [src/modules/README.md](../README.md) — 蒸餾層狀態總覽
- [modules/ai/AGENT.md](../../../modules/ai/AGENT.md) — 完整 HEX+DDD 實作層規則
- [modules/ai/api/](../../../modules/ai/api/) — 跨模組 API 邊界（權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
