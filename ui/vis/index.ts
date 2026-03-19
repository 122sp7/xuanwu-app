/**
 * @module ui/vis
 * React components for vis.js visualization.
 *
 * Provides ready-to-use React components that wrap vis.js libraries:
 *   - VisNetwork  — Interactive network graph
 *   - VisTimeline — Interactive timeline
 *
 * All components are client-only ("use client").
 *
 * Usage:
 *   import { VisNetwork, VisTimeline } from "@/ui/vis";
 */

"use client";

export { VisNetwork } from "./network";
export type { VisNetworkProps } from "./network";

export { VisTimeline } from "./timeline";
export type { VisTimelineProps } from "./timeline";
