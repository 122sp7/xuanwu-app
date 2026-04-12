/**
 * Module: notion/subdomains/relations
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing IRelationRepository.
 * Firestore path: notionRelations/{relationId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { Relation } from "../../../subdomains/relations/domain/entities/Relation";
import type { IRelationRepository } from "../../../subdomains/relations/domain/repositories/IRelationRepository";

function relationsPath(): string {
  return "notionRelations";
}

function relationPath(relationId: string): string {
  return `notionRelations/${relationId}`;
}

function toRelation(relationId: string, data: Record<string, unknown>): Relation {
  return {
    relationId,
    sourceArtifactId: typeof data.sourceArtifactId === "string" ? data.sourceArtifactId : "",
    targetArtifactId: typeof data.targetArtifactId === "string" ? data.targetArtifactId : "",
    relationType: typeof data.relationType === "string" ? data.relationType : "related",
    direction: data.direction === "backward" ? "backward" : "forward",
    organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
  };
}

export class FirebaseRelationRepository implements IRelationRepository {
  async findById(relationId: string): Promise<Relation | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(relationPath(relationId));
    if (!data) return null;
    return toRelation(relationId, data);
  }

  async listBySource(sourceArtifactId: string): Promise<readonly Relation[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      relationsPath(),
      [{ field: "sourceArtifactId", op: "==", value: sourceArtifactId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toRelation(d.id, d.data));
  }

  async listByTarget(targetArtifactId: string): Promise<readonly Relation[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      relationsPath(),
      [{ field: "targetArtifactId", op: "==", value: targetArtifactId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toRelation(d.id, d.data));
  }

  async save(relation: Relation): Promise<void> {
    const { relationId, ...rest } = relation;
    await firestoreInfrastructureApi.set(relationPath(relationId), { relationId, ...rest });
  }

  async remove(relationId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(relationPath(relationId));
  }
}
