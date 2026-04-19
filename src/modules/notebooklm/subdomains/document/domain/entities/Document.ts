/**
 * Document — distilled from modules/notebooklm/subdomains/source
 * Represents a workspace-scoped ingested document (formerly SourceFile).
 */
import { v4 as uuid } from "uuid";

export type DocumentStatus = "active" | "processing" | "archived" | "deleted";
export type DocumentClassification = "image" | "manifest" | "record" | "other";

export interface DocumentSnapshot {
  readonly id: string;
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: DocumentClassification;
  readonly tags: readonly string[];
  readonly status: DocumentStatus;
  readonly storageUrl?: string;
  readonly source?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;
  /** Layout Parser 解析頁數（由 fn 寫入 Firestore parsed.page_count）*/
  readonly parsedPageCount?: number;
  /** Layout Parser 語意分塊數（由 fn 寫入 Firestore parsed.chunk_count）*/
  readonly parsedChunkCount?: number;
  /** Form Parser 結構化欄位數（由 fn 寫入 Firestore parsed.entity_count）*/
  readonly parsedEntityCount?: number;
  /** 解析結果 JSON 的 GCS URI（由 fn 寫入 Firestore parsed.json_gcs_uri）*/
  readonly parsedJsonGcsUri?: string;
  /** RAG 索引分塊數（由 fn 寫入 Firestore rag.chunk_count）*/
  readonly ragChunkCount?: number;
  /** RAG 向量數（由 fn 寫入 Firestore rag.vector_count）*/
  readonly ragVectorCount?: number;
  /** RAG 索引狀態（由 fn 寫入 Firestore rag.status: "ready" | "error"）*/
  readonly ragStatus?: string;
}

export interface CreateDocumentInput {
  readonly notebookId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification?: DocumentClassification;
  readonly tags?: string[];
  readonly storageUrl?: string;
  readonly source?: string;
}

export class Document {
  private _domainEvents: Array<{ type: string; eventId: string; occurredAt: string; payload: Record<string, unknown> }> = [];

  private constructor(private _props: DocumentSnapshot) {}

  static create(input: CreateDocumentInput): Document {
    const now = new Date().toISOString();
    const doc = new Document({
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
      status: "active",
      storageUrl: input.storageUrl,
      source: input.source,
      createdAtISO: now,
      updatedAtISO: now,
    });
    doc._domainEvents.push({
      type: "notebooklm.document.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { documentId: doc._props.id, workspaceId: input.workspaceId },
    });
    return doc;
  }

  static reconstitute(snapshot: DocumentSnapshot): Document {
    return new Document(snapshot);
  }

  archive(): void {
    if (this._props.status === "deleted") throw new Error("Cannot archive a deleted document");
    this._props = { ...this._props, status: "archived", updatedAtISO: new Date().toISOString() };
    this._domainEvents.push({
      type: "notebooklm.document.archived",
      eventId: uuid(),
      occurredAt: new Date().toISOString(),
      payload: { documentId: this._props.id },
    });
  }

  delete(): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "deleted", deletedAtISO: now, updatedAtISO: now };
  }

  get id(): string { return this._props.id; }
  get name(): string { return this._props.name; }
  get status(): DocumentStatus { return this._props.status; }
  get workspaceId(): string { return this._props.workspaceId; }

  getSnapshot(): Readonly<DocumentSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
