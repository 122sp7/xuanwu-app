# Workspace

協作容器與工作區範疇主域

## Implementation Structure

```text
modules/workspace/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration (delegates to subdomains)
│   ├── queries/      # Read query handlers (pure reads, no business logic)
│   ├── use-cases/    # Command use cases remaining at root level
│   └── services/     # Application services (composite orchestrators)
├── domain/           # Context-wide domain concepts (Workspace aggregate root)
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── audit/             # Active — append-only audit trail
    ├── feed/              # Active — workspace activity projection
    ├── lifecycle/         # Active — workspace create/update/delete/transitions
    ├── membership/        # Active — member view model and participation queries
    ├── presence/          # Stub — real-time presence and activity
    ├── scheduling/        # Active — workspace scheduling management
    ├── sharing/           # Active — team and individual access grants
    └── workspace-workflow/ # Active — task/issue/invoice state machines
```

## Subdomains

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| audit | Active | 不可否認稽核追蹤 |
| feed | Active | 工作區活動投影 |
| lifecycle | Active | 工作區容器生命週期（建立/修改/刪除/狀態轉換）|
| membership | Active | 工作區參與者視圖模型與查詢 |
| presence | Stub | 即時在線狀態 |
| scheduling | Active | 工作區排程管理 |
| sharing | Active | 工作區存取授權（團隊/個人）|
| workspace-workflow | Active | 工作區流程協調 |

## Application Layer Architecture

The root application services act as **composite orchestrators** that delegate to subdomain services:

| Operation | Delegated To |
|-----------|-------------|
| Create/Update/Delete workspace | `lifecycle` subdomain |
| Team/Individual access grants | `sharing` subdomain |
| Member view queries | `membership` subdomain |
| Mount capabilities | Root use-case (pending subdomain assignment) |
| Create workspace location | Root use-case (Workspace operational profile) |
| Workspace read queries | Root query handlers |
| Wiki content tree projection | Root query handler |

### DDD Rules Applied

- **Rule 5/13/16**: Pure reads → query handlers in `queries/`, not use cases
- **Rule 12**: Commands → `use-cases/` or subdomain use cases
- **Rule 18**: Single-call wrappers eliminated; functions instead of classes for queries
- **Rule 8**: Each use case = one business intent (verb-first naming)

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.
- Subdomain cross-collaboration goes through subdomain `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/workspace/README.md)
- [Subdomains](../../docs/contexts/workspace/subdomains.md)
- [Context Map](../../docs/contexts/workspace/context-map.md)
- [Ubiquitous Language](../../docs/contexts/workspace/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
