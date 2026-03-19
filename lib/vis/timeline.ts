/**
 * @module lib/vis/timeline
 * Thin wrapper for vis-timeline.
 *
 * vis-timeline provides interactive, fully customizable timelines and 2D graphs
 * with items, ranges, and comprehensive event handling.
 *
 * Usage:
 *   import { Timeline } from "@/lib/vis/timeline";
 *   const timeline = new Timeline(container, items, options);
 */

export { Timeline } from "vis-timeline/esnext";
export * from "vis-timeline/esnext/types";

export type TimelineOptions = InstanceType<typeof Timeline> extends { setOptions(opts: infer T): void } ? T : never;
