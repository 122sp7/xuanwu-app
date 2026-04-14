import { functionsInfrastructureApi } from "@/modules/platform/api/infrastructure";

import type {
  SourcePipelinePort,
  ParseSourceDocumentInput,
  ParseSourceDocumentOutput,
  ReindexSourceDocumentInput,
  ReindexSourceDocumentOutput,
} from "../../../subdomains/source/domain/ports/SourcePipelinePort";

const SOURCE_FUNCTION_REGION = "asia-southeast1";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export class PlatformSourcePipelineAdapter implements SourcePipelinePort {
  async parseDocument(input: ParseSourceDocumentInput): Promise<ParseSourceDocumentOutput> {
    const raw = await functionsInfrastructureApi.call<
      {
        account_id: string;
        workspace_id: string;
        doc_id: string;
        gcs_uri: string;
        filename: string;
        mime_type: string;
        size_bytes: number;
        run_rag: boolean;
      },
      unknown
    >(
      "parse_document",
      {
        account_id: input.accountId,
        workspace_id: input.workspaceId,
        doc_id: input.documentId,
        gcs_uri: input.gcsUri,
        filename: input.filename,
        mime_type: input.mimeType || "application/octet-stream",
        size_bytes: input.sizeBytes,
        run_rag: false,
      },
      { region: SOURCE_FUNCTION_REGION },
    );

    const data = asRecord(raw);
    return { documentId: asString(data.doc_id, input.documentId) };
  }

  async reindexDocument(input: ReindexSourceDocumentInput): Promise<ReindexSourceDocumentOutput> {
    const raw = await functionsInfrastructureApi.call<
      {
        account_id: string;
        workspace_id: string;
        doc_id: string;
        json_gcs_uri: string;
        source_gcs_uri: string;
        filename: string;
        page_count: number;
      },
      unknown
    >(
      "rag_reindex_document",
      {
        account_id: input.accountId,
        workspace_id: input.workspaceId,
        doc_id: input.documentId,
        json_gcs_uri: input.jsonGcsUri,
        source_gcs_uri: input.sourceGcsUri,
        filename: input.filename,
        page_count: input.pageCount,
      },
      { region: SOURCE_FUNCTION_REGION },
    );

    const data = asRecord(raw);
    return {
      chunkCount: asNumber(data.chunk_count, 0),
      vectorCount: asNumber(data.vector_count, 0),
    };
  }
}
