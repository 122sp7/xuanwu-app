# AGENT.md — platform/subscription

> **強制開發規範**
> 本子域開發沿用 `modules/platform/AGENT.md` 的 Serena 與技能規範。
>
> ```
> serena
> #use skill serena-mcp
> #use skill alistair-cockburn
> #use skill context7
> ```
>
> 若工作觸及 driving adapters 或 web UI，再依 root AGENT 額外啟用 `shadcn` 與 `next-devtools-mcp`。

## 子域定位

`subscription` 擁有 `SubscriptionAgreement`、`Entitlement`、`UsageLimit` 與 `PlanConstraint` 的語言邊界，負責決定平台在商業上允許哪些能力與交付。

## 優先術語

- `SubscriptionAgreement`
- `Entitlement`
- `UsageLimit`
- `PlanConstraint`

## 允許的修改

- 細化方案、權益、限制與有效期間語言
- 細化 `UsageMeterRepository` 與 agreement lifecycle 的責任切分
- 細化商業限制如何影響 capability 與 delivery allowance

## 禁止的修改

- 在此子域組裝 `ConfigurationProfile`
- 在此子域直接執行 `ExternalSystemGateway`
- 在此子域驗證主體身份

## 同步更新規則

- 商業語言變更時，同步更新本 README、`modules/platform/ubiquitous-language.md` 與 `modules/platform/aggregates.md`
- 若下游治理影響改變，同步更新 `modules/platform/subdomains.md`、`modules/platform/context-map.md` 與 `modules/platform/application-services.md`