/**
 * modules/wiki — domain entity: GraphNode
 *
 * Represents a node in the knowledge graph.  A node typically corresponds
 * to a Page, but may also represent a Tag or an external resource.
 */

import type { ID } from "@shared-types";

/** Supported node categories in the knowledge graph */
export type GraphNodeType = "page" | "tag" | "attachment";

/** A vertex in the knowledge graph */
export interface GraphNode {
  /** Unique identifier (mirrors the Page / Tag ID) */
  readonly id: ID;
  /** Human-readable label displayed in graph views */
  readonly label: string;
  /** Category of the node */
  readonly type: GraphNodeType;
}
