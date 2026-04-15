# AI Module — Agent Guide

## Purpose

`src/modules/ai` 是 **AI 機制能力蒸餾骨架**，為 Xuanwu 系統提供文字分塊（Chunk）、向量嵌入（Embedding）、語意檢索（Retrieval）、上下文管理（Context）、內容生成（Generation）、來源引用（Citation）、品質評估（Evaluation）、提示管線（Pipeline）等 AI 底層機制的新實作落點。

**蒸餾來源：** `modules/ai/`  
**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

> **⚠ 邊界警示：** `ai` 擁有 AI **機制**（模型呼叫、向量計算、提示建構），不擁有使用者對話 UX（屬 `notebooklm`）、知識文件管理（屬 `notion`）或任務生成流程（屬 `workspace`）。

## 子域清單（名詞域）

| 子域 | 說明 | 對應 modules/ 來源 | 蒸餾狀態 |
|---|---|---|---|
| `chunk` | 文字分塊實體（分塊策略、Token 計量）| `tokens` + 分塊邏輯 | 📋 待蒸餾 |
| `citation` | 引用實體（生成內容的來源溯源）| 新增（無舊對應）| 📋 待蒸餾 |
| `context` | AI 上下文實體（記憶體、對話歷程、人格）| `memory-context` + `messages` + `conversations` + `personas` | 📋 待蒸餾 |
| `embedding` | 向量嵌入實體（Embedding 生成與儲存）| `embeddings` | 📋 待蒸餾 |
| `evaluation` | 評估實體（輸出品質、安全防護、模型可觀測性）| `evaluation-policy` + `safety-guardrail` + `datasets` + `model-observability` | 📋 待蒸餾 |
| `generation` | AI 生成實體（模型選擇、Tool calling、內容生成）| `models` + `tools` | 📋 待蒸餾 |
| `memory` | AI 記憶實體（長期記憶、跨會話持久化）| 新增（`memory-context` 萃取）| 📋 待蒸餾 |
| `pipeline` | 提示管線實體（提示模板、多步驟管線）| `prompt-pipeline` + `prompts` | 📋 待蒸餾 |
| `retrieval` | 語意檢索實體（向量相似度搜尋）| 分散於 `tools` / `context` | 📋 待蒸餾 |
| `tool-calling` | 工具呼叫實體（Tool 定義、執行、結果處理）| `tools` + `tool-runtime` | 📋 待蒸餾 |

> **子域不重複原則：**  
> - `conversation`（使用者對話 UX）→ `notebooklm` 所有  
> - `document`（來源文件管理）→ `notebooklm` 所有  
> - `task-formation`（AI 輔助任務生成流程）→ `workspace` 所有；ai 提供 `generation` 能力支援  

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、Genkit SDK、HTTP client 或任何框架。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`，禁止直接跨 subdomain import。
- 外部消費者（notebooklm、workspace）只能透過 `modules/ai/api/index.ts` 存取 — 此邊界仍以 `modules/` 為權威。
- ai 模組不得依賴 notion、notebooklm、workspace（ai 是上游 AI 機制提供者）。

## task-formation 歸屬決策

`task-formation` 子域屬於 **`workspace`**，理由：
- 輸出物（Task entities）是 workspace 的領域物件
- 觸發者（使用者指定生成任務）是 workspace 層業務流程
- AI 模型呼叫透過 `ai/generation` Port 注入，由 workspace 消費

`modules/ai/subdomains/task-formation` 目前為空骨架，未來應整合至 `workspace/task-formation`，不應在 ai 模組擴展此子域。

## Route Here When

- 撰寫 AI 機制的新 use case、entity、adapter 實作（embedding、retrieval、generation 等）。
- 實作 prompt template、tool calling port、embedding vector adapter 等骨架。
- 需要 `src/modules/ai/` 層的骨架結構作為起點。

## Route Elsewhere When

- 讀取 AI 模組邊界規則、published language → `modules/ai/AGENT.md`、`modules/ai/api/`
- 使用者對話 / Notebook UX → `src/modules/notebooklm/`
- 知識文件 / Page 管理 → `src/modules/notion/`
- 任務生成業務流程 → `src/modules/workspace/`（`task-formation`）
- Genkit flow 定義（現有）→ `modules/ai/subdomains/*/infrastructure/ai/`
- 跨模組 API boundary → `modules/ai/api/index.ts`（仍是權威）

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/ai/AGENT.md`、`modules/ai/api/` |
| 撰寫新 use case / adapter / entity | `src/modules/ai/`（本層） |
| 查閱現有 Genkit wiring | `modules/ai/subdomains/*/infrastructure/` |
| 跨模組 API boundary | `modules/ai/api/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 把 `modules/ai/infrastructure/` 的實作直接搬到 `src/modules/ai/domain/`
- ❌ 把 `src/modules/ai/` 當成 `modules/ai/` 的別名
- ❌ 在 `domain/` 匯入 Genkit、Firebase SDK、React
- ❌ 在 barrel 使用 `export *`
- ❌ 在 ai 模組定義使用者對話 UX（屬 notebooklm）
- ❌ 在 ai 模組定義 task-formation 業務流程（屬 workspace）

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/ai/](../../../modules/ai/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
