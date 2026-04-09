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

// ── database subdomain ───────────────────────────────────────────────────────
// Migration-Pending: full implementation from modules/knowledge-database/
export * from "../subdomains/database/api";
