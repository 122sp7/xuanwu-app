# Skill: Multi-stage RAG Ingestion Pipeline
## Context
處理企業知識庫的文檔解析與向量化。

## Process Flow
1. **Parsing**: 透過 Google Cloud Document AI 進行 OCR 與結構化。
2. **Chunking**: 根據語義進行分塊（L1 Domain Logic）。
3. **Embedding**: 使用 Genkit 指定模型生成向量。
4. **Storage**: 存入 Upstash Vector 並同步中繼資料至 Firestore。

## Constraints
- 必須處理 Document AI 的異步回調邏輯。
- 向量維度必須與 Upstash 索引配置對齊。