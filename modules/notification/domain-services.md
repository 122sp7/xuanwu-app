# notification — Domain Services

> **Canonical DDD reference:** `../../docs/ddd/notification/domain-services.md`

本文件對齊 `docs/ddd/notification/domain-services.md`，整理 `notification` 的 domain services 與相關設計約束。

## Domain Service Files
- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain service 只承載純業務規則
- 單一 aggregate 能封裝的規則，不應外提到 domain service
- framework-specific 依賴必須留在 infrastructure

## 參考

- `../../docs/ddd/notification/domain-services.md`
- `../../docs/ddd/notification/aggregates.md`
