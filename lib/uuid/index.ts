/**
 * @module lib/uuid
 * Thin wrapper for uuid v13.
 *
 * Provides stable import paths for RFC-compliant UUID generation and
 * validation.  All functions are pure and safe to import from any layer.
 *
 *   v4  — random UUID (general-purpose, most common)
 *   v7  — time-ordered random UUID (preferred for database primary keys;
 *          monotonically increasing within the same millisecond)
 *
 * Usage:
 *   import { v4, v7 } from "@/lib/uuid";
 *   const id     = v4();            // "110e8400-e29b-41d4-a716-446655440000"
 *   const dbKey  = v7();            // time-sortable UUID for Firestore docs
 *   const isUUID = validate(id);    // true
 */

// ── Generators ─────────────────────────────────────────────────────────────
export { v4, v7 } from "uuid";

// ── Validation & parsing ───────────────────────────────────────────────────
export { validate, parse, stringify, version } from "uuid";

// ── Constants ──────────────────────────────────────────────────────────────
export { NIL, MAX } from "uuid";

// ── Rare generators (included for completeness) ────────────────────────────
// v1 — timestamp MAC-address; v6 — reordered timestamp; v3/v5 — name-based
export { v1, v3, v5, v6 } from "uuid";
