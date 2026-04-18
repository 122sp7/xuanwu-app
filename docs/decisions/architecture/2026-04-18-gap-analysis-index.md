# 缺口分析索引 — Workspace / Notion / NotebookLM

> 本文件為各缺口獨立分析文件的索引頁。每個缺口獨立存放，方便各 PR 只對齊單一缺口的 20 條治理準則。

## 分析版本

| 版本 | 日期 | 變更 |
|---|---|---|
| v1 | 2026-04-18 | 初版 14 條準則映射（已合併至 v2） |
| v2 | 2026-04-18 | 拆分為 5 個獨立文件，全面映射 20 條治理準則 |

---

## 優先級定義

| 等級 | 定義 |
|---|---|
| P0 | 直接影響主流程可用性、跨邊界一致性或安全邊界，需優先修補 |
| P1 | 已有替代路徑但風險持續累積，應安排近期迭代處理 |
| P2 | 不阻塞主流程，但會造成能力不完整或擴展成本上升 |

---

## 缺口總覽

| Gap ID | 類型 | 優先級 | 摘要 | 文件 |
|---|---|---|---|---|
| GAP-01 | 功能缺口 | P0 | schedule/audit/settlement 子域已有 domain/application/repository，但無 server actions 且 UI 為 empty state；Saga 未接線 | [GAP-01](./gaps/GAP-01-schedule-audit-settlement-ui-only.md) |
| GAP-02 | 業務缺口 | P2 | notion.templates 及多個子域仍為 placeholder/stub，無可執行業務能力 | [GAP-02](./gaps/GAP-02-notion-templates-placeholder.md) |
| GAP-03 | 業務缺口 | P0 | notebooklm → workspace 任務實體化 adapter 回傳假結果，跨域 handoff 未真正落地 | [GAP-03](./gaps/GAP-03-notebooklm-task-materialization-stub.md) |
| GAP-04 | 功能缺口 | P1 | task-formation callable extractor 失敗後回傳假候選資料，缺失錯誤分類、retry 與可觀測性 | [GAP-04](./gaps/GAP-04-task-formation-extractor-weak-fallback.md) |
| GAP-05 | 業務缺口 | P0 | 所有 server actions 無 requireAuth / PermissionAPI 呼叫，任意呼叫者可操作任意 workspace | [GAP-05](./gaps/GAP-05-authorization-boundary-missing.md) |

---

## 20 條治理準則覆蓋矩陣

> 每個缺口文件均逐條映射以下 20 條準則。此矩陣顯示哪些準則在各缺口中為「主要違規」（🔴）或「需關注」（🟡）或「符合」（✅）。

