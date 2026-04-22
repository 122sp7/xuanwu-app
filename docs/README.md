# Docs

## PURPOSE

本文件集是 Xuanwu App 的戰略權威入口，定義 bounded context 所有權、術語與 context map 方向。
它的核心目標是讓邊界決策可追溯、可對齊，並避免實作層把戰略語言污染。

## GETTING STARTED

閱讀與決策建議順序：

1. [01-architecture/system/architecture-overview.md](./01-architecture/system/architecture-overview.md)
2. [01-architecture/domain/bounded-contexts.md](./01-architecture/domain/bounded-contexts.md)
3. [01-architecture/domain/ubiquitous-language.md](./01-architecture/domain/ubiquitous-language.md)
4. [01-architecture/system/context-map.md](./01-architecture/system/context-map.md)
5. [02-decisions/README.md](./02-decisions/README.md)

## ARCHITECTURE

文件網架構基線：

- Hexagonal Architecture + DDD
- semantic-first domain language
- Firebase serverless runtime split with fn worker pipeline
- Genkit orchestration and prompt/tool contracts
- Frontend state split with Zustand and XState
- Runtime validation contracts with Zod

## PROJECT STRUCTURE

- [01-architecture/system](./01-architecture/system)（[AGENTS.md](./01-architecture/AGENTS.md)、[README.md](./01-architecture/system/README.md)）：全域架構、整合規範、context map、strategic patterns、delivery milestones
- [01-architecture/domain](./01-architecture/domain)（[AGENTS.md](./01-architecture/AGENTS.md)、[README.md](./01-architecture/domain/README.md)）：主域、子域、術語與模板、DDD 戰略設計
- [01-architecture/contexts](./01-architecture/contexts)：各 context 本地文件（8 個 bounded context）
- [02-decisions](./02-decisions)：ADR 與決策索引
- [04-examples](./04-examples)：功能與端到端示例

Context readme 快速入口：

- [structure/contexts/ai/README.md](./01-architecture/contexts/ai/README.md)
- [structure/contexts/analytics/README.md](./01-architecture/contexts/analytics/README.md)
- [structure/contexts/billing/README.md](./01-architecture/contexts/billing/README.md)
- [structure/contexts/iam/README.md](./01-architecture/contexts/iam/README.md)
- [structure/contexts/platform/README.md](./01-architecture/contexts/platform/README.md)
- [structure/contexts/workspace/README.md](./01-architecture/contexts/workspace/README.md)
- [structure/contexts/notion/README.md](./01-architecture/contexts/notion/README.md)
- [structure/contexts/notebooklm/README.md](./01-architecture/contexts/notebooklm/README.md)

## DEVELOPMENT RULES

- MUST resolve ownership in docs before implementation changes.
- MUST treat docs as strategic authority and runtime files as implementation authority.
- MUST keep cross-context language aligned with published language rules.
- MUST route unresolved conflicts through ADR or explicit conflict notes.

## AI INTEGRATION

AI 代理在實作前必須先定位：

1. Owning context
2. Published language
3. Dependency direction
4. Integration pattern (API boundary or event contract)

不得在未完成上述對齊前直接生成跨域程式碼。

## DOCUMENTATION

權威地圖：

- [01-architecture/system/architecture-overview.md](./01-architecture/system/architecture-overview.md)
- [01-architecture/domain/subdomains.md](./01-architecture/domain/subdomains.md)
- [01-architecture/domain/bounded-contexts.md](./01-architecture/domain/bounded-contexts.md)
- [01-architecture/system/context-map.md](./01-architecture/system/context-map.md)
- [01-architecture/domain/ubiquitous-language.md](./01-architecture/domain/ubiquitous-language.md)
- [01-architecture/system/integration-guidelines.md](./01-architecture/system/integration-guidelines.md)
- [01-architecture/system/strategic-patterns.md](./01-architecture/system/strategic-patterns.md)
- [01-architecture/system/hard-rules-consolidated.md](./01-architecture/system/hard-rules-consolidated.md)
- [01-architecture/domain/bounded-context-subdomain-template.md](./01-architecture/domain/bounded-context-subdomain-template.md)
- [01-architecture/system/project-delivery-milestones.md](./01-architecture/system/project-delivery-milestones.md)
- [02-decisions/README.md](./02-decisions/README.md)

聚焦實作流：

- [01-architecture/system/source-to-task-flow.md](./01-architecture/system/source-to-task-flow.md)
- [04-examples/modules/feature/notebooklm-source-processing-task-flow.md](./04-examples/modules/feature/notebooklm-source-processing-task-flow.md)
- [04-examples/end-to-end/deliveries/upload-parse-to-task-flow.md](./04-examples/end-to-end/deliveries/upload-parse-to-task-flow.md)

## USABILITY

- 新加入開發者可在 5 分鐘內用本頁讀到正確決策入口與 context 文件。
- 開發者可在 3 分鐘內定位某個功能的 owning context 與命名權威。
- 本頁只做入口與路由，不承載實作細節，避免維護漂移。
