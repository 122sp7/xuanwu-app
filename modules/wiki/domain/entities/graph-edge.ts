/**
 * modules/wiki — domain entity: GraphEdge
 *
 * Represents a directional relationship between two GraphNodes.
 * Per aggregates.md: each edge has a lifecycle (pending → active → inactive → removed).
 */

import type { ID } from "@shared-types";

/** The nature of an edge between two nodes (AGENT.md: use EdgeType, not LinkType) */
export type EdgeType =
  | "explicit"    // manually created by the user
  | "implicit"    // suggested / computed by AI
  | "hierarchy";  // parent → child page relationship

/** Lifecycle states of a GraphEdge (aggregates.md) */
export type EdgeStatus = "pending" | "active" | "inactive" | "removed";

/**
 * A directed edge in the knowledge graph (aggregates.md).
 * AGENT.md: use GraphEdge — never Link, Connection, or Relation.
 */
export interface GraphEdge {
  /** Unique identifier of this edge */
  readonly id: ID;
  /** ID of the source GraphNode (aggregates.md: sourceNodeId) */
  readonly sourceNodeId: ID;
  /** ID of the target GraphNode (aggregates.md: targetNodeId) */
  readonly targetNodeId: ID;
  /** Relationship type (aggregates.md: edgeType, not type) */
  readonly edgeType: EdgeType;
  /** Lifecycle status (aggregates.md) */
  readonly status?: EdgeStatus;
  /** Actor who created this edge */
  readonly createdByUserId?: string;
}
