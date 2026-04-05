# source — 文件來源上下文

> **Domain Type:** Supporting Subdomain（支援域）
> **模組路徑:** `modules/source/`
> **開發狀態:** 🚧 Developing

## 定位

`source` 管理知識平台的**文件來源生命週期**，是 RAG 攝入管線的文件入口。它擁有檔案上傳、版本快照、保留政策與 RAG 文件登記的業務規則。

## 職責

| 能力 | 說明 |
|------|------|
| upload-init | 建立 SourceDocument 聚合根、產生 Firebase Storage 上傳簽名 URL |
| upload-complete | 標記上傳完成、觸發 IngestionHandoff 給 `ai` 域 |
| RagDocument 登記 | 登記已完成上傳的文件進入 RAG 管線 |
| WikiLibrary 管理 | 管理知識庫文件集合（WikiLibrary） |
| 檔案列表查詢 | 依工作區範圍列出 SourceDocument |
| 保留政策 | 管理 RetentionPolicy（保留期限、刪除規則） |

## 核心聚合根

- **`SourceDocument`**（File.ts）— 核心檔案聚合根，管理上傳生命週期、FileVersion
- **`WikiLibrary`** — RAG 文件的邏輯集合容器

## Runtime 邊界（重要）

```
Next.js（source module） → 上傳 UX、Server Action、upload-init/complete
py_fn/                   → Embedding 生成、向量寫入（重型工作）
```

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | SourceDocument 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
