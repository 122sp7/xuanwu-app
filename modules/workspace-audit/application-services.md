# workspace-audit — Application Services

> **Canonical DDD reference:** `../../docs/ddd/workspace-audit/application-services.md`

本文件對齊 `docs/ddd/workspace-audit/application-services.md`，整理 `workspace-audit` 的 application layer orchestrators、use cases、DTO 與 process managers。

## Application Files
- `application/.gitkeep`
- `application/use-cases/audit.use-cases.ts`

## 設計規則

- application layer 負責 orchestration，不承載 UI 與 infrastructure 細節
- use case 透過 repository ports / domain services 操作 domain
- 對外公開入口仍以 `api/` 為主，不直接暴露 application internals

## 參考

- `../../docs/ddd/workspace-audit/application-services.md`
- `./repositories.md`
- `./domain-services.md`
