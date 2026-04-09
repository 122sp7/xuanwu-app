/**
 * AuditSignalStore — Non-Repository Output Port
 *
 * Writes immutable audit signals to the audit-log store
 *
 * Contract methods:
 *   write(signal: Record<string, unknown>): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export AuditSignalStore interface
