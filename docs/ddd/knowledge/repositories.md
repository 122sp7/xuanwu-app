# knowledge ??Repositories

> **Canonical bounded context:** `knowledge`
> **璅∠?頝臬?:** `modules/knowledge/`
> **Domain Type:** Core Domain

?祆?隞嗆??`knowledge` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/knowledge.repositories.ts`
  - `KnowledgePageRepository` ????`verify()`, `requestReview()`, `assignOwner()` 蝑?Wiki Space ?寞?
  - `KnowledgeBlockRepository`
  - `KnowledgeVersionRepository`
  - `KnowledgeCollectionRepository`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseContentPageRepository.ts`
  - 撖虫? `KnowledgePageRepository`嚗 `verify()`, `requestReview()`, `assignOwner()` 銝?寞?
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentCollectionRepository.ts`
  - 撖虫? `KnowledgeCollectionRepository`嚗toKnowledgeCollection()` mapper 撌脣???`spaceType` 甈?

## KnowledgePageRepository ?寞?撠

| ?寞? | 隤芣? |
|------|------|
| `create()` | 撱箇?? |
| `rename()` | ???|
| `move()` | 蝘餃?撅斤? |
| `archive()` | 甇豢? |
| `reorderBlocks()` | ???憛?|
| `approve()` | 撖拇嚗I ?阮璅∪?嚗?|
| `verify()` | 撽??嚗iki Space 璅∪?嚗?|
| `requestReview()` | 璅??箏?撖拚嚗iki Space 璅∪?嚗?|
| `assignOwner()` | ???鞎痊鈭?|
| `findById()` | ???桅? |
| `listByAccountId()` | ?撣單?????|
| `listByWorkspaceId()` | ?撌乩???????|

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/knowledge/repositories.md`
- `../../../docs/ddd/knowledge/aggregates.md`
