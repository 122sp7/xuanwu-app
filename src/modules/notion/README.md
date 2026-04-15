# Notion Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/notion/` 正在從 `modules/notion/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `authoring` | `modules/notion/subdomains/authoring/` | 📋 待蒸餾 | 知識文件創作 / 編輯 |
| `collaboration` | `modules/notion/subdomains/collaboration/` | 📋 待蒸餾 | 協作 / 評論 / 共編 |
| `knowledge` | `modules/notion/subdomains/knowledge/` | 📋 待蒸餾 | 核心知識物件（KnowledgeArtifact）|
| `knowledge-database` | `modules/notion/subdomains/knowledge-database/` | 📋 待蒸餾 | 知識庫（原 database，已語意化）|
| `relations` | `modules/notion/subdomains/relations/` | 📋 待蒸餾 | 知識關聯圖 |
| `taxonomy` | `modules/notion/subdomains/taxonomy/` | 📋 待蒸餾 | 標籤 / 分類法 |

---

## 預期目錄結構（蒸餾後）

```
src/modules/notion/
  index.ts
  README.md
  AGENT.md
  orchestration/
    NotionFacade.ts
  shared/
    domain/index.ts             ← KnowledgeArtifact reference type（跨子域共用）
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    knowledge/                  ← 優先蒸餾（KnowledgeArtifact 核心 aggregate）
      domain/
      application/
      adapters/outbound/
    authoring/
    knowledge-database/
    taxonomy/
    collaboration/
    relations/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 讓其他模組直接修改 `KnowledgeArtifact` | notion 是唯一可寫的所有者 |
| 使用 `database` 作為子域名 | 已語意化為 `knowledge-database` |
| 把 `modules/notion/infrastructure/` 直接複製到 `src/modules/notion/domain/` | 層次混淆 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/notion/](../../../modules/notion/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
