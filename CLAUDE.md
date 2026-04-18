# Xuanwu App — Claude Instructions

Knowledge-management and AI-assisted workspace platform built with Next.js 16 + React 19.

## Essential Reading Order

Before writing any code, read these documents in order:

1. `docs/README.md` — 架構文件索引
2. `docs/structure/system/architecture-overview.md` — 全域架構與主域關係
3. `docs/structure/domain/bounded-contexts.md` — 主域與子域所有權
4. `docs/structure/domain/ubiquitous-language.md` — 戰略術語權威
5. `docs/decisions/README.md` — ADR 決策日誌
6. `src/modules/<context>/AGENT.md` — 目標主域的任務定義

## Project Structure

```
src/app/                  Next.js App Router (UI entry points)
src/modules/              主域模組實作層（Hexagonal DDD）
  <context>/
    subdomains/
      <subdomain>/
        domain/
        application/
        adapters/inbound/
        adapters/outbound/
    adapters/
    shared/
    orchestration/
docs/                     架構文件（DDD、Context Map、ADR）
py_fn/                    Python Cloud Functions（ingestion、embedding）
packages/                 Shared packages
```

> **重要：`src/modules/` 是唯一模組實作層。**
> - 讀取邊界規則、跨模組 API 合約與現況 domain model
> - 撰寫新 use case、adapter、entity（以 `src/modules/template` 為骨架）

`src/modules/<context>/` follows the active module skeleton:

```
src/modules/<context>/
  index.ts
  subdomains/
    <subdomain>/
      domain/
      application/
      adapters/inbound/
      adapters/outbound/
  adapters/
  shared/
  orchestration/
```

## Commands

```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Production build + TypeScript check
npm run lint             # ESLint
npm run test             # Vitest unit tests
```

Firebase deployment:

```bash
npm run deploy:firebase               # Deploy everything
npm run deploy:firestore:rules        # Firestore rules only
npm run deploy:functions:py-fn        # Python functions only
```

## Architecture Rules

### Dependency Direction (immutable)

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` must be framework-free and runtime-agnostic.
- Never import another module's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Cross-module collaboration must go through `src/modules/<target>/index.ts` only.

### Main Domain Relationships (upstream → downstream)

```
iam     → billing · platform · workspace · notion · notebooklm
billing → workspace · notion · notebooklm
ai      → notion · notebooklm
platform → workspace
workspace → notion · notebooklm
notion  → notebooklm
(all above) → analytics  ← event/projection sink only
```

`iam`, `billing`, `ai` are governance upstreams. `platform` is operational support. `analytics` is downstream sink only. Do not invert any direction.

Full context map authority: `docs/structure/system/context-map.md` and `docs/structure/system/module-graph.system-wide.md`.

### Layer Ownership

| Layer | Owns |
|---|---|
| `domain/` | Business rules, entities, value objects, aggregates, domain events, repository interfaces |
| `application/` | Use-case orchestration, command/query contracts |
| `infrastructure/` | Repository and adapter implementations |
| `interfaces/` | UI, route/action wiring, input-output translation |
| `index.ts` | Cross-module entry surface (public API barrel) |

### Development Order for New Features

1. Define domain (entities, value objects, aggregates, events)
2. Define application (use cases, DTOs)
3. Define ports (only if boundary isolation is needed)
4. Implement infrastructure (adapters, persistence)
5. Implement interfaces (UI, actions, hooks)

Do not build UI first and backfill domain later.

## Naming Conventions

| Element | Pattern |
|---|---|
| Use case file | `verb-noun.use-case.ts` |
| Repository interface | `PascalCaseRepository` |
| Repository implementation | `TechnologyPascalCaseRepository` |
| Domain event discriminant | `module-name.action` |

## Ubiquitous Language — Do Not Mix

| Use | Not |
|---|---|
| `Actor` | `User` (when referring to identity) |
| `Membership` | `User` (when referring to workspace participant) |
| `KnowledgeArtifact` | `Wiki`, `Doc` |
| `Conversation` | `Chat` |
| `Entitlement` | `Plan` (when referring to capability signal) |
| `Subscription` | `Plan` (when referring to billing plan) |

Cross-domain tokens use published language: `actor reference`, `workspaceId`, `entitlement signal`, `knowledge artifact reference`. Never pass upstream aggregates directly to downstream.

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Backend**: Firebase (Firestore, Storage, App Hosting), Python Cloud Functions
- **API**: tRPC
- **State**: Zustand, XState
- **Data fetching**: TanStack Query
- **UI**: Tailwind CSS 4, shadcn/ui, TipTap (rich text)
- **Validation**: Zod
- **Testing**: Vitest
- **Node.js**: v24 required

## Anti-Patterns to Avoid

- Putting framework, transport, storage, or SDK details into `domain/` core
- Sharing internal models across module boundaries instead of using published language
- Adding `GetXxxUseCase` — pure reads without business logic belong in query handlers
- Calling repositories directly from `interfaces/`
- Creating a new top-level main domain (system has exactly 8: iam, billing, ai, analytics, platform, workspace, notion, notebooklm; governed by ADR 0014)
- Using `Shared Kernel` or `Partnership` patterns at main-domain level (directed upstream-downstream only)
- Mixing ACL and Conformist in the same integration
- Treating `billing` or `iam` owned concepts (Entitlement, Actor, Tenant) as owned by `platform`

## Cross-Module Integration Checklist

1. Identify upstream / downstream direction
2. Define published language tokens
3. Decide: semantics compatible → Conformist; semantics would pollute local language → Anti-Corruption Layer
4. Never pass upstream entity or aggregate as downstream canonical model
