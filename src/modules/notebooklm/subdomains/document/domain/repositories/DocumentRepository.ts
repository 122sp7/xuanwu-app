import type { DocumentSnapshot, DocumentStatus } from "../entities/Document";

export interface DocumentQuery {
  readonly notebookId?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly status?: DocumentStatus;
  readonly limit?: number;
  readonly offset?: number;
}

export interface DocumentRepository {
  save(snapshot: DocumentSnapshot): Promise<void>;
  findById(id: string): Promise<DocumentSnapshot | null>;
  findByNotebookId(notebookId: string): Promise<DocumentSnapshot[]>;
  query(params: DocumentQuery): Promise<DocumentSnapshot[]>;
  delete(id: string): Promise<void>;
}
