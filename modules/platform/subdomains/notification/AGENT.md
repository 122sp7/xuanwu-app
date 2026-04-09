# AGENT.md — platform/notification

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

`notification` 擁有 `NotificationDispatch`、`NotificationRoute` 與 `DispatchOutcome` 的語言邊界，負責讓平台把內部事實轉成對象可接收的派送請求與交付結果。

## 優先術語

- `NotificationDispatch`
- `NotificationRoute`
- `DispatchOutcome`

## 允許的修改

- 細化通知路由與派送結果語言
- 細化 `NotificationGateway` 與 `DeliveryHistoryRepository` 的責任切分
- 細化通知結果如何回流到 audit 與 observability

## 禁止的修改

- 在此子域定義 `PermissionDecision`
- 在此子域定義 `WorkflowPolicy`
- 在此子域持有 `IntegrationContract`

## 同步更新規則

- 派送語言變更時，同步更新本 README、`modules/platform/ubiquitous-language.md` 與 `modules/platform/domain-events.md`
- 若上下游交付關係改變，同步更新 `modules/platform/context-map.md`、`modules/platform/repositories.md` 與 `modules/platform/subdomains.md`
