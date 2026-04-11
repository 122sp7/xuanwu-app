/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseDocumentStatusAdapter — watches Firestore document status via onSnapshot.
 *
 * Extracted from interfaces/components to keep Firestore access in infrastructure layer.
 */

import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";

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
  const db = getFirebaseFirestore();

  return new Promise((resolve, reject) => {
    const docRef = firestoreApi.doc(db, "accounts", accountId, "documents", docId);
    const unsubscribe = firestoreApi.onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = asRecord(snapshot.data());
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
    });
  });
}
