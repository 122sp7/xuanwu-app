# notion/subdomains/ai

## 子域職責

`ai` 子域負責 AI 輔助能力在知識內容流程中的整合：

- AI 輔助頁面草稿生成（`AiDraftRequest`）
- 頁面摘要自動生成
- `IngestionSignal` 的發送，觸發 AI 攝入管道（py_fn）
- 與 `notebooklm` 的整合，提供知識內容作為 Synthesis 來源

## 核心語言

| 術語 | 說明 |
|---|---|
| `AiDraftRequest` | 觸發 AI 頁面草稿生成的請求 |
| `IngestionSignal` | 觸發後端 AI 攝入管道的訊號 |
| `AiSuggestion` | AI 提供的內容補全或改寫建議 |
| `PageSummary` | AI 生成的頁面摘要 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`RequestAiDraft`、`GeneratePageSummary`、`PublishIngestionSignal`）
- `domain/`: `AiDraftRequest`、`IngestionSignal`
- `infrastructure/`: Genkit 適配器、py_fn 訊號發送
- `interfaces/`: server action 接線

## 整合規則

- `ai` 子域是 `notion` → `notebooklm` 的橋接器（知識來源攝入）
- `IngestionSignal` 發出後由 `py_fn` 異步處理（chunking / embedding）
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
