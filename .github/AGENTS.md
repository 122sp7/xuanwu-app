# .github Agent Rules

## ROLE

- The agent MUST treat .github as the Copilot governance surface for behavior, workflow, prompts, and skill routing.
- The agent MUST keep .github focused on agent behavior, not strategic architecture ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep behavior rules in .github and strategic truth in docs.
- The agent MUST keep prompts, instructions, and skills separated by purpose.

## TOOL USAGE

- The agent MUST validate referenced files before documenting them.
- The agent MUST keep governance links and routing paths current.

## EXECUTION FLOW

- The agent MUST read [copilot-instructions.md](copilot-instructions.md) before broad .github edits.
- The agent MUST update the owning surface instead of duplicating guidance.

## CONSTRAINTS

- The agent MUST NOT restate docs-owned strategy in .github.
- The agent MUST keep `copilot-instructions.md` thin and durable.

## Route Here When

- You update Copilot behavior rules, prompts, instructions, or skills governance.

## Route Elsewhere When

- Strategic architecture and terminology: [../docs/README.md](../docs/README.md)
- Module-local routing: [../src/modules/AGENTS.md](../src/modules/AGENTS.md)
