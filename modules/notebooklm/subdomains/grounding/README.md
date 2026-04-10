# notebooklm/subdomains/grounding

## 子域職責

`grounding` 子域負責引用對齊與可追溯證據的正典邊界：

- 將 AI 生成回應中的每一個聲明對齊到具體的來源片段（`GroundingEvidence`）
- 管理引用可信度評估（`ConfidenceScore`）與引用缺口標記
- 提供可審計的引用追蹤，確保生成內容的可追溯性

## 核心語言

| 術語 | 說明 |
|---|---|
| `GroundingResult` | 一次引用對齊作業的結果聚合根 |
| `GroundingEvidence` | 將生成聲明與來源片段對齊的證據單位 |
| `ConfidenceScore` | 引用對齊的可信度評分（0-1） |
| `CitationGap` | 無法對齊來源的生成聲明標記 |
| `GroundingPolicy` | 控制引用對齊嚴格程度的策略定義 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`GroundResponse`、`ValidateCitations`、`QueryGroundingLog`）
- `domain/`: `GroundingResult`、`GroundingEvidence`、`GroundingPolicy`
- `infrastructure/`: Genkit 引用對齊適配器
- `interfaces/`: server action 接線

## 整合規則

- `grounding` 消費 `retrieval` 提供的 `RetrievedChunk`，對齊 `synthesis` 生成的回應
- 發布 `notebooklm.response-grounded` 事件，供 `evaluation` 訂閱使用
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/notebooklm/subdomains.md 建議建立
