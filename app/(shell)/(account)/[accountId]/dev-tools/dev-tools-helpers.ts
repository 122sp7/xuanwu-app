// ── Types ─────────────────────────────────────────────────────────────────────

export interface ParseResult {
  doc_id: string;
  status: "processing" | "completed" | "error";
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
}

export interface DocRecord {
  id: string;
  status: "processing" | "completed" | "error" | string;
  filename: string;
  gcs_uri: string;
  uploaded_at: Date | null;
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
  rag_status?: string;
  rag_chunk_count?: number;
  rag_vector_count?: number;
  rag_raw_chars?: number;
  rag_normalized_chars?: number;
  rag_normalization_version?: string;
  rag_language_hint?: string;
  rag_error?: string;
}

export type UploadStatus = "idle" | "uploading" | "waiting" | "done" | "error";

// ── Constants ─────────────────────────────────────────────────────────────────

export const WATCH_PATH = "uploads/";
export const ACCEPTED_MIME: Record<string, string> = {
  pdf: "application/pdf",
  tif: "image/tiff",
  tiff: "image/tiff",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};
export const ACCEPTED_EXTS = ".pdf, .tif / .tiff, .png, .jpg / .jpeg";

// ── Data-mapping helpers ──────────────────────────────────────────────────────

export function formatDateTime(value: Date | null): string {
  if (!value) return "—";
  return value.toLocaleString("zh-TW", { hour12: false });
}

/**
 * Extract the storage object path from a `gs://bucket/path` URI.
 * Returns the path portion only (e.g. `uploads/abc/file.pdf`).
 */
export function gcsUriToPath(gcsUri: string): string {
  if (!gcsUri.startsWith("gs://")) return gcsUri;
  const withoutPrefix = gcsUri.slice(5);
  const firstSlash = withoutPrefix.indexOf("/");
  if (firstSlash < 0) return "";
  return withoutPrefix.slice(firstSlash + 1);
}

function deriveJsonUri(gcsUri: string): string {
  if (!gcsUri.startsWith("gs://")) return "";
  const withoutPrefix = gcsUri.slice(5);
  const firstSlash = withoutPrefix.indexOf("/");
  if (firstSlash < 0) return "";

  const bucket = withoutPrefix.slice(0, firstSlash);
  const objectPath = withoutPrefix.slice(firstSlash + 1);
  if (!objectPath.startsWith("uploads/")) return "";

  const relativePath = objectPath.slice("uploads/".length);
  const dotIndex = relativePath.lastIndexOf(".");
  const stem = dotIndex > -1 ? relativePath.slice(0, dotIndex) : relativePath;
  return `gs://${bucket}/files/${stem}.json`;
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (value && typeof value === "object" && "toDate" in value) {
    if (typeof (value as { toDate?: unknown }).toDate === "function") {
      const converted = (value as { toDate: () => unknown }).toDate();
      return converted instanceof Date ? converted : null;
    }
  }
  return null;
}

/**
 * Map a plain data record (from platform infrastructure API) to DocRecord.
 * Accepts `{ id, data }` where data is an already-resolved object —
 * NOT a Firestore DocumentSnapshot with a `data()` method.
 */
export function mapDocRecord(doc: { id: string; data: Record<string, unknown> }): DocRecord {
  const data = asRecord(doc.data);
  const source = asRecord(data.source);
  const parsed = asRecord(data.parsed);
  const rag = asRecord(data.rag);
  const err = asRecord(data.error);

  return {
    id: doc.id,
    status: asString(data.status, "unknown"),
    filename: asString(source.filename, doc.id),
    gcs_uri: asString(source.gcs_uri),
    uploaded_at: asDate(source.uploaded_at),
    page_count: asNumber(parsed.page_count),
    json_gcs_uri: asString(parsed.json_gcs_uri, deriveJsonUri(asString(source.gcs_uri))),
    error_message: asString(err.message) || undefined,
    rag_status: asString(rag.status) || undefined,
    rag_chunk_count: asNumber(rag.chunk_count),
    rag_vector_count: asNumber(rag.vector_count),
    rag_raw_chars: asNumber(rag.raw_chars),
    rag_normalized_chars: asNumber(rag.normalized_chars),
    rag_normalization_version: asString(rag.normalization_version) || undefined,
    rag_language_hint: asString(rag.language_hint) || undefined,
    rag_error: asString(rag.error) || undefined,
  };
}
