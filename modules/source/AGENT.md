# AGENT.md — modules/source

## 模組定位

`modules/source` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責文件來源的上傳、版本管理、授權與保留政策。是知識攝入管線（RAG ingestion）的文件入口。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `SourceDocument`（不是 File、Document、Asset）
- `SourceCollection`（不是 Library、Folder、Collection）
- `FileVersion`（不是 Version、Snapshot）
- `RetentionPolicy`（不是 Policy、LifecycleRule）
- `AuditRecord`（不是 Log、Event）
- `RagDocument`（已準備攝入 RAG 管線的文件）

## 邊界規則

### ✅ 允許

```typescript
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, SourceCollectionDTO } from "@/modules/source/api";
```

### ❌ 禁止

```typescript
import { File } from "@/modules/source/domain/entities/File";
import { FirebaseFileRepository } from "@/modules/source/infrastructure/...";
```

## 上傳流程規則

- 上傳 UX 屬於 **Next.js** 責任（非 py_fn）
- 上傳完成後，透過 `ai/api` 觸發 IngestionJob（best-effort handoff）
- 實際 Embedding 生成在 **py_fn** Python worker 執行

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `ai/api` | API 呼叫 | 上傳完成後觸發 RAG IngestionJob |
| `knowledge/api` | 事件發布 | 文件關聯知識頁面時通知 |
| `workspace/api` | API 呼叫 | 驗證工作區範圍與授權 |
| `identity/api` | API 呼叫 | 驗證上傳者身分與授權 |

## Firestore Timestamp 規則

使用 Timestamp.toDate() 時必須用成員表達式：

```typescript
// ✅ 安全的調用方式
(value.toDate as () => unknown)()

// ❌ 禁止解構賦值後再調用
const { toDate } = value; toDate()  // 'this' binding 失效
```

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
