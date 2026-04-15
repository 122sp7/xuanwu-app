# NotebookLM Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/notebooklm/` 正在從 `modules/notebooklm/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（名詞域 → modules/ 來源）

> **子域設計原則：** 每個子域以**名詞**命名，代表其核心管理實體。  
> **子域不重複原則：** `synthesis`（合成推理）是 `conversation` 的應用層流程，不獨立成子域。AI 機制（embedding / retrieval / generation）屬 `ai` 模組。

| 子域 | 蒸餾來源（modules/notebooklm/subdomains/）| 狀態 | 說明 |
|---|---|---|---|
| `document` | `source` | 📋 待蒸餾 | Document 實體（來源文件接收、RagDocument 生命週期、ingestion 狀態）|
| `conversation` | `conversation` + `synthesis` | 📋 待蒸餾 | Conversation 實體（使用者對話 Session、問答流程、合成輸出）|
| `notebook` | `notebook` | 📋 待蒸餾 | Notebook 實體（筆記本生命週期、Document 集合管理）|

---

## 子域邊界示意（notebooklm vs ai）

```
notebooklm/document     ─ingestion→  ai/embedding（文件向量化）
notebooklm/document     ─切塊委託→  ai/chunk（分塊計算）
notebooklm/conversation ─問答觸發→  ai/retrieval（找相關 chunk）
notebooklm/conversation ─生成觸發→  ai/generation（生成回答）
notebooklm/conversation ─引用取得→  ai/citation（標注來源）
```

notebooklm 持有**使用者體驗流程**；ai 提供**計算機制**。

---

## 預期目錄結構（蒸餾後）

```
src/modules/notebooklm/
  index.ts
  README.md
  AGENT.md
  orchestration/
    NotebooklmFacade.ts
    NotebooklmCoordinator.ts    ← document→embedding→conversation 跨子域流程
  shared/
    domain/index.ts
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    document/                   ← 優先蒸餾（RagDocument 完整 modules/ 實作）
      domain/
      application/
      adapters/outbound/
    conversation/               ← 優先蒸餾（含 synthesis 應用流程）
    notebook/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 notebooklm `domain/` 定義 AI 機制子域 | AI 機制（embedding / retrieval / generation）屬 `ai` |
| 新建獨立 `synthesis` 子域 | 合成邏輯屬 `conversation` 應用層 |
| 直接呼叫 Genkit（不透過 port）| 破壞 port/adapter 邊界 |
| `Page` / `Block` 在 notebooklm 設為可寫 | 只能唯讀引用（notion 所有）|

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/notebooklm/](../../../modules/notebooklm/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
