/**
 * Module: wiki-beta
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the WikiBeta domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type {
  WikiBetaPage,
  WikiBetaPageStatus,
  WikiBetaPageTreeNode,
} from "../domain/entities/wiki-beta-page.types";

export type {
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryFieldType,
  WikiBetaLibraryRow,
  WikiBetaLibraryStatus,
} from "../domain/entities/wiki-beta-library.types";

export type {
  WikiBetaWorkspaceRef,
  WikiBetaWorkspaceContentNode,
  WikiBetaContentItemNode,
} from "../domain/entities/wiki-beta.types";
