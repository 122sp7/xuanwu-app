# AI Module — Agent Guide

## Purpose

`src/modules/ai` 是 **AI 能力蒸餾骨架**，為 Xuanwu 系統提供模型呼叫、提示管線、安全防護、記憶體上下文、評估策略等 AI 橫切能力的新實作落點。

**蒸餾來源：** `modules/ai/`  
**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

## 蒸餾子域清單

蒸餾來源 `modules/ai/subdomains/` 包含以下子域：

| 子域 | 說明 | 蒸餾狀態 |
|---|---|---|
| `conversations` | 對話歷程管理 | 📋 待蒸餾 |
| `datasets` | 訓練/評估資料集 | 📋 待蒸餾 |
| `embeddings` | 向量嵌入能力 | 📋 待蒸餾 |
| `evaluation-policy` | AI 輸出評估策略 | 📋 待蒸餾 |
| `memory-context` | 對話記憶體 / 上下文 | 📋 待蒸餾 |
| `messages` | 訊息格式與歷程 | 📋 待蒸餾 |
| `model-observability` | 模型呼叫可觀測性 | 📋 待蒸餾 |
| `models` | 模型選擇 / 路由 | 📋 待蒸餾 |
| `personas` | AI 人格設定 | 📋 待蒸餾 |
| `prompt-pipeline` | 提示管線（multi-template）| 📋 待蒸餾 |
| `prompts` | 提示模板倉庫 | 📋 待蒸餾 |
| `safety-guardrail` | 輸出安全防護 | 📋 待蒸餾 |
| `tokens` | Token 計量 / 配額 | 📋 待蒸餾 |
| `tools` | Tool calling / function 定義 | 📋 待蒸餾 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、Genkit SDK、HTTP client 或任何框架。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`，禁止直接跨 subdomain import。
- 外部消費者（notebooklm、workspace）只能透過 `modules/ai/api/index.ts` 存取 — 此邊界仍以 `modules/` 為權威。

## Route Here When

- 撰寫 AI 能力的新 use case、entity、adapter 實作。
- 實作 prompt template、tool calling port、embedding adapter 等骨架。
- 需要 `src/modules/ai/` 層的骨架結構作為起點。

## Route Elsewhere When

- 讀取 AI 模組邊界規則、published language → `modules/ai/AGENT.md`、`modules/ai/api/`
- Genkit flow 定義 → `modules/ai/subdomains/*/infrastructure/ai/`（現有 Genkit 實作）
- 跨模組 API boundary → `modules/ai/api/index.ts`（仍是權威）
- AI 工具函式 / 共享 util → `packages/shared-utils/`

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

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/ai/](../../../modules/ai/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
