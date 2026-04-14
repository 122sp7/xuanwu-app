/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseDocumentStatusAdapter — watches Firestore document status via onSnapshot.
 *
 * Extracted from interfaces/components to keep Firestore access in infrastructure layer.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export async function waitForParsedDocument(
  accountId: string,
  docId: string,
): Promise<{ pageCount: number; jsonGcsUri: string }> {
  return new Promise((resolve, reject) => {
    const unsubscribe = firestoreInfrastructureApi.watchDocument<Record<string, unknown>>(
      `accounts/${accountId}/documents/${docId}`,
      {
        onNext: (document) => {
          if (!document) return;

          const data = asRecord(document.data);
          const status = asString(data.status, "unknown");

          if (status === "completed") {
            const parsed = asRecord(data.parsed);
            unsubscribe();
            resolve({
              pageCount: asNumber(parsed.page_count, 0),
              jsonGcsUri: asString(parsed.json_gcs_uri),
            });
            return;
          }

          if (status === "error") {
            const error = asRecord(data.error);
            unsubscribe();
            reject(new Error(asString(error.message, "文件解析失敗")));
          }
        },
        onError: (error) => {
          unsubscribe();
          reject(error instanceof Error ? error : new Error("文件解析監聽失敗"));
        },
      },
    );
  });
}
