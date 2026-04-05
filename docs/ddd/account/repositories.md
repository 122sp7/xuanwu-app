# account ??Repositories

> **Canonical bounded context:** `account`
> **璅∠?頝臬?:** `modules/account/`
> **Domain Type:** Generic Subdomain

?祆?隞嗆??`account` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/AccountPolicyRepository.ts`
- `domain/repositories/AccountQueryRepository.ts`
- `domain/repositories/AccountRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseAccountPolicyRepository.ts`
- `infrastructure/firebase/FirebaseAccountQueryRepository.ts`
- `infrastructure/firebase/FirebaseAccountRepository.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/account/repositories.md`
- `../../../docs/ddd/account/aggregates.md`
