/**
 * modules/wiki — domain entity: GraphNode
 *
 * Represents a node in the knowledge graph.  A node typically corresponds
 * to a KnowledgePage but may also represent a Tag or an external resource.
 *
 * Ubiquitous Language: use `GraphNode` and `NodeType`.
 * PROHIBITED: Node, WikiNode, Page (in graph context); NodeKind, PageType.
 */

import type { ID } from "@shared-types";

/** Lifecycle state of a GraphNode */
export type NodeStatus =
  | "draft"     // created but not yet surfaced to the graph
  | "active"    // visible and traversable
  | "archived"; // removed from active traversal

/** Semantic category of a GraphNode */
export type NodeType = "page" | "tag" | "attachment";

/** A vertex in the knowledge graph */
export interface GraphNode {
  /** Unique identifier (mirrors the KnowledgePage / Tag ID) */
  readonly id: ID;
  /** Human-readable title displayed in graph views */
  readonly title: string;
  /** Semantic category of the node */
  readonly nodeType: NodeType;
  /** Lifecycle state */
  readonly status: NodeStatus;
  /** Workspace this node belongs to (optional until workspace integration is complete) */
  readonly workspaceId?: string;
  /** Organization this node belongs to (optional until workspace integration is complete) */
  readonly organizationId?: string;
  /** IDs of outbound edges from this node */
  readonly outboundEdgeIds?: string[];
}
