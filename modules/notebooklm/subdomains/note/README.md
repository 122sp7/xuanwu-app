# notebooklm/subdomains/note

## 子域職責

`note` 子域負責對話衍生的輕量筆記管理：

- 從 AI 對話中建立、編輯輕量 `Note`
- `Note` 與知識來源（`notion` 頁面、`source` 文件）的連結管理
- 筆記的個人化組織與搜尋

## 核心語言

| 術語 | 說明 |
|---|---|
| `Note` | 對話衍生的輕量筆記文字單元 |
| `NoteRef` | 指向筆記的穩定引用 |
| `KnowledgeLink` | Note 與 notion 頁面或 source 文件的連結 |
| `NoteSource` | Note 的來源追蹤（來自哪個 Thread/Message） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateNote`、`UpdateNote`、`LinkNoteToKnowledge`）
- `domain/`: `Note`、`KnowledgeLink`
- `infrastructure/`: Firestore repository 實作
- `interfaces/`: server action 接線

## 整合規則

- `Note` 的建立來源可以是手動輸入或從 AI 回應中提取
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點
