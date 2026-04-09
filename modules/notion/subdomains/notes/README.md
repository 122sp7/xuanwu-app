# notion/subdomains/notes

## 子域職責

`notes` 子域負責個人輕量筆記與正式知識的協作：

- 個人 `Note`（快速筆記、想法、草稿）的建立與管理
- `Note` 提升為正式 `KnowledgePage` 的流程
- `NoteRef`（筆記引用）與正式知識內容的雙向連結

## 核心語言

| 術語 | 說明 |
|---|---|
| `Note` | 個人輕量筆記，非正式知識 |
| `NoteRef` | 指向筆記的穩定引用 |
| `NotePromotionRequest` | 將筆記提升為正式頁面的請求 |
| `PersonalNoteCollection` | 個人筆記的組織集合 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateNote`、`UpdateNote`、`PromoteNoteToPage`）
- `domain/`: `Note`、`NoteRef`、`NotePromotionRequest`
- `infrastructure/`: Firestore repository 實作
- `interfaces/`: server action 接線 + 快速筆記 UI 元件

## 整合規則

- `NotePromotionRequest` 觸發後，`knowledge` 子域負責建立正式 `KnowledgePage`
- `notes` 子域的 `Note` 是個人私有的，不需 workspace-level 協作
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
