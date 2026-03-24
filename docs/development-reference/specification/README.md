# 規格與契約索引

本目錄是系統規格與契約的入口，供設計、開發、測試與驗收共用。

## 文件地圖

| 文件 | 類型 | 說明 |
| --- | --- | --- |
| [system-overview.md](./system-overview.md) | Specification | 平台定位、技術架構、運行時邊界 |
| [../reference/development-contracts/overview.md](../reference/development-contracts/overview.md) | Contract index | 契約總覽與狀態 |
| [../../decision-architecture/adr/](../../decision-architecture/adr/) | ADR | 架構決策記錄 |

## 規格層次

1. 系統規格: [system-overview.md](./system-overview.md)
2. 主題規格: feature 或 topic 文件
3. 開發契約: [../reference/development-contracts/overview.md](../reference/development-contracts/overview.md)

## 契約入口

| 契約 | 入口 |
| --- | --- |
| Acceptance | [acceptance-contract.md](../reference/development-contracts/acceptance-contract.md) |
| Audit | [audit-contract.md](../reference/development-contracts/audit-contract.md) |
| Billing | [billing-contract.md](../reference/development-contracts/billing-contract.md) |
| Daily | [daily-contract.md](../reference/development-contracts/daily-contract.md) |
| Event | [event-contract.md](../reference/development-contracts/event-contract.md) |
| Namespace | [namespace-contract.md](../reference/development-contracts/namespace-contract.md) |
| Parser | [parser-contract.md](../reference/development-contracts/parser-contract.md) |
| RAG ingestion | [rag-ingestion-contract.md](../reference/development-contracts/rag-ingestion-contract.md) |
| Schedule | [schedule-contract.md](../reference/development-contracts/schedule-contract.md) |

## 跨目錄參考

- [docs/how-to-user/ui-ux/README.md](../../how-to-user/ui-ux/README.md)
- [docs/development-reference/development/README.md](../development/README.md)
- [docs/decision-architecture/adr/](../../decision-architecture/adr/)
- [PERMISSIONS.md](../../../PERMISSIONS.md)
