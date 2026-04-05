# Context Map ??ai

## 銝虜嚗?鞈湛?

### source ??ai嚗ustomer/Supplier嚗?

- `source.upload_completed` 閫貊 `ai` 撱箇? IngestionJob
- `ai` 靘陷 `source/api` ?? SourceDocument ????storageUrl?imeType嚗?

---

## 銝虜嚗◤靘陷嚗?

### ai ??search嚗ustomer/Supplier嚗?

- `ai.ingestion_completed` ? `search` ?湔??蝝Ｗ?
- `search` ??RAG ?亥岷靘陷 `ai` ????IngestionChunk

### ai ??py_fn嚗untime Boundary嚗?

**????BC ?? DDD ?游?嚗 runtime ???嚗?*

```
Next.js ai module ??[Firestore Job Record]????py_fn/ worker
                   ??[Firebase Storage URL]????py_fn/ worker
py_fn/ worker ??[Chunk + Embedding 撖怠? Firestore]????Next.js reads
```

- Next.js 蝡荔?Job 撱箇????閰ＵPI
- `py_fn/`嚗arse / chunk / embed 撖阡??瑁?

---

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| source ??ai | source | ai | Published Language (Events) |
| ai ??search | ai | search | Published Language (Events) |
| ai ??py_fn | Next.js | py_fn | Runtime Boundary嚗? DDD ??嚗?|
