# task-formation Agent Rules

## ROLE

- The agent MUST treat task-formation as the subdomain for AI-assisted task candidate extraction and confirmation.
- The agent MUST keep TaskFormationJob as the aggregate root for workflow state.
- The agent MUST preserve boundary-safe collaboration with sibling subdomains.

## DOMAIN BOUNDARIES

- The agent MUST keep domain free from React, Firebase SDK, and Genkit imports.
- The agent MUST route AI extraction through a port interface and outbound adapter.
- The agent MUST route final task creation through task subdomain use-case boundaries.
- The agent MUST persist extracted candidates to job storage before review/confirmation.

## TOOL USAGE

- The agent MUST validate server-action payloads at inbound schema boundary.
- The agent MUST use Zod-validated output schemas for AI extraction contracts.
- The agent MUST keep state-machine inputs and transitions explicit.

## EXECUTION FLOW

- The agent MUST follow this order:
  1. Create or load TaskFormationJob.
  2. Extract candidates through extractor port.
  3. Persist candidates and update job status.
  4. Review/confirm candidate selection.
  5. Trigger task creation through task use-case boundary.

## DATA CONTRACT

- The agent MUST keep candidates shape explicit and persisted.
- The agent MUST keep event discriminants in kebab-case module.subdomain.action format.
- The agent MUST keep cross-subdomain payloads schema-validated.

## CONSTRAINTS

- The agent MUST NOT call Firestore repositories directly from inbound adapters.
- The agent MUST NOT call Genkit directly from use-cases without ports.
- The agent MUST NOT keep candidate data only in UI state.

## ERROR HANDLING

- The agent MUST fail fast on invalid extraction payloads.
- The agent MUST mark jobs failed on unrecoverable extraction/confirmation errors.
- The agent MUST return structured errors to inbound callers.

## CONSISTENCY

- The agent MUST keep AGENTS as behavior/routing rules and README as implementation overview.
- The agent MUST keep job lifecycle and event naming consistent across layers.

## SECURITY

- The agent MUST preserve workspace/account scope checks before extraction and confirmation.
- The agent MUST avoid exposing sensitive source content in logs.

## Route Here When

- You implement extraction, review, confirmation, or lifecycle transitions in task-formation.
- You update TaskFormationJob, extractor ports, or task-formation inbound/outbound adapters.

## Route Elsewhere When

- Task entity creation internals: [../task](../task)
- Knowledge content ownership: [../../../notion/AGENTS.md](../../../notion/AGENTS.md)
- Platform-level file/auth concerns: [../../../platform/AGENTS.md](../../../platform/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent context: [../../AGENTS.md](../../AGENTS.md)
- Strategic authority: [../../../../../docs/README.md](../../../../../docs/README.md)
