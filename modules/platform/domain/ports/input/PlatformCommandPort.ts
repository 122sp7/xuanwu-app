/**
 * PlatformCommandPort — Input Port Interface
 *
 * The driving port for all command-oriented interactions with the platform module.
 * Implemented by: application/handlers/index.ts (command dispatch router)
 * Called by:      adapters/web/, adapters/cli/, api/facade.ts
 *
 * Contract:
 *   executeCommand<TCommand extends PlatformCommand>(command: TCommand): Promise<PlatformCommandResult>
 *
 * Invariants:
 *   - Commands are dispatched by name; the handler registry resolves the handler
 *   - Errors in business logic are returned as ok=false results, not thrown exceptions
 *   - The port interface itself has no knowledge of HTTP, CLI, or queue semantics
 *
 * @see ports/input/index.ts — re-exports this interface
 * @see application/handlers/ — implementations
 * @see docs/bounded-context.md — port contract rules
 */

// TODO: implement / re-export PlatformCommandPort interface
