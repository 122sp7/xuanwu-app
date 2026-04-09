# observability — platform subdomain

`observability` 是 platform blueprint 中負責診斷訊號、健康指標與關聯追蹤的子域。它把來自 workflow、integration、notification、audit 的運行事實整理成 `ObservabilitySignal` 與 `HealthIndicator`。

## 核心責任

- 維持 `ObservabilitySignal` 的訊號語言
- 維持 `HealthIndicator` 與 `CorrelationContext` 的診斷語意
- 將平台運行結果轉成可量測、可追蹤、可告警的輸出

## 主要語言

- `ObservabilitySignal`
- `HealthIndicator`
- `CorrelationContext`

## Port 焦點

- `PlatformCommandPort`
- `ObservabilitySink`

## 與其他子域關係

- 上游主要來自 `workflow`、`integration`、`notification`、`audit`
- 它是診斷輸出邊界，不是業務政策的來源

## 不擁有的責任

- 不取代 `AuditSignal`
- 不定義 capability 或 entitlement
- 不主導交付重試策略
