# search — Domain Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/search/domain-services.md`
- `../../../docs/ddd/search/aggregates.md`
