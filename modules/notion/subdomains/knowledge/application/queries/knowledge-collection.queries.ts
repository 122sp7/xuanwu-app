import type { KnowledgeCollectionSnapshot } from "../../domain/aggregates/KnowledgeCollection";
import type { IKnowledgeCollectionRepository } from "../../domain/repositories/IKnowledgeCollectionRepository";

export class GetKnowledgeCollectionUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string, collectionId: string): Promise<KnowledgeCollectionSnapshot | null> {
    const c = await this.repo.findById(accountId, collectionId);
    return c ? c.getSnapshot() : null;
  }
}

export class ListKnowledgeCollectionsUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string): Promise<KnowledgeCollectionSnapshot[]> {
    const cs = await this.repo.listByAccountId(accountId);
    return cs.map(c => c.getSnapshot());
  }
}

export class ListKnowledgeCollectionsByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgeCollectionRepository) {}
  async execute(accountId: string, workspaceId: string): Promise<KnowledgeCollectionSnapshot[]> {
    const cs = await this.repo.listByWorkspaceId(accountId, workspaceId);
    return cs.map(c => c.getSnapshot());
  }
}
