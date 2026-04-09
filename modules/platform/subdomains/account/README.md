# account — platform subdomain

`account` 是 platform blueprint 中負責主體可治理屬性的子域。它把外部或上游傳來的主體事實整理成 `AccountProfile` 與 `SubjectPreference`，讓其他子域可以在不觸碰身份驗證或 UI 細節的前提下使用一致語言。

## 核心責任

- 維持 `AccountProfile` 的欄位語意與輪廓邊界
- 維持 `SubjectPreference` 的偏好語言，供通知與體驗決策使用
- 吸收 `IdentitySignal` 並轉成可治理的主體資料視圖

## 主要語言

- `AccountProfile`
- `SubjectPreference`
- `AuthenticatedSubject`

## Port 焦點

- `PlatformEventIngressPort`
- `SubjectDirectory`

## 與其他子域關係

- 上游主要來自 `identity`
- 下游主要服務 `permission`、`notification`、`audit`

## 不擁有的責任

- 不直接做 `PermissionDecision`
- 不直接定義 `MembershipBoundary`
- 不直接派送通知或寫入 audit store
