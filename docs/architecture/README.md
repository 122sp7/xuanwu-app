# Architecture

<!-- change: Add ADR-001 to index and AI reading path; PR-NUM -->

此資料夾放系統架構說明與設計原則。

## 文件索引

### 核心 DDD 參考

| 文件 | 說明 |
|------|------|
| [`../ddd/subdomains.md`](../ddd/subdomains.md) | 子域分類（Canonical） |
| [`../ddd/bounded-contexts.md`](../ddd/bounded-contexts.md) | 有界上下文地圖（Canonical） |
| `../../modules/<context>/*.md` | bounded-context 詳細文件（通用語言、聚合、事件、儲存庫、使用案例） |

### 架構設計

| 文件 | 說明 |
|------|------|
| [`context-map.md`](./context-map.md) | 上下文關係圖：跨 bounded context 的互動關係與 DDD 關係模式 |
| [`infrastructure-strategy.md`](./infrastructure-strategy.md) | 基礎設施策略：技術棧、Runtime 邊界、Firestore Schema、攝入管線 |
| [`read-model.md`](./read-model.md) | 讀模型 / CQRS：Query 函式目錄、即時訂閱模式、讀寫分離設計 |
| [`ai-domain.md`](./ai-domain.md) | AI Domain（Genkit Flow）：RAG 管線、Genkit 整合、串流事件設計 |
| [`module-boundary.md`](./module-boundary.md) | 模組邊界：MDDD 邊界規則、API 邊界設計、import 規範與執行機制 |

### 規劃與決策

| 文件 | 說明 |
|------|------|
| [`domain-implementation-target.md`](./domain-implementation-target.md) | 模組實現數量目標與 wiki 分解記錄 |
| [`workspace-ui-gap-analysis.md`](./workspace-ui-gap-analysis.md) | Workspace UI 缺口分析：後端完整但 UI 缺失的功能清單 |
| [`adr/`](./adr/) | 架構決策記錄（ADR） |

## 閱讀路徑建議

```
新成員入門:
  ../ddd/bounded-contexts.md → ../../modules/<context>/ubiquitous-language.md → context-map.md

實作指引:
  domain-model.md → use-cases.md → repository-pattern.md

架構合規:
  module-boundary.md → bounded-contexts.md
```
