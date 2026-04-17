import type { PageSnapshot, PageStatus } from "../entities/Page";

export interface PageQuery {
  readonly accountId?: string;
  readonly workspaceId?: string;
  readonly parentPageId?: string | null;
  readonly status?: PageStatus;
  readonly limit?: number;
  readonly offset?: number;
}

export interface PageRepository {
  save(snapshot: PageSnapshot): Promise<void>;
  findById(id: string): Promise<PageSnapshot | null>;
  findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null>;
  findChildren(parentPageId: string): Promise<PageSnapshot[]>;
  query(params: PageQuery): Promise<PageSnapshot[]>;
  delete(id: string): Promise<void>;
}
