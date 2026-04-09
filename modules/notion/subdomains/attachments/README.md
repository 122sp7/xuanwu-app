# notion/subdomains/attachments

## 子域職責

`attachments` 子域負責附件與媒體資產的關聯與儲存管理：

- 上傳附件（圖片、文件、影片）並關聯至 `KnowledgePage` 或 `Article`
- `Attachment` 的元資料管理（名稱、大小、MIME type、儲存 URL）
- `MediaRef`（媒體引用）的嵌入與解析

## 核心語言

| 術語 | 說明 |
|---|---|
| `Attachment` | 與知識內容關聯的附件資產 |
| `MediaRef` | 嵌入在頁面內容中的媒體引用 |
| `AttachmentOwner` | 附件所屬的知識內容識別碼 |
| `StorageUrl` | 附件的持久化儲存位置 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`UploadAttachment`、`DeleteAttachment`、`ResolveMediaRef`）
- `domain/`: `Attachment`、`MediaRef`
- `infrastructure/`: Firebase Storage 適配器
- `interfaces/`: server action 接線 + 上傳 UI 元件

## 整合規則

- `Attachment` 的 `AttachmentOwner` 可以是 `KnowledgePage` 或 `Article`
- 儲存 URL 由 Firebase Storage 生成，不可在 `domain/` 層直接依賴 SDK
- 父模組 public API（`@/modules/notion/api`）是跨模組進入點
