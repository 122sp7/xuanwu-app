# Ubiquitous Language ??notebook

> **蝭?嚗?* ?? `modules/notebook/` ??銝??

## 銵?摰儔

| 銵? | ?望? | 摰儔 |
|------|------|------|
| 撠店銝?| Thread | 銝蝯?摨?撠店閮??嚗 AI 撠店??銋??桀? |
| 閮 | Message | Thread 銝剔??桀?閮嚗 role ??content嚗?|
| 閮閫 | MessageRole | 閮?澆??閫嚗"user" \| "assistant" \| "system"` |
| 蝑??砍???| NotebookResponse | AI 璅∪?撠?甈?prompt ????????text?odel嚗?|
| ??頛詨 | GenerateNotebookResponseInput | ?澆 AI ???撓?伐?prompt?odel??ystem?嚗?|
| 蝑??砍澈 | NotebookRepository | 撠? Genkit AI ?澆??Repository port |

## 璉銵?嚗歇蝘餉 search嚗?

| 璉銵? | ?唬?蝵?|
|----------|--------|
| `RagQuery` / `RagCitation` | `modules/search/domain/entities/RagQuery.ts` |
| `RagGenerationRepository` | `modules/search/domain/repositories/RagGenerationRepository.ts` |
| `RagRetrievalRepository` | `modules/search/domain/repositories/RagRetrievalRepository.ts` |

## 蝳迫?踵?銵?

| 甇?Ⅱ | 蝳迫 |
|------|------|
| `Thread` | `Conversation`, `Chat`, `Session` |
| `Message` | `ChatMessage`, `Turn` |
| `NotebookResponse` | `AIResponse`, `LLMOutput` |
