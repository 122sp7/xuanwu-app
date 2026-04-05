# organization — Repositories

> **Canonical DDD reference:** `../../docs/ddd/organization/repositories.md`

本文件對齊 `docs/ddd/organization/repositories.md`，整理 `organization` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/OrganizationRepository.ts`

## Infrastructure Implementations
- `infrastructure/firebase/FirebaseOrganizationRepository.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/organization/repositories.md`
- `./application-services.md`
