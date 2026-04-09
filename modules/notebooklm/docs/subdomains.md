# Subdomains — notebooklm

本文件是 notebooklm 的正式子域 inventory。這份清單是 **closed by default** 的：後續開發必須先把能力映射到既有子域，而不是再新增新的子域名稱。

## Subdomain Rule in Hexagonal DDD

- 每個子域描述的是 AI 對話與合成核心能力，不是資料夾便利分類
- 子域之間共享語言時，應先落地到 `ubiquitous-language.md`、`context-map.md` 與相關 ports 文件

## Canonical Inventory

| 子域 | 核心問題 | 主要語言 |
|---|---|---|
| `ai` | AI 模型如何被調用與管理 | `AiModel`, `Prompt`, `PromptTemplate`, `ModelResponse`, `AiCallLog` |
| `conversation` | 對話 Thread 與 Message 如何被管理 | `Thread`, `Message`, `MessageRole`, `ThreadHistory`, `ConversationContext` |
| `note` | 對話衍生筆記如何與知識連結 | `Note`, `NoteRef`, `KnowledgeLink`, `NoteSource` |
| `notebook` | Notebook 如何組合多個來源與對話 | `Notebook`, `NotebookItem`, `NotebookSource`, `NotebookSummary` |
| `source` | 來源文件如何被追蹤與引用 | `Source`, `SourceRef`, `Citation`, `SourceChunk`, `Grounding` |
| `synthesis` | RAG 合成、摘要與洞察如何被生成 | `Synthesis`, `SynthesisRequest`, `SynthesisResult`, `Insight`, `Summary` |
| `versioning` | 對話版本與快照如何被管理 | `ConversationSnapshot`, `VersionPolicy`, `SnapshotRef` |

## Capability Groups

### AI 推理核心

- `ai` — 模型調用抽象與提示工程
- `synthesis` — RAG 合成、摘要生成

### 對話管理

- `conversation` — Thread/Message 生命週期
- `versioning` — 版本快照策略

### 知識組合

- `notebook` — Notebook 容器組合
- `note` — 輕量筆記

### 來源管理

- `source` — 來源追蹤與引用

## 子域 README

| 子域 | 文件 |
|---|---|
| `ai` | [subdomains/ai/README.md](../subdomains/ai/README.md) |
| `conversation` | [subdomains/conversation/README.md](../subdomains/conversation/README.md) |
| `note` | [subdomains/note/README.md](../subdomains/note/README.md) |
| `notebook` | [subdomains/notebook/README.md](../subdomains/notebook/README.md) |
| `source` | [subdomains/source/README.md](../subdomains/source/README.md) |
| `synthesis` | [subdomains/synthesis/README.md](../subdomains/synthesis/README.md) |
| `versioning` | [subdomains/versioning/README.md](../subdomains/versioning/README.md) |
