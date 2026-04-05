# AGENT.md — source BC

## 模組定位

`source` 是文件來源的支援域，負責上傳生命週期、版本快照與 RAG 文件登記。是 RAG ingestion pipeline 的業務入口。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `SourceDocument` | File、Document、Asset、Attachment |
| `WikiLibrary` | Library、Folder、Collection |
| `FileVersion` | Version、Snapshot、Revision |
| `RagDocument` | RagFile、IngestionDoc |
| `RetentionPolicy` | Policy、ExpiryRule |
| `AuditRecord` | Log、Event、History |
| `ActorContext` | User、CurrentUser |
| `IngestionHandoff` | Trigger、Signal |

## 邊界規則

### ✅ 允許
```typescript
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, WikiLibraryDTO } from "@/modules/source/api";
```

### ❌ 禁止
```typescript
import { File } from "@/modules/source/domain/entities/File";
```

## Firestore Timestamp 規則

```typescript
// ✅ 安全的調用方式
const date = (value.toDate as () => unknown)() as Date;

// ❌ 禁止解構賦值
const { toDate } = value; toDate(); // 'this' binding 失效
```

## 驗證命令

```bash
npm run lint
npm run build
```
