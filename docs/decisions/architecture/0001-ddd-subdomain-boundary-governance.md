# ADR 0001 — DDD Subdomain Boundary Governance

## Status

Accepted

## Date

2025-02-11

## Context

Codebase analysis (xuanwu-skill, Feb 2025) 顯示 8 個主域的 subdomain 實作存在系統性缺口：

1. **notebooklm**：`document` 違反 ubiquitous language，與 notion 的 `KnowledgeArtifact` 命名衝突。缺少 `synthesis`、`note`、`conversation-versioning`。
2. **notion**：目前只有 `block`、`collaboration`、`database`、`page`、`template`、`view`，缺少 baseline 要求的 `knowledge`、`authoring`、`taxonomy`、`relations`、`publishing` 等 11 個子域。
3. **platform**：缺少 `feature-flag`、`audit-log`、`observability`、`onboarding`、`compliance`。
4. **ai**：`orchestration` 只作為 `AiFacade.ts` 存在於 module root，未正式化為子域。`safety`、`tracing`、`reasoning`、`distillation` 缺失。
5. **billing**：缺少 core `billing`、`referral`、`pricing`、`invoice`。
6. **analytics**：`insights` 命名偏離 baseline 定義的 `reporting`；`dashboards` 缺失。
7. **workspace**：只缺 `presence`（gap subdomain，可延遲）。
8. **iam**：gap subdomains `consent`、`secret-governance` 仍待建立。

核心問題：**subdomain 邊界未對齊 `docs/structure/domain/subdomains.md` 的 baseline 定義。**

## Decision

### 原則

1. `docs/structure/domain/subdomains.md` 的 **baseline subdomains** 是強制交付清單，不是可選目標。
2. **Recommended gap subdomains** 是可延遲但需 ADR 記錄的待建缺口。
3. Subdomain 命名必須 100% 對齊 `docs/structure/domain/ubiquitous-language.md`。
4. 不符合 baseline 的現有 subdomain 目錄名稱必須以獨立 ADR 記錄並限期修正。

### 修正優先順序

| 優先級 | 主域 | 必要行動 |
|---|---|---|
| P0 | notebooklm | 建立 `synthesis`、`note`、`conversation-versioning`；重命名 `document` → `source` |
| P0 | notion | 建立 `knowledge`、`authoring`、`taxonomy`、`relations`、`publishing`；評估現有 `view` 歸屬 |
| P1 | platform | 建立 `feature-flag`、`audit-log`、`observability`、`onboarding` |
| P1 | ai | 正式化 `orchestration` 為子域；建立 `safety`、`tracing` |
| P2 | billing | 建立 core `billing`、`referral`；評估 `pricing`、`invoice` |
| P2 | analytics | 確認 `insights` 是否等同 `reporting`，或需補 `reporting`、`dashboards` |
| P3 | iam | 評估 `consent`、`secret-governance` 建立時機 |
| P3 | workspace | 評估 `presence` 建立條件 |

### Extra Subdomains 評估規則

以下現有 subdomain 不在 baseline 定義中，需 ADR 決定保留或移除：

| 主域 | Extra subdomain | 處置方向 |
|---|---|---|
| ai | `chunk`, `citation`, `embedding`, `pipeline` | 評估是否應移至 notebooklm/source 子域 |
| platform | `cache`, `file-storage` | 評估是否對應 platform 的 operational service 語意 |
| notion | `view` | 評估是否為 `database` 或 `collaboration` 的子能力 |

## Consequences

**正面：** 防止 subdomain 命名漂移與 bounded context 語言污染。  
**負面：** 需要多個重命名 PR 並更新所有 import 路徑。  
**中性：** 現有功能不中斷，但 index.ts 的 public surface 需同步更新。

## References

- `docs/structure/domain/subdomains.md` — baseline subdomain 清單
- `docs/structure/domain/bounded-contexts.md` — 主域所有權規則
- `docs/structure/domain/ubiquitous-language.md` — 命名權威
- ADR domain/0001 — notebooklm source 重命名
- ADR domain/0002 — notion subdomain 缺口補充
