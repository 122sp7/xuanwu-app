# AGENT.md ??knowledge BC

## 璅∠?摰?

`knowledge` ??Core Domain嚗恣??KnowledgePage ???渡??賡望??knowledge.page_approved` ?臬像?啁??詨??游?鈭辣嚗孛??workspace-flow ?拙?瘚???

`knowledge` 撠? Notion ?敹??賡?嚗ages嚗nowledgePage嚗locks嚗ontentBlock嚗atabases嚗nowledgeCollection with spaceType="database"嚗iki/Knowledge Base嚗nowledgeCollection with spaceType="wiki"嚗葆?撽?????嚗?

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `KnowledgePage` | Page?ocument |
| `ContentBlock` | Block?ode?lement |
| `ContentVersion` | Version?napshot?istory |
| `BlockType` | Type?ontentType |
| `KnowledgeCollection` | Database?ollection?able |
| `WikiSpace` | KB?nowledgeBase嚗?亦迂?潘? |
| `PageVerificationState` | verified?eeds_review嚗????嚗?|
| `PageOwner` (`ownerId`) | Owner?esponsible |

> `WikiPage` ??`wiki` BC ??隤?`knowledge` BC 銝蝙??`WikiPage` 雿?隤???
> `WikiSpace` ??`knowledge` BC 隞?” `spaceType="wiki"` ??`KnowledgeCollection`嚗? `wiki` 璅∠?嚗?霅???摰銝???

## ??閬?

### ???迂
```typescript
import { knowledgeApi } from "@/modules/knowledge/api";
import type { KnowledgePageDTO, ContentBlockDTO } from "@/modules/knowledge/api";
```

### ??蝳迫
```typescript
import { ContentPage } from "@/modules/knowledge/domain/entities/content-page.entity";
import { KnowledgePageCreatedEvent } from "@/modules/knowledge/domain/events/knowledge.events";
import type { WikiPage } from "@/modules/wiki/domain/entities/...";
```

## page_approved 鈭辣閬?

`knowledge.page_approved` 敹??嚗?
- `extractedTasks[]` ??靘?workspace-flow 撱箇? Task
- `extractedInvoices[]` ??靘?workspace-flow 撱箇? Invoice
- `actorId`, `causationId`, `correlationId` ??餈質馱??

## 撽??賭誘

```bash
npm run lint
npm run build
```
