# audit — platform subdomain

`audit` 是 platform blueprint 中負責不可變證據與追蹤事實的子域。它把關鍵決策、交付結果與治理動作轉成 `AuditSignal`，讓平台可以回答「誰在何時做了什麼，為何被記錄」。

## 核心責任

- 維持 `AuditSignal` 的證據語言與記錄邊界
- 維持 `AuditClassification` 的等級、保留與追蹤語意
- 吸收授權、工作流、通知與整合結果，整理成治理證據

## 主要語言

- `AuditSignal`
- `AuditClassification`
- `DispatchOutcome`

## Port 焦點

- `PlatformCommandPort`
- `AuditSignalStore`

## 與其他子域關係

- 上游主要來自 `permission`、`workflow`、`notification`、`integration`
- 下游主要服務 `observability`

## 不擁有的責任

- 不主導業務政策本身
- 不取代 `ObservabilitySignal`
- 不決定通知或整合是否應重試
