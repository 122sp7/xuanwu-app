# notebooklm — AI 對話與合成上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/notebooklm/`  
> **開發狀態:** 🏗️ Scaffold

## 在 Knowledge Platform / Second Brain 中的角色

`notebooklm` 是 Xuanwu 的 NotebookLM-like 互動層，將檢索結果、知識內容與知識結構脈絡轉成對話、摘要、洞察與可引用回答。它是最接近使用者 AI 推理體驗的上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 對話 Thread 管理 | 維護對話串與訊息歷史（`conversation` 子域） |
| AI 模型調用 | 提示工程與模型介接（`ai` 子域） |
| Notebook 組合 | Notebook 容器與內容組合管理（`notebook` 子域） |
| 來源追蹤 | 來源文件追蹤與引用管理（`source` 子域） |
| RAG 合成 | 摘要、洞察與合成生成（`synthesis` 子域） |
| 輕量筆記 | 對話衍生筆記與知識連結（`note` 子域） |
| 版本策略 | 對話版本與快照管理（`versioning` 子域） |

## 子域清單（7 個）

| 子域 | 核心職責 |
|---|---|
| `ai` | AI 模型調用與提示工程 |
| `conversation` | 對話 Thread 與 Message 生命週期 |
| `note` | 輕量筆記與知識連結 |
| `notebook` | Notebook 組合與管理 |
| `source` | 來源文件追蹤與引用 |
| `synthesis` | RAG 合成、摘要與洞察生成 |
| `versioning` | 對話版本與快照策略 |

## 與其他 Bounded Context 協作

- `notion` 是主要上游，提供知識內容來源。
- `platform` 提供身份認證與平台治理能力。
- `workspace` 提供 `workspaceId` 範疇錨點。

## Hexagonal 邊界

| Hexagonal 概念 | notebooklm 位置 | 說明 |
|---|---|---|
| Public boundary | `api/` | 跨模組公開契約投影 |
| Driving adapters | `adapters/` | web、CLI 等輸入端 |
| Application | `application/` | use case orchestration、DTO、command/query 處理 |
| Domain core | `domain/` | 聚合、值物件、domain services、domain events |
| Input ports | `ports/input/` | 進入 application 的穩定契約 |
| Output ports | `ports/output/` | repositories、stores、gateways、sinks |
| Driven adapters | `infrastructure/` | 對 output ports 的具體實作 |
| Subdomains | `subdomains/` | 7 個子域各自的能力邊界 |

## 詳細文件

| 文件 | 說明 |
|---|---|
| [docs/README.md](./docs/README.md) | 文件索引 |
| [docs/bounded-context.md](./docs/bounded-context.md) | 邊界定義、能力分組與封板規則 |
| [docs/subdomains.md](./docs/subdomains.md) | 7 個子域的正式責任表 |
| [docs/ubiquitous-language.md](./docs/ubiquitous-language.md) | 此 BC 通用語言 |
| [docs/aggregates.md](./docs/aggregates.md) | 聚合根與核心概念 |
| [docs/domain-events.md](./docs/domain-events.md) | 領域事件與整合語言 |
| [docs/context-map.md](./docs/context-map.md) | 與其他 BC 的關係與整合方式 |
