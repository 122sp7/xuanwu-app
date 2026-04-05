# knowledge ??Application Services

> **Canonical bounded context:** `knowledge`
> **璅∠?頝臬?:** `modules/knowledge/`
> **Domain Type:** Core Domain

?祆?隞嗉???`knowledge` ??application layer ????use cases?摰寡? `modules/knowledge/application/` 撖虫?靽?銝?氬?

## Application Layer ?瑁痊

蝞∠??亥???摰孵?憛??甇瑕嚗撟喳?敹霅摰寥???

Application layer ?芾?鞎穿?
- ?矽 use cases / DTO / process manager
- ?澆 domain repository ports ??domain services
- 銝頛?UI / framework-specific concerns

## 撖阡?瑼?

- `application/block-service.ts`
- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-block.use-cases.ts`
- `application/use-cases/knowledge-collection.use-cases.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-version.use-cases.ts`

## Use Cases 皜

| Use Case 憿 | ?? | UI ?亙 |
|---|---|---|
| `CreateKnowledgePageUseCase` | 撱箇??亥?? | PageTreeView `+` ?? / "?啣??" |
| `RenameKnowledgePageUseCase` | ??賢?? | PageTreeView `?圳 ?詨 ??銵 inline 頛詨獢?|
| `MoveKnowledgePageUseCase` | 蝘餃??撅斤? | PageTreeView `?圳 ?詨 ???宏???敺祕雿? |
| `ArchiveKnowledgePageUseCase` | 甇豢??嚗I嚗宏?喳??暹▲嚗?| PageTreeView `?圳 ?詨 ???宏?喳??暹▲??|
| `ReorderKnowledgePageBlocksUseCase` | ????憛?|
| `ApproveKnowledgePageUseCase` | 撖拇?嚗孛?潭??隞塚? |
| `VerifyKnowledgePageUseCase` | 撽??嚗iki Space 璅∪?嚗?|
| `RequestPageReviewUseCase` | 閬??撖拚嚗iki Space 璅∪?嚗?|
| `AssignPageOwnerUseCase` | ???鞎痊鈭綽?Wiki Space 璅∪?嚗?|
| `GetKnowledgePageUseCase` | ???桅? |
| `ListKnowledgePagesUseCase` | ??撣單?????|
| `GetKnowledgePageTreeUseCase` | ???璅寧?蝯? |
| `CreateKnowledgeCollectionUseCase` | 撱箇???嚗atabase / Wiki Space嚗?|
| `RenameKnowledgeCollectionUseCase` | ??賢??? |
| `AddPageToCollectionUseCase` | 撠??Ｗ??仿???|
| `RemovePageFromCollectionUseCase` | 敺??宏?日???|
| `AddCollectionColumnUseCase` | ?啣?甈?嚗atabase 璅∪?嚗?|
| `ArchiveKnowledgeCollectionUseCase` | 甇豢??? |
| `GetKnowledgeCollectionUseCase` | ???桐??? |
| `ListKnowledgeCollectionsByAccountUseCase` | ??撣單?????|
| `ListKnowledgeCollectionsByWorkspaceUseCase` | ??撌乩???????|

## 閮剛?撠?

- 璅∠? README嚗../../../modules/knowledge/README.md`
- 璅∠? AGENT嚗../../../modules/knowledge/AGENT.md`
- ??application layer ???芋蝯撠勗?辣嚗../../../modules/knowledge/application-services.md`
