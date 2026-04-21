import type { IngestionSourceSnapshot, SourceStatus } from "../entities/IngestionSource";

export interface IngestionSourceQuery {
  readonly notebookId?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly status?: SourceStatus;
  readonly limit?: number;
  readonly offset?: number;
}

export interface IngestionSourceRepository {
  save(snapshot: IngestionSourceSnapshot): Promise<void>;
  findById(id: string): Promise<IngestionSourceSnapshot | null>;
  findByNotebookId(notebookId: string): Promise<IngestionSourceSnapshot[]>;
  query(params: IngestionSourceQuery): Promise<IngestionSourceSnapshot[]>;
  delete(id: string): Promise<void>;
}
