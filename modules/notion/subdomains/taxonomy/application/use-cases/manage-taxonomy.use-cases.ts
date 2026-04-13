import { v4 as uuid } from "@lib-uuid";
/**
 * Module: notion/subdomains/taxonomy
 * Layer: application/use-cases
 * Purpose: Use case orchestration for taxonomy node operations.
 */

import type { TaxonomyRepository } from "../../domain/repositories/TaxonomyRepository";
import type { TaxonomyNode, CreateTaxonomyNodeInput } from "../../domain/entities/TaxonomyNode";

export class CreateTaxonomyNodeUseCase {
  constructor(private readonly taxonomyRepo: TaxonomyRepository) {}

  async execute(input: CreateTaxonomyNodeInput): Promise<TaxonomyNode> {
    let parentPath: readonly string[] = [];
    let depth = 0;

    if (input.parentNodeId) {
      const parent = await this.taxonomyRepo.findById(input.parentNodeId);
      if (!parent) {
        throw new Error(`Parent node not found: ${input.parentNodeId}`);
      }
      parentPath = parent.path;
      depth = parent.depth + 1;
    }

    const now = new Date().toISOString();
    const nodeId = uuid();
    const node: TaxonomyNode = {
      nodeId,
      label: input.label.trim(),
      parentNodeId: input.parentNodeId,
      path: [...parentPath, nodeId],
      depth,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await this.taxonomyRepo.save(node);
    return node;
  }
}

export class RemoveTaxonomyNodeUseCase {
  constructor(private readonly taxonomyRepo: TaxonomyRepository) {}

  async execute(nodeId: string): Promise<void> {
    const children = await this.taxonomyRepo.listChildren(nodeId);
    if (children.length > 0) {
      throw new Error("Cannot remove node with children. Remove children first.");
    }
    await this.taxonomyRepo.remove(nodeId);
  }
}

export class ListTaxonomyRootsUseCase {
  constructor(private readonly taxonomyRepo: TaxonomyRepository) {}

  async execute(organizationId: string): Promise<readonly TaxonomyNode[]> {
    return this.taxonomyRepo.listRoots(organizationId);
  }
}

export class ListTaxonomyChildrenUseCase {
  constructor(private readonly taxonomyRepo: TaxonomyRepository) {}

  async execute(parentNodeId: string): Promise<readonly TaxonomyNode[]> {
    return this.taxonomyRepo.listChildren(parentNodeId);
  }
}
