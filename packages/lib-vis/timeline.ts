/**
 * @module libs/vis/timeline
 * Thin wrapper for vis-timeline.
 *
 * vis-timeline provides interactive, fully customizable timelines and 2D graphs
 * with items, ranges, and comprehensive event handling.
 *
 * Usage:
 *   import { Timeline } from "@/libs/vis/timeline";
 *   const timeline = new Timeline(container, items, options);
 */

export { Timeline, Graph2d } from "vis-timeline";
export * from "vis-timeline";

import type { Timeline as TimelineType, Graph2d as Graph2dType } from "vis-timeline";

type TimelineClass = typeof TimelineType;
type Graph2dClass = typeof Graph2dType;

export type TimelineOptions = InstanceType<TimelineClass> extends { setOptions(opts: infer T): void } ? T : never;
export type Graph2dOptions = InstanceType<Graph2dClass> extends { setOptions(opts: infer T): void } ? T : never;
