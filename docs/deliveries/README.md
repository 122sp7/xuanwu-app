# Deliveries Docs

這裡整理跨 context 的流程編排文件。

重點是描述整條流程怎麼串起來，而不是單一模組內部實作。
這一層對齊 event-driven、Saga / Flow orchestration 與 system handoff。

## Current Delivery Write-ups

- [upload-parse-to-task-flow.md](./upload-parse-to-task-flow.md) — upload → parse → Knowledge Page → task flow 的跨 context handoff 與交付證據。
