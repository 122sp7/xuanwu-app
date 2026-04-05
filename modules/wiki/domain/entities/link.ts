/**
 * modules/wiki — domain entity: Link (deprecated)
 *
 * @deprecated Use GraphEdge and EdgeType from "./graph-edge" instead.
 * AGENT.md: the correct term is GraphEdge, not Link.
 * This file is a shim for external consumers during the rename transition.
 */
export type { GraphEdge as Link, EdgeType as LinkType } from "./graph-edge";
