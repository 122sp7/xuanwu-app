# workspace-flow ??Repositories

> **Canonical bounded context:** `workspace-flow`
> **璅∠?頝臬?:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

?祆?隞嗆??`workspace-flow` ??repository ports ??infrastructure 撖虫?嚗???`domain/` ??`infrastructure/` ??撠銵具?

## Domain Repository Ports

- `domain/repositories/InvoiceRepository.ts`
- `domain/repositories/IssueRepository.ts`
- `domain/repositories/TaskRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/invoice-item.converter.ts`
- `infrastructure/firebase/invoice.converter.ts`
- `infrastructure/firebase/issue.converter.ts`
- `infrastructure/firebase/sourceReference.converter.ts`
- `infrastructure/firebase/task.converter.ts`
- `infrastructure/firebase/workspace-flow.collections.ts`
- `infrastructure/repositories/FirebaseInvoiceItemRepository.ts`
- `infrastructure/repositories/FirebaseInvoiceRepository.ts`
- `infrastructure/repositories/FirebaseIssueRepository.ts`
- `infrastructure/repositories/FirebaseTaskRepository.ts`

## 閮剛?閬?

- Repository 隞摰儔??`domain/repositories/`
- Repository 撖虫??曉 `infrastructure/`
- `application/` ?芾靘陷 repository ports嚗??湔靘陷 infrastructure 撖虫?

## 璅∠??批???隞?

- `../../../modules/workspace-flow/repositories.md`
- `../../../docs/ddd/workspace-flow/aggregates.md`
