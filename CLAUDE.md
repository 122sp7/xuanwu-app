# Xuanwu App — Claude Instructions

Knowledge-management and AI-assisted workspace platform built with Next.js 16 + React 19.

## Essential Reading Order

Before writing any code, read these documents in order:

1. `docs/README.md` — 架構文件索引
2. `docs/architecture-overview.md` — 全域架構與主域關係
3. `docs/bounded-contexts.md` — 主域與子域所有權
4. `docs/ubiquitous-language.md` — 戰略術語權威
5. `docs/decisions/README.md` — ADR 決策日誌
6. `modules/<context>/AGENT.md` — 目標主域的任務定義

## Project Structure

```
app/                  Next.js App Router (UI entry points)
modules/              完整 Hexagonal DDD 實作（邊界規則 / published language 的策略權威）
  platform/           治理、通知
  iam/                身份、存取、帳號、組織
  workspace/          協作容器、工作區範疇
  notion/             正典知識內容
  notebooklm/         對話、來源、推理輸出
  ai / analytics / billing / ...
src/modules/          精簡蒸餾骨架（新實作程式碼的目標層）
  template/           骨架基線（複製此結構開始新模組）
  iam/                identity + access-control + account + organization
  platform/           notification
  workspace/          lifecycle + membership + task + issue
  notion / notebooklm / ai / analytics / billing
docs/                 架構文件（DDD、Context Map、ADR）
py_fn/                Python Cloud Functions（ingestion、embedding）
packages/             Shared packages
```

> **重要：`modules/` ≠ `src/modules/`**
> - `modules/<context>/` — 讀取邊界規則、跨模組 API 合約、現有 domain model
> - `src/modules/<context>/` — 撰寫新 use case、adapter、entity（以 `src/modules/template` 為骨架）

`modules/<context>/` follows full Hexagonal Architecture:

```
modules/<context>/
  api/                Cross-module entry surface only
  domain/             Entities, value objects, aggregates, domain events, ports
  application/        Use cases, command/query contracts, application services
  infrastructure/     Repository and adapter implementations
  interfaces/         UI, route/action wiring, input-output translation
  subdomains/         Sub-domain groupings
  index.ts            Aggregate export only
```

`src/modules/<context>/` follows lean distilled skeleton:

```
src/modules/<context>/
  index.ts            Aggregate named export
  domain/             Entities, value objects, services, repositories, events
  application/        Use cases + DTOs
  adapters/inbound/   HTTP / RPC driving adapters
  adapters/outbound/  Firestore / Firebase / external driven adapters
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
- Cross-module collaboration must go through `modules/<target>/api/` only.

### Main Domain Relationships (upstream → downstream)

```
platform → workspace → notion → notebooklm
platform → notion
platform → notebooklm
workspace → notebooklm
```

platform is governance upstream. Do not invert this.

### Layer Ownership

| Layer | Owns |
|---|---|
| `domain/` | Business rules, entities, value objects, aggregates, domain events, repository interfaces |
| `application/` | Use-case orchestration, command/query contracts |
| `infrastructure/` | Repository and adapter implementations |
| `interfaces/` | UI, route/action wiring, input-output translation |
| `api/` | Cross-module entry surface only |

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
- Creating a new top-level main domain (system has exactly 4: platform, workspace, notion, notebooklm)
- Using `Shared Kernel` or `Partnership` patterns at main-domain level
- Mixing ACL and Conformist in the same integration

## Cross-Module Integration Checklist

1. Identify upstream / downstream direction
2. Define published language tokens
3. Decide: semantics compatible → Conformist; semantics would pollute local language → Anti-Corruption Layer
4. Never pass upstream entity or aggregate as downstream canonical model
