# ai ??Application Services

> **Canonical bounded context:** `ai`
> **璅∠?頝臬?:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

?祆?隞嗉???`ai` ??application layer ????use cases?摰寡? `modules/ai/application/` 撖虫?靽?銝?氬?

## Application Layer ?瑁痊

?矽 RAG ingestion job ???賡望?嚗??? parse/chunk/embed 撌乩?鈭斤策 py_fn/ ?瑁???

Application layer ?芾?鞎穿?
- ?矽 use cases / DTO / process manager
- ?澆 domain repository ports ??domain services
- 銝頛?UI / framework-specific concerns

## 撖阡?瑼?

- `application/link-extractor.service.ts`
- `application/use-cases/advance-ingestion-stage.use-case.ts`
- `application/use-cases/register-ingestion-document.use-case.ts`

## 閮剛?撠?

- 璅∠? README嚗../../../modules/ai/README.md`
- 璅∠? AGENT嚗../../../modules/ai/AGENT.md`
- ??application layer ???芋蝯撠勗?辣嚗../../../modules/ai/application-services.md`
