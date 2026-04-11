# Workspace

協作容器與工作區範疇主域

## Implementation Structure

```text
modules/workspace/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── audit/
    ├── feed/
    ├── scheduling/
    └── workspace-workflow/
```

## Subdomains

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| audit | Active | 不可否認稽核追蹤 |
| feed | Active | 工作區活動投影 |
| scheduling | Active | 工作區排程管理 |
| workspace-workflow | Active | 工作區流程協調 |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/workspace/README.md)
- [Subdomains](../../docs/contexts/workspace/subdomains.md)
- [Context Map](../../docs/contexts/workspace/context-map.md)
- [Ubiquitous Language](../../docs/contexts/workspace/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