| 準則 | GAP-01 | GAP-02 | GAP-03 | GAP-04 | GAP-05 |
|---|---|---|---|---|---|
| 1. AI Operational Scope | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2. Bounded Context | 🟡 Saga wiring | 🟡 token missing | 🟡 adapter only | ✅ | 🔴 no platform API |
| 3. Ubiquitous Language | ✅ | 🟡 scope enum | 🟡 candidate term | 🟡 field names | 🔴 actorId naming |
| 4. Contract / Schema | 🔴 no Zod on action | 🟡 output schema | 🔴 no candidate parse | 🔴 no callable schema | 🔴 actorId from client |
| 5. Breaking Change Policy | 🟡 schema not public | 🟡 content format | 🟡 port not public | 🟡 callable protocol | 🔴 schema field removal |
| 6. Aggregate Design | 🔴 double-validation | 🔴 no factory/event | 🔴 fake result bypasses | 🔴 fake bypasses job.fail | 🔴 no actorId in create |
| 7. State Model / FSM | 🔴 assign no guard | 🔴 no TemplateStatus | 🔴 no handoff states | 🔴 retrying unused | 🟡 role→transition map |
| 8. Consistency / Transaction | 🔴 Saga unwired | 🔴 no cross-agg strategy | 🔴 no compensation | 🔴 callable+state not atomic | ✅ auth is pre-guard |
| 9. Event Ordering / Causality | 🔴 Saga no idempotency | 🔴 no domain events | 🔴 no idempotency key | 🔴 fake triggers wrong event | 🔴 events lack actorId |
| 10. Failure Strategy | 🔴 Saga no try/catch | 🔴 silent empty array | 🔴 no retry/DLQ | 🔴 all errors silenced | 🔴 no auth error path |
| 11. Authorization / Security | 🔴 action no auth | 🔴 scope no permission | 🔴 actor not verified | 🔴 callable no auth | 🔴 all actions no auth |
| 12. Hexagonal Architecture | 🟡 use-case dup-valid | 🔴 action skips use case | ✅ | 🔴 adapter has biz logic | 🔴 action uses SDK direct |
| 13. Dependency Rule | 🔴 Saga deep import | ✅ | 🔴 cannot deep import | ✅ | 🔴 no platform abstraction |
| 14. Testability | 🔴 zero tests | 🔴 zero tests | 🔴 zero tests | 🔴 fake makes tests pass | 🔴 zero auth tests |
| 15. Observability | 🔴 no struct log | 🔴 no log on stub | 🔴 no correlation log | 🔴 no callable metrics | 🔴 no audit trail |
| 16. ADR / Design Rationale | 🔴 Saga wiring no ADR | 🔴 content format no ADR | 🔴 handoff no ADR | 🔴 fallback no ADR | 🔴 auth gate no ADR |
| 17. YAGNI Enforcement | ✅ | 🔴 collab not needed yet | 🟡 workflowHref | 🟡 second extractor | ✅ min permission |
| 18. Single Responsibility | 🔴 double-validation | 🟡 page/block boundary | 🟡 two job concepts | 🔴 adapter has biz logic | 🔴 auth logic scattered |
| 19. Design Activation Rules | ✅ | ✅ | ✅ | ✅ | ✅ required now |
| 20. Lint / Policy as Code | 🔴 no inbound rule | 🔴 no stub-in-prod rule | 🔴 no stub-in-main rule | 🔴 no empty catch rule | 🔴 no auth-required rule |

---

## 建議修補順序

```
Week 1 (P0 安全)    GAP-05 → 所有 server actions 加 auth gate
Week 2 (P0 可用性)  GAP-01 → schedule/audit/settlement server actions + Saga wiring
Week 3 (P0 閉環)    GAP-03 → notebooklm task materialization 真實呼叫
Week 4 (P1)         GAP-04 → task-formation extractor 錯誤分類 + retry
Week 5+ (P2)        GAP-02 → notion templates 主鏈路填充
```

> 每個修補 PR 必須對齊對應缺口文件的「修補路徑（最小必要步驟）」，並附帶：Zod 契約、授權檢查、結構化 log、測試證據。

---

## Context7 驗證錨點

> 矩陣中所有準則對應的修補指引，其函式庫 API 已透過 Context7 逐一查閱確認（confidence ≥ 99.99%）。

| 函式庫 | Context7 ID | 在缺口修補中的用途 |
|---|---|---|
| Zod | `/colinhacks/zod` | Rule 4（Contract/Schema）：server action 邊界 `Schema.parse(rawInput)` 不穿透 `unknown`；Rule 5（Breaking Change）：`z.literal('v1')` schema 版本化；Rule 6 brand type：`z.string().uuid().brand(...)` 防 ID 混用 |
| XState | `/statelyai/xstate` | Rule 7（State Model/FSM）：`setup({ guards: {...} }).createMachine(...)` 外置 guard 定義；Rule 10（Failure Strategy）：`type: 'final'` 的 `failed` state 防止 silent swallow；`retrying` state 含 `retryCount` assign |
| Stately Docs | `/statelyai/docs` | 狀態命名規範（業務語意）：`idle / creating / succeeded / failed / retrying`；`invoke.src` actor + `onDone` / `onError` 映射 |
| ESLint | `/eslint/eslint` | Rule 20（Lint/Policy as Code）：flat-config custom rules — `server-action-missing-auth`（GAP-05）、`no-stub-return-in-adapter`（GAP-03/04）、`no-empty-catch`（GAP-04） |

---

## 相關文件

- [歷史版本 overview（v1）](../2026-04-18-workspace-notion-notebooklm-gap-analysis.md)
- [Decisions README](../../README.md)
