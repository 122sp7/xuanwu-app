/**
 * Module: notion
 * Layer: api (top-level public boundary)
 * Purpose: Unified ACL for all notion subdomains.
 *          External consumers (app/, other modules) must only import from here.
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
// Migration-Pending: full implementation from modules/knowledge-base/
export * from "../subdomains/authoring/api";

// ── collaboration subdomain ───────────────────────────────────────────────────
// Migration-Pending: full implementation from modules/knowledge-collaboration/
export * from "../subdomains/collaboration/api";

// ── database subdomain ────────────────────────────────────────────────────────
// Migration-Pending: full implementation from modules/knowledge-database/
export * from "../subdomains/database/api";

// ── taxonomy subdomain ────────────────────────────────────────────────────────
// Tier 2 — classification hierarchy and semantic organization
export * from "../subdomains/taxonomy/api";

// ── relations subdomain ───────────────────────────────────────────────────────
// Tier 2 — backlinks, forward links, and reference graphs
export * from "../subdomains/relations/api";
