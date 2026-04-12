/**
 * Module: notion
 * Layer: api (top-level public boundary)
 * Purpose: Unified public boundary for notion subdomains.
 *          External consumers (workspace, other modules) must only import from here.
 *          Browser-facing route composition should prefer workspace/api when
 *          workspace is the orchestration owner.
 *
 * Notes:
 * - This file exposes only stable cross-module semantic capabilities.
 * - Internal factory wiring remains private to notion subdomains/interfaces
 *   until a context-wide server-only contract is explicitly justified.
 */

// ── Context-wide published language ───────────────────────────────────────────
export type {
  KnowledgeArtifactReference,
  AttachmentReference,
  TaxonomyHint,
} from "../domain/published-language";

export type { NotionDomainEvent } from "../domain/events";

// ── knowledge subdomain ───────────────────────────────────────────────────────
export * from "../subdomains/knowledge/api";

// ── authoring subdomain ───────────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the knowledge-base convergence.
export * from "../subdomains/authoring/api";

// ── collaboration subdomain ───────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the collaboration convergence.
export * from "../subdomains/collaboration/api";

// ── database subdomain ────────────────────────────────────────────────────────
// Migration state: subdomain-owned composition remains private; root api only
// aggregates stable public capabilities during the database convergence.
export * from "../subdomains/database/api";

// ── taxonomy subdomain ────────────────────────────────────────────────────────
// Tier 2 — classification hierarchy and semantic organization
export * from "../subdomains/taxonomy/api";

// ── relations subdomain ───────────────────────────────────────────────────────
// Tier 2 — backlinks, forward links, and reference graphs
export * from "../subdomains/relations/api";
