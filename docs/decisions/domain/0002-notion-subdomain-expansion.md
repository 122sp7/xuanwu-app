# ADR 0002 — notion Subdomain 缺口補充計畫

## Status

Proposed

## Date

2025-02-11

## Context

`src/modules/notion/subdomains/` 目前只有 6 個子域：

```
block / collaboration / database / page / template / view
```

`docs/structure/domain/subdomains.md` 的 notion baseline 定義 **14 個子域**：

```
knowledge / authoring / collaboration / database /
knowledge-engagement / attachments / automation /
external-knowledge-sync / notes / templates /
knowledge-versioning / taxonomy / relations / publishing
```

缺口分析：

| 狀態 | 子域 |
|---|---|
| ✅ 已有（對應 baseline） | `collaboration`, `database`, `template` |
| ⚠️ 命名偏離 | `block` ≠ baseline（page/block 是技術實作概念，非業務子域） |
| ⚠️ 命名偏離 | `page` — 對應 baseline 的 `knowledge`（頁面是知識內容載體，`page` 是技術術語） |
| ❌ baseline 但不存在 | `knowledge`, `authoring`, `knowledge-engagement`, `attachments`, `automation`, `external-knowledge-sync`, `notes`, `knowledge-versioning`, `taxonomy`, `relations`, `publishing` |
| ❓ 不在 baseline | `view` — 需評估 |

`view` 子域：可能是 `database` 的呈現模式（多視圖管理），若是則應合併到 `database/` 子域，而非獨立存在。

## Decision

### 命名修正（需獨立 PR）

| 現有 subdomain | 對應修正 | 理由 |
|---|---|---|
| `page` | 重命名 → `knowledge` | `knowledge` 是正典語言；`page` 是技術實作術語 |
| `block` | 移至 `knowledge/domain/` 內部的 BlockContent value object | `block` 是頁面內容模型，非獨立子域 |
| `view` | 合併至 `database/` 或建立 ADR 評估獨立性 | baseline 未定義 `view` 為獨立子域 |

### 子域建立優先順序

**Phase 1（P0 — 核心知識能力）：**
- `authoring` — 知識庫文章建立、驗證、分類
- `taxonomy` — 分類法與語義組織（其他子域依賴）
- `relations` — 內容關聯與 backlink

**Phase 2（P1 — 知識生命週期）：**
- `knowledge-versioning` — 版本快照策略
- `publishing` — 正式發布與對外交付
- `attachments` — 附件與媒體儲存

**Phase 3（P2 — 知識增強）：**
- `knowledge-engagement` — 知識使用行為量測
- `notes` — 個人輕量筆記
- `automation` — 知識事件觸發自動化
- `external-knowledge-sync` — 外部系統雙向整合

### 子域骨架基線

每個新子域依 `bounded-context-subdomain-template.md` 建立：

```
subdomains/<name>/
  README.md
  domain/
    entities/
    value-objects/
    events/
    repositories/
  application/
    use-cases/
    dtos/
```

## Consequences

**正面：** notion 取得完整的知識管理能力語言；避免 `page`/`block` 這類技術術語滲透到 published language。  
**負面：** `page` → `knowledge` 重命名影響 `src/app/` 所有 notion 路由與消費端。  
**中性：** Phase 3 子域可視業務需求延遲建立，但必須預留目錄位置與 README.md 說明。

## References

- `docs/structure/domain/subdomains.md` — notion baseline 清單
- `src/modules/notion/subdomains/` — 現有子域目錄
- `docs/structure/domain/bounded-context-subdomain-template.md` — 子域骨架模板
- ADR architecture/0001 — 整體子域邊界治理
