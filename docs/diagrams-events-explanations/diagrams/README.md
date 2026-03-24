# Diagrams Index

本目錄提供架構、流程、資料與狀態機圖的統一入口。

## 原則

- 一張圖只描述一個視角。
- 不在多張圖重複同層資訊。
- 讓產品、架構、實作三種讀者都能快速定位。

## 圖表分類

| 分類 | 圖表 |
| --- | --- |
| System structure | [system-multi-workspace-hierarchy.mermaid](./system-multi-workspace-hierarchy.mermaid), [ai-knowledge-platform-architecture.png](./ai-knowledge-platform-architecture.png), [system-architecture-overview-combined.mermaid](./system-architecture-overview-combined.mermaid) |
| Workspace model | [workspace-internal-data-model.mermaid](./workspace-internal-data-model.mermaid), [workspace-interaction-flow.mermaid](./workspace-interaction-flow.mermaid) |
| Runtime and API | [api-data-flow.mermaid](./api-data-flow.mermaid), [firestore-collection-path-structure.mermaid](./firestore-collection-path-structure.mermaid), [security-rules-decision-flow.mermaid](./security-rules-decision-flow.mermaid) |
| Routing and session | [nextjs-app-router-structure.mermaid](./nextjs-app-router-structure.mermaid), [auth-state-machine.mermaid](./auth-state-machine.mermaid) |
| Knowledge and events | [kb-ingestion-pipeline-state-machine.mermaid](./kb-ingestion-pipeline-state-machine.mermaid), [event-bus-message-flow.mermaid](./event-bus-message-flow.mermaid) |
| Agent workflow | [agent-architecture-commander-subagents.mermaid](./agent-architecture-commander-subagents.mermaid) |

## 建議閱讀順序

1. [system-multi-workspace-hierarchy.mermaid](./system-multi-workspace-hierarchy.mermaid)
2. [ai-knowledge-platform-architecture.png](./ai-knowledge-platform-architecture.png)
3. [system-architecture-overview-combined.mermaid](./system-architecture-overview-combined.mermaid)
4. [workspace-internal-data-model.mermaid](./workspace-internal-data-model.mermaid)
5. [workspace-interaction-flow.mermaid](./workspace-interaction-flow.mermaid)
6. [api-data-flow.mermaid](./api-data-flow.mermaid)
7. [firestore-collection-path-structure.mermaid](./firestore-collection-path-structure.mermaid)
8. [security-rules-decision-flow.mermaid](./security-rules-decision-flow.mermaid)
9. [nextjs-app-router-structure.mermaid](./nextjs-app-router-structure.mermaid)
10. [auth-state-machine.mermaid](./auth-state-machine.mermaid)
11. [kb-ingestion-pipeline-state-machine.mermaid](./kb-ingestion-pipeline-state-machine.mermaid)
12. [event-bus-message-flow.mermaid](./event-bus-message-flow.mermaid)

## 關聯文件

- [docs/decision-architecture/architecture/ai-knowledge-platform-architecture.md](../../decision-architecture/architecture/ai-knowledge-platform-architecture.md)
- [docs/development-reference/development/modules-implementation-guide.md](../../development-reference/development/modules-implementation-guide.md)