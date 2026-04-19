# 2026-04-18 Navigation Capability Gap Index (v3)

> ⚠️ **此文件為 v3 補充記錄，GAP-06/07/08 已整合至主索引 [gap-analysis-index.md](./2026-04-18-gap-analysis-index.md)。**
> 本文保留 v3 的發現脈絡與 Context7 驗證錨點，不再作為獨立追蹤入口。

> Scope: only **new/non-duplicate** gaps found from current tab/route catalog after `npm run repomix:skill` refresh.
> Excludes existing GAP-01~GAP-05 in `docs/decisions/architecture/gaps/`.

## Coverage baseline

- Workspace tabs: `workspace.overview` ~ `workspace.issues`
- Notion tabs: `notion.knowledge` / `notion.pages` / `notion.database` / `notion.templates`
- NotebookLM tabs: `notebooklm.notebook` / `notebooklm.ai-chat` / `notebooklm.sources` / `notebooklm.research`
- Account routes: `/organization` `/members` `/teams` `/permissions` `/workspaces` `/daily` `/schedule` `/schedule/dispatcher` `/audit` `/workspace` `/dashboard`

## Non-duplicate gaps (new set)

| Gap ID | Type | Priority | Scope | Decision File |
|---|---|---|---|---|
| GAP-06 | 功能缺口 | P1 | `workspace.members` / `workspace.quality` / `workspace.approval` / `workspace.settings` | [GAP-06](./gaps/GAP-06-workspace-governance-tabs-disconnected.md) |
| GAP-07 | 業務缺口 | P0 | `notebooklm.ai-chat` + conversation subdomain | [GAP-07](./gaps/GAP-07-notebooklm-conversation-model-not-activated.md) |
| GAP-08 | 業務缺口 | P1 | Account governance routes (`/organization` `/members` `/teams` `/permissions` `/workspaces` `/daily` `/schedule` `/schedule/dispatcher` `/audit` `/dashboard`) | [GAP-08](./gaps/GAP-08-platform-account-governance-routes-stubbed.md) |

## Context7-verified best-practice anchors

- Zod (`/colinhacks/zod`): strict object boundary + parse/safeParse split
- XState (`/statelyai/xstate`): explicit finite-state transitions with guard composition
- OpenTelemetry JS (`/open-telemetry/opentelemetry-js`): trace/span attributes, error status, span lifecycle
- ESLint (`/eslint/eslint`): flat-config custom rule/plugin for architecture policy-as-code

## Relationship to existing decisions

- GAP-01~GAP-05 remain authoritative for schedule/audit/settlement, templates stub, notebooklm→workspace materialization, extractor fallback, and auth boundary.
- This v3 set only records newly verified gaps not already tracked as independent remediation units.
