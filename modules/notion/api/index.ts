/**
 * Module: notion
 * Layer: api (top-level public boundary)
 * Purpose: Unified ACL for all notion subdomains.
 *          External consumers (app/, other modules) must only import from here.
 */

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

// ── notes subdomain ───────────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/notes/api";

// ── templates subdomain ───────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/templates/api";

// ── attachments subdomain ─────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/attachments/api";

// ── automation subdomain ──────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/automation/api";

// ── knowledge-analytics subdomain ─────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/knowledge-analytics/api";

// ── knowledge-integration subdomain ───────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/knowledge-integration/api";

// ── knowledge-versioning subdomain ────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/knowledge-versioning/api";

// ── taxonomy subdomain ────────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/taxonomy/api";

// ── relations subdomain ───────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/relations/api";

// ── publishing subdomain ──────────────────────────────────────────────────────
// Stub — awaiting use case definition
export * from "../subdomains/publishing/api";
