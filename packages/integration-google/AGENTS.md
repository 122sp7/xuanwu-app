# integration-google — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts` — barrel: URL utilities + UI component exports
- `GoogleDocViewerModal.tsx` — React component for Google Docs Viewer iframe overlay

## Drift Guard

- `AGENTS.md` 擁有 `packages/integration-google/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->

此套件是 **Google 服務整合的唯一封裝層**，涵蓋：
- Google Docs Viewer URL 建構與 MIME 類型白名單（純工具函式）
- `GoogleDocViewerModal` React 元件（與 Viewer URL 緊密耦合的 UI）
- `googleapis` / `google-auth-library` server-side adapter 使用路徑（不在 barrel export）

---

## Route Here

| 類型 | 說明 |
|---|---|
| Google Docs Viewer embed URL | `createGoogleViewerEmbedUrl(url)` |
| Previewable MIME types | `GOOGLE_VIEWER_PREVIEWABLE_TYPES` |
| Viewer preview modal UI | `GoogleDocViewerModal` |
| Google Calendar server-side adapter | `packages/integration-google/` 下建立 `calendar-adapter.ts`（未來） |
| Google OAuth / service account auth | 此套件內建立 `auth-client.ts`，不外洩到 domain 層 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| Firebase Storage 下載 URL 取得 | `src/modules/notebooklm/adapters/outbound/firebase-composition.ts` |
| 通用 UI primitives（PageSection、EmptyState） | `packages/ui-components` |
| Google Calendar domain model / use cases | `src/modules/platform/subdomains/calendar/` |

---

## 嚴禁

```ts
// ❌ 在 ui-components 直接組裝 Google 端點 URL
`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

// ✅ 透過此套件
import { createGoogleViewerEmbedUrl, GoogleDocViewerModal } from '@packages'
```

- 不得在此套件加入業務邏輯或 domain model
- 不得 import `src/modules/*`
- `googleapis` / `google-auth-library` 只能在 server-only adapter 檔案中使用（不得 import 進 `"use client"` 元件）

## Alias

```ts
import {
  createGoogleViewerEmbedUrl,
  GOOGLE_VIEWER_PREVIEWABLE_TYPES,
  GoogleDocViewerModal,
  type GoogleDocViewerModalProps,
} from '@packages'
```
