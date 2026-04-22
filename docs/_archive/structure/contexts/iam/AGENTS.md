# IAM Context Agent Rules

## ROLE

- The agent MUST treat this directory as the documentation authority for the iam context inside docs/structure/contexts.
- The agent MUST keep iam framed as identity, access, account, and organization owner.

## DOMAIN BOUNDARIES

- The agent MUST preserve iam ownership for identity, access-control, tenant, security-policy, account, organization, session, consent, and secret-governance.
- The agent MUST NOT let iam absorb billing, AI policy, or content ownership.

## TOOL USAGE

- The agent MUST align context docs with strategic docs before local edits.
- The agent MUST keep cross-context references explicit and valid.

## EXECUTION FLOW

- The agent MUST identify whether the question is identity, access, account, organization, tenant, or routing.
- The agent MUST update local context docs without competing with root strategic docs.

## CONSTRAINTS

- The agent MUST preserve iam as the source of actor reference, tenant scope, and access decision language.
- The agent MUST avoid implementation-level framework detail in context governance docs.

## Route Here When

- You document iam context ownership, boundaries, or cross-context routing.

## Route Elsewhere When

- Root strategic ownership decisions: [../../../README.md](../../../README.md)
