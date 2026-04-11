/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseParsedDocumentAdapter — Firebase Storage implementation of IParsedDocumentPort.
 *
 * Reads parsed JSON from a GCS URI and extracts the text content.
 */

import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";

import type { IParsedDocumentPort } from "../../domain/ports/IParsedDocumentPort";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export class FirebaseParsedDocumentAdapter implements IParsedDocumentPort {
  async loadParsedDocumentText(jsonGcsUri: string): Promise<string> {
    if (!jsonGcsUri) return "";
    const storage = getFirebaseStorage();
    const ref = storageApi.ref(storage, jsonGcsUri);
    const url = await storageApi.getDownloadURL(ref);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`無法讀取解析 JSON (${response.status})`);
    const payload = asRecord(await response.json());
    return asString(payload.text);
  }
}
