# memory-context subdomain

## Purpose

The memory-context subdomain owns reusable AI memory and contextual carry-forward semantics.
It helps preserve distilled, relevant prior context for future reasoning and generation without leaking product-specific conversation ownership.

## Responsibility

- define memory-context contracts and relevance rules
- keep reusable contextual state available for downstream AI workflows
- prefer distilled or bounded context over uncontrolled raw history

## Non-Responsibility

- no chat product ownership
- no notebook-local conversation lifecycle ownership
- no storage adapter implementation in the domain layer

## Dependency direction

`api -> application -> domain`