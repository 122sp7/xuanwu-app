# ADR 0004 — Occam 缺口分流與基線聚焦

## Status

Accepted

## Date

2026-04-20

## Context

目前 `src/modules/*/subdomains/` 與 `docs/structure/domain/subdomains.md` baseline 仍有明顯落差。現況（2026-04-20）目錄快照：

- notion: `block`, `collaboration`, `database`, `page`, `template`, `view`
- notebooklm: `conversation`, `document`, `notebook`
- ai: `chunk`, `citation`, `context`, `embedding`, `evaluation`, `generation`, `memory`, `pipeline`, `retrieval`, `tool-calling`
- platform: `background-job`, `cache`, `file-storage`, `notification`, `platform-config`, `search`
- billing: `entitlement`, `subscription`, `usage-metering`
- analytics: `event-contracts`, `event-ingestion`, `event-projection`, `experimentation`, `insights`, `metrics`, `realtime-insights`
- iam: `access-control`, `account`, `authentication`, `authorization`, `federation`, `identity`, `organization`, `security-policy`, `session`, `tenant`
- workspace: `activity`, `api-key`, `approval`, `audit`, `feed`, `invitation`, `issue`, `lifecycle`, `membership`, `orchestration`, `quality`, `resource`, `schedule`, `settlement`, `share`, `task`, `task-formation`

若直接補齊全部缺口，會產生大量空骨架與命名搬移，違反最小必要設計（Occam / YAGNI）。

## Decision

### 一定要做（Must-Do Baseline）

以下缺口屬於「語言衝突」或「核心能力缺失」，不做會持續破壞主域邊界：

| 優先級 | 主域 | 必做基線 |
|---|---|---|
| P0 | notebooklm | `document` → `source` 命名修正，避免與 notion 內容語言衝突 |
| P0 | notebooklm | 建立 `synthesis` 子域，承接 RAG 合成/摘要/洞察正典責任 |
| P0 | notion | 建立 `knowledge` 正典容器，讓 `page/block` 回到實作細節而非子域語言 |
| P1 | ai | 建立 `safety` 子域，補上所有 AI 輸出路徑的安全護欄 |
| P1 | platform | 建立 `audit-log` 與 `feature-flag` 子域，補齊治理與發佈控制基線 |

### 現階段不重要（Defer / Not-Now）

以下缺口視為可延後，不作為本輪必交：

| 類別 | 主域 | 延後項目 | 理由 |
|---|---|---|---|
| Gap subdomain | workspace | `presence` | 無即時協作需求時屬預建風險 |
| Gap subdomain | iam | `consent`, `secret-governance` | 尚未出現直接需求壓力 |
| Gap subdomain | billing | `pricing`, `invoice`, `quota-policy` | 與當前核心流程無直接阻斷 |
| 命名對齊 | analytics | `insights` ↔ `reporting`, `dashboards` | 可先 ADR 對齊語言，後續再落實目錄 |
| 延伸能力 | platform | `support`, `content`, `workflow` 細分 | 非當前治理阻斷點 |

### 禁止事項（Occam Guardrail）

1. 不一次建立所有缺口子域空目錄。
2. 不在未有實際 use case 前預建抽象層。
3. 不把 naming fix 與大規模功能重寫綁在同一批變更。

## Consequences

**正面：** 先修掉最破壞邊界的缺口，快速恢復語言一致性與核心治理能力。  
**負面：** 仍保留部分 gap subdomain 未建立，需要持續追蹤。  
**中性：** 延後項目必須以「觸發條件」驅動，不再以目錄數量作為進度指標。

## References

- `docs/structure/domain/subdomains.md`
- `docs/decisions/architecture/0001-ddd-subdomain-boundary-governance.md`
- `docs/decisions/domain/0001-notebooklm-document-to-source-rename.md`
- `docs/decisions/domain/0002-notion-subdomain-expansion.md`
- `docs/decisions/domain/0003-notebooklm-synthesis-subdomain.md`
- `docs/decisions/platform/0001-platform-audit-log-vs-workspace-audit.md`
- `docs/decisions/platform/0002-feature-flag-subdomain.md`
- `docs/decisions/ai/0002-ai-safety-subdomain.md`
