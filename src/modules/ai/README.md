# AI Module

## 子域清單（名詞域）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體，不以動詞流程命名。  
> **子域不重複原則：** `conversation`（使用者對話 UX）屬 `notebooklm`；`document` 屬 `notebooklm`；`task-formation` 屬 `workspace`。

| 子域 | 狀態 | 說明 |
|---|---|---|
| `chunk` | 🔨 骨架建立，實作進行中 | 文字分塊實體（分塊策略、Token 計量、Chunk ID）|
| `citation` | 🔨 骨架建立，實作進行中 | 引用實體（生成內容對應的來源 Chunk 溯源）|
| `context` | 🔨 骨架建立，實作進行中 | AI 上下文實體（記憶體、對話歷程、人格設定）|
| `embedding` | 🔨 骨架建立，實作進行中 | 向量嵌入實體（Embedding 生成與向量儲存）|
| `evaluation` | 🔨 骨架建立，實作進行中 | 評估實體（品質評分、安全過濾、模型可觀測性）|
| `generation` | 🔨 骨架建立，實作進行中 | AI 生成實體（模型選擇、Tool calling、生成結果）|
| `memory` | 🔨 骨架建立，實作進行中 | AI 記憶實體（長期記憶、跨會話持久化）|
| `pipeline` | 🔨 骨架建立，實作進行中 | 提示管線實體（Prompt 模板、多步驟 Pipeline 定義）|
| `retrieval` | 🔨 骨架建立，實作進行中 | 語意檢索實體（向量相似度搜尋、TopK 結果）|
| `tool-calling` | 🔨 骨架建立，實作進行中 | 工具呼叫實體（Tool 定義、執行、結果處理）|

---

## task-formation 歸屬決策

| 子域 | 歸屬 | 理由 |
|---|---|---|
| `task-formation` | **`workspace`** | Task 是 workspace 領域物件；AI 生成能力由 `ai/generation` Port 注入 |

---

## 預期目錄結構

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
    embedding/
      domain/
      application/
      adapters/outbound/
    pipeline/
      domain/
      application/
      adapters/outbound/
    evaluation/
    generation/
    chunk/
    retrieval/
    context/
    citation/
    memory/
    tool-calling/
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

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 `domain/` 中 import Genkit、Firebase SDK | 破壞 domain 純度 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking 與邊界可追蹤性 |
| 在 ai 定義使用者對話 UX | 屬 notebooklm |
| 在 ai 定義 task-formation 業務流程 | 屬 workspace |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
