# notebook ??Repositories

> **Canonical bounded context:** `notebook`
> **璅∠?頝臬?:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

?祆?隞嗆??`notebook` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/NotebookRepository.ts`

> `RagGenerationRepository` ??`RagRetrievalRepository` 撌脩宏??`modules/search`嚗?
> `domain/repositories/RagGenerationRepository.ts` ??`domain/repositories/RagRetrievalRepository.ts`
> ??`@deprecated` re-export stub嚗?撅祆 notebook domain ports??

## Infrastructure Implementations

- `infrastructure/genkit/GenkitNotebookRepository.ts`
- `infrastructure/genkit/client.ts`
- `infrastructure/genkit/index.ts`
- `infrastructure/index.ts`

> `infrastructure/firebase/FirebaseRagRetrievalRepository.ts` 撅祆 `search` BC嚗?
> ??桀??拍?銝???notebook infrastructure ?桅?銝????粹?皜⊥批??整?

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/notebook/repositories.md`
- `../../../docs/ddd/notebook/aggregates.md`
