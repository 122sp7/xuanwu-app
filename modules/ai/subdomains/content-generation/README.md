# content-generation subdomain

## Purpose

The content-generation subdomain owns provider-agnostic text generation capabilities for the AI bounded context.
It focuses on producing summaries, drafts, and free-form generated output from validated inputs.

## Responsibility

- define content-generation contracts in domain language
- expose generation use cases through application and api boundaries
- support summarization and structured text generation inputs

## Non-Responsibility

- no prompt orchestration ownership
- no safety policy ownership
- no persistence or UI concerns

## Dependency direction

`api -> application -> domain`