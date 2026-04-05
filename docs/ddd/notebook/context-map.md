# Context Map ??notebook

## 銝虜嚗?鞈湛?

### search ??notebook嚗ustomer/Supplier嚗?

- `notebook` ?澆 `search/api` ??隤??賊? chunks嚗AG retrieval嚗?
- ?冽 RAG-augmented 撠店??

### wiki ??notebook嚗ustomer/Supplier嚗?

- `notebook` ?舀閰?`wiki/api` ???亥???銝????芯??舀???函?嚗?

---

## 銝虜嚗◤靘陷嚗?

### notebook ??app/(shell)/ai-chat嚗nterfaces嚗?

- AI Chat ????砍 `app/(shell)/ai-chat/_actions.ts` ?澆 `notebook/api`
- **瘜冽?**嚗notebook/api` barrel 銝???Client Component 銝剔??import嚗enkit server-only嚗?

---

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| search ??notebook | search | notebook | Customer/Supplier嚗?甇交閰ｇ? |
| wiki ??notebook | wiki | notebook | Customer/Supplier嚗?甇交閰ｇ? |
| notebook ??AI Chat UI | notebook | app/ | Anti-Corruption Layer嚗app/(shell)/ai-chat/_actions.ts`嚗?|
