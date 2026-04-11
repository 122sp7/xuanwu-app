# Notion

知識內容生命週期主域

## Implementation Structure

```text
modules/notion/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── authoring/
    ├── collaboration/
    ├── database/
    └── knowledge/
```

## Subdomains

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| authoring | Active | 內容建立與編輯 |
| collaboration | Active | 內容協作與共同編輯 |
| database | Active | 結構化資料與資料庫管理 |
| knowledge | Active | 知識內容正典狀態管理 |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notion/README.md)
- [Subdomains](../../docs/contexts/notion/subdomains.md)
- [Context Map](../../docs/contexts/notion/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notion/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
