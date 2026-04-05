# notebook — Application Services

> **Canonical DDD reference:** `../../docs/ddd/notebook/application-services.md`

本文件對齊 `docs/ddd/notebook/application-services.md`，整理 `notebook` 的 application layer orchestrators、use cases、DTO 與 process managers。

## Application Files
- `application/index.ts`
- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/generate-agent-response.use-case.ts`

## 設計規則

- application layer 負責 orchestration，不承載 UI 與 infrastructure 細節
- use case 透過 repository ports / domain services 操作 domain
- 對外公開入口仍以 `api/` 為主，不直接暴露 application internals

## 參考

- `../../docs/ddd/notebook/application-services.md`
- `./repositories.md`
- `./domain-services.md`
