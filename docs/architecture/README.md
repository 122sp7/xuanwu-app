# Architecture

<!-- change: Add ADR-001 to index and AI reading path; PR-NUM -->

此資料夾放系統架構說明與設計原則。

## 文件索引

### 核心 DDD 參考

| 文件 | 說明 |
|------|------|
| [`bounded-contexts.md`](./bounded-contexts.md) | 16 個有界上下文的職責、實體、事件與邊界規則 |
| [`ubiquitous-language.md`](./ubiquitous-language.md) | 通用語言字典：術語定義、命名規範、代碼位置對照 |
| [`domain-model.md`](./domain-model.md) | 領域模型：所有 Aggregate、Entity、Value Object 結構與狀態機 |
| [`domain-events.md`](./domain-events.md) | 領域事件完整目錄：設計規範、事件清單與跨上下文事件流 |
| [`use-cases.md`](./use-cases.md) | Use Cases / Application Layer：所有 Use Case 列表與設計原則 |
| [`repository-pattern.md`](./repository-pattern.md) | Repository Pattern：介面定義、Port、Firebase 實作對照表 |
| [`domain-services.md`](./domain-services.md) | 領域服務：狀態機策略、業務守衛與純函式服務 |

### 架構設計

| 文件 | 說明 |
|------|------|
| [`context-map.md`](./context-map.md) | 上下文關係圖：16 個上下文的互動關係與 DDD 關係模式 |
| [`infrastructure-strategy.md`](./infrastructure-strategy.md) | 基礎設施策略：技術棧、Runtime 邊界、Firestore Schema、攝入管線 |
| [`read-model.md`](./read-model.md) | 讀模型 / CQRS：Query 函式目錄、即時訂閱模式、讀寫分離設計 |
| [`ai-domain.md`](./ai-domain.md) | AI Domain（Genkit Flow）：RAG 管線、Genkit 整合、串流事件設計 |
| [`module-boundary.md`](./module-boundary.md) | 模組邊界：MDDD 邊界規則、API 邊界設計、import 規範與執行機制 |

### 規劃與決策

| 文件 | 說明 |
|------|------|
| [`domain-implementation-target.md`](./domain-implementation-target.md) | 模組實現數量目標與 wiki-beta 分解記錄 |
| [`workspace-ui-gap-analysis.md`](./workspace-ui-gap-analysis.md) | Workspace UI 缺口分析：後端完整但 UI 缺失的功能清單 |
| [`adr/`](./adr/) | 架構決策記錄（ADR） |
| [`adr/ADR-001-content-to-workflow-boundary.md`](./adr/ADR-001-content-to-workflow-boundary.md) | **ADR-001**：content ↔ workspace-flow 邊界與事件驅動整合（Buffer Zone / Materialization） |

## 閱讀路徑建議

```
新成員入門:
  bounded-contexts.md → ubiquitous-language.md → context-map.md

實作指引:
  domain-model.md → use-cases.md → repository-pattern.md

AI 功能開發:
  ai-domain.md → infrastructure-strategy.md → domain-events.md
  → adr/ADR-001-content-to-workflow-boundary.md  ← content→workspace-flow 事件驅動設計

架構合規:
  module-boundary.md → bounded-contexts.md
```

