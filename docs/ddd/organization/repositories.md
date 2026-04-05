# organization ??Repositories

> **Canonical bounded context:** `organization`
> **璅∠?頝臬?:** `modules/organization/`
> **Domain Type:** Generic Subdomain

?祆?隞嗆??`organization` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/OrganizationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseOrganizationRepository.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/organization/repositories.md`
- `../../../docs/ddd/organization/aggregates.md`
