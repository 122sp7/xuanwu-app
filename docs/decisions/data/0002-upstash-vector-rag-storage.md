# ADR 0002 — Upstash Vector RAG 儲存策略

## Status

Accepted

## Date

2025-02-11

## Context

系統使用 Upstash Vector 作為 RAG（Retrieval-Augmented Generation）的向量儲存。需要明確定義：

1. **哪個層擁有 Upstash Vector 的讀寫權**
2. **notebooklm/synthesis 如何取得 retrieval 結果**
3. **TypeScript 模組是否應直接呼叫 Upstash Vector SDK**
4. **embedding 向量的 metadata schema 是誰定義**

目前架構：
- `fn/` Python 負責 ingestion pipeline（parse → chunk → embed → write to Upstash Vector）
- `ai/subdomains/retrieval/` 負責向量搜尋邏輯（TypeScript）
- `ai/subdomains/embedding/` 負責 embedding 模型呼叫（TypeScript）

風險：若 TypeScript 和 Python 都直接操作 Upstash Vector，vector namespace 命名和 metadata schema 可能出現版本漂移。

## Decision

### 所有權分層

| 層 | 對 Upstash Vector 的關係 | 說明 |
|---|---|---|
| `fn/` (Python) | **Write Owner** | ingestion pipeline 的 upsert 操作 |
| `ai/subdomains/retrieval/` (TypeScript) | **Read via Port** | 透過 `VectorStorePort` interface 查詢，不直接呼叫 SDK |
| `notebooklm/subdomains/synthesis/` | **Consumer** | 呼叫 `ai/retrieval` 的 use case，不感知 Upstash Vector |
| Next.js (TypeScript) | **Forbidden** | 禁止在 Next.js App Router 或 Server Action 直接呼叫 Upstash Vector SDK |

### VectorStorePort 定義

```typescript
// ai/subdomains/retrieval/domain/ports/VectorStorePort.ts
export interface VectorStorePort {
  query(params: {
    namespaceId: string;     // sourceId or notebookId
    vector: number[];        // 已 embed 的查詢向量
    topK: number;
    filter?: Record<string, string>;
  }): Promise<VectorMatch[]>;
}

export interface VectorMatch {
  id: string;
  score: number;
  metadata: ChunkMetadata;  // fn/ 寫入時定義的 metadata schema
}
```

### Metadata Schema 所有權

向量的 metadata schema 由 **`fn/` 側定義並維護**，TypeScript 側的 `ChunkMetadata` 型別是 **消費端映射**，不是正典：

```python
# fn/src/domain/value_objects/chunk_metadata.py (正典)
@dataclass
class ChunkMetadata:
    source_id: str
    notebook_id: str
    chunk_index: int
    page_number: Optional[int]
    section_title: Optional[str]
    content_type: str        # text / table / image_caption
    language: str
```

TypeScript 端的 `ChunkMetadata` 必須與 Python 側保持同步（版本化 schema 合約，未來可用 JSON Schema 共享）。

### Namespace 命名規則

Upstash Vector namespace 對應 source（document）：

```
namespace = sourceId   # notebooklm/source 的 SourceId
```

不使用 notebookId 作為 namespace，避免同一 source 在多個 notebook 中重複存儲。

### 禁止事項

- ❌ Next.js Server Action 直接 `import { Index } from '@upstash/vector'`
- ❌ TypeScript 模組直接 upsert 向量（write 只屬於 fn/）
- ❌ Python fn/ 呼叫 TypeScript retrieval 邏輯（反向依賴）

## Consequences

**正面：** Write 路徑集中在 fn/；TypeScript 側透過 port 隔離，可換成其他向量資料庫；schema 漂移問題可被偵測。  
**負面：** TypeScript 的 `ChunkMetadata` 需要手動與 Python 側同步（未來可考慮 JSON Schema 生成）。  
**中性：** `ai/subdomains/retrieval/infrastructure/` 實作 `VectorStorePort`，使用 `@upstash/vector` SDK，這是唯一允許引用 SDK 的位置。

## References

- `fn/src/infrastructure/persistence/` — fn/ 的向量寫入 adapter
- `src/modules/ai/subdomains/retrieval/` — TypeScript retrieval 子域
- `src/modules/notebooklm/subdomains/` — 消費端
- `packages/integration-ai/` — 現有 AI 整合套件
- ADR ai/0001 — chunk/embedding pipeline 所有權（fn/ 負責 write）
- ADR domain/0003 — notebooklm synthesis subdomain（retrieval 的消費端）
