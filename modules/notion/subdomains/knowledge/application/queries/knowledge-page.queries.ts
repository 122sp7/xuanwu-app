import type { KnowledgePageSnapshot, KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";

export function buildKnowledgePageTree(pages: KnowledgePageSnapshot[]): KnowledgePageTreeNode[] {
  const map = new Map<string, KnowledgePageTreeNode>();
  for (const page of pages) {
    map.set(page.id, { ...page, children: [] });
  }
  const roots: KnowledgePageTreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentPageId === null || !map.has(node.parentPageId)) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentPageId)!;
      (parent.children as KnowledgePageTreeNode[]).push(node);
    }
  }
  const sortByOrder = (nodes: KnowledgePageTreeNode[]): void => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) sortByOrder(n.children as KnowledgePageTreeNode[]);
  };
  sortByOrder(roots);
  return roots;
}

export class GetKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null> {
    if (!accountId.trim() || !pageId.trim()) return null;
    return this.repo.findSnapshotById(accountId, pageId);
  }
}

export class ListKnowledgePagesUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePageSnapshot[]> {
    if (!accountId.trim()) return [];
    return this.repo.listSnapshotsByAccountId(accountId);
  }
}

export class ListKnowledgePagesByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]> {
    if (!accountId.trim() || !workspaceId.trim()) return [];
    return this.repo.listSnapshotsByWorkspaceId(accountId, workspaceId);
  }
}

export class GetKnowledgePageTreeUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePageTreeNode[]> {
    if (!accountId.trim()) return [];
    const pages = await this.repo.listSnapshotsByAccountId(accountId);
    return buildKnowledgePageTree(pages);
  }
}

export class GetKnowledgePageTreeByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<KnowledgePageTreeNode[]> {
    if (!accountId.trim() || !workspaceId.trim()) return [];
    const pages = await this.repo.listSnapshotsByWorkspaceId(accountId, workspaceId);
    return buildKnowledgePageTree(pages);
  }
}
