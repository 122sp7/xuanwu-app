# ADR 001: Enterprise RAG Foundation Baseline

## 狀態 (Status)
Accepted

## 背景 (Context)

原始版本把 RAG foundation、upload/storage、Firestore schema、document lifecycle、query pipeline、enterprise enhancements 全部寫在同一份文件中。這會造成兩個問題：

1. 一份 ADR 同時承擔太多決策，後續難以維護。
2. 針對單一議題補規格時，容易反覆改動與複製其他段落。

因此，基礎架構仍保留一份總覽 ADR，但細節拆分到後續文件，讓每份 ADR 只處理一個穩定責任。

## 決策 (Decision)

企業級 RAG 的基礎架構採用以下固定基線：

1. Next.js 是唯一的 user-facing orchestration runtime。
2. Cloud Functions (Python) 是唯一的 ingestion / background worker runtime。
3. Firebase Storage 是 raw file 與衍生檔的 canonical binary store。
4. Firestore 是 canonical metadata store，也是第一優先的 vector-search backing store。
5. `documents` 是 document lifecycle 的 canonical collection。
6. `chunks` 是 retrieval 與 embedding 的 canonical collection。
7. 所有 upload、storage、documents、chunks、cache、feedback、background jobs 都必須 tenant-scoped。
8. Genkit 用於 query preprocess、prompt assembly、LLM generation、tool calling，不承擔 canonical persistence。

## 設計細節 (Design)

### 1. 架構總覽

```text
Browser / UI
    ↓
Next.js (upload, query, streaming, feedback)
    ↓
Firebase Storage + Firestore
    ↓
Cloud Functions (Python) worker
    ↓
Firestore chunks + vector index
    ↓
Next.js query orchestration + Genkit answer generation
```

### 2. Pipeline baseline

#### Ingestion Pipeline

```text
[Next.js 上傳檔案]
        ↓
[Firebase Storage（raw file）]
        ↓
[Firestore 建立文件 metadata（status: uploaded）]
        ↓
[Cloud Functions (Python) 觸發]
        ↓
[下載檔案 / 讀取]
        ↓
[Parsing（PDF / DOCX / HTML → text）]
        ↓
[Cleaning（normalize / 去雜訊）]
        ↓
[Document-level Taxonomy（整份文件分類）]
        ↓
[Structuring（chunk 切分）]
        ↓
[Chunk-level Metadata（docId / chunkId / taxonomy / page / tags）]
        ↓
[Embedding（每個 chunk 向量化）]
        ↓
[Firestore（chunks collection + embedding）]
        ↓
[建立 Vector Index（Firestore vector index）]
        ↓
[更新文件狀態：ready]
```

#### Query Pipeline

```text
[Next.js（User Query）]
        ↓
[Route Handler / Server Action]
        ↓
[Genkit Flow（Query Preprocess）]
        ↓
[Query Embedding]
        ↓
[Firestore Vector Search（Top-K + filter taxonomy）]
        ↓
[取得 Top-K chunks]
        ↓
[Context 組裝（prompt building）]
        ↓
[Genkit LLM（回答生成）]
        ↓
[Streaming 回傳（Next.js UI）]
```

### 3. 拆分後的 ADR 責任

- [ADR-002](./ADR-002-rag-upload-storage-and-naming.md): upload、canonical naming、Storage path、tenant-scoped binary layout
- [ADR-003](./ADR-003-rag-firestore-data-model-and-lifecycle.md): `documents` / `chunks` schema、status lifecycle、trigger、idempotency
- [ADR-004](./ADR-004-rag-query-retrieval-and-enterprise-enhancements.md): query pipeline、vector search、hybrid search、rerank、cache、feedback
- [ADR-005](./ADR-005-rag-ingestion-execution-contract.md): ingestion pipeline 執行契約、欄位流轉、失敗分類、重試邏輯
- [ADR-006](./ADR-006-rag-query-execution-contract.md): query pipeline 執行契約、retrieval gates、prompt 組裝與 streaming 契約
- [ADR-007](./ADR-007-rag-optional-enhancements-rollout.md): hybrid search、rerank、cache、feedback 的分階段 rollout 規則
- [ADR-008](./ADR-008-rag-observability-slo-and-acceptance.md): 觀測指標、SLO、驗收門檻與發布檢核

### 4. Deployment 與 observability 基線

部署與維運必須至少滿足：

1. Firebase Storage bucket 可供 Next.js upload 與 worker read access。
2. Firestore 建立 `chunks.embedding` vector index，並規劃 filter 所需索引。
3. Cloud Functions (Python) 具備 parser、embedding、Firestore、Storage 所需 IAM 與 runtime config。
4. upload、processing、ready、failed、query latency、cache hit rate、feedback volume 必須可觀測。

## Alternatives Considered

### 方案 A：維持單一超長 ADR

不採用。

原因：

- 細節多且耦合高，後續維護成本大
- 一次修改容易誤傷不相干決策
- 難以明確判斷哪一段是 canonical source

## 後果 (Consequences)

### 正面影響

1. 每份 ADR 的責任更單一，後續補規格更容易。
2. RAG foundation 仍有清楚總覽，不會失去全局視角。
3. query、storage、data model、lifecycle 可以獨立演進，但仍維持同一基線。

### 負面影響

1. 需要同時維護多份文件之間的一致性。
2. 若拆分後互相引用不足，可能造成讀者跳轉成本上升。

## Operational Notes

- 新增或修改 RAG 規則時，優先改動責任最小的 ADR，不應把細節重新塞回本文件。
- 若某個子領域出現新的重大決策，應新增後續 ADR，而不是膨脹主文件。