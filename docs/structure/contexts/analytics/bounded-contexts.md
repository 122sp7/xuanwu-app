# Analytics

## Domain Role

analytics 是下游 bounded context。它以 projection、metric 與 report 為主，不持有上游主域的寫入正典模型。

## Ownership Rules

- 擁有 reporting、metrics、dashboards、telemetry projections。
- 消費事件，不直接改寫上游 aggregate。
- 只在需要查詢與分析時建立 local read model。
