/**
 * modules/knowledge-graph — domain entity: GraphViewConfig
 *
 * Describes the visual configuration for rendering a knowledge graph.
 * This is a pure data type; rendering logic lives in the interfaces layer.
 */

import type { ID } from "@shared-types";

/** Layout algorithm for positioning nodes */
export type GraphLayout = "force-directed" | "hierarchical" | "radial";

/** Visual configuration for a knowledge-graph view */
export interface GraphViewConfig {
  /** Identifier for this configuration */
  readonly id: ID;
  /** Human-readable name */
  readonly label: string;
  /** Layout algorithm to apply */
  readonly layout: GraphLayout;
  /** IDs of nodes that should be visible; empty means show all */
  readonly visibleNodeIds: ID[];
  /** ID of the node to center / focus the view on (optional) */
  readonly focusNodeId?: ID;
  /** Whether to show edge labels */
  readonly showEdgeLabels: boolean;
  /** Maximum graph depth to render from the focus node */
  readonly maxDepth: number;
}
