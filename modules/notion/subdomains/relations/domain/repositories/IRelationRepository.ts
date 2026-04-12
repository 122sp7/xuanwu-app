/**
 * Module: notion/subdomains/relations
 * Layer: domain/repositories
 * Purpose: IRelationRepository — domain port for relation persistence.
 */

import type { Relation } from "../entities/Relation";

export interface IRelationRepository {
  findById(relationId: string): Promise<Relation | null>;
  listBySource(sourceArtifactId: string): Promise<readonly Relation[]>;
  listByTarget(targetArtifactId: string): Promise<readonly Relation[]>;
  save(relation: Relation): Promise<void>;
  remove(relationId: string): Promise<void>;
}
