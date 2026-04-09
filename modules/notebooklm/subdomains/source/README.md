# notebooklm/subdomains/source

## 子域職責

`source` 子域負責來源文件的追蹤與引用管理：

- 加入 Notebook 的來源文件（URL、上傳文件、notion 頁面）的追蹤
- `Citation`（引用）的建立與一致性維護
- `Grounding`（根基文件）的識別，用於 RAG 合成

## 核心語言

| 術語 | 說明 |
|---|---|
| `Source` | 被加入 Notebook 的來源文件 |
| `SourceRef` | 指向 Source 的穩定引用識別碼 |
| `Citation` | AI 回應中的具體引用（指向 SourceChunk） |
| `SourceChunk` | Source 中的文字片段（來自向量檢索） |
| `Grounding` | 支撐 AI 回應的根基文件集合 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`AddSource`、`TrackCitation`、`BuildGrounding`）
- `domain/`: `Source`、`Citation`、`Grounding`
- `infrastructure/`: Firestore repository + 向量索引查詢
- `interfaces/`: server action 接線

## 整合規則

- `Source` 的內容可來自 `notion` 頁面、外部 URL 或直接上傳文件
- `Citation` 必須可追溯到具體的 `SourceChunk`
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點
