# Aggregates ??knowledge

## ???對?KnowledgePage嚗ontentPage嚗?

### ?瑁痊
?詨??亥??桀?????恣???Ｘ?憿摮惜蝝?靽?parentPageId嚗?憛??典?銵剁?blockIds嚗?撖拇???

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | ?銝駁 |
| `title` | `string` | ?璅? |
| `slug` | `string` | URL-safe 霅蝚?|
| `parentPageId` | `string \| null` | ?園???ID嚗邦?撅斤?嚗?|
| `blockIds` | `string[]` | ???ContentBlock ID ?” |
| `accountId` | `string` | ?撅砍董??|
| `workspaceId` | `string?` | ?撅砍極雿?嚗?賂? |
| `status` | `KnowledgePageStatus` | `active \| archived` |
| `approvalState` | `KnowledgePageApprovalState?` | `pending \| approved`嚗I ???阮雿輻嚗?|
| `approvedByUserId` | `string?` | 撖拇??ID |
| `approvedAtISO` | `string?` | 撖拇?? |
| `createdByUserId` | `string` | 撱箇???ID |
| `createdAtISO` | `string` | ISO 8601 撱箇??? |
| `updatedAtISO` | `string` | ISO 8601 ?湔?? |

### Wiki/Knowledge Base 撽?撅祆改?spaceType="wiki" ?舐嚗?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `verificationState` | `PageVerificationState?` | `verified \| needs_review`嚗ndefined = ??wiki 璅∪?嚗?|
| `ownerId` | `string?` | ?鞎痊鈭綽?靽??批捆皞Ⅱ?蝙?刻? |
| `verifiedByUserId` | `string?` | ?敺?霅?ID |
| `verifiedAtISO` | `string?` | ?敺?霅???|
| `verificationExpiresAtISO` | `string?` | 撽??唳???嚗???芸?頧 `needs_review`嚗?|

### KnowledgePageStatus ??UI 璅惜撠

| `status` 撅祆批? | 摮?閰?| UI 憿舐內璅惜 | 隤芣? |
|--------------|------|----------------|------|
| `"active"` | 瘣餉? | 嚗迤撣賊＊蝷綽? | ?身???|
| `"archived"` | 撌脫飛瑼?| 蝘餉?獢塚?撌脫飛瑼? | ??`archiveKnowledgePage` 閫貊嚗I 璅惜?箝宏?喳??暹▲??|

> **霅血?嚗?* 銝??啣? `"trash"` ??archived` ?喟撠? Notion "Move to Trash" ??domain 撖虫???蝣箄?頠?歹???ADR 瘙箄??耨?寞迨?辣??

### 銝???

- `slug` ?典?銝 accountId 銝??銝
- archived ?銝?啣? ContentBlock
- archived ???`PageTreeView` 銝＊蝷綽?撅內撅日?瞈?`status === "active"`嚗?

---

## 撖阡?嚗ontentBlock嚗nowledgeBlock嚗?

### ?瑁痊
??抒????批捆?桀?嚗?摨??耦???Ｗ摰嫘?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | ?憛蜓??|
| `pageId` | `string` | ?撅祇???ID |
| `accountId` | `string` | ?撅砍董??|
| `content` | `BlockContent` | ??摰對???`type: BlockType` 甈?嚗?|
| `order` | `number` | ???? |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

> `BlockContent.type` ??`BlockType`嚗text \| heading-1 \| heading-2 \| heading-3 \| image \| code \| bullet-list \| numbered-list \| divider \| quote`嚗?
> 隞?Ⅳ雿蔭嚗domain/value-objects/block-content.ts`

---

## 撖阡?嚗ontentVersion嚗nowledgeVersion嚗?

### ?瑁痊
??風?脩??砍翰?改?append-only??

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | ?銝駁 |
| `pageId` | `string` | ?撅祇???|
| `accountId` | `string` | ?撅砍董??|
| `label` | `string` | ?璅惜嚗犖憿霈?膩嚗?|
| `titleSnapshot` | `string` | ?撱箇????璅?敹怎 |
| `blocks` | `KnowledgeVersionBlock[]` | ???暺??憛翰?批?銵?|
| `createdByUserId` | `string` | 撱箇??董??ID |
| `createdAtISO` | `string` | ISO 8601 |

---

## ???對?KnowledgeCollection嚗atabase / Wiki Space嚗?

### ?瑁痊
Notion-like ???征??靘?`spaceType` ??拍車璅∪?嚗?
- **`spaceType="database"`**嚗otion Database ??撣嗆?雿?Schema嚗olumns嚗????嚗?渲”???閬?
- **`spaceType="wiki"`**嚗otion Wiki / Knowledge Base ??撣園??ａ?霅?????霅澈蝛粹?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | ??銝駁 |
| `accountId` | `string` | ?撅砍董??|
| `workspaceId` | `string?` | ?撅砍極雿? |
| `name` | `string` | ???迂 |
| `description` | `string?` | 隤芣??? |
| `spaceType` | `CollectionSpaceType` | `"database" \| "wiki"` |
| `columns` | `CollectionColumn[]` | 甈?摰儔嚗atabase 璅∪?雿輻嚗?|
| `pageIds` | `string[]` | ???KnowledgePage ID ?” |
| `status` | `CollectionStatus` | `active \| archived` |
| `createdByUserId` | `string` | 撱箇???|
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

---

## Repository Interfaces

| 隞 | 銝餉??寞? |
|------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `approve()`, `verify()`, `requestReview()`, `assignOwner()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` |
| `KnowledgeVersionRepository` | `create()`, `findById()`, `listByPageId()` |
| `KnowledgeCollectionRepository` | `create()`, `rename()`, `addPage()`, `removePage()`, `addColumn()`, `archive()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
