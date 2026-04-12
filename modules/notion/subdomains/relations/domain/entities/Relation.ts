/**
 * Module: notion/subdomains/relations
 * Layer: domain/entities
 * Purpose: Relation — a typed link between two knowledge artifacts.
 *
 * Canonical boundary: relations own backlinks, forward links, and reference graphs.
 * knowledge subdomain already has BacklinkIndex — future convergence or delegation TBD.
 */

export type RelationDirection = "forward" | "backward";

export interface Relation {
  readonly relationId: string;
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly direction: RelationDirection;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly createdAtISO: string;
}

export interface CreateRelationInput {
  readonly sourceArtifactId: string;
  readonly targetArtifactId: string;
  readonly relationType: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
}
