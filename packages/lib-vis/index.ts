/**
 * @package lib-vis
 * Unified Vis.js visualization library barrel.
 *
 * Provides thin wrappers for all vis.js core libraries:
 *   - vis-data      — DataSet/DataView for structured data management
 *   - vis-network   — Interactive network graphs with physics
 *   - vis-timeline  — Interactive timelines and 2D graphs
 *   - vis-graph3d   — Interactive 3D graph visualization
 *
 * All exports are client-side. Do not import from Server Components
 * without proper use-client boundary.
 *
 * Usage:
 *   import { DataSet, Network, Timeline, Graph3d } from "@lib-vis";
 */

export * from "./data";
export { Network } from "./network";
export {
  NetworkImages,
  networkDOTParser,
  parseDOTNetwork,
  parseGephiNetwork,
  networkGephiParser,
  networkOptions,
} from "./network";
export type { NetworkOptions } from "./network";
export { Timeline, Graph2d } from "./timeline";
export type { TimelineOptions, Graph2dOptions } from "./timeline";
export {
  Graph3d,
  Graph3dCamera,
  Graph3dFilter,
  Graph3dPoint2d,
  Graph3dPoint3d,
  Graph3dSlider,
  Graph3dStepNumber,
} from "./graph3d";
export type { Graph3dOptions } from "./graph3d";
