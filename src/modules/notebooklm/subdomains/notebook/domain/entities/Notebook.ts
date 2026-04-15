/**
 * Notebook — distilled from modules/notebooklm/subdomains/notebook
 * Represents an AI-assisted notebook backed by documents.
 */
import { v4 as uuid } from "@lib-uuid";

export type NotebookStatus = "active" | "archived";

export interface NotebookSnapshot {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly documentIds: readonly string[];
  readonly status: NotebookStatus;
  readonly model?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateNotebookInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly model?: string;
}

export class Notebook {
  private _domainEvents: Array<{ type: string; eventId: string; occurredAt: string; payload: Record<string, unknown> }> = [];

  private constructor(private _props: NotebookSnapshot) {}

  static create(input: CreateNotebookInput): Notebook {
    const now = new Date().toISOString();
    const notebook = new Notebook({
      id: uuid(),
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      title: input.title,
      description: input.description,
      documentIds: [],
      status: "active",
      model: input.model,
      createdAtISO: now,
      updatedAtISO: now,
    });
    notebook._domainEvents.push({
      type: "notebooklm.notebook.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { notebookId: notebook._props.id, workspaceId: input.workspaceId },
    });
    return notebook;
  }

  static reconstitute(snapshot: NotebookSnapshot): Notebook {
    return new Notebook(snapshot);
  }

  addDocument(documentId: string): void {
    if (this._props.documentIds.includes(documentId)) return;
    this._props = {
      ...this._props,
      documentIds: [...this._props.documentIds, documentId],
      updatedAtISO: new Date().toISOString(),
    };
  }

  removeDocument(documentId: string): void {
    this._props = {
      ...this._props,
      documentIds: this._props.documentIds.filter((id) => id !== documentId),
      updatedAtISO: new Date().toISOString(),
    };
  }

  archive(): void {
    if (this._props.status === "archived") throw new Error("Notebook already archived");
    this._props = { ...this._props, status: "archived", updatedAtISO: new Date().toISOString() };
  }

  get id(): string { return this._props.id; }
  get title(): string { return this._props.title; }
  get status(): NotebookStatus { return this._props.status; }
  get workspaceId(): string { return this._props.workspaceId; }
  get documentIds(): readonly string[] { return this._props.documentIds; }

  getSnapshot(): Readonly<NotebookSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
