/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Explicit exports only — no wildcard re-exports of application/ (ADR 1404/5203).
 */

// ── Shell command catalog ─────────────────────────────────────────────────────
export {
  listShellCommandCatalogItems,
  type ShellCommandCatalogItem,
} from "../application/services/shell-command-catalog";
