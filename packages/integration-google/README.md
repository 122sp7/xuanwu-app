# integration-google

Google 服務整合套件 — Google Docs Viewer URL 建構、MIME 類型白名單、
`GoogleDocViewerModal` React 元件、以及 server-side Google API adapter 的掛載點。

## 提供能力

| 匯出 | 說明 |
|---|---|
| `createGoogleViewerEmbedUrl(sourceUrl)` | 將 HTTPS URL 組裝為 Google Docs Viewer iframe src |
| `GOOGLE_VIEWER_PREVIEWABLE_TYPES` | Google Docs Viewer 可渲染的 MIME 類型集合 |
| `GoogleDocViewerModal` | fullscreen 預覽 Modal，接受已解析的下載 URL |
| `GoogleDocViewerModalProps` | Modal props type |

## 消費方式

```ts
import {
  createGoogleViewerEmbedUrl,
  GOOGLE_VIEWER_PREVIEWABLE_TYPES,
  GoogleDocViewerModal,
  type GoogleDocViewerModalProps,
} from '@packages'

// 判斷是否可預覽
if (GOOGLE_VIEWER_PREVIEWABLE_TYPES.has(mimeType)) {
  const embedUrl = createGoogleViewerEmbedUrl(downloadUrl);
  // 或直接使用 modal
  return <GoogleDocViewerModal name={name} mimeType={mimeType} url={downloadUrl} ... />;
}
```

## Server-side Google API

`googleapis` 與 `google-auth-library` 已安裝於根 `package.json`。
Server-side adapter 檔案（如 Google Calendar、Google Drive）應放在此套件下，
以 `.server.ts` 後綴或獨立檔案命名，不得被 `"use client"` 元件 import。

```
packages/integration-google/
  index.ts                    ← client-safe barrel
  GoogleDocViewerModal.tsx    ← React 元件 ("use client")
  calendar-adapter.ts         ← 未來：Google Calendar API adapter (server-only)
  auth-client.ts              ← 未來：OAuth / service account 初始化 (server-only)
```

## 架構邊界

- 此套件不包含業務邏輯或 domain model。
- `index.ts` 只 re-export client-safe symbol；server-only 檔案由 server component / Server Action 直接 import 路徑。
- 不得 import `src/modules/*`。
