# identity ??Repositories

> **Canonical bounded context:** `identity`
> **璅∠?頝臬?:** `modules/identity/`
> **Domain Type:** Generic Subdomain

?祆?隞嗆??`identity` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/IdentityRepository.ts`
- `domain/repositories/TokenRefreshRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseIdentityRepository.ts`
- `infrastructure/firebase/FirebaseTokenRefreshRepository.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/identity/repositories.md`
- `../../../docs/ddd/identity/aggregates.md`
