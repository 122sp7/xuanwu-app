# Strategic Patterns

## Pattern Flow

```mermaid
flowchart TD
  A[Need cross-context collaboration] --> B{Model compatibility?}
  B -- Yes --> C[Published Language]
  B -- No --> D[ACL]
  C --> E{Shared concept stable?}
  E -- Yes --> F[Shared Kernel]
  E -- No --> G[Customer/Supplier]
  G --> H[Version contract + monitor drift]
```

## Pattern Rules

1. Prefer **Published Language** for explicit contracts.
2. Use **ACL** when upstream/downstream models diverge.
3. Use **Shared Kernel** only for low-volatility, jointly-owned concepts.
4. Use **Open Host Service** for reusable external-facing integration contracts.
5. Apply **Conformist** only with explicit risk acceptance.

