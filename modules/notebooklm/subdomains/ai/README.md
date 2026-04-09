# notebooklm/subdomains/ai

## 子域職責

`ai` 子域負責 AI 模型調用的底層能力：

- AI 模型提供者的抽象與路由（OpenAI、Gemini、Claude 等）
- `Prompt` 與 `PromptTemplate` 的管理與渲染
- 模型調用日誌與 token 計量

## 核心語言

| 術語 | 說明 |
|---|---|
| `AiModel` | 可調用的 AI 模型識別碼與參數 |
| `Prompt` | 一次模型調用的完整提示輸入 |
| `PromptTemplate` | 可參數化的提示範本 |
| `ModelResponse` | 模型返回的原始回應（text、finishReason、usage） |
| `AiCallLog` | 一次 AI 調用的可稽核記錄 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CallAiModel`、`RenderPromptTemplate`）
- `domain/`: `AiModel`、`Prompt`、`PromptTemplate`、`ModelResponse`
- `infrastructure/`: Genkit / SDK 適配器
- `interfaces/`: server action 接線

## 整合規則

- 此子域不直接與 UI 互動，只對 `synthesis`、`conversation` 等子域提供能力
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點
