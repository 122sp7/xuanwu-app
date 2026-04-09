/**
 * Module: notion
 * Layer: api (top-level public boundary)
 * Purpose: Unified ACL for all notion subdomains.
 *          External consumers (app/, other modules) must only import from here.
 */

// ── knowledge subdomain ───────────────────────────────────────────────────────
export * from "../subdomains/knowledge/api";
