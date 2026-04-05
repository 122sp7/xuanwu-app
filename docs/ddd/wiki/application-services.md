# wiki — Application Services

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件記錄 `wiki` 的 application layer 服務與 use cases。內容與 `modules/wiki/application/` 實作保持一致。

## Application Layer 職責

管理知識圖譜節點與邊，提供 backlink 與 graph traversal 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/auto-link.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/wiki/README.md`
- 模組 AGENT：`../../../modules/wiki/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/wiki/application-services.md`
