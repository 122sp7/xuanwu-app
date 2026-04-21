import type {
  CreateDatabaseInput,
  DatabaseProperty,
  PropertyType,
} from "@/src/modules/notion";
import { getDocumentDownloadUrl } from "../../outbound/firebase-composition";
import type { IngestionSourceSnapshot } from "../../../subdomains/source/domain/entities/IngestionSource";

const MAX_SOURCE_TEXT_CHARS = 32000;
const MAX_SUMMARY_CHARS = 1200;
const MAX_DATABASE_PROPERTIES = 24;
const MAX_PROPERTY_NAME_CHARS = 80;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function collectTextFragments(value: unknown, bag: string[]): void {
  if (typeof value === "string") {
    const normalized = normalizeWhitespace(value);
    if (normalized.length >= 2) bag.push(normalized);
    return;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    bag.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectTextFragments(item, bag));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectTextFragments(entry, bag));
  }
}

export function buildSourceTextFromArtifacts(
  artifacts: ReadonlyArray<unknown>,
  fallbackTitle: string,
): string {
  const fragments: string[] = [];
  artifacts.forEach((artifact) => collectTextFragments(artifact, fragments));

  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const fragment of fragments) {
    if (seen.has(fragment)) continue;
    seen.add(fragment);
    deduped.push(fragment);
  }

  const combined = normalizeWhitespace(deduped.join("\n"));
  if (combined.length > 0) {
    return combined.slice(0, MAX_SOURCE_TEXT_CHARS);
  }
  return fallbackTitle;
}

function inferPropertyType(value: unknown): PropertyType {
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value)) return "url";
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "date";
    return "text";
  }
  return "text";
}

function formatPropertyName(path: ReadonlyArray<string>): string {
  return normalizeWhitespace(
    path
      .join(" ")
      .replace(/[.[\]]+/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  ).slice(0, MAX_PROPERTY_NAME_CHARS);
}

function addProperty(
  properties: DatabaseProperty[],
  seen: Set<string>,
  path: ReadonlyArray<string>,
  value: unknown,
): void {
  if (properties.length >= MAX_DATABASE_PROPERTIES || path.length === 0) return;
  const name = formatPropertyName(path);
  if (!name || seen.has(name.toLowerCase())) return;
  seen.add(name.toLowerCase());
  properties.push({
    id: crypto.randomUUID(),
    name,
    type: inferPropertyType(value),
  });
}

function collectProperties(
  value: unknown,
  path: string[],
  properties: DatabaseProperty[],
  seen: Set<string>,
): void {
  if (properties.length >= MAX_DATABASE_PROPERTIES || value == null) return;

  if (Array.isArray(value)) {
    if (value.length === 0) return;
    const scalarSample = value.find((entry) => entry == null || typeof entry !== "object");
    if (scalarSample !== undefined) {
      addProperty(properties, seen, path, scalarSample);
      return;
    }
    value.slice(0, 5).forEach((entry) => collectProperties(entry, path, properties, seen));
    return;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) => {
      collectProperties(entry, [...path, key], properties, seen);
    });
    return;
  }

  addProperty(properties, seen, path, value);
}

export function buildDatabasePropertiesFromArtifact(artifact: unknown): DatabaseProperty[] {
  const properties: DatabaseProperty[] = [];
  const seen = new Set<string>();
  collectProperties(artifact, [], properties, seen);
  return properties.slice(0, MAX_DATABASE_PROPERTIES);
}

async function fetchJsonArtifact(storageUrl: string | undefined): Promise<unknown | null> {
  if (!storageUrl) return null;
  const downloadUrl = await getDocumentDownloadUrl(storageUrl);
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`無法讀取解析產出：${response.status}`);
  }
  return response.json();
}

export interface DocumentArtifactContext {
  readonly pageSummary: string;
  readonly pageSourceLabel: string;
  readonly pageSourceText: string;
  readonly databaseDescription: string;
  readonly databaseProperties: CreateDatabaseInput["properties"];
  readonly databaseSourceText: string;
}

export async function buildDocumentArtifactContext(
  doc: IngestionSourceSnapshot,
): Promise<DocumentArtifactContext> {
  const [layoutArtifact, formArtifact, ocrArtifact, genkitArtifact] = await Promise.all([
    fetchJsonArtifact(doc.parsedLayoutJsonGcsUri),
    fetchJsonArtifact(doc.parsedFormJsonGcsUri),
    fetchJsonArtifact(doc.parsedOcrJsonGcsUri),
    fetchJsonArtifact(doc.parsedGenkitJsonGcsUri),
  ]);

  const pageSourceText = buildSourceTextFromArtifacts(
    [layoutArtifact, ocrArtifact, genkitArtifact, formArtifact].filter(Boolean),
    doc.name,
  );
  const pageSummary = pageSourceText.slice(0, MAX_SUMMARY_CHARS);
  const pageSourceLabel = normalizeWhitespace(
    [
      `來源文件：${doc.name}`,
      doc.parsedPageCount != null ? `${doc.parsedPageCount} 頁` : undefined,
      doc.parsedLayoutChunkCount != null ? `Layout ${doc.parsedLayoutChunkCount} 塊` : undefined,
      doc.parsedFormEntityCount != null ? `Form ${doc.parsedFormEntityCount} 欄位` : undefined,
    ].filter((part): part is string => Boolean(part)).join(" · "),
  );

  const databaseProperties = buildDatabasePropertiesFromArtifact(formArtifact ?? genkitArtifact)
    .filter((property) => property.name !== "名稱");
  const databaseDescription = normalizeWhitespace(
    [
      `由來源文件 ${doc.name} 建立的結構化知識資料庫。`,
      databaseProperties.length > 0
        ? `已從解析產出推導 ${databaseProperties.length} 個欄位。`
        : "目前缺少穩定的結構化欄位，保留全文脈絡供任務形成使用。",
    ].join(" "),
  );

  return {
    pageSummary,
    pageSourceLabel,
    pageSourceText,
    databaseDescription,
    databaseProperties,
    databaseSourceText: pageSourceText,
  };
}
