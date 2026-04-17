import type { BlockSnapshot } from "../entities/Block";

export interface BlockRepository {
  save(snapshot: BlockSnapshot): Promise<void>;
  saveAll(snapshots: BlockSnapshot[]): Promise<void>;
  findById(id: string): Promise<BlockSnapshot | null>;
  findByPageId(pageId: string): Promise<BlockSnapshot[]>;
  findChildren(parentBlockId: string): Promise<BlockSnapshot[]>;
  delete(id: string): Promise<void>;
  deleteByPageId(pageId: string): Promise<void>;
}
