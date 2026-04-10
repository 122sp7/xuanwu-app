# Subdomains — notebooklm

本文件是 notebooklm 的正式子域 inventory。這份清單是 **closed by default** 的：後續開發必須先把能力映射到既有子域，而不是再新增新的子域名稱。

## Subdomain Rule in Hexagonal DDD

- 每個子域描述的是 AI 對話與合成核心能力，不是資料夾便利分類
- 子域之間共享語言時，應先落地到 `ubiquitous-language.md`、`context-map.md` 與相關 ports 文件

## Canonical Inventory

| 子域 | 核心問題 | 主要語言 |
|---|---|---|
| `conversation` | 對話 Thread 與 Message 如何被管理 | `Thread`, `Message`, `MessageRole`, `ThreadHistory`, `ConversationContext` |
| `note` | 對話衍生筆記如何與知識連結 | `Note`, `NoteRef`, `KnowledgeLink`, `NoteSource` |
| `notebook` | Notebook 如何組合多個來源與對話 | `Notebook`, `NotebookItem`, `NotebookSource`, `NotebookSummary` |
| `source` | 來源文件如何被追蹤與引用 | `Source`, `SourceRef`, `Citation`, `SourceChunk`, `Grounding` |
| `synthesis` | RAG 合成、摘要與洞察如何被生成 | `Synthesis`, `SynthesisRequest`, `SynthesisResult`, `Insight`, `Summary` |
| `conversation-versioning` | 對話版本與快照如何被管理 | `ConversationSnapshot`, `VersionPolicy`, `SnapshotRef` |

> ⚠️ **Code Migration Required**
> - `ai` 子域已從 notebooklm 移除。通用 AI 模型提供者能力改由 `platform.ai` 消費。
>   現有 `subdomains/ai/` 的 RAG/grounding/synthesis 程式碼需重構至 `retrieval`、`grounding`、`evaluation` gap 子域。
>   受影響：`api/index.ts`（`subdomains/ai/qa` 的 import）、`api/server.ts`（`subdomains/ai/qa/server` 的 import）。
> - `subdomains/versioning/` 已重命名為 `subdomains/conversation-versioning/`。

## Capability Groups

### 對話管理

- `conversation` — Thread/Message 生命週期
- `conversation-versioning` — 版本快照策略

### 知識組合

- `notebook` — Notebook 容器組合
- `note` — 輕量筆記

### 來源管理

- `source` — 來源追蹤與引用

### RAG 推理

- `synthesis` — RAG 合成、摘要生成

## 子域 README

| 子域 | 文件 |
|---|---|
| `conversation` | [subdomains/conversation/README.md](../subdomains/conversation/README.md) |
| `note` | [subdomains/note/README.md](../subdomains/note/README.md) |
| `notebook` | [subdomains/notebook/README.md](../subdomains/notebook/README.md) |
| `source` | [subdomains/source/README.md](../subdomains/source/README.md) |
| `synthesis` | [subdomains/synthesis/README.md](../subdomains/synthesis/README.md) |
| `conversation-versioning` | [subdomains/conversation-versioning/README.md](../subdomains/conversation-versioning/README.md) |
