# context-assembly subdomain

## Purpose

The context-assembly subdomain owns the preparation of ranked, bounded, model-ready context packages.
It selects and shapes input context so downstream generation and distillation can run with predictable quality and token cost.

## Responsibility

- assemble token-budgeted context inputs
- rank and combine candidate evidence
- produce model-ready context payloads for downstream use cases

## Non-Responsibility

- no final content generation ownership
- no policy evaluation ownership
- no observability storage responsibilities

## Dependency direction

`api -> application -> domain`