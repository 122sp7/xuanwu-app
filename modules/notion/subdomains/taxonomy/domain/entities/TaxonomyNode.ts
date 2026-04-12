/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/entities
 * Purpose: TaxonomyNode — a node in a hierarchical classification system.
 *
 * Canonical boundary: taxonomy owns classification hierarchy and semantic tags.
 * notion/knowledge may reference taxonomy via TaxonomyHint published language.
 */

export interface TaxonomyNode {
  readonly nodeId: string;
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly path: readonly string[];
  readonly depth: number;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTaxonomyNodeInput {
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
