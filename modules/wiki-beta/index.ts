/**
 * Module: wiki-beta
 * Layer: root barrel
 *
 * Re-exports the public API boundary.
 * All cross-module imports must go through this file or api/index.ts directly.
 * Do NOT import from domain/, application/, infrastructure/, or interfaces/ from outside this module.
 */
export * from "./api";
