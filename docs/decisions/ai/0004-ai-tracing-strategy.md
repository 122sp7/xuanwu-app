# ADR 0004 — ai `tracing` 子域策略

## Status

Proposed

## Date

2025-02-11

## Context

`docs/structure/domain/subdomains.md` 定義 ai baseline 的 `tracing`：

> tracing — AI 執行觀測、span 紀錄與成本追蹤

目前 `ai/subdomains/` 無 `tracing`。問題：

1. **AI 成本不透明**：每次 Genkit flow 呼叫的 token 用量、模型名稱、延遲時間無結構化記錄。
2. **analytics 混淆**：`analytics` module 擁有 `metrics` / `reporting` / `telemetry-projection`，但這些是**下游投影**；ai 執行的結構化 span 紀錄是**上游 source**，兩者職責不同。
3. **observability 邊界**：`platform/observability` 是平台層的健康量測（服務是否正常），不是 AI 執行語義的追蹤（哪個 flow、哪個 model、多少 token）。

Genkit 原生支援 OpenTelemetry tracing，但需要定義：
- 哪些 span 屬性是業務語言（flowName、modelId、inputTokens、outputTokens）
- 哪些是 infrastructure 雜訊（request headers、internal retry count）

## Decision

### 建立 `tracing` 子域

```
src/modules/ai/subdomains/tracing/
  README.md
  domain/
    value-objects/
      AiSpan.ts               # 單次 AI 呼叫的語義 span（業務語言層面）
      AiCostRecord.ts         # 成本記錄（model、inputTokens、outputTokens、estimatedCost）
      TraceId.ts              # brand type
    events/
      AiSpanRecorded.ts       # 供 analytics 消費的 domain event
    repositories/
      AiTraceRepository.ts    # 介面定義（infrastructure 實作）
  application/
    use-cases/
      record-ai-span.use-case.ts
    dtos/
      RecordAiSpanInput.ts
```

### 責任邊界

| 責任 | 所屬 |
|---|---|
| 記錄 AI 呼叫的業務語義 span | ✅ ai/tracing |
| 投影 span 為報表或成本儀表板 | ❌ analytics（消費 AiSpanRecorded event） |
| 服務健康、可用性告警 | ❌ platform/observability |
| Genkit OpenTelemetry 配置 | ✅ ai/infrastructure（adapter 配置）|

### analytics 整合方式

`AiSpanRecorded` domain event 發布後，`analytics/event-ingestion` 訂閱並寫入投影，再由 `analytics/metrics` 形成成本儀表板數據。

ai/tracing 不直接依賴 analytics，只發布事件。

## Consequences

**正面：** AI 成本與執行品質可被結構化追蹤；`analytics` 有清楚的 source event。  
**負面：** 需要在 Genkit flow 的 infrastructure adapter 中插入 span 記錄點。  
**中性：** 若 Genkit OpenTelemetry 配置已自動收集 span，此子域主要做業務語義層轉換，程式碼量不大。

## References

- `docs/structure/domain/subdomains.md` — ai tracing baseline
- `packages/integration-ai/genkit.ts` — Genkit 現有配置（OpenTelemetry 開關）
- `src/modules/analytics/subdomains/event-ingestion/` — analytics 消費端
- ADR ai/0003 — orchestration（tracing 將在 workflow 執行前後記錄 span）
