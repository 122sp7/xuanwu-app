# Event Core (Scaffold)

`core/event-core` is a minimal scaffold for event lifecycle capabilities.
It keeps only the core dependency path and basic module boundaries.

## Dependency Direction
- Interfaces -> Application -> Domain <- Infrastructure
- Domain is framework-free
- Event bus and persistence are adapter-side capabilities

## Current Minimal Structure
- application/use-cases
- domain/entities
- domain/repositories
- domain/value-objects
- infrastructure/persistence
- infrastructure/repositories
- interfaces/api

## Not Included In This Phase
- application/dto
- application/mappers
- application/services
- domain/aggregates
- domain/domain-services
- domain/factories
- domain/exceptions
- domain/shared
- infrastructure/external
- infrastructure/mappers
- interfaces/serializers

## Core Flow
```mermaid
flowchart TD
    A[Capture Event] --> B[Persist Event]
    B --> C[Dispatch Event]
    C --> D[Observe Delivery]
    D --> E[Correlate By Aggregate]
```

## What Is Intentionally Left As Skeleton
- Use-cases keep method signatures and orchestration points only
- Domain keeps event invariants and value semantics only
- Infrastructure keeps adapter boundaries and payload shapes only
- Interfaces keep transport entry contracts only

## Fill-In Order (Recommended)
1. Domain event invariants and metadata semantics
2. Application orchestration and repository composition
3. Infrastructure adapter implementation
4. Interface validation and serialization