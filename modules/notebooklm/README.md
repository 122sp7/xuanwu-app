# NotebookLM

對話、來源處理與推理主域

## Implementation Structure

```text
modules/notebooklm/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── ai/
    ├── conversation/
    ├── notebook/
    └── source/
```

## Subdomains

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| ai | Active | AI 推理與模型互動 |
| conversation | Active | 對話管理與對話流程 |
| source | Active | 來源匯入與來源管理 |
| notebook | Stub | 筆記本容器與組織 |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notebooklm/README.md)
- [Subdomains](../../docs/contexts/notebooklm/subdomains.md)
- [Context Map](../../docs/contexts/notebooklm/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notebooklm/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
