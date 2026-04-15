# NotebookLM Module — Agent Guide

## Purpose

`src/modules/notebooklm` 是 **NotebookLM 能力蒸餾骨架**，為 Xuanwu 系統提供對話（Conversation）、來源管理（Source）、筆記本（Notebook）、合成推理（Synthesis）等 RAG 核心能力的新實作落點。

**蒸餾來源：** `modules/notebooklm/`  
**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

## 蒸餾子域清單

| 子域 | 說明 | 蒸餾狀態 |
|---|---|---|
| `conversation` | 對話上下文管理 | 📋 待蒸餾 |
| `notebook` | 筆記本生命週期 | 📋 待蒸餾 |
| `source` | 知識來源接收 / RAG 文件 | 📋 待蒸餾 |
| `synthesis` | 合成推理 / 回答生成 | 📋 待蒸餾 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、Genkit SDK 或任何框架。
- AI 能力（embedding、synthesis）透過 port 注入，消費 `modules/ai/api/`，不直接呼叫 Genkit。
- `source` 子域持有 `RagDocument` entity；`KnowledgeArtifact` 是由 notion 提供的 reference，notebooklm 只讀取。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 NotebookLM 的新 use case、entity、adapter 實作。
- 實作 source ingestion、conversation 管理、synthesis adapter 骨架。

## Route Elsewhere When

- 讀取邊界規則 → `modules/notebooklm/AGENT.md`、`modules/notebooklm/api/`
- AI 能力 → `modules/ai/api/`（不直接呼叫 Genkit）
- KnowledgeArtifact（只讀）→ `modules/notion/api/`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/notebooklm/AGENT.md`、`modules/notebooklm/api/` |
| 撰寫新 use case / adapter / entity | `src/modules/notebooklm/`（本層）|
| 跨模組 API boundary | `modules/notebooklm/api/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 把 `modules/notebooklm/infrastructure/` 直接搬到 `src/modules/notebooklm/domain/`
- ❌ 在 notebooklm `domain/` 中定義 AI subdomain（AI 能力屬於 `modules/ai/`）
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/notebooklm/](../../../modules/notebooklm/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
