# AGENT.md — platform/observability

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

`observability` 擁有 `ObservabilitySignal`、`HealthIndicator` 與 `CorrelationContext` 的語言邊界，負責把平台運行事實轉成可量測、可追蹤、可告警的診斷輸出。

## 優先術語

- `ObservabilitySignal`
- `HealthIndicator`
- `CorrelationContext`

## 允許的修改

- 細化訊號分類、健康狀態與關聯語言
- 細化 `ObservabilitySink` 的輸出責任
- 細化從 workflow、integration、notification、audit 匯入的診斷語言

## 禁止的修改

- 在此子域定義 `AuditClassification`
- 在此子域主導交付重試策略
- 在此子域改寫業務狀態

## 同步更新規則

- 語言變更時，同步更新本 README、`modules/platform/ubiquitous-language.md` 與 `modules/platform/context-map.md`
- 若 sink 或上游訊號來源改變，同步更新 `modules/platform/repositories.md` 與 `modules/platform/subdomains.md`
