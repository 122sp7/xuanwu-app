# workspace ??Repositories

> **Canonical bounded context:** `workspace`
> **璅∠?頝臬?:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

?祆?隞嗆??`workspace` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/WikiWorkspaceRepository.ts`
- `domain/repositories/WorkspaceQueryRepository.ts`
- `domain/repositories/WorkspaceRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceRepository.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/workspace/repositories.md`
- `../../../docs/ddd/workspace/aggregates.md`
