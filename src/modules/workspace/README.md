# workspace

## PURPOSE

workspace 模組負責協作容器、分享範圍、活動、任務與工作區生命週期語言。
它是工作區協作流程的 owning context，不承接身份治理所有權。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

workspace 由 activity、api-key、approval、audit、feed、invitation、issue、lifecycle、membership、orchestration、quality、resource、schedule、settlement、share、task、task-formation 等子域組成。
跨模組整合應透過 [index.ts](index.ts) 消費公開能力。

## PROJECT STRUCTURE

- [subdomains/activity](subdomains/activity)
- [subdomains/api-key](subdomains/api-key)
- [subdomains/approval](subdomains/approval)
- [subdomains/audit](subdomains/audit)
- [subdomains/feed](subdomains/feed)
- [subdomains/invitation](subdomains/invitation)
- [subdomains/issue](subdomains/issue)
- [subdomains/lifecycle](subdomains/lifecycle)
- [subdomains/membership](subdomains/membership)
- [subdomains/orchestration](subdomains/orchestration)
- [subdomains/quality](subdomains/quality)
- [subdomains/resource](subdomains/resource)
- [subdomains/schedule](subdomains/schedule)
- [subdomains/settlement](subdomains/settlement)
- [subdomains/share](subdomains/share)
- [subdomains/task](subdomains/task)
- [subdomains/task-formation](subdomains/task-formation)

## DEVELOPMENT RULES

- MUST keep workspace as collaboration scope owner.
- MUST expose cross-module capability via [index.ts](index.ts).
- MUST keep workspaceId, membership, and share scope terminology explicit.
- MUST avoid mixing IAM, billing, or platform operational ownership into workspace.

## AI INTEGRATION

workspace 可提供 activity、task、resource 與 workflow signal 給 AI 或 analytics 消費。
任何 AI 整合都應透過已發布邊界完成，不直接依賴 workspace 內部模型。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內定位 workspace 的主要子域與協作責任。
- 可在 3 分鐘內判斷變更屬於 task、membership、share、feed 或 lifecycle。
