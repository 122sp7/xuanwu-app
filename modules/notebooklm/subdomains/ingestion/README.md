# notebooklm/subdomains/ingestion

## 子域職責

`ingestion` 子域負責來源文件的匯入、正規化與前處理正典邊界：

- 接收使用者上傳或連結的來源文件（PDF、URL、純文字等）
- 正規化內容格式，轉換為下游子域可消費的標準結構
- 驗證來源合法性、去重與版本化前處理管線

## 核心語言

| 術語 | 說明 |
|---|---|
| `IngestionJob` | 一次來源文件匯入作業的聚合根 |
| `SourceDocument` | 匯入後正規化的來源文件表示 |
| `IngestionStatus` | 匯入作業狀態（`pending`、`processing`、`completed`、`failed`） |
| `NormalizedContent` | 轉換完成的正規化內容單位 |
| `IngestionError` | 匯入失敗的錯誤證據 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`SubmitIngestionJob`、`ProcessIngestionJob`、`RetryIngestionJob`）
- `domain/`: `IngestionJob`、`SourceDocument`、`NormalizedContent`
- `infrastructure/`: 檔案解析適配器（PDF、URL、純文字）、py_fn 工作者橋接
- `interfaces/`: server action 接線、上傳入口

## 整合規則

- `ingestion` 完成後發布 `notebooklm.source-ingested` 事件，通知 `source` 與 `retrieval` 子域
- 重量級解析（PDF、OCR）委派給 `py_fn/` 工作者執行
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/notebooklm/subdomains.md 建議建立
