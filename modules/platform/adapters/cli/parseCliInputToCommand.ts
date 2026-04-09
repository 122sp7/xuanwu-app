/**
 * parseCliInputToCommand — CLI Input Parser
 *
 * Parses raw CLI arguments (argv array) into a typed PlatformCommand.
 * This is the driving adapter responsibility: translate external CLI input
 * into the platform's command contract without adding business logic.
 *
 * Rules:
 *   - Unknown command names must return a parse error, not throw
 *   - CLI adapter must not interpret command business rules
 *   - Produced PlatformCommand is passed unchanged to PlatformCommandPort
 *
 * @see adapters/cli/runPlatformCliCommand.ts — executes the parsed command
 * @see ports/input/index.ts — PlatformCommandPort
 */

// TODO: implement parseCliInputToCommand argv parser
