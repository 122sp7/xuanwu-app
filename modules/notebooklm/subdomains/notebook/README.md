# notebooklm/subdomains/notebook

## 子域職責

`notebook` 子域負責 Notebook 容器的組合與管理：

- `Notebook` 的建立、組合多個 `Source` 與 `Conversation`
- Notebook 概覽與摘要的生成
- Notebook 的版本管理與分享

## 核心語言

| 術語 | 說明 |
|---|---|
| `Notebook` | 包含多個來源與對話的知識組合容器 |
| `NotebookItem` | Notebook 中的單一項目（Source、Thread、Note） |
| `NotebookSource` | Notebook 加入的來源文件引用 |
| `NotebookSummary` | Notebook 級別的 AI 生成摘要 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateNotebook`、`AddSourceToNotebook`、`GenerateNotebookSummary`）
- `domain/`: `Notebook`、`NotebookItem`、`NotebookSource` 聚合與值物件
- `infrastructure/`: Firestore repository 實作
- `interfaces/`: server action 接線 + UI 元件

## 整合規則

- `Notebook` 是 `notebooklm` 的頂層組合容器
- 每個 Notebook 綁定一個 `workspaceId` 與 owner
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點
