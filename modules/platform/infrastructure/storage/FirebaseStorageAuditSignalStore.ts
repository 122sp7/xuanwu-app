/**
 * FirebaseStorageAuditSignalStore — Storage Adapter (Driven Adapter)
 *
 * Implements: AuditSignalStore
 *
 * Writes immutable audit signals to Firestore (or Cloud Storage for large payloads).
 * Audit records must be append-only; no updates or deletes.
 *
 * Responsibilities:
 *   - Accept a normalised audit signal record
 *   - Write to the audit-log Firestore collection with server timestamp
 *   - Return void on success; propagate typed error on failure
 *
 * Rules:
 *   - Must not expose Firestore types outside this file
 *   - Collection path and index strategy are documented in docs/repositories.md
 *   - This adapter must never delete or overwrite existing audit records
 *
 * @see ports/output/index.ts — AuditSignalStore interface
 * @see subdomains/audit-log/ — audit-log subdomain
 * @see docs/repositories.md — audit-log collection contract
 */

// TODO: implement FirebaseStorageAuditSignalStore
