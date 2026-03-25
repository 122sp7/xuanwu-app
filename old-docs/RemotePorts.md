# Remote Ports & Infrastructure Interfaces

本文件定義 `infrastructure/` 層必須實作的 Port 介面。這實現了 Hexagonal Architecture，讓核心領域邏輯不依賴具體的外部服務（如 Firebase, Upstash, OpenAI）。

---

## 1. Vector Store Port (`modules/retrieval/domain/ports`)

負責向量資料庫的讀寫。

```typescript
export interface IVectorStore {
  /**
   * 將文本區塊轉換為向量並儲存
   * @param documents - 包含 id, content, metadata 的物件
   */
  upsertDocuments(documents: VectorDocument[]): Promise<void>;

  /**
   * 根據查詢字串尋找相似區塊
   * @param query - 查詢文本
   * @param k - 回傳數量
   * @param filter - 屬性過濾 (e.g., pageId)
   */
  similaritySearch(query: string, k: number, filter?: Record<string, any>): Promise<ScoredDocument[]>;

  /**
   * 刪除指定 ID 的向量
   */
  deleteDocuments(ids: string[]): Promise<void>;
}

export type VectorDocument = {
  id: string;
  content: string;
  metadata: Record<string, any>;
};
```

## 2. LLM Orchestrator Port (`modules/agent/domain`)

負責與 Python Runtime (`py_fn`) 或 Genkit 溝通的介面。

```typescript
export interface ILLMOrchestrator {
  /**
   * 生成對話回應 (支援 Streaming)
   */
  generateResponseStream(
    history: ChatMessage[],
    context: ContextBlock[],
    options?: GenerationOptions
  ): AsyncGenerator<string, void, unknown>;

  /**
   * 結構化資料提取 (用於自動標籤、摘要)
   */
  extractStructuredData<T>(
    content: string,
    schema: ZodSchema<T>
  ): Promise<T>;
}
```

## 3. Event Bus Port (`shared/domain/ports`)

負責跨模組的非同步事件傳遞。

```typescript
export interface IEventBus {
  /**
   * 發布領域事件
   */
  publish<T extends DomainEvent>(event: T): Promise<void>;

  /**
   * 訂閱特定事件
   */
  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: (event: T) => Promise<void>
  ): void;
}
```

## 4. Implementation Guidelines (實作指引)

- **Development Stub**: 在開發環境中，若未連接真實 Python 後端，應提供 `MockLLMOrchestrator` 回傳固定的 Lorem Ipsum 字串，以確保 UI 開發不受阻。
- **Production**: `FirebaseFunctionsLLMAdapter` 應透過 HTTPS Callable Function 呼叫部署在 Google Cloud Functions (Python Genkit) 上的邏輯。
- **Vector DB**: 優先使用 `UpstashVectorAdapter` 透過 HTTP REST API 進行操作，保持 Edge Runtime 相容性。
