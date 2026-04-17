# AI Module — Agent Guide

## Purpose

`src/modules/ai` 是 **AI 機制能力模組**，為 Xuanwu 系統提供文字分塊（Chunk）、向量嵌入（Embedding）、語意檢索（Retrieval）、上下文管理（Context）、內容生成（Generation）、來源引用（Citation）、品質評估（Evaluation）、提示管線（Pipeline）等 AI 底層機制的實作落點。

> **⚠ 邊界警示：** `ai` 擁有 AI **機制**（模型呼叫、向量計算、提示建構），不擁有使用者對話 UX（屬 `notebooklm`）、知識文件管理（屬 `notion`）或任務生成流程（屬 `workspace`）。

## 子域清單（名詞域）

| 子域 | 說明 | 狀態 |
|---|---|---|
| `chunk` | 文字分塊實體（分塊策略、Token 計量）| 🔨 骨架建立，實作進行中 |
| `citation` | 引用實體（生成內容的來源溯源）| 🔨 骨架建立，實作進行中 |
| `context` | AI 上下文實體（記憶體、對話歷程、人格）| 🔨 骨架建立，實作進行中 |
| `embedding` | 向量嵌入實體（Embedding 生成與儲存）| 🔨 骨架建立，實作進行中 |
| `evaluation` | 評估實體（輸出品質、安全防護、模型可觀測性）| 🔨 骨架建立，實作進行中 |
| `generation` | AI 生成實體（模型選擇、Tool calling、內容生成）| 🔨 骨架建立，實作進行中 |
| `memory` | AI 記憶實體（長期記憶、跨會話持久化）| 🔨 骨架建立，實作進行中 |
| `pipeline` | 提示管線實體（提示模板、多步驟管線）| 🔨 骨架建立，實作進行中 |
| `retrieval` | 語意檢索實體（向量相似度搜尋）| 🔨 骨架建立，實作進行中 |
| `tool-calling` | 工具呼叫實體（Tool 定義、執行、結果處理）| 🔨 骨架建立，實作進行中 |

> **子域不重複原則：**  
> - `conversation`（使用者對話 UX）→ `notebooklm` 所有  
> - `document`（來源文件管理）→ `notebooklm` 所有  
> - `task-formation`（AI 輔助任務生成流程）→ `workspace` 所有；ai 提供 `generation` 能力支援  

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、Genkit SDK、HTTP client 或任何框架。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`，禁止直接跨 subdomain import。
- 外部消費者（notebooklm、workspace）只能透過 `src/modules/ai/index.ts` 存取。
- ai 模組不得依賴 notion、notebooklm、workspace（ai 是上游 AI 機制提供者）。

## task-formation 歸屬決策

`task-formation` 子域屬於 **`workspace`**，理由：
- 輸出物（Task entities）是 workspace 的領域物件
- 觸發者（使用者指定生成任務）是 workspace 層業務流程
- AI 模型呼叫透過 `ai/generation` Port 注入，由 workspace 消費

## Route Here When

- 撰寫 AI 機制的新 use case、entity、adapter 實作（embedding、retrieval、generation 等）。
- 實作 prompt template、tool calling port、embedding vector adapter 等骨架。
- 需要 `src/modules/ai/` 層的骨架結構作為起點。

## Route Elsewhere When

- 讀取 AI 模組邊界規則、published language → `src/modules/ai/AGENT.md`
- 使用者對話 / Notebook UX → `src/modules/notebooklm/`
- 知識文件 / Page 管理 → `src/modules/notion/`
- 任務生成業務流程 → `src/modules/workspace/`（`task-formation`）
- 跨模組 API boundary → `src/modules/ai/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/ai/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/ai/`（本層） |
| 跨模組 API boundary | `src/modules/ai/index.ts` |

**嚴禁事項：**
- ❌ 在 `domain/` 匯入 Genkit、Firebase SDK、React
- ❌ 在 barrel 使用 `export *`
- ❌ 在 ai 模組定義使用者對話 UX（屬 notebooklm）
- ❌ 在 ai 模組定義 task-formation 業務流程（屬 workspace）

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
