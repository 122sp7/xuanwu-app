# Context Map ??search

## 銝虜嚗?鞈湛?

### ai ??search嚗ustomer/Supplier嚗?

- `ai.ingestion_completed` ? `search` ?湔??蝝Ｗ?
- `search` 靘陷 `ai` ????IngestionChunk嚗mbedding ??嚗?

### wiki ??search嚗ustomer/Supplier嚗?

- `wiki.node_activated` 閫貊 `search` ?湔蝭暺??”蝷?

---

## 銝虜嚗◤靘陷嚗?

### search ??notebook嚗ustomer/Supplier嚗?

- `notebook` ?澆 `search/api.answerRagQuery()` ?? RAG chunks ??獢?
- ??郊?亥岷嚗??臭?隞?

### search ??Wiki UI嚗nterfaces嚗?

- `RagView`, `RagQueryView` 敺?`modules/search` root barrel ?臬嚗? /api嚗?
- Wiki ??湔?澆 `search/api` Server Actions

---

## Import 頝舐

```
server code (Server Action, API route) ??import from @/modules/search/api
client code (React Component)          ??import from @/modules/search (root barrel)
```

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| ai ??search | ai | search | Published Language (Events) |
| wiki ??search | wiki | search | Published Language (Events) |
| search ??notebook | search | notebook | Customer/Supplier嚗?甇伐? |
| search ??Wiki UI | search | app/ | Conformist |
