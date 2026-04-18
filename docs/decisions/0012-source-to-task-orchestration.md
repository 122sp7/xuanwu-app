# 0012 Source-To-Task Orchestration

- Status: Accepted
- Date: 2026-04-14
- Scope: `notebooklm.source` → `notion.knowledge` → `workspace.workspace-workflow` → `platform` event infrastructure

## Context

系統原本已具備：

- 上傳文件
- 解析文件
- 建立 Knowledge Page

但接下來需要支援：

- 上傳文件
- 解析文件
- 建立任務

若直接為了「建立任務」而讓 `notebooklm` 直接寫入 workspace 任務資料，會同時造成：

1. `notebooklm` 越界掌管 task materialization。
2. `workspace` 被迫接受 raw ingestion intent，而不是已整理的 business intent。
3. `notion` 的正典 Knowledge Page 邊界被繞過。
4. platform 作為 event / infra gateway 的角色被削弱。

## Decision

1. **入口仍由 `notebooklm.source` 擁有**
   - 使用者的 upload 與 processing dialog 仍留在 source context。

2. **Task flow 先經過 Knowledge Page**
   - 若使用者選擇建立任務，系統必須先建立 Knowledge Page，作為正典內容承接點。

3. **Task extraction / materialization 由 `workspace.workspace-workflow` 擁有**
   - notebooklm 不直接寫 task repository。
   - notebooklm 只能透過 public API / port 與 workspace 協作。

4. **跨 context handoff 必須走公開邊界與事件**
   - extraction：走 workspace 公開 command
   - page approval：走 notion 公開 action
   - materialization：走 knowledge-approved event + workspace listener

5. **Platform 擁有 event infrastructure**
   - event transport、shared bus、dispatch infrastructure 仍由 platform server-side composition 建立。

## Consequences

### Positive

- 維持 bounded context ownership 清楚。
- 任務建立流程可以和既有 knowledge approval flow 對齊。
- notebooklm 不需要知道 workspace task aggregate 的內部結構。
- platform 的 infra ownership 沒有被 feature shortcut 侵蝕。

### Trade-offs

- Task flow 不是最短路徑；它依賴 Knowledge Page 作為中介正典載體。
- 若未來要支援「不建 page 也建 task」，必須先新增另一條被正式建模的 published language，而不是直接在現有流程偷接 repository。

## Conflict Resolution

- 若未來有人想讓 source dialog 直接呼叫 workspace repository，應以本 ADR 為準並拒絕該改動。
- 若 workflow 需要更多資料，優先擴充 public API 或 event payload，不得跨 context import internals。

## Related Docs

- [0001-hexagonal-architecture.md](./0001-hexagonal-architecture.md)
- [0002-bounded-contexts.md](./0002-bounded-contexts.md)
- [0003-context-map.md](./0003-context-map.md)
- [../architecture/source-to-task-flow.md](../architecture/source-to-task-flow.md)
- [../examples/end-to-end/deliveries/upload-parse-to-task-flow.md](../examples/end-to-end/deliveries/upload-parse-to-task-flow.md)