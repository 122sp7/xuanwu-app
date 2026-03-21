/**
 * @package ui-vis
 * vis.js visualization React components.
 *
 * Provides interactive data visualization components built on top of vis.js:
 *   - VisNetwork  — Interactive network/graph visualization
 *   - VisTimeline — Interactive timeline visualization
 *
 * All components are client-only ("use client").
 *
 * Usage:
 *   import { VisNetwork, VisTimeline } from "@ui-vis";
 */

"use client";

export { VisNetwork } from "@/ui/vis/network";
export type { VisNetworkProps } from "@/ui/vis/network";

export { VisTimeline } from "@/ui/vis/timeline";
export type { VisTimelineProps } from "@/ui/vis/timeline";
