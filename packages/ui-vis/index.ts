/**
 * @module ui-vis
 * Graph, network, and timeline visualization via vis.js family.
 *
 * Network — interactive force-directed graph; mount to a DOM container via
 *   new Network(container, { nodes, edges }, options).
 * DataSet / DataView — reactive in-memory data collections; trigger automatic
 *   Network re-renders on add / update / remove.
 * Timeline — horizontal event and range visualization mounted similarly to Network.
 *
 * IMPORTANT: CSS must be imported separately in the consuming module:
 *   import 'vis-network/styles/vis-network.css'
 *   import 'vis-timeline/styles/vis-timeline-graph2d.css'
 *
 * "use client" required — all classes depend on browser DOM APIs.
 *
 * Alias: @ui-vis
 */

// ─── Network (Graph Visualization) ───────────────────────────────────────────

export { Network } from "vis-network";

// ─── Data Collections ────────────────────────────────────────────────────────

export { DataSet } from "vis-data";
export { DataView } from "vis-data";

// ─── Timeline ────────────────────────────────────────────────────────────────

export { Timeline } from "vis-timeline/peer";

// ─── Types ───────────────────────────────────────────────────────────────────

export type {
  Options as VisNetworkOptions,
  Node as VisNode,
  Edge as VisEdge,
} from "vis-network";

export type {
  DataSetOptions,
} from "vis-data";

export type {
  TimelineOptions,
  TimelineItem,
  TimelineGroup,
} from "vis-timeline/peer";
