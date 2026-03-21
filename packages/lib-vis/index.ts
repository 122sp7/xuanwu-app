/**
 * @package lib-vis
 * Vis.js visualization library — DataSet, Network, Timeline, Graph3d.
 * Client-side only. Do NOT import from Server Components.
 *
 * Import via: import { DataSet, Network, Timeline } from "@lib-vis"
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
