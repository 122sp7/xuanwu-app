# identity — Repositories

> **Canonical DDD reference:** `../../docs/ddd/identity/repositories.md`

本文件對齊 `docs/ddd/identity/repositories.md`，整理 `identity` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/IdentityRepository.ts`
- `domain/repositories/TokenRefreshRepository.ts`

## Infrastructure Implementations
- `infrastructure/firebase/FirebaseIdentityRepository.ts`
- `infrastructure/firebase/FirebaseTokenRefreshRepository.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/identity/repositories.md`
- `./application-services.md`
