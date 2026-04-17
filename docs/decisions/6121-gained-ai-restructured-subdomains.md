# 6121 Migration Gain — ai 重組後子域

- Status: Recorded
- Date: 2026-04-17
- Category: Migration Gain > ai

## Context

`xuanwu-skill`（新）的 `src/modules/ai/subdomains/` 包含 10 個重組後的子域，替換了舊版中不同名稱或不存在的子域。這次重組使 ai 模組的子域更精確地對應 RAG pipeline 的各個階段。

### 新版 10 個子域 vs 舊版結構對比

| 新子域 | 對應舊子域 | 說明 |
|---|---|---|
| `chunk` | `chunking`（部分） | Chunk 的 domain model + 分塊策略 |
| `citation` | 無直接對應 | 引用來源生成（原在 notebooklm/synthesis） |
| `context` | 無直接對應 | RAG context window 組裝 |
| `embedding` | `embedding`（同名） | Embedding 生成與管理 |
| `evaluation` | `evaluation`（同名） | RAG 評估（relevance/faithfulness/completeness） |
| `generation` | `generation`（同名） | LLM 文本生成 |
| `memory` | 無直接對應 | 長期記憶管理（cross-session memory） |
| `pipeline` | `prompt-pipeline`（部分） | 多步驟 AI pipeline 執行 |
| `retrieval` | `retrieval`（同名） | 向量檢索 |
| `tool-calling` | 無直接對應 | Genkit tool calling 抽象層 |

### 重組帶來的架構改進

#### 1. `citation` 從 notebooklm 提升至 ai 模組

舊版的 `CitationBuilder`（ADR 6102）放在 notebooklm/synthesis，是 notebooklm 的私有邏輯。

新版將 `citation` 提升為 ai 模組的一個子域，使 citation 生成能力可被其他消費者（如 workspace 的 Activity Summary）使用。

#### 2. `memory` 子域的新增

新增的 `memory` 子域管理跨 session 的長期記憶（如用戶的 AI 對話偏好、常用知識來源），補充了舊版缺失的記憶管理層。

#### 3. `tool-calling` 子域的新增

新增的 `tool-calling` 子域提供 Genkit tool calling 的統一抽象，使 flow 定義不直接綁定工具的具體實作。

#### 4. `context` 子域的新增

新增的 `context` 子域負責 RAG context window 的組裝（選擇哪些 chunks 放入 prompt 的 context），原本是 synthesis 流程中的隱式邏輯。

### 現狀

10 個子域中多數有 domain/application 骨架，但 implementation 內容密度不均：
- `embedding`、`retrieval`、`generation`：有較完整的 domain model（各 ~50-80 lines）
- `chunk`、`evaluation`：有基本 domain struct
- `citation`、`context`、`memory`、`tool-calling`、`pipeline`：多為空 stub（1-5 lines）

## Decision

此為已規劃但尚未完整實作的結構調整，**不需要立即動作**。

注意：`memory`、`tool-calling`、`context` 三個空 stub 子域需要補充 domain model（可參考 ADR 6110、6111、6112 中的相關設計規格）。

## Consequences

- ai 模組的子域結構比舊版更清晰，各子域與 RAG pipeline 階段一對一對應。
- `citation`、`context`、`memory`、`tool-calling` 四個新子域尚無實作，需要設計後補充。

## 關聯 ADR

- **6110** ai prompt-pipeline 子域：`pipeline` 子域是 prompt-pipeline 的重命名延伸，但 domain model 尚未補充。
- **6111** ai 5 個缺失子域：`conversations`、`datasets`、`personas`、`safety-guardrail`、`model-observability` 仍未在新結構中出現，需另行評估。
- **6112** ai governance docs：重組後的子域邊界規格需要重新撰寫 `AGENT.md`。
