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

type TimelineClass = typeof import("vis-timeline").Timeline;
type Graph2dClass = typeof import("vis-timeline").Graph2d;

export type TimelineOptions = InstanceType<TimelineClass> extends { setOptions(opts: infer T): void } ? T : never;
export type Graph2dOptions = InstanceType<Graph2dClass> extends { setOptions(opts: infer T): void } ? T : never;
