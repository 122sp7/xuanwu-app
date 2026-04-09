# ADR 0001: Use Hexagonal Architecture

- Status: Accepted

## Decision

Adopt hexagonal architecture with ports in core and adapters at boundaries.

## Rules

1. Domain depends only on abstractions.
2. Adapters implement ports and isolate framework/infrastructure.
3. Inbound interfaces map transport concerns to use cases.

