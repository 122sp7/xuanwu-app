# notification — Repositories

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotificationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseNotificationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notification/repositories.md`
- `../../../docs/ddd/notification/aggregates.md`
