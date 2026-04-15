# NotebookLM Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/notebooklm/` 正在從 `modules/notebooklm/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `conversation` | `modules/notebooklm/subdomains/conversation/` | 📋 待蒸餾 | 對話上下文管理 |
| `notebook` | `modules/notebooklm/subdomains/notebook/` | 📋 待蒸餾 | 筆記本生命週期 |
| `source` | `modules/notebooklm/subdomains/source/` | 📋 待蒸餾 | 知識來源 / RagDocument |
| `synthesis` | `modules/notebooklm/subdomains/synthesis/` | 📋 待蒸餾 | 合成推理 / 回答生成 |

---

## 預期目錄結構（蒸餾後）

```
src/modules/notebooklm/
  index.ts
  README.md
  AGENT.md
  orchestration/
    NotebooklmFacade.ts
    NotebooklmCoordinator.ts    ← source→embedding→synthesis 跨子域流程
  shared/
    domain/index.ts
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    source/                     ← 優先蒸餾（RagDocument 完整 modules/ 實作）
      domain/
      application/
      adapters/outbound/
    conversation/
    synthesis/
    notebook/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 notebooklm `domain/` 定義 AI 能力子域 | AI 能力屬於 `modules/ai/` |
| 直接呼叫 Genkit（不透過 port）| 破壞 port/adapter 邊界 |
| `KnowledgeArtifact` 在 notebooklm 設為可寫 | 只能唯讀引用（notion 所有）|

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/notebooklm/](../../../modules/notebooklm/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
