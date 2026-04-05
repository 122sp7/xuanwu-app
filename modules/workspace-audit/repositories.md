# workspace-audit — Repositories

> **Canonical DDD reference:** `../../docs/ddd/workspace-audit/repositories.md`

本文件對齊 `docs/ddd/workspace-audit/repositories.md`，整理 `workspace-audit` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/AuditRepository.ts`

## Infrastructure Implementations
- `infrastructure/.gitkeep`
- `infrastructure/firebase/FirebaseAuditRepository.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/workspace-audit/repositories.md`
- `./application-services.md`
