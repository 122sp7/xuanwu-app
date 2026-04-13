/**
 * Module: notion/subdomains/taxonomy
 * Layer: infrastructure/firebase
 * Purpose: Firebase adapter implementing TaxonomyRepository.
 * Firestore path: notionTaxonomyNodes/{nodeId}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type { TaxonomyNode } from "../../../subdomains/taxonomy/domain/entities/TaxonomyNode";
import type { TaxonomyRepository } from "../../../subdomains/taxonomy/domain/repositories/TaxonomyRepository";

function collectionPath(): string {
  return "notionTaxonomyNodes";
}

function docPath(nodeId: string): string {
  return `notionTaxonomyNodes/${nodeId}`;
}

function toTaxonomyNode(nodeId: string, data: Record<string, unknown>): TaxonomyNode {
  const rawPath = data.path;
  const path: readonly string[] =
    Array.isArray(rawPath) && rawPath.every((s) => typeof s === "string")
      ? (rawPath as string[])
      : [nodeId];

  return {
    nodeId,
    label: typeof data.label === "string" ? data.label : "",
    parentNodeId: typeof data.parentNodeId === "string" ? data.parentNodeId : null,
    path,
    depth: typeof data.depth === "number" ? data.depth : 0,
    organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseTaxonomyRepository implements TaxonomyRepository {
  async findById(nodeId: string): Promise<TaxonomyNode | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(docPath(nodeId));
    if (!data) return null;
    return toTaxonomyNode(nodeId, data);
  }

  async listRoots(organizationId: string): Promise<readonly TaxonomyNode[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionPath(),
      [
        { field: "organizationId", op: "==", value: organizationId },
        { field: "depth", op: "==", value: 0 },
      ],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toTaxonomyNode(d.id, d.data));
  }

  async listChildren(parentNodeId: string): Promise<readonly TaxonomyNode[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      collectionPath(),
      [{ field: "parentNodeId", op: "==", value: parentNodeId }],
      { orderBy: [{ field: "createdAtISO", direction: "asc" }] },
    );
    return docs.map((d) => toTaxonomyNode(d.id, d.data));
  }

  async save(node: TaxonomyNode): Promise<void> {
    await firestoreInfrastructureApi.set(docPath(node.nodeId), {
      nodeId: node.nodeId,
      label: node.label,
      parentNodeId: node.parentNodeId ?? null,
      path: [...node.path],
      depth: node.depth,
      organizationId: node.organizationId,
      workspaceId: node.workspaceId ?? null,
      createdAtISO: node.createdAtISO,
      updatedAtISO: node.updatedAtISO,
    });
  }

  async remove(nodeId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(docPath(nodeId));
  }
}
