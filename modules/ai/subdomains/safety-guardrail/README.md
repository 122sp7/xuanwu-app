# safety-guardrail subdomain

## Purpose

The safety-guardrail subdomain owns AI safety rules, content protection constraints, and execution boundaries.
It ensures downstream AI capabilities remain policy-aligned and risk-aware.

## Responsibility

- define safety constraints and guardrail decisions
- validate risky or policy-sensitive AI interactions
- provide a bounded safety capability to downstream consumers

## Non-Responsibility

- no full prompt orchestration ownership
- no provider telemetry ownership
- no product-specific workflow state mutation

## Dependency direction

`api -> application -> domain`