# search ??Repositories

> **Canonical bounded context:** `search`
> **璅∠?頝臬?:** `modules/search/`
> **Domain Type:** Supporting Subdomain

?祆?隞嗆??`search` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagQueryFeedbackRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`
- `domain/repositories/WikiContentRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseRagQueryFeedbackRepository.ts`
- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/FirebaseWikiContentRepository.ts`
- `infrastructure/genkit/GenkitRagGenerationRepository.ts`
- `infrastructure/genkit/client.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/search/repositories.md`
- `../../../docs/ddd/search/aggregates.md`
