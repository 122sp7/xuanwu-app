# notebooklm/subdomains/evaluation

## 子域職責

`evaluation` 子域負責品質評估與回歸比較的正典邊界：

- 定義與執行 RAG 回應品質的評估指標（`EvaluationMetric`）
- 管理評估集（`EvaluationDataset`）與基準版本比較
- 偵測生成品質退步（`RegressionAlert`）並觸發告警

## 核心語言

| 術語 | 說明 |
|---|---|
| `EvaluationRun` | 一次品質評估作業的聚合根 |
| `EvaluationMetric` | 評估指標定義（忠實度、相關性、引用覆蓋率等） |
| `EvaluationDataset` | 一組用於評估的標準問答對 |
| `EvaluationScore` | 單一指標的評估結果數值 |
| `RegressionAlert` | 評估分數低於基準閾值的退步告警 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`RunEvaluation`、`CompareWithBaseline`、`ManageEvaluationDataset`）
- `domain/`: `EvaluationRun`、`EvaluationMetric`、`EvaluationDataset`
- `infrastructure/`: 評估框架適配器（Genkit Evaluators、Vertex AI Model Evaluation）
- `interfaces/`: server action 接線、評估儀表板

## 整合規則

- `evaluation` 訂閱 `notebooklm.response-grounded` 事件，觸發自動品質評估
- 評估結果供 `platform.analytics` 或 `platform.observability` 消費
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/notebooklm/subdomains.md 建議建立
