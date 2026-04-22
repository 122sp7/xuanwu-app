/**
 * artifact-helpers — notebooklm Sources tab artifact text utilities.
 *
 * Shared helpers for loading and normalizing fn parse_document output artifacts
 * (layout, form, ocr, genkit JSON) stored in GCS and referenced via Firestore URIs.
 */

import { z } from "@packages";
import type { DatabaseProperty } from "@/src/modules/notion/subdomains/database/domain/entities/Database";
import { getDocumentDownloadUrl } from "../../outbound/firebase-composition";

// Keep sourceText safely below Firestore's 1 MiB document limit. 80k chars is
// ~240–320 KB for typical CJK/ASCII mix (3–4 bytes per char in UTF-8), leaving
// ample headroom for the rest of the page/database snapshot fields.
export const SOURCE_TEXT_MAX_CHARS = 80_000;

// Summary / description stored in Page.summary and Database.description.
// 5000 chars gives ~10–20 lines of meaningful context while staying within
// Firestore field limits and keeping the downstream task-formation prompt compact.
export const ARTIFACT_SNIPPET_MAX_CHARS = 5_000;

export const ArtifactPayloadSchema = z.object({
  text: z.string().optional(),
  chunks: z.array(z.object({ text: z.string().optional() })).optional(),
  entities: z.array(z.object({
    type: z.string().optional(),
    // fn writes snake_case; support both spellings so extractors are forwards-compatible.
    mentionText: z.string().optional(),
    mention_text: z.string().optional(),
    normalizedValue: z.string().optional(),
    normalized_value: z.string().optional(),
  })).optional(),
});

/**
 * Normalize parser artifacts written by fn parse_document:
 * - layout / ocr / genkit: prefer top-level text, then chunk.text
 * - form: fallback to entity key/value lines when plain text is unavailable
 */
export function extractTextFromArtifactPayload(payload: unknown): string | undefined {
  const parsed = ArtifactPayloadSchema.safeParse(payload);
  if (!parsed.success) return undefined;
  const record = parsed.data;
  const text = record.text?.trim() ?? "";
  if (text.length > 0) return text;

  const chunkText = (record.chunks ?? [])
    .map((chunk) => chunk.text?.trim() ?? "")
    .filter((value) => value.length > 0)
    .join("\n");
  if (chunkText.length > 0) return chunkText;

  const entityText = (record.entities ?? [])
    .map((entity) => {
      const key = entity.type ?? "";
      const mention = entity.mentionText ?? entity.mention_text ?? "";
      if (key && mention) return `${key}: ${mention}`;
      return mention || key;
    })
    .filter((value) => value.length > 0)
    .join("\n");
  return entityText || undefined;
}

export function trimSourceText(text: string | undefined): string | undefined {
  const normalized = text?.trim();
  if (!normalized) return undefined;
  return normalized.slice(0, SOURCE_TEXT_MAX_CHARS);
}

export async function loadSourceTextFromArtifactUri(uri: string): Promise<string | undefined> {
  try {
    const artifactUrl = await getDocumentDownloadUrl(uri);
    const response = await fetch(artifactUrl);
    if (!response.ok) return undefined;
    return trimSourceText(extractTextFromArtifactPayload(await response.json()));
  } catch {
    return undefined;
  }
}

/** Heuristically infer a DatabaseProperty type from a sample mention_text value. */
export function inferPropertyType(mentionText: string): "text" | "number" | "date" {
  const v = mentionText.trim();
  // Date patterns: YYYY.MM.DD, YYYY-MM-DD, YYYY/MM/DD
  if (/^\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}$/.test(v)) return "date";
  // Number patterns: integers, decimals, comma-separated thousands (e.g. 1,134,000)
  if (/^-?[\d,]+(\.\d+)?$/.test(v.replace(/,/g, ""))) return "number";
  return "text";
}

/**
 * Fetch a form-parser artifact JSON and map unique entity.type values to
 * DatabaseProperty definitions so the created Database starts with typed columns.
 * Type is inferred from the first mention_text value for each property.
 */
export async function entitiesToDatabaseProperties(
  formArtifactUri: string,
): Promise<DatabaseProperty[] | undefined> {
  try {
    const artifactUrl = await getDocumentDownloadUrl(formArtifactUri);
    const response = await fetch(artifactUrl);
    if (!response.ok) return undefined;
    const payload = await response.json() as unknown;
    const parsed = ArtifactPayloadSchema.safeParse(payload);
    if (!parsed.success) return undefined;
    const entities = parsed.data.entities ?? [];
    const seen = new Set<string>();
    const properties: DatabaseProperty[] = [];
    for (const entity of entities) {
      const name = (entity.type ?? "").trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        const mention = (entity.mentionText ?? entity.mention_text ?? "").trim();
        properties.push({
          id: crypto.randomUUID(),
          name,
          type: mention ? inferPropertyType(mention) : "text",
        });
      }
    }
    return properties.length > 0 ? properties : undefined;
  } catch {
    return undefined;
  }
}
