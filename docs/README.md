# Xuanwu Strategic Architecture Docs

## Purpose

This folder is the strategic documentation set for **Hexagonal Architecture with Domain-Driven Design**.

## Reading Guide

```mermaid
flowchart TD
  A[README] --> B[architecture-overview.md]
  B --> C[subdomains.md]
  C --> D[bounded-contexts.md]
  D --> E[context-map.md]
  E --> F[ubiquitous-language.md]
  F --> G[strategic-patterns.md]
  G --> H[integration-guidelines.md]
  D --> I[contexts/_template.md]
  I --> J[contexts/*.md]
  E --> K[decisions/README.md]
```

## Rules

1. Update `bounded-contexts.md` and `context-map.md` together when boundaries change.
2. Update `ubiquitous-language.md` before introducing new domain terms.
3. Keep cross-context collaboration API-first and explicit.
4. Record strategic changes as ADRs under `decisions/`.

