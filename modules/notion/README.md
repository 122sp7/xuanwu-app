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
    ├── authoring/           # Baseline — Active
    ├── collaboration/        # Baseline — Active
    ├── database/             # Baseline — Active
    ├── knowledge/            # Baseline — Active
    ├── attachments/          # Baseline — Stub
    ├── automation/           # Baseline — Stub
    ├── knowledge-analytics/  # Baseline — Stub
    ├── knowledge-integration/ # Baseline — Stub
    ├── knowledge-versioning/ # Baseline — Stub
    ├── notes/                # Baseline — Stub
    ├── templates/            # Baseline — Stub
    ├── publishing/           # Recommended Gap — Stub
    ├── relations/            # Recommended Gap — Stub
    └── taxonomy/             # Recommended Gap — Stub
```

## Subdomains

### Baseline — Active

| Subdomain | Purpose |
|-----------|--------|
| authoring | 知識庫文章建立、驗證與分類 |
| collaboration | 協作留言、細粒度權限與版本快照 |
| database | 結構化資料多視圖管理 |
| knowledge | 頁面建立、組織、版本化與交付 |

### Baseline — Stub

| Subdomain | Purpose |
|-----------|--------|
| attachments | 附件與媒體關聯儲存 |
| automation | 知識事件觸發自動化動作 |
| knowledge-analytics | 知識使用行為量測 |
| knowledge-integration | 知識與外部系統雙向整合 |
| knowledge-versioning | 全域版本快照策略管理 |
| notes | 個人輕量筆記與正式知識協作 |
| templates | 頁面範本管理與套用 |

### Recommended Gap — Stub

| Subdomain | Purpose |
|-----------|--------|
| publishing | 建立正式發布與對外交付的正典邊界 |
| relations | 建立內容之間關聯與 backlink 的正典邊界 |
| taxonomy | 建立分類法與語義組織的正典邊界 |

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
