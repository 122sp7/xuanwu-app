/**
 * modules/wiki — domain entity: GraphEdge
 *
 * Represents a directed relationship between two GraphNodes in the
 * knowledge graph.
 *
 * Ubiquitous Language: use `GraphEdge` and `EdgeType`.
 * PROHIBITED: Link, Edge, Connection, Relation; LinkType, RelationType.
 */

import type { ID } from "@shared-types";

/** Lifecycle state of a GraphEdge */
export type EdgeStatus =
  | "pending"    // created but not yet confirmed
  | "active"     // confirmed and traversable
  | "inactive"   // temporarily disabled
  | "removed";   // logically deleted; cannot be restored

/** The semantic nature of the relationship between two GraphNodes */
export type EdgeType =
  | "explicit"    // manually created by the user (e.g. [[WikiLink]])
  | "implicit"    // suggested / computed by AI (AutoLink)
  | "hierarchy";  // parent → child page relationship (contains)

/** A directed edge in the knowledge graph */
export interface GraphEdge {
  /** Unique identifier of this edge */
  readonly id: ID;
  /** ID of the originating GraphNode */
  readonly sourceNodeId: ID;
  /** ID of the target GraphNode */
  readonly targetNodeId: ID;
  /** Semantic relationship type */
  readonly edgeType: EdgeType;
  /** Lifecycle state; defaults to "active" for auto-created edges */
  readonly status: EdgeStatus;
  /** ID of the user who created the edge; undefined for system-generated edges */
  readonly createdByUserId?: string;
}
