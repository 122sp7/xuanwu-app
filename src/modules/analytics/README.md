# analytics

## PURPOSE

analytics 模組承接事件輸入、投影、指標與洞察能力。
它作為下游分析層，為多個上游 context 生成可觀測與決策支援輸出。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

analytics 由事件契約、輸入、投影、指標與洞察子域組成。
跨模組協作以事件與公開邊界為主，不承接上游寫入所有權。

## PROJECT STRUCTURE

- [subdomains/event-contracts](subdomains/event-contracts)
- [subdomains/event-ingestion](subdomains/event-ingestion)
- [subdomains/event-projection](subdomains/event-projection)
- [subdomains/experimentation](subdomains/experimentation)
- [subdomains/insights](subdomains/insights)
- [subdomains/metrics](subdomains/metrics)
- [subdomains/realtime-insights](subdomains/realtime-insights)

## DEVELOPMENT RULES

- MUST keep analytics as downstream projection/reporting owner.
- MUST keep contracts explicit for event ingestion and projection.
- MUST avoid upstream domain mutation responsibility.
- MUST expose module capabilities via [index.ts](index.ts).

## AI INTEGRATION

analytics 可消費 AI 相關事件或評估訊號，但不應直接承接 AI provider 管理。
若需要 AI 驅動分析，應透過明確事件契約整合。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內定位 analytics 子域入口。
- 可在 3 分鐘內判斷需求是事件輸入、投影、指標或洞察修改。
