# NotebookLM Module — Agent Guide

## Purpose

`src/modules/notebooklm` 是 **NotebookLM RAG 核心能力模組**，為 Xuanwu 系統提供來源文件（Document）、使用者對話（Conversation）、筆記本（Notebook）等 RAG 使用者體驗能力的實作落點。

> **⚠ 邊界警示：** notebooklm 擁有 RAG **使用者體驗**（對話流程、文件接收、筆記本管理）。  
> AI **機制**（embedding、retrieval、generation、citation）屬 `ai` 模組，notebooklm 透過 Port 消費。

## 子域清單（名詞域）

| 子域 | 說明 | 狀態 |
|---|---|---|
| `document` | Document 實體（來源文件接收、RagDocument 生命週期、metadata）| 🔨 骨架建立，實作進行中 |
| `conversation` | Conversation 實體（使用者對話 Session、問答流程、Synthesis 輸出）| 🔨 骨架建立，實作進行中 |
| `notebook` | Notebook 實體（筆記本生命週期、Document 集合）| 🔨 骨架建立，實作進行中 |

> **子域不重複原則：**  
> - `synthesis`（合成推理）是 `conversation` 的**應用層流程**，不獨立成子域  
> - AI 機制（embedding、retrieval、generation）屬 `ai` 模組；notebooklm 透過 Port 注入消費  
> - `conversation`（AI 模型上下文管理）屬 `ai/context`；`conversation`（使用者對話 UX）屬本模組  

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、Genkit SDK 或任何框架。
- AI 能力（embedding、retrieval、generation、citation）透過 Port 注入，消費 `src/modules/ai/index.ts`，不直接呼叫 Genkit。
- `document` 子域持有 `RagDocument` entity；`Page`（notion 的 KnowledgeArtifact）是由 notion 提供的 reference，notebooklm 只讀取。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 NotebookLM 的新 use case、entity、adapter 實作。
- 實作 document ingestion、conversation 管理、notebook lifecycle 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/notebooklm/AGENT.md`
- AI 能力（embedding / retrieval / generation）→ `src/modules/ai/index.ts`（不直接呼叫 Genkit）
- KnowledgeArtifact（只讀）→ `src/modules/notion/index.ts`
- 跨模組 API boundary → `src/modules/notebooklm/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/notebooklm/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/notebooklm/`（本層）|
| 跨模組 API boundary | `src/modules/notebooklm/index.ts` |

**嚴禁事項：**
- ❌ 在 notebooklm `domain/` 中定義 AI 機制（embedding、retrieval、generation 屬 `ai`）
- ❌ 新建獨立 `synthesis` 子域（合成邏輯屬 `conversation` 應用層）
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
