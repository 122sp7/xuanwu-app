/**
 * @module integration-google
 * Google 服務整合層：Google Docs Viewer embed URL 建構、MIME 類型白名單、
 * GoogleDocViewerModal React 元件。
 *
 * 此套件封裝所有對外部 Google 服務的依賴。
 * UI 層透過此套件消費 Google Viewer URL 建構邏輯，不得直接組裝 Google 端點字串。
 *
 * googleapis / google-auth-library 的 server-side 用法透過各自模組的
 * infrastructure adapter 使用，不在此 barrel 直接 re-export（避免 client bundle 污染）。
 */

/**
 * Build Google Docs Viewer embed URL from an HTTPS-accessible source URL.
 * Typically used with short-lived signed URLs for private files (e.g. Firebase Storage
 * token-based download URLs).
 *
 * @param sourceUrl - A publicly-reachable HTTPS URL to the document or image.
 * @returns A Google Docs Viewer embed URL suitable for use in an <iframe>.
 */
export const createGoogleViewerEmbedUrl = (sourceUrl: string): string =>
  `https://docs.google.com/viewer?url=${encodeURIComponent(sourceUrl)}&embedded=true`;

/**
 * Set of MIME types that Google Docs Viewer can render.
 * Use this as the source of truth when deciding whether to show a preview button.
 */
export const GOOGLE_VIEWER_PREVIEWABLE_TYPES: ReadonlySet<string> = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/tiff",
  "image/tif",
]);


// ── UI Components ─────────────────────────────────────────────────────────────
// React components that are tightly coupled to the Google Docs Viewer surface.
// These require a "use client" boundary; see GoogleDocViewerModal.tsx.
export type { GoogleDocViewerModalProps } from "./GoogleDocViewerModal";
export { GoogleDocViewerModal } from "./GoogleDocViewerModal";
