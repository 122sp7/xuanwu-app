# billing

## PURPOSE

billing 模組負責商業能力治理，涵蓋 subscription、entitlement 與 usage-metering。
它定義可用能力、商業限制與相關下游輸出。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

billing 以 entitlement、subscription、usage-metering 三個子域切分。
跨模組消費應透過 [index.ts](index.ts) 進入，不直接依賴內部實作。

## PROJECT STRUCTURE

- [subdomains/entitlement](subdomains/entitlement)
- [subdomains/subscription](subdomains/subscription)
- [subdomains/usage-metering](subdomains/usage-metering)

## DEVELOPMENT RULES

- MUST keep billing as commercial capability owner.
- MUST keep cross-module consumption behind [index.ts](index.ts).
- MUST keep entitlement and subscription terminology explicit.
- MUST avoid leaking IAM or workspace ownership into billing.

## AI INTEGRATION

billing 可提供 entitlement 或 usage signal 給 AI 與其他模組使用。
若 AI 流程依賴 billing capability，應透過明確契約整合，不直接耦合內部模型。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內理解 billing 的三個子域入口。
- 可在 3 分鐘內判斷變更屬於 entitlement、subscription 或 usage-metering。
