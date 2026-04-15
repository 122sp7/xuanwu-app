# embeddings — 向量化結果與索引

## 子域目的

管理文本與圖像的向量化結果（Embedding）、維度（Dimensions）規範，以及向量索引實體的生命週期。此子域是 `ai` bounded context 對「已向量化知識」的正典知識邊界，為下游的 retrieval 工作流提供穩定的索引契約。

## 業務能力邊界

**負責：**
- Embedding 向量的生成請求協調與結果持久化
- 向量維度（Dimensions）規範與一致性保護
- 向量索引實體（Index Entry）的 CRUD 與版本化
- Embedding 模型識別符與版本追蹤

**不負責：**
- 向量搜尋與召回（屬於 `notebooklm/retrieval` 子域）
- Knowledge Artifact 的原始內容（屬於 `notion` bounded context）
- Chunking 策略（屬於 `py_fn/` 工作流）
- Embedding 模型的供應商路由（屬於 `models` 子域）

## 核心概念

| 概念 | 說明 |
|------|------|
| EmbeddingVector | 已向量化的浮點數組，攜帶維度與模型來源 |
| IndexEntry | 可定址的向量索引實體（含 chunk ID、向量、metadata）|
| EmbeddingModel | 向量化所使用的模型識別符與維度規範 |
| Dimensions | 向量維度數值；同一索引內必須一致 |

## 架構層級

```
embeddings/
  api/              ← 對外公開 Embedding 能力（generate、lookup）
  domain/
    entities/       ← IndexEntry
    value-objects/  ← EmbeddingVector, EmbeddingModel, Dimensions
    repositories/   ← IndexEntryRepository（介面）
    ports/          ← EmbeddingProviderPort（外部模型呼叫抽象）
  application/
    use-cases/      ← GenerateEmbedding, UpsertIndexEntry
```

## 與 py_fn 的邊界

- `py_fn/` 擁有 chunking 與 embedding pipeline 的執行端
- 執行完成後透過 Firestore 寫入 index entry；本子域定義索引實體的 schema 合約
- 本子域不直接呼叫 `py_fn/`；`py_fn/` 透過事件或 Firestore 觸發寫入

## Ubiquitous Language

- **EmbeddingVector**：特定模型在特定維度下生成的向量表示（不是模型物件）
- **IndexEntry**：可被 retrieval 消費的向量化單元，包含 chunk 追溯資訊
- **Dimensions**：維度一致性約束；跨 IndexEntry 維度不一致即為 invariant 違反
- **EmbeddingModel**：向量化時使用的模型版本，影響維度與語意空間
