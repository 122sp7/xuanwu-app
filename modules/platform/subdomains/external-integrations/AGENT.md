# AGENT.md — platform/integration

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

`integration` 擁有 `IntegrationContract`、`EndpointRef`、`SecretReference` 與 `DeliveryPolicy` 的語言邊界，負責讓平台能安全地對外互動，而不把外部協議細節洩漏回 domain。

## 優先術語

- `IntegrationContract`
- `EndpointRef`
- `DeliveryPolicy`
- `SecretReference`

## 允許的修改

- 細化整合契約欄位與狀態語言
- 細化 `ExternalSystemGateway` 與 `SecretReferenceResolver` 的責任切分
- 細化外部交付失敗如何回寫成事件與訊號

## 禁止的修改

- 在此子域定義 `Entitlement`
- 在此子域建立 `WorkflowTrigger`
- 在此子域直接保存 `AuditSignal`

## 同步更新規則

- 契約、端點或交付語言變更時，同步更新本 README、`modules/platform/ubiquitous-language.md` 與 `modules/platform/domain-events.md`
- 若 gateway / repository 焦點改變，同步更新 `modules/platform/repositories.md` 與 `modules/platform/subdomains.md`
