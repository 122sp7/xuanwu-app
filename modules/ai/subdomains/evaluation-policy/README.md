# evaluation-policy subdomain

## Purpose

The evaluation-policy subdomain owns AI quality rules, score interpretation, and regression evaluation criteria.
It provides the semantic policy layer for deciding whether outputs are acceptable, comparable, and safe to advance.

## Responsibility

- define evaluation criteria and quality thresholds
- compare outputs against expected policy checks
- support repeatable AI regression assessment

## Non-Responsibility

- no model execution ownership
- no provider telemetry implementation
- no UI or route concerns

## Dependency direction

`api -> application -> domain`