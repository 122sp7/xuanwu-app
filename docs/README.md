# Docs

## PURPOSE

本文件集是 Xuanwu App 的戰略權威入口，定義 bounded context 所有權、術語與 context map 方向。
它的核心目標是讓邊界決策可追溯、可對齊，並避免實作層把戰略語言污染。

## GETTING STARTED

閱讀與決策建議順序：

1. [structure/system/architecture-overview.md](./structure/system/architecture-overview.md)
2. [structure/domain/bounded-contexts.md](./structure/domain/bounded-contexts.md)
3. [structure/domain/ubiquitous-language.md](./structure/domain/ubiquitous-language.md)
4. [structure/system/context-map.md](./structure/system/context-map.md)
5. [decisions/README.md](./decisions/README.md)

## ARCHITECTURE

文件網架構基線：

- Hexagonal Architecture + DDD
- semantic-first domain language
- Firebase serverless runtime split with fn worker pipeline
- Genkit orchestration and prompt/tool contracts
- Frontend state split with Zustand and XState
- Runtime validation contracts with Zod

## PROJECT STRUCTURE

- [structure/system](./structure/system)：全域架構、整合規範、context map
- [structure/domain](./structure/domain)：主域、子域、術語與模板
- [structure/contexts](./structure/contexts)：各 context 本地文件
- [decisions](./decisions)：ADR 與決策索引
- [examples](./examples)：功能與端到端示例

Context readme 快速入口：

- [structure/contexts/ai/README.md](./structure/contexts/ai/README.md)
- [structure/contexts/analytics/README.md](./structure/contexts/analytics/README.md)
- [structure/contexts/billing/README.md](./structure/contexts/billing/README.md)
- [structure/contexts/iam/README.md](./structure/contexts/iam/README.md)
- [structure/contexts/platform/README.md](./structure/contexts/platform/README.md)
- [structure/contexts/workspace/README.md](./structure/contexts/workspace/README.md)
- [structure/contexts/notion/README.md](./structure/contexts/notion/README.md)
- [structure/contexts/notebooklm/README.md](./structure/contexts/notebooklm/README.md)

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

- [structure/system/architecture-overview.md](./structure/system/architecture-overview.md)
- [structure/domain/subdomains.md](./structure/domain/subdomains.md)
- [structure/domain/bounded-contexts.md](./structure/domain/bounded-contexts.md)
- [structure/system/context-map.md](./structure/system/context-map.md)
- [structure/domain/ubiquitous-language.md](./structure/domain/ubiquitous-language.md)
- [structure/system/integration-guidelines.md](./structure/system/integration-guidelines.md)
- [structure/system/strategic-patterns.md](./structure/system/strategic-patterns.md)
- [structure/system/hard-rules-consolidated.md](./structure/system/hard-rules-consolidated.md)
- [structure/domain/bounded-context-subdomain-template.md](./structure/domain/bounded-context-subdomain-template.md)
- [structure/system/project-delivery-milestones.md](./structure/system/project-delivery-milestones.md)
- [decisions/README.md](./decisions/README.md)
- [decisions/SMELL-INDEX.md](./decisions/SMELL-INDEX.md)

聚焦實作流：

- [structure/system/source-to-task-flow.md](./structure/system/source-to-task-flow.md)
- [examples/modules/feature/notebooklm-source-processing-task-flow.md](./examples/modules/feature/notebooklm-source-processing-task-flow.md)
- [examples/end-to-end/deliveries/upload-parse-to-task-flow.md](./examples/end-to-end/deliveries/upload-parse-to-task-flow.md)

## USABILITY

- 新加入開發者可在 5 分鐘內用本頁讀到正確決策入口與 context 文件。
- 開發者可在 3 分鐘內定位某個功能的 owning context 與命名權威。
- 本頁只做入口與路由，不承載實作細節，避免維護漂移。
