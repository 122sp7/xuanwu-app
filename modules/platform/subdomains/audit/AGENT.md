# AGENT.md — platform/audit

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

`audit` 擁有 `AuditSignal` 與 `AuditClassification` 的證據語言，負責把關鍵決策與交付結果轉成不可變的治理事實。

## 優先術語

- `AuditSignal`
- `AuditClassification`
- `DispatchOutcome`

## 允許的修改

- 細化 audit 等級、保留與證據語言
- 細化哪些事件需要被提升成治理證據
- 細化 `AuditSignalStore` 的責任邊界

## 禁止的修改

- 在此子域定義 `PermissionDecision`
- 在此子域取代 `ObservabilitySignal`
- 在此子域主導通知或整合的重試策略

## 同步更新規則

- 語言或分類變更時，同步更新本 README、`modules/platform/domain-events.md` 與 `modules/platform/ubiquitous-language.md`
- 若上下游證據來源改變，同步更新 `modules/platform/context-map.md`
