/**
 * Module: file
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the File domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type { File, FileStatus } from "../domain/entities/File";
export type { FileVersion, FileVersionStatus } from "../domain/entities/FileVersion";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getWorkspaceFiles } from "../interfaces/queries/file.queries";
