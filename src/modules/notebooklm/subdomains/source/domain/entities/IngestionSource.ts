/**
 * IngestionSource — canonical ubiquitous-language term for a workspace-scoped
 * ingested document in the notebooklm bounded context.
 *
 * "Source" is the strategic name per docs/structure/domain/ubiquitous-language.md.
 * The legacy "document" subdomain has been removed; all consumers now reference
 * IngestionSource and IngestionSourceSnapshot directly.
 */
import { v4 as uuid } from "uuid";

export type SourceStatus = "active" | "processing" | "archived" | "deleted" | "error";
export type SourceClassification = "image" | "manifest" | "record" | "other";

export interface IngestionSourceSnapshot {
  readonly id: string;
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: SourceClassification;
  readonly tags: readonly string[];
  readonly status: SourceStatus;
  readonly storageUrl?: string;
  /** External origin URI (e.g. GCS path, URL) */
  readonly originUri?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;

  // ── fn pipeline status fields ──────────────────────────────────────────────
  /** Layout Parser 解析頁數（由 fn 寫入 Firestore parsed.page_count）*/
  readonly parsedPageCount?: number;
  /** Layout Parser 語意分塊數（由 fn 寫入 Firestore parsed.layout_chunk_count）*/
  readonly parsedLayoutChunkCount?: number;
  /** Form Parser 結構化欄位數（由 fn 寫入 Firestore parsed.form_entity_count）*/
  readonly parsedFormEntityCount?: number;
  /** Layout Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.layout_json_gcs_uri）*/
  readonly parsedLayoutJsonGcsUri?: string;
  /** Form Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.form_json_gcs_uri）*/
  readonly parsedFormJsonGcsUri?: string;
  /** OCR Parser 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.ocr_json_gcs_uri）*/
  readonly parsedOcrJsonGcsUri?: string;
  /** Genkit-AI 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.genkit_json_gcs_uri）*/
  readonly parsedGenkitJsonGcsUri?: string;
  /** RAG 索引分塊數（由 fn 寫入 Firestore rag.chunk_count）*/
  readonly ragChunkCount?: number;
  /** RAG 向量數（由 fn 寫入 Firestore rag.vector_count）*/
  readonly ragVectorCount?: number;
  /** RAG 索引狀態（由 fn 寫入 Firestore rag.status: "ready" | "error"）*/
  readonly ragStatus?: string;
  /** fn 解析失敗時的錯誤訊息（由 fn 寫入 Firestore error.message）*/
  readonly errorMessage?: string;

  // ── fn pipeline timing / model fields ─────────────────────────────────────
  /** Layout Parser 完成時間（由 fn 寫入 Firestore parsed.parsed_at）*/
  readonly parsedAt?: string;
  /** Layout Parser 耗時毫秒（由 fn 寫入 Firestore parsed.extraction_ms）*/
  readonly extractionMs?: number;
  /** RAG 嵌入模型名稱（由 fn 寫入 Firestore rag.embedding_model）*/
  readonly embeddingModel?: string;
  /** RAG 索引完成時間（由 fn 寫入 Firestore rag.indexed_at）*/
  readonly ragIndexedAt?: string;
}

export interface RegisterIngestionSourceInput {
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification?: SourceClassification;
  readonly tags?: string[];
  readonly storageUrl?: string;
  readonly originUri?: string;
}

export class IngestionSource {
  private _domainEvents: Array<{
    type: string;
    eventId: string;
    occurredAt: string;
    payload: Record<string, unknown>;
  }> = [];

  private constructor(private _props: IngestionSourceSnapshot) {}

  static register(input: RegisterIngestionSourceInput): IngestionSource {
    const now = new Date().toISOString();
    const src = new IngestionSource({
      id: uuid(),
      notebookId: input.notebookId,
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      accountId: input.accountId,
      name: input.name,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      classification: input.classification ?? "other",
      tags: input.tags ?? [],
      status: "processing",
      storageUrl: input.storageUrl,
      originUri: input.originUri,
      createdAtISO: now,
      updatedAtISO: now,
    });
    src._domainEvents.push({
      type: "notebooklm.source.registered",
      eventId: uuid(),
      occurredAt: now,
      payload: { sourceId: src._props.id, workspaceId: input.workspaceId },
    });
    return src;
  }

  static reconstitute(snapshot: IngestionSourceSnapshot): IngestionSource {
    return new IngestionSource(snapshot);
  }

  markReady(): void {
    if (this._props.status === "deleted") throw new Error("Cannot mark a deleted source as ready");
    this._props = { ...this._props, status: "active", updatedAtISO: new Date().toISOString() };
    this._domainEvents.push({
      type: "notebooklm.source.ready",
      eventId: uuid(),
      occurredAt: new Date().toISOString(),
      payload: { sourceId: this._props.id },
    });
  }

  archive(): void {
    if (this._props.status === "deleted") throw new Error("Cannot archive a deleted source");
    this._props = { ...this._props, status: "archived", updatedAtISO: new Date().toISOString() };
    this._domainEvents.push({
      type: "notebooklm.source.archived",
      eventId: uuid(),
      occurredAt: new Date().toISOString(),
      payload: { sourceId: this._props.id },
    });
  }

  get id(): string { return this._props.id; }
  get name(): string { return this._props.name; }
  get status(): SourceStatus { return this._props.status; }
  get workspaceId(): string { return this._props.workspaceId; }
  get notebookId(): string | undefined { return this._props.notebookId; }

  getSnapshot(): Readonly<IngestionSourceSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
