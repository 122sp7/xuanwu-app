# notebooklm/subdomains/synthesis

## 子域職責

`synthesis` 子域負責 RAG 合成與 AI 生成內容的管理：

- 基於 `Source` 與 `Grounding` 的 RAG 合成執行
- 摘要（`Summary`）的生成與持久化
- 洞察（`Insight`）的提取與標記
- 合成請求的佇列、重試與結果管理

## 核心語言

| 術語 | 說明 |
|---|---|
| `Synthesis` | 一次完整的 RAG 合成操作聚合根 |
| `SynthesisRequest` | 觸發合成的輸入（問題、來源、模型偏好） |
| `SynthesisResult` | 合成輸出（回答、引用、token 使用量） |
| `Insight` | 從合成結果中提取的關鍵洞察 |
| `Summary` | 對一組來源或對話的自動摘要 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`RunSynthesis`、`GenerateSummary`、`ExtractInsights`）
- `domain/`: `Synthesis`、`SynthesisRequest`、`SynthesisResult`、`Insight`
- `infrastructure/`: Genkit flow 適配器、結果 Firestore 儲存
- `interfaces/`: server action 接線

## 整合規則

- `synthesis` 消費 `source` 子域提供的 `Grounding`
- `synthesis` 調用 `ai` 子域的模型能力
- 生成結果（`SynthesisResult`）觸發 `notebooklm.synthesis_completed` 事件
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點
