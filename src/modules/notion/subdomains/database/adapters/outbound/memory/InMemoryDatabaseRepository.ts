import type { DatabaseSnapshot } from "../../../domain/entities/Database";
import type { DatabaseRepository } from "../../../domain/repositories/DatabaseRepository";

export class InMemoryDatabaseRepository implements DatabaseRepository {
  private readonly store = new Map<string, DatabaseSnapshot>();

  async save(snapshot: DatabaseSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<DatabaseSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findByPageId(pageId: string): Promise<DatabaseSnapshot[]> {
    return Array.from(this.store.values()).filter((d) => d.pageId === pageId);
  }

  async findByWorkspaceId(workspaceId: string): Promise<DatabaseSnapshot[]> {
    return Array.from(this.store.values()).filter((d) => d.workspaceId === workspaceId);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
