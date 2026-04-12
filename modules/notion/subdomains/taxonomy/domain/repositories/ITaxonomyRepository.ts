/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/repositories
 * Purpose: ITaxonomyRepository — domain port for taxonomy node persistence.
 */

import type { TaxonomyNode } from "../entities/TaxonomyNode";

export interface ITaxonomyRepository {
  findById(nodeId: string): Promise<TaxonomyNode | null>;
  listChildren(parentNodeId: string): Promise<readonly TaxonomyNode[]>;
  listRoots(organizationId: string): Promise<readonly TaxonomyNode[]>;
  save(node: TaxonomyNode): Promise<void>;
  remove(nodeId: string): Promise<void>;
}
