# integration-google

Google 服務整合套件 — Google Docs Viewer embed URL 建構與 MIME 類型白名單。

## 提供能力

- `createGoogleViewerEmbedUrl(sourceUrl)` — 將 HTTPS URL 組裝為 Google Docs Viewer iframe src
- `GOOGLE_VIEWER_PREVIEWABLE_TYPES` — Google Docs Viewer 可渲染的 MIME 類型集合

## 消費方式

```ts
import { createGoogleViewerEmbedUrl, GOOGLE_VIEWER_PREVIEWABLE_TYPES } from '@packages'

// 判斷是否可預覽
if (GOOGLE_VIEWER_PREVIEWABLE_TYPES.has(mimeType)) {
  const embedUrl = createGoogleViewerEmbedUrl(downloadUrl);
  // render iframe with embedUrl
}
```

## 架構邊界

- 此套件不包含任何 React 元件、業務邏輯或 Firebase SDK。
- Firebase Storage 下載 URL 取得（`getDownloadURL`）屬於 Firebase 整合層，不在此套件。
- React Modal 元件屬於消費模組（`notebooklm`），不在此套件。
