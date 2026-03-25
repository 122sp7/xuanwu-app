# Architecture Specifications

> 各模組與跨模組系統的詳細架構規格。每份文件描述一個有界上下文或跨界能力的設計決策、模組邊界與資料流。

## 文件索引

| 文件 | 描述 |
|------|------|
| [ai-knowledge-platform-architecture.md](ai-knowledge-platform-architecture.md) | AI 知識平台整體架構：RAG 管線、Knowledge Graph、向量索引 |

## 規範

- 新增架構文件前，先確認 [ADR](../adr/) 沒有衝突的已接受決策。
- 每份文件應描述：模組職責、入站/出站依賴、Firestore 集合、與相鄰模組的合約點。
- 架構規格移動或重大改變時，同步更新 [docs/README.md](../../README.md) 的路由表。
- 詳細圖表放在 [docs/diagrams-events-explanations/diagrams/](../../diagrams-events-explanations/diagrams/)，此處只保留文字說明。
