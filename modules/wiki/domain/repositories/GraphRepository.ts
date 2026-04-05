/**
 * modules/wiki — domain/repositories
 * Purpose: Port interfaces for knowledge-graph persistence.
 *
 * Method names follow aggregates.md:
 *   saveNode(), saveEdge(), findNodeById(), findEdgesByTarget()
 *
 * The infrastructure layer implements these; the application layer depends
 * only on these ports (Dependency Inversion Principle).
 */

import type { GraphNode } from "../entities/graph-node";
import type { GraphEdge, EdgeType } from "../entities/graph-edge";

export interface GraphRepository {
  /** Persist or update a node (upsert by id). aggregates.md: saveNode() */
  saveNode(node: GraphNode): Promise<void>;

  /** Persist a new edge between two nodes. aggregates.md: saveEdge() */
  saveEdge(edge: GraphEdge): Promise<void>;

  /** Return a node by its id. aggregates.md: findNodeById() */
  findNodeById(id: string): Promise<GraphNode | null>;

  /** Return all edges originating from a given node. */
  findEdgesBySourceId(sourceId: string): Promise<GraphEdge[]>;

  /** Return all edges pointing to a given node (backlinks). aggregates.md: findEdgesByTarget() */
  findEdgesByTarget(targetId: string): Promise<GraphEdge[]>;

  /** Return all edges with the given type. */
  findEdgesByType(type: EdgeType): Promise<GraphEdge[]>;

  /** Return all nodes in the graph. */
  listNodes(): Promise<GraphNode[]>;

  /** Return all edges in the graph. */
  listEdges(): Promise<GraphEdge[]>;
}
