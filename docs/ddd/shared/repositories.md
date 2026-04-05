# shared ??Repositories

> **Canonical bounded context:** `shared`
> **璅∠?頝臬?:** `modules/shared/`
> **Domain Type:** Shared Kernel

?祆?隞嗆??`shared` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- ?桀?瘝?撠?瑼???

## Infrastructure Implementations

- `infrastructure/InMemoryEventStoreRepository.ts`
- `infrastructure/NoopEventBusRepository.ts`
- `infrastructure/SimpleEventBus.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/shared/repositories.md`
- `../../../docs/ddd/shared/aggregates.md`
