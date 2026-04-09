/**
 * workspace public API boundary.
 *
 * Cross-module and app-layer consumers must import from here instead of
 * reaching into interfaces/api directly.
 *
 * This barrel delegates to modules/workspace/interfaces/api which is the
 * single canonical public surface for the workspace bounded context.
 */

export * from "../interfaces/api";