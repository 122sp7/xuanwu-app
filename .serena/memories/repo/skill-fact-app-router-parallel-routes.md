# Skill Fact: App Router Parallel Routes (Next.js 16 Composition)

**Type**: Framework composition skill  
**Authority**: Vercel Next.js App Router (Next.js 16 + React 19)  
**Application Scope**: Dashboard composition, modal/tool/chat console routes, route ownership, module API consumption in `app/`  

---

## Core Principle

**UI composition in `app/` must remain thin, follow one-way data flow, and consume modules ONLY through module `index.ts` public boundary.**

Route layers exist to **orchestrate, not to contain business logic.**

---

## Workflow (Single Slice or Parallel Block)

1. **Identify the route segment and its single UI responsibility**
   - Dashboard? Sidebar tool? Modal slot? Chat console?
   - One concern per segment (not multiple behaviors in one route slice)
   - Answer: "This route exists to [verb] the [noun]"

2. **List the module APIs the slice may consume**
   - Only `@/modules/<name>` (root `index.ts`) imports allowed
   - No imports from `domain/`, `application/`, `infrastructure/`
   - Document which API each interaction calls

3. **Keep route files thin: composition, loading states, and rendering only**
   - No business logic in route files
   - No orchestration of multiple modules' internals
   - Delegating to modules' own `application/` layer instead

4. **Move interactive state into local components or hooks when needed**
   - Local UI state (open/closed, form input) lives in `interfaces/`
   - Domain state lives in `modules/` domain or application layer
   - Keep one-way data flow (component → hook → module API → component update)

5. **Validate imports so no module internals are pulled into `app/`**
   - grep for imports in route segment
   - Verify all `@/modules/*` imports end with `/api`
   - Verify no Firebase, external SDK, or framework-specific adapters leak into routes

---

## Guardrails (Hard Boundaries)

| Forbidden | Why | Fix |
|-----------|-----|-----|
| `from "@/modules/*/domain"` | Business rules belong in module, not route | Import from module root `index.ts`; call use-case |
| `from "@/modules/*/application"` | Orchestration hidden in route | Delegate to module's `index.ts`, let module own the orchestration |
| `from "@/modules/*/infrastructure"` | Technical details pollute composition layer | Route should not know about persistence, adapters, or external SDKs |
| Business logic in `.tsx` file | Routes are for flow, not rules | Move rules to module domain; route calls module API |
| Hidden state coupling between blocks | Parallel routes should be independent | Use context or module-level state management; avoid shared route state |

---

## Route Tiers in Xuanwu

| Tier | File Location | Responsibility | May Consume |
|------|---|---|---|
| **Application layout** | `app/layout.tsx` | Composition of routes, global state providers | Module APIs for shared nav, auth, theme |
| **Route slice** (e.g., dashboard) | `app/(shell)/dashboard/page.tsx` | Render view for single capability | Dashboard module API |
| **Parallel route block** (e.g., sidebar) | `app/(shell)/@sidebar/page.tsx` | Render independent slot | Navigation module API |
| **Server Action entry** | `app/*/_actions/` (or next to route) | Server-side form handler | Use-case from module, return result |
| **Local component** | `app/*/components/` | UI rendering, local interaction | Parent route via props; no module imports |

---

## Data Flow Pattern (One-Way)

```
User Input (form, click)
  ↓
Server Action or Route Handler
  ↓
Module Use Case (orchestration)
  ↓
Module Domain (rules)
  ↓
Result (updated aggregate, event, or DTO)
  ↓
Route Re-render (Next.js ISR or revalidateTag)
  ↓
UI reflects new state
```

**Key**: Route does NOT directly call infrastructure, repository, or domain logic. Route delegates to module's `api/`.

---

## Output Expectations After Refactor

When modifying route composition, report:

1. **Route segment responsibility**: One sentence describing the route's single concern
2. **Consumed module APIs**: List of `@/modules/*/api` imports with use case names
3. **Route tier classification**: Is this app-level, slice-level, parallel block, or component?
4. **Server vs. Client**: Is the route a React Server Component or Client Component? Why?
5. **Validation performed**:
   - ✅ No forbidden imports (grep for `/domain`, `/application`, `/infrastructure`)
   - ✅ Data flow is one-way (no back-channel state mutation)
   - ✅ Local state is isolated (not shared between siblings unintentionally)

---

## Common Xuanwu Patterns

| Pattern | Location | Purpose | Consumes |
|---------|----------|---------|----------|
| Dashboard grid layout | `app/(shell)/dashboard/layout.tsx` | Compose parallel slots (grid, sidebar, panel) | Module APIs for each slot |
| Sidebar navigation | `app/(shell)/@sidebar/page.tsx` | Render nav tree, handle toggle state | platform/subdomains/navigation/api or similar |
| Modal slot | `app/(shell)/@modal/page.tsx` | Render conditional modal (create, edit, delete) | Target subdomain's create/edit use-case API |
| Chat console | `app/(shell)/ai-chat/page.tsx` | RSC + streaming responses | platform/ai API or notebooklm/synthesis API |
| Form handler | `app/(shell)/knowledge/_actions/publish.ts` | Server Action submitting form data | notion/publish use-case API |

---

## Xuanwu-Specific Rules

| Rule | Why |
|------|-----|
| Route segment = one module responsibility | Keeps ownership clear; parallel routes stay independent |
| `api/` import only | Enforces hexagonal DDD boundary at composition level |
| No Firebase SDK in routes | Keep Next.js layers ignorant of persistence details |
| Server Actions in `_actions/` subdir | Centralizes form handling; easier to audit |
| RSC by default, Client only when needed | Reduces payload, improves performance |

---

## Citations

- Vercel Next.js App Router (v16+)
- Xuanwu: nextjs-app-router.instructions.md, nextjs-parallel-routes.instructions.md, nextjs-server-actions.instructions.md
- Hexagonal DDD skill: api/ boundary as composition entry point
