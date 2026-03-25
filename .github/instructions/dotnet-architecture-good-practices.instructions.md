---
name: 'Dotnet Architecture Guidelines'
description: "DDD and .NET architecture guidelines"
applyTo: '**/*.{cs,csproj,razor}'
---

# DDD Systems and .NET Guidelines (Condensed)

Use these rules for .NET code generation and review.

## Mandatory Pre-Coding Analysis

Before implementation, state briefly:
1. Which DDD concepts apply (aggregate, value object, domain event, service).
2. Which layer changes (Domain/Application/Infrastructure).
3. Which business invariants must be preserved.
4. Which tests will be added (`MethodName_Condition_ExpectedResult`).

If this is unclear, request clarification.

## Core Architecture Rules

- Keep ubiquitous language consistent in names and docs.
- Domain layer owns business rules and invariants.
- Application layer orchestrates use-cases and validation.
- Infrastructure implements ports/repositories and adapters.
- Depend on abstractions (DIP), keep single responsibility (SRP).

## .NET Engineering Rules

- Prefer async/await for I/O-bound operations.
- Use DI constructor injection.
- Use clear exception handling and logging policy.
- Use modern C# features when they improve clarity.

## Security and Compliance

- Enforce authorization at aggregate/application boundaries.
- Preserve auditable domain events for critical state changes.
- Handle sensitive/regulated data explicitly (PCI/SOX/LGPD context when relevant).

## Financial Rules (When Applicable)

- Use `decimal` for money.
- Keep transaction boundaries explicit.
- Keep audit trail for financial operations.
- Encapsulate calculations in domain services/value objects.

## Testing Standard

Naming:
- `MethodName_Condition_ExpectedResult()`

Required categories:
- Unit tests for domain logic.
- Integration tests for persistence/boundaries.
- Acceptance tests for end-to-end scenarios as needed.

## Minimal Delivery Checklist

- [ ] Domain boundaries and invariants are explicit.
- [ ] SOLID adherence reviewed (at least SRP/DIP).
- [ ] Validation and error paths are covered.
- [ ] Test names follow required convention.
- [ ] Security/compliance impact reviewed.
- [ ] Performance implications considered.

## Anti-Noise Rules

- Avoid repeating long theory in PR output.
- Keep analysis concise and decision-oriented.
- Prefer short checklists over duplicated prose.
- Link detailed references instead of copying handbooks.
