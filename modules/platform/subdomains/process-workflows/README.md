# workflow — platform subdomain

`workflow` 是 platform blueprint 中負責流程觸發與策略協調的子域。它把平台事實轉成 `WorkflowTrigger`，並透過 `WorkflowPolicy` 決定流程何時啟動、延後、抑制或升級。

## 核心責任

- 維持 `WorkflowTrigger` 的啟動語言
- 維持 `WorkflowPolicy` 的策略語言
- 把可執行流程結果導向 `notification`、`audit`、`observability`

## 主要語言

- `WorkflowTrigger`
- `WorkflowPolicy`
- `CorrelationContext`

## Port 焦點

- `PlatformCommandPort`
- `WorkflowPolicyRepository`
- `WorkflowDispatcherPort`

## 與其他子域關係

- 上游主要依賴 `permission`、`config`、`subscription`
- 下游主要服務 `notification`、`audit`、`observability`

## 不擁有的責任

- 不擁有外部 endpoint 契約
- 不直接派送通知
- 不直接保存 audit 證據
