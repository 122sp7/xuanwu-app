/**
 * modules/wiki — infrastructure/in-memory
 * Purpose: In-memory adapter for GraphRepository.
 *          Uses plain Map — no external database required.
 *          Designed for local demos and unit tests.
 */

import type { GraphNode } from "../domain/entities/graph-node";
import type { GraphEdge, EdgeType } from "../domain/entities/graph-edge";
import type { GraphRepository } from "../domain/repositories/GraphRepository";

export class InMemoryGraphRepository implements GraphRepository {
  private readonly nodes = new Map<string, GraphNode>();
  private readonly edges = new Map<string, GraphEdge>();

  async saveNode(node: GraphNode): Promise<void> {
    this.nodes.set(node.id, node);
  }

  async saveEdge(edge: GraphEdge): Promise<void> {
    this.edges.set(edge.id, edge);
  }

  async findNodeById(id: string): Promise<GraphNode | null> {
    return this.nodes.get(id) ?? null;
  }

  async findEdgesBySourceId(sourceId: string): Promise<GraphEdge[]> {
    return [...this.edges.values()].filter((e) => e.sourceNodeId === sourceId);
  }

  async findEdgesByTarget(targetId: string): Promise<GraphEdge[]> {
    return [...this.edges.values()].filter((e) => e.targetNodeId === targetId);
  }

  async findEdgesByType(type: EdgeType): Promise<GraphEdge[]> {
    return [...this.edges.values()].filter((e) => e.edgeType === type);
  }

  async listNodes(): Promise<GraphNode[]> {
    return [...this.nodes.values()];
  }

  async listEdges(): Promise<GraphEdge[]> {
    return [...this.edges.values()];
  }
}
