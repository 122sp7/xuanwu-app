/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseParsedDocumentAdapter — Firebase Storage implementation of ParsedDocumentPort.
 *
 * Reads parsed JSON from a GCS URI and extracts the text content.
 */

import { storageInfrastructureApi } from "@/modules/platform/api/infrastructure";

import type { ParsedDocumentPort } from "../../../subdomains/source/domain/ports/ParsedDocumentPort";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function resolveStoragePathFromGsUri(input: string): string {
  const normalized = input.trim();
  if (!normalized) return "";
  if (!normalized.startsWith("gs://")) return normalized;

  const withoutScheme = normalized.slice(5);
  const firstSlash = withoutScheme.indexOf("/");
  if (firstSlash === -1) return "";
  return withoutScheme.slice(firstSlash + 1);
}

export class FirebaseParsedDocumentAdapter implements ParsedDocumentPort {
  async loadParsedDocumentText(jsonGcsUri: string): Promise<string> {
    if (!jsonGcsUri) return "";
    const storagePath = resolveStoragePathFromGsUri(jsonGcsUri);
    if (!storagePath) return "";
    const url = await storageInfrastructureApi.getUrl(storagePath);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`無法讀取解析 JSON (${response.status})`);
    const payload = asRecord(await response.json());
    return asString(payload.text);
  }
}
