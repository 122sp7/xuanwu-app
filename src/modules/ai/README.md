# AI Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/ai/` 正在從 `modules/ai/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。
>
> - `modules/ai/` → 讀取邊界規則、published language、context map；不在此新增實作。
> - `src/modules/ai/` → 撰寫新 use case、adapter、entity；以 `template` 骨架為起點。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（名詞域 → modules/ 來源）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體，不以動詞流程命名。  
> **子域不重複原則：** `conversation`（使用者對話 UX）屬 `notebooklm`；`document` 屬 `notebooklm`；`task-formation` 屬 `workspace`。

| 子域 | 蒸餾來源（modules/ai/subdomains/）| 狀態 | 說明 |
|---|---|---|---|
| `chunk` | `tokens` + 分塊邏輯 | 📋 待蒸餾 | 文字分塊實體（分塊策略、Token 計量、Chunk ID）|
| `embedding` | `embeddings` | 📋 待蒸餾 | 向量嵌入實體（Embedding 生成與向量儲存）|
| `retrieval` | `tools` / `context`（分散）| 📋 待蒸餾 | 語意檢索實體（向量相似度搜尋、TopK 結果）|
| `context` | `memory-context` + `messages` + `conversations` + `personas` | 📋 待蒸餾 | AI 上下文實體（記憶體、對話歷程、人格設定）|
| `generation` | `models` + `tools` | 📋 待蒸餾 | AI 生成實體（模型選擇、Tool calling、生成結果）|
| `citation` | 新增（無舊對應）| 📋 待蒸餾 | 引用實體（生成內容對應的來源 Chunk 溯源）|
| `evaluation` | `evaluation-policy` + `safety-guardrail` + `datasets` + `model-observability` | 📋 待蒸餾 | 評估實體（品質評分、安全過濾、模型可觀測性）|
| `pipeline` | `prompt-pipeline` + `prompts` | 📋 待蒸餾 | 提示管線實體（Prompt 模板、多步驟 Pipeline 定義）|

---

## task-formation 歸屬決策

| 子域 | 歸屬 | 理由 |
|---|---|---|
| `task-formation` | **`workspace`** | Task 是 workspace 領域物件；AI 生成能力由 `ai/generation` Port 注入 |

`modules/ai/subdomains/task-formation`（空骨架）未來整合至 `workspace/task-formation`，不在 ai 模組擴展。

---

## 預期目錄結構（蒸餾後）

```
src/modules/ai/
  index.ts                      ← 模組對外唯一入口（具名匯出）
  README.md
  AGENT.md
  orchestration/
    AiFacade.ts                 ← 對外統一 Facade
    AiCoordinator.ts            ← 跨子域協調（chunk→embedding→retrieval→generation）
  shared/
    domain/index.ts
    application/index.ts
    events/index.ts             ← Published Language Events（供 notebooklm / workspace 消費）
    errors/index.ts
    types/index.ts
  subdomains/
    embedding/                  ← 優先蒸餾（現有 modules/ 實作完整）
      domain/
      application/
      adapters/outbound/
    pipeline/                   ← 優先蒸餾（prompt-pipeline 有完整實作）
      domain/
      application/
      adapters/outbound/
    evaluation/                 ← 優先蒸餾（safety-guardrail 有完整實作）
    generation/
    chunk/
    retrieval/
    context/
    citation/
```

---

## 依賴方向

```
subdomains/*/adapters/inbound → subdomains/*/application → subdomains/*/domain
                                                                    ↑
                               subdomains/*/adapters/outbound  ───┘
                                                    ↑
                                             shared/domain
```

跨子域協調只能透過 `orchestration/` 或 `shared/events/`，不得直接跨 subdomain import。

---

## 子域邊界示意（ai vs notebooklm）

```
notebooklm/conversation  ←使用→  ai/generation（生成回答機制）
notebooklm/document      ←使用→  ai/embedding（向量化文件）
notebooklm/conversation  ←使用→  ai/retrieval（檢索相關 chunk）
notebooklm/conversation  ←使用→  ai/citation（標注引用來源）
notebooklm/document      ─切塊→  ai/chunk（分塊計算）
```

ai 提供**機制**；notebooklm 組合機制成**使用者體驗**。

---

## 蒸餾來源參考

- `modules/ai/api/` — 公開 API 邊界（跨模組存取入口）
- `modules/ai/subdomains/prompt-pipeline/` — 現有 prompt-pipeline 完整實作
- `modules/ai/subdomains/safety-guardrail/` — 現有 safety-guardrail 實作
- `modules/ai/subdomains/evaluation-policy/` — 現有 evaluation-policy 實作

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 把 `modules/ai/infrastructure/` 直接複製到 `src/modules/ai/domain/` | 層次混淆，污染 domain 純度 |
| 把 `src/modules/ai/` 當成 `modules/ai/` 的別名 | 兩層職責不同，互不取代 |
| 在 `domain/` 中 import Genkit、Firebase SDK | 破壞 domain 純度 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking 與邊界可追蹤性 |
| 在 ai 定義使用者對話 UX | 屬 notebooklm |
| 在 ai 定義 task-formation 業務流程 | 屬 workspace |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/ai/](../../../modules/ai/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
