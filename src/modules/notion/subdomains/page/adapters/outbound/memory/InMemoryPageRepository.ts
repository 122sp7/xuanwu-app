import type { PageSnapshot, PageStatus } from "../../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../../domain/repositories/PageRepository";

export class InMemoryPageRepository implements PageRepository {
  private readonly store = new Map<string, PageSnapshot>();

  async save(snapshot: PageSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<PageSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findBySlug(slug: string, accountId: string): Promise<PageSnapshot | null> {
    for (const page of this.store.values()) {
      if (page.slug === slug && page.accountId === accountId) return page;
    }
    return null;
  }

  async findChildren(parentPageId: string): Promise<PageSnapshot[]> {
    return Array.from(this.store.values()).filter((p) => p.parentPageId === parentPageId);
  }

  async query(params: PageQuery): Promise<PageSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.accountId) results = results.filter((p) => p.accountId === params.accountId);
    if (params.workspaceId) results = results.filter((p) => p.workspaceId === params.workspaceId);
    if (params.parentPageId !== undefined) results = results.filter((p) => p.parentPageId === params.parentPageId);
    if (params.status) results = results.filter((p) => p.status === (params.status as PageStatus));
    return results.slice(params.offset ?? 0, (params.offset ?? 0) + (params.limit ?? 100));
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
