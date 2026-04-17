import type { BlockSnapshot } from "../../../domain/entities/Block";
import type { BlockRepository } from "../../../domain/repositories/BlockRepository";

export class InMemoryBlockRepository implements BlockRepository {
  private readonly store = new Map<string, BlockSnapshot>();

  async save(snapshot: BlockSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async saveAll(snapshots: BlockSnapshot[]): Promise<void> {
    for (const s of snapshots) this.store.set(s.id, s);
  }

  async findById(id: string): Promise<BlockSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findByPageId(pageId: string): Promise<BlockSnapshot[]> {
    return Array.from(this.store.values()).filter((b) => b.pageId === pageId);
  }

  async findChildren(parentBlockId: string): Promise<BlockSnapshot[]> {
    return Array.from(this.store.values()).filter((b) => b.parentBlockId === parentBlockId);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async deleteByPageId(pageId: string): Promise<void> {
    for (const [id, block] of this.store) {
      if (block.pageId === pageId) this.store.delete(id);
    }
  }
}
