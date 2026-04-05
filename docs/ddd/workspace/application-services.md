# workspace — Application Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件記錄 `workspace` 的 application layer 服務與 use cases。內容與 `modules/workspace/application/` 實作保持一致。

## Application Layer 職責

管理工作區容器、成員與內容樹，並組合多個 workspace-* 子域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/wiki-content-tree.use-case.ts`
- `application/use-cases/workspace-member.use-cases.ts`
- `application/use-cases/workspace.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace/README.md`
- 模組 AGENT：`../../../modules/workspace/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace/application-services.md`
