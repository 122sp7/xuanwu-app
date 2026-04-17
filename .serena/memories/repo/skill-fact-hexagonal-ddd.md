# Skill Fact: Hexagonal Architecture with Domain-Driven Design

**Type**: Architectural design skill  
**Authority**: Martin Fowler (DDD); sairyss/domain-driven-hexagon (Context7-verified); Alistair Cockburn (Hexagonal Architecture)  
**Application Scope**: Module boundaries, bounded-context ownership, dependency direction, ports/adapters, cross-module API design  

---

## Dependency Direction Law (Immutable)

```
interfaces/ → application/ → domain/ ← infrastructure/
```

**Rule**: Dependencies point inward. The domain core depends on nothing external.

**Xuanwu Enforcement**:
- ESLint boundary rules: no infrastructure/domain imports; no main-domain-api imports from infrastructure
- Public API entry: `index.ts` at module root only
- Cross-module: use target module's `index.ts` boundary or events

---

## Core DDD + Hexagonal Synthesis

1. **Start from owning bounded context and ubiquitous language**, not from folders
2. **Keep business rules in domain objects and domain services**, not in routes, UI, or persistence code
3. **Use application for orchestration, transactions, command/query flow, and DTO translation**
4. **Place infrastructure and interfaces outside the core, depending inward**
5. **Expose cross-module collaboration only through the target module `index.ts` boundary or published events**
6. **Add abstractions only when they protect a real boundary**

---

## DDD Use-Case Decision Rules (Compact)

### When to Write a Use Case

| Condition | Use Case | Alternative |
|-----------|----------|-------------|
| Business behavior + flow logic | ✅ Yes | - |
| Multiple aggregates need to collaborate | ✅ Yes | - |
| Transaction or consistency required | ✅ Yes | - |
| Pure read without business logic | ❌ No | Query handler |
| UI state or interaction logic | ❌ No | Keep in interfaces/ |
| Single data op, no rule | ❌ No | Repository or domain service |

**Anti-Patterns**:
- `GetXxxUseCase` = usually a query smell
- Use case >200 lines = split or push down to domain
- Use case wrapping single call = over-design

---

## Hexagonal Layer Ownership

| Layer | Owns | Does NOT Own |
|-------|------|------|
| **domain/** | Business rules, entities, value objects, aggregates, events, repository interfaces | Framework, HTTP, Firebase, UI concerns |
| **application/** | Use-case orchestration, command/query contracts, DTO | Business rules, infrastructure details, UI logic |
| **infrastructure/** | Repository implementations, adapters, external APIs, persistence | Business rules, orchestration logic |
| **interfaces/** | Route handlers, UI components, Server Actions, input/output translation | Business decisions, domain logic |
| **index.ts** | Cross-module entry surface (exports only) | Internal implementation details |

---

## Port and Adapter Pattern

**Rule**: Core defines ports; outer layers implement adapters.

**When to create a port**:
1. Core must stay independent from framework, SDK, database, queue, or remote service
2. Dependency crosses process, runtime, or bounded-context boundaries
3. Multiple adapters are plausible now or later
4. Domain rule depends on external capability (domain-owned port appropriate)

**Xuanwu Practice**:
- Repository ports live in `domain/repositories/`
- External service ports live in `domain/ports/`
- Adapters implement in `infrastructure/repositories/` or `infrastructure/adapters/`
- Never call adapter directly; always route through port

---

## Cross-Module Collaboration

**Rule**: Only through target module's `index.ts` boundary or published events.

**Forbidden**:
- ❌ Importing peer `domain/`, `application/`, `infrastructure/`, or `interfaces/`
- ❌ Sharing internal models as canonical contracts
- ❌ Inverting dependency direction (downstream → upstream)

**Allowed**:
- ✅ `@/modules/<target>` (root `index.ts`) imports
- ✅ Domain events (async decoupling)
- ✅ Published language tokens (validated by AGENTS.md)

---

## Module Structure Template

```
src/modules/<bounded-context>/
  index.ts                    # Cross-module entry (only exports, no implementation)
  domain/                     # Business rules, entities, aggregates, ports
  application/                # Use cases, orchestration, DTO
  infrastructure/             # Repository & adapter implementations
  interfaces/                 # Routes, UI, Server Actions
  docs/                       # Context-local architecture docs
  subdomains/                 # Optional: sub-scoped slices with same layering
```

---

## Xuanwu-Specific Rules

| Pattern | Rule | Why |
|---------|------|-----|
| subdomain API | Always delegate through `index.ts` boundary | Prevents interface leakage |
| factory functions | Place in `interfaces/composition/` (not module root) | Separates DI from core |
| bounded context naming | Must align with module folder | Consistency + grep-ability |
| usage logs | Require AGENTS.md + module AGENT.md conformance | Ensure ownership clarity |

---

## Citations

- Martin Fowler, *Domain-Driven Design* (Evans, 2003)
- Alistair Cockburn, *Hexagonal Architecture* (2005)
- sairyss/domain-driven-hexagon (Context7 verified)
- Xuanwu: architecture-core.instructions.md, bounded-contexts.md, AGENTS.md
