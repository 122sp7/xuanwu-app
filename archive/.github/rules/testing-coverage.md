---
title: Test Coverage Requirements
impact: MEDIUM-HIGH
impactDescription: Ensures critical business logic is tested
tags: testing, coverage, requirements
---

## Test Coverage Requirements

**Impact: MEDIUM-HIGH**

Domain logic and use cases must have test coverage. Infrastructure and UI components have lower coverage requirements since they depend on external systems.

**Coverage priorities:**

| Layer | Priority | What to Test |
|-------|----------|--------------|
| Domain entities & services | HIGH | Business rules, state transitions, validation |
| Application use cases | HIGH | Orchestration logic, error paths, edge cases |
| Infrastructure | MEDIUM | Integration with Firebase/external services |
| Interfaces (components) | MEDIUM | User-facing behavior, not implementation details |

**Test naming convention:**

```typescript
// Use descriptive names that explain the scenario
describe("createTask", () => {
  it("returns success with valid input", async () => { ... });
  it("returns DomainError when title is empty", async () => { ... });
  it("returns DomainError when workspace does not exist", async () => { ... });
});
```

**Guidelines:**
- Test behavior, not implementation details
- Mock repository interfaces in use-case tests (domain layer stays pure)
- Use `infrastructure/default/` or `infrastructure/memory/` implementations for integration tests
- Don't test framework behavior (React rendering, Firebase SDK) — test your logic
