# AGENT.md — platform/workflow

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

`workflow` 擁有 `WorkflowTrigger`、`WorkflowPolicy` 與 `CorrelationContext` 的語言邊界，負責把已發生事實轉成可執行流程，而不直接持有外部交付細節。

## 優先術語

- `WorkflowTrigger`
- `WorkflowPolicy`
- `CorrelationContext`

## 允許的修改

- 細化 trigger 與 policy 的狀態語言
- 細化 `WorkflowDispatcherPort` 與 `WorkflowPolicyRepository` 的責任切分
- 細化流程結果如何回流到 notification、audit、observability

## 禁止的修改

- 在此子域持有 `EndpointRef`
- 在此子域定義 `NotificationRoute`
- 在此子域直接保存 `AuditSignal`

## 同步更新規則

- 觸發或策略語言變更時，同步更新本 README、`modules/platform/ubiquitous-language.md` 與 `modules/platform/domain-events.md`
- 若下游交付方向改變，同步更新 `modules/platform/context-map.md`、`modules/platform/application-services.md` 與 `modules/platform/subdomains.md`