const DEFAULT_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim()
  || "xuanwu-i-00708880-4e2d8.firebasestorage.app";

export function toGsUri(storagePath: string): string {
  const normalized = storagePath.trim().replace(/^\/+/, "");
  return `gs://${DEFAULT_BUCKET}/${normalized}`;
}

export function formatFileSize(sizeBytes: number): string {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"] as const;
  let value = sizeBytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

export function getStatusTone(status: string): "default" | "secondary" | "outline" {
  if (status === "ready") return "default";
  if (status === "processing" || status === "uploaded") return "secondary";
  return "outline";
}
