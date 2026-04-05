# Aggregates ??search

## ???對?RagQueryFeedback

### ?瑁痊
?園?銝行?銋?雿輻?? RAG ?亥岷蝑??釭??擖?湔?蝥??RAG ?釭??

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `feedbackId` | `string` | ??銝駁 |
| `queryId` | `string` | ??閰?ID |
| `helpful` | `boolean` | ?臬? |
| `comment` | `string \| null` | ??閰?嚗?賂? |
| `submittedAt` | `string` | ISO 8601 |

---

## ?潛隞?

| ?潛隞?| 隤芣? |
|--------|------|
| `RagRetrievedChunk` | 瑼Ｙ揣?啁? chunk嚗hunkId, docId, chunkIndex, text, score, taxonomy嚗?|
| `RagCitation` | 撘鞈?嚗hunkId, docId, text, score嚗?|
| `VectorDocument` | ??蝝Ｗ??辣嚗d, content, metadata, embedding嚗?|
| `WikiCitation` | Wiki RAG 撘嚗ageId, pageTitle, text, score嚗?|

---

## Ports嚗exagonal Architecture嚗?

| Port | 隤芣? |
|------|------|
| `IVectorStore` | ??鞈?摨急鞊∴?`index()`, `search()`, `deleteByDocId()`嚗?|
| `RagRetrievalRepository` | Chunk ?????? |
| `RagGenerationRepository` | AI 蝑???嚗???chunks + Genkit ?澆嚗?|
| `RagQueryFeedbackRepository` | ??????|
| `WikiContentRepository` | Wiki ?游? RAG ?亥岷嚗queryWikiRag()`, `reindexWikiDocument()`嚗?|
