import type { CreateDatabaseInput } from "@/src/modules/notion";
import { getDocumentDownloadUrl } from "../../outbound/firebase-composition";
import type { IngestionSourceSnapshot } from "../../../subdomains/source/domain/entities/IngestionSource";
import {
  buildDatabasePropertiesFromArtifact,
  buildSourceTextFromArtifacts,
} from "./document-artifact-payload";

const MAX_SUMMARY_CHARS = 1200;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
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
