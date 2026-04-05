/**
 * modules/wiki — domain/repositories
 * Purpose: Port interfaces for knowledge-graph persistence.
 *
 * The infrastructure layer implements these; the application layer depends
 * only on these ports (Dependency Inversion Principle).
 */

import type { GraphNode } from "../entities/graph-node";
import type { GraphEdge, EdgeType } from "../entities/graph-edge";

export interface GraphRepository {
  /** Persist or update a node (upsert by id). */
  saveNode(node: GraphNode): Promise<void>;

  /** Persist a new or updated edge between two nodes. */
  saveEdge(edge: GraphEdge): Promise<void>;

  /** Return a node by its ID, or null if not found. */
  findNodeById(nodeId: string): Promise<GraphNode | null>;

  /** Return all edges pointing to a given node (backlinks / inbound edges). */
  findEdgesByTarget(targetNodeId: string): Promise<GraphEdge[]>;

  /** Return all edges originating from a given node. */
  findEdgesBySource(sourceNodeId: string): Promise<GraphEdge[]>;

  /** Return all edges with the given type. */
  findEdgesByType(type: EdgeType): Promise<GraphEdge[]>;

  /** Return all nodes in the graph. */
  listNodes(): Promise<GraphNode[]>;

  /** Return all edges in the graph. */
  listEdges(): Promise<GraphEdge[]>;
}
