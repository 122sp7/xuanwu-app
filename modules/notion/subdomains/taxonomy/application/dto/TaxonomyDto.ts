/**
 * Module: notion/subdomains/taxonomy
 * Layer: application/dto
 * Purpose: Input/output contracts for taxonomy operations.
 */

export interface CreateTaxonomyNodeDto {
  readonly label: string;
  readonly parentNodeId: string | null;
  readonly organizationId: string;
  readonly workspaceId?: string;
}

export interface TaxonomyNodeDto {
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
