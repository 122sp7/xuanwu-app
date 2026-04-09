# Strategic ADR Index

## ADR Flow

```mermaid
flowchart TD
  A[Strategic change identified] --> B[Draft ADR]
  B --> C[Review impact on subdomains/bounded-contexts/context-map]
  C --> D[Approve]
  D --> E[Update docs + contracts]
```

## Rules

1. Every strategic boundary change requires an ADR.
2. ADR must list affected contexts and published language contracts.
3. ADR status must be one of: Proposed, Accepted, Superseded.

