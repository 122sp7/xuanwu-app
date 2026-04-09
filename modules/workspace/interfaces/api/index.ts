/**
 * workspace interfaces/api aggregate export.
 *
 * Internal driving-adapter aggregation for the workspace bounded context.
 * External app-layer and cross-module consumers must import from
 * `@/modules/workspace/api`, which is the canonical public boundary.
 */

export * from "./contracts";
export * from "./facades";
