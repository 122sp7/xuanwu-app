# ai — AI Infrastructure Layer

> **開發狀態**：🚧 Developing — 積極開發中
> **Domain Type**：Supporting Domain（支援域）

`modules/ai` 負責 AI 基礎設施層，包含 Embedding 生成、向量索引管理、RAG 流程協調與 LLM 推理。是整個知識平台的 AI 計算引擎，為 `notebook`、`search` 等模組提供 AI 能力。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`
- 重型 AI 工作（embedding、ingestion）委派給 `py_fn/` Python worker

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| Embedding 生成 | 文本向量化，產生 Embedding |
| 向量索引管理 | 管理 VectorIndex 的建立與更新 |
| LLM 推理協調 | 協調 LLM API 呼叫（透過 Genkit） |
| RAG 流程 | Context-grounded 問答生成 |
| 知識攝入觸發 | 觸發 py_fn ingestion pipeline |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `AIQuery` | 一次 AI 查詢的完整記錄（input、context、output） |
| `Embedding` | 文本的向量表示快照 |
| `VectorIndex` | 向量資料庫的索引管理單元 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 嵌入向量 | Embedding | 文本的數值向量表示 |
| 向量索引 | VectorIndex | 向量資料庫的搜尋索引 |
| AI 查詢 | AIQuery | 一次完整的 AI 推理查詢記錄 |
| 提示詞 | Prompt | 傳送給 LLM 的指令文本 |
| 補全 | Completion | LLM 的回應文本 |
| 上下文 | Context | RAG 檢索到的知識片段 |
| 引用 | Reference | AI 回應引用的知識來源 |
| Token 計數 | TokenCount | 一次推理消耗的 Token 數量 |
| 攝入任務 | IngestionJob | 知識文件的向量化攝入作業 |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `ai.embedding_created` | Embedding 生成完成時 |
| `ai.ingestion_completed` | 知識攝入完成時 |
| `ai.query_answered` | AI 查詢回應完成時 |

---

## Runtime 邊界（重要）

| 運行時 | 職責 |
|--------|------|
| **Next.js** | LLM 推理協調（Genkit Flow）、串流回應、使用者對話 |
| **py_fn/** | Embedding 生成、文件解析、向量寫入（重型工作） |

---

## 目錄結構

```
modules/ai/
├── api/                  # 公開 API 邊界
├── application/          # Use Cases
├── domain/               # Aggregates, Repositories
│   ├── repositories/     # GraphRepository, IngestionJobRepository
│   └── value-objects/
└── infrastructure/       # Genkit / Firebase / py_fn 適配器
```

---

## 架構參考

- AI 架構文件：`docs/architecture/ai-domain.md`
- Infrastructure 策略：`docs/architecture/infrastructure-strategy.md`
