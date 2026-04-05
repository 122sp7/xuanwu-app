# AGENT.md ??source BC

## 璅∠?摰?

`source` ?舀?隞嗡?皞??舀??鞎痊銝??望????砍翰?扯? RAG ?辣?餉?? RAG ingestion pipeline ?平????

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `SourceDocument` | File?ocument?sset?ttachment |
| `WikiLibrary` | Library?older?ollection |
| `FileVersion` | Version?napshot?evision |
| `RagDocument` | RagFile?ngestionDoc |
| `RetentionPolicy` | Policy?xpiryRule |
| `AuditRecord` | Log?vent?istory |
| `ActorContext` | User?urrentUser |
| `IngestionHandoff` | Trigger?ignal |

## ??閬?

### ???迂
```typescript
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, WikiLibraryDTO } from "@/modules/source/api";
```

### ??蝳迫
```typescript
import { File } from "@/modules/source/domain/entities/File";
```

## Firestore Timestamp 閬?

```typescript
// ??摰?矽?冽撘?
const date = (value.toDate as () => unknown)() as Date;

// ??蝳迫閫??鞈血?
const { toDate } = value; toDate(); // 'this' binding 憭望?
```

## 撽??賭誘

```bash
npm run lint
npm run build
```
