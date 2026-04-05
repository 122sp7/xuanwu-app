# source ??Repositories

> **Canonical bounded context:** `source`
> **璅∠?頝臬?:** `modules/source/`
> **Domain Type:** Supporting Subdomain

?祆?隞嗆??`source` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/FileRepository.ts`
- `domain/repositories/RagDocumentRepository.ts`
- `domain/repositories/WikiLibraryRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseFileRepository.ts`
- `infrastructure/firebase/FirebaseRagDocumentRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/in-memory-wiki-library.repository.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/source/repositories.md`
- `../../../docs/ddd/source/aggregates.md`
