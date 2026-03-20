/**
 * @module libs/vis/graph3d
 * Thin wrapper for vis-graph3d.
 *
 * vis-graph3d provides interactive 3D graph visualization with surfaces,
 * lines, dots, and blocks with extensive styling options.
 *
 * Usage:
 *   import { Graph3d } from "@/libs/vis/graph3d";
 *   const graph3d = new Graph3d(container, data, options);
 */

import * as VisGraph3dNamespace from "vis-graph3d";

export { Graph3d } from "vis-graph3d";
export * from "vis-graph3d";

const visGraph3dRuntime = VisGraph3dNamespace as unknown as {
	Graph3dCamera?: unknown;
	Graph3dFilter?: unknown;
	Graph3dPoint2d?: unknown;
	Graph3dPoint3d?: unknown;
	Graph3dSlider?: unknown;
	Graph3dStepNumber?: unknown;
};

export const Graph3dCamera = visGraph3dRuntime.Graph3dCamera;
export const Graph3dFilter = visGraph3dRuntime.Graph3dFilter;
export const Graph3dPoint2d = visGraph3dRuntime.Graph3dPoint2d;
export const Graph3dPoint3d = visGraph3dRuntime.Graph3dPoint3d;
export const Graph3dSlider = visGraph3dRuntime.Graph3dSlider;
export const Graph3dStepNumber = visGraph3dRuntime.Graph3dStepNumber;

type Graph3dClass = typeof import("vis-graph3d").Graph3d;
export type Graph3dOptions = InstanceType<Graph3dClass> extends { setOptions(opts: infer T): void } ? T : never;
