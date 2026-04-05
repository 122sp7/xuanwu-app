# identity — Repositories

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/IdentityRepository.ts`
- `domain/repositories/TokenRefreshRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseIdentityRepository.ts`
- `infrastructure/firebase/FirebaseTokenRefreshRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/identity/repositories.md`
- `../../../docs/ddd/identity/aggregates.md`
