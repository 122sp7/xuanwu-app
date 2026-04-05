# ai ??Repositories

> **Canonical bounded context:** `ai`
> **璅∠?頝臬?:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

?祆?隞嗆??`ai` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`
- `domain/repositories/IngestionJobRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`
- `infrastructure/InMemoryIngestionJobRepository.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/ai/repositories.md`
- `../../../docs/ddd/ai/aggregates.md`
