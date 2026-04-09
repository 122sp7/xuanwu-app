# notification — platform subdomain

`notification` 是 platform blueprint 中負責派送請求、路由規則與交付結果的子域。它讓平台可以把事件或 workflow 結果轉成 `NotificationDispatch`，再透過適當通道與對象交付出去。

## 核心責任

- 維持 `NotificationDispatch` 的派送語言
- 維持 `NotificationRoute` 與 `DispatchOutcome` 的交付語意
- 整理通道結果，供 `audit` 與 `observability` 使用

## 主要語言

- `NotificationDispatch`
- `NotificationRoute`
- `DispatchOutcome`

## Port 焦點

- `PlatformCommandPort`
- `NotificationGateway`
- `DeliveryHistoryRepository`

## 與其他子域關係

- 上游主要來自 `workflow`、`config`、`permission`、`account`
- 下游主要服務 `audit` 與 `observability`

## 不擁有的責任

- 不定義 `PermissionDecision`
- 不持有外部整合契約
- 不主導 workflow policy
