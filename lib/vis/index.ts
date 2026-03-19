/**
 * @module lib/vis
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
 *   import { DataSet, Network, Timeline, Graph3d } from "@/lib/vis";
 */

export * from "./data";
export * from "./network";
export { Timeline, Graph2d } from "./timeline";
export type { TimelineOptions, Graph2dOptions } from "./timeline";
export * from "./graph3d";
