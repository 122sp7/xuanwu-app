/**
 * workspace interfaces/api aggregate export.
 *
 * Public API boundary for contracts, facades, queries, actions, and runtime.
 * App-layer and cross-module consumers should import from this path for
 * domain contracts, facades, and server-side query/command surfaces.
 *
 * For web UI components, hooks, and navigation helpers, use
 * modules/workspace/interfaces/web instead.
 */

export * from "./contracts";
export * from "./facades";
