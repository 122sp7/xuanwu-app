# identity — platform subdomain

`identity` 是 platform blueprint 中承接已驗證主體事實的入口子域。它不處理產品級登入體驗，而是把驗證完成、刷新、失效等事實轉成 `AuthenticatedSubject` 與 `IdentitySignal`，供平台治理鏈使用。

## 核心責任

- 維持 `AuthenticatedSubject` 的最小可信語言
- 維持 `IdentitySignal` 的事實類型與事件語意
- 為 `account`、`audit` 提供主體進入平台時的起始資訊

## 主要語言

- `AuthenticatedSubject`
- `IdentitySignal`
- `SubjectScope`

## Port 焦點

- `PlatformEventIngressPort`
- `SubjectDirectory`

## 與其他子域關係

- 下游主要服務 `account` 與 `audit`
- 它是主體語言的入口，不是治理決策的終點

## 不擁有的責任

- 不定義 `AccountProfile`
- 不定義 `PermissionDecision`
- 不定義組織角色或成員邊界
