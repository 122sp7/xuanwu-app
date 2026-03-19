/**
 * @module lib/vis/graph3d
 * Thin wrapper for vis-graph3d.
 *
 * vis-graph3d provides interactive 3D graph visualization with surfaces,
 * lines, dots, and blocks with extensive styling options.
 *
 * Usage:
 *   import { Graph3d } from "@/lib/vis/graph3d";
 *   const graph3d = new Graph3d(container, data, options);
 */

export { Graph3d } from "vis-graph3d/esnext";
export * from "vis-graph3d/esnext/types";

export type Graph3dOptions = InstanceType<typeof Graph3d> extends { setOptions(opts: infer T): void } ? T : never;
