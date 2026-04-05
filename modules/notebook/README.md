# notebook — AI Notebook & Chat Layer

> **開發狀態**：🚧 Developing — 積極開發中
> **Domain Type**：Supporting Domain（支援域）

`modules/notebook` 對應 **NotebookLM** 的核心職能，負責 AI 筆記、對話管理、摘要生成與洞察提取。提供使用者與 AI 進行多輪對話的聚合根與生命週期管理。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`
- AI 生成操作透過 `ai/api` 委派執行

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 筆記管理 | 建立、管理 AI 輔助筆記本（Notebook） |
| 對話管理 | 管理多輪對話執行緒（ChatSession / Thread） |
| 摘要生成 | 觸發知識摘要（Summary）並保存結果 |
| 洞察提取 | 從知識內容提取 Insight，生成引用（Citation） |
| 消息歷史 | 維護 Thread 中的 Message 列表 |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `Notebook` | AI 筆記本，包含多個 Source 和 ChatSession |
| `ChatSession` | 一段多輪 AI 對話會話 |
| `Summary` | 從知識內容生成的摘要快照 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 筆記本 | Notebook | AI 筆記本聚合根，包含 Sources 和 Sessions |
| 對話執行緒 | Thread | 一段多輪對話的 Message 集合 |
| 消息 | Message | Thread 中的單一對話單元（role: user / assistant） |
| 對話會話 | ChatSession | 使用者與 AI 的一次對話實例 |
| 摘要 | Summary | AI 生成的知識摘要文本 |
| 洞察 | Insight | AI 從知識中提取的關鍵觀點 |
| 引用 | Citation | 摘要或洞察的知識來源參考 |
| 代理生成 | AgentGeneration | 一次 AI 代理的完整輸入/輸出記錄 |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `notebook.created` | 新筆記本建立時 |
| `notebook.session_started` | 新對話會話開始時 |
| `notebook.summary_generated` | 摘要生成完成時 |
| `notebook.message_appended` | 新消息加入 Thread 時 |
| `notebook.insight_extracted` | 洞察提取完成時 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`、`workspace/api`、`ai/api`（LLM 推理）、`search/api`（RAG 檢索）
- **下游（被依賴）**：`workspace/api`（工作區 Notebook tab）

---

## 目錄結構

```
modules/notebook/
├── api/                  # 公開 API 邊界（contracts.ts, facade.ts, index.ts）
├── application/          # Use Cases
│   └── use-cases/
├── domain/               # Aggregates, Entities, Value Objects, Events, Repositories
│   ├── entities/         # AgentGeneration.ts, Thread.ts, Message.ts, RagQuery.ts
│   ├── repositories/     # RagGenerationRepository, RagRetrievalRepository
│   └── value-objects/
├── infrastructure/       # Genkit / Firebase 適配器
│   ├── firebase/         # FirebaseRagRetrievalRepository
│   └── genkit/           # GenkitAgentRepository
├── interfaces/           # UI 元件、hooks、server actions
│   └── _actions/         # notebook.actions.ts
└── index.ts
```

---

## 架構參考

- 系統設計文件：`docs/architecture/ai-domain.md`
- 通用語言：`docs/architecture/ubiquitous-language.md`
