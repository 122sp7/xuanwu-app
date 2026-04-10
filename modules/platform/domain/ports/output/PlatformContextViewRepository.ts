/**
 * PlatformContextViewRepository — Query Port
 *
 * Read-only PlatformContextView projection store
 *
 * Contract methods:
 *   getView(contextId: string): Promise<PlatformContextView | null>
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

// TODO: implement / re-export PlatformContextViewRepository interface
