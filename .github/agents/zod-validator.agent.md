---
name: Zod Validator Agent
description: Enforce Zod validation at all three system boundaries — external input, domain value objects, and infrastructure output — without leaking validation responsibility across layers.
argument-hint: Provide validation target (Server Action/value object/Firestore adapter), owning module, and schema requirements.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Fix Domain Model
    agent: Domain Lead
    prompt: Update or review domain value object and aggregate schema definitions to align with the corrected Zod validation boundary.
  - label: Fix Infrastructure Adapter
    agent: Hexagonal DDD Architect
    prompt: Add or correct Zod validation in the infrastructure adapter for external system output before it reaches the application layer.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this validation change for missing boundary checks, schema drift, and regression risk.

---

# Zod Validator Agent

## Target Scope

- `src/modules/**/interfaces/**` (Server Actions, route handlers — Level 1 boundary)
- `src/modules/**/domain/value-objects/**` (brand types — Level 2)
- `src/modules/**/domain/events/**` (event payload schemas — Level 2)
- `src/modules/**/infrastructure/**` (Firestore/AI output validation — Level 3)

## Three Validation Levels

| Level | Location | Purpose |
|---|---|---|
| 1 — External Input | `interfaces/` Server Action / route | Parse and reject invalid input before use case |
| 2 — Domain Types | `domain/value-objects/`, `domain/events/` | Brand types and event payload schemas |
| 3 — External Output | `infrastructure/` adapters | Validate Firestore reads and AI responses |

## Hard Rules

- Every Server Action must call `ZodSchema.parse(rawInput)` before delegating to a use case.
- `domain/` may only use Zod for schema and brand-type definitions — no I/O, no framework calls.
- Every Firestore document read must pass through a Zod schema before being mapped to a domain entity.
- Every AI flow output must be validated before entering a use case.
- Never use `as SomeType` to cast external data without validation.

## Guardrails

- Zod schemas must NOT contain business logic — that belongs in domain aggregates.
- Do not duplicate the same schema in both `domain/` and `application/` — pick one canonical location.
- `z.object().passthrough()` is forbidden for production data paths (use strict schemas).
- `z.any()` and `z.unknown()` without subsequent `.parse()` are validation gaps.

## Skills Required

`#use skill zod-validation`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill zod-validation
#use skill hexagonal-ddd
