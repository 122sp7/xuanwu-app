# Context Map — notebooklm

## 上游（依賴）

### search → notebooklm（Customer/Supplier）

- `notebooklm` 呼叫 `search/api` 取得語意相關 chunks（RAG retrieval）
- 用於 RAG-augmented 對話生成
- `knowledge`、`knowledge-base` 與 `source` 的內容會先經 `ai` 攝入，再由 `search` 提供給 `notebooklm`

---

## 下游（被依賴）

### notebooklm → app/(shell)/ai-chat（Interfaces）

- AI Chat 頁面透過本地 `app/(shell)/ai-chat/_actions.ts` 呼叫 `notebooklm/api`
- **注意**：`notebooklm/api` barrel 不得在 Client Component 中直接 import（Genkit server-only）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| search → notebooklm | search | notebooklm | Customer/Supplier（同步查詢） |
| notebooklm → AI Chat UI | notebooklm | app/ | Anti-Corruption Layer（`app/(shell)/ai-chat/_actions.ts`） |
