# subscription — platform subdomain

`subscription` 是 platform blueprint 中負責商業權益、配額與有效期間的子域。它把方案資料整理成 `SubscriptionAgreement`、`Entitlement` 與 `UsageLimit`，讓平台知道哪些能力與交付在當前可用。

## 核心責任

- 維持 `SubscriptionAgreement` 的商業邊界
- 維持 `Entitlement`、`UsageLimit`、`PlanConstraint` 的限制語言
- 提供 capability enablement 與 delivery allowance 所需的商業輸入

## 主要語言

- `SubscriptionAgreement`
- `Entitlement`
- `UsageLimit`

## Port 焦點

- `PlatformCommandPort`
- `SubscriptionAgreementRepository`
- `UsageMeterRepository`

## 與其他子域關係

- 下游主要服務 `config`、`permission`、`integration`、`workflow`
- 它是商業限制來源，不是配置與交付的執行者

## 不擁有的責任

- 不組裝 `ConfigurationProfile`
- 不直接執行外部交付
- 不直接驗證主體身份
