# src/modules

## PURPOSE

src/modules 是唯一的 bounded-context 實作層。
這層承載各主域的 application/domain/infrastructure/interfaces 結構。
跨模組協作必須經由各模組公開邊界，不可直接穿透內部實作。

## GETTING STARTED

在 repo 根目錄啟動開發環境：

```bash
npm install
npm run dev
```

閱讀順序：

1. [AGENTS.md](AGENTS.md)
2. [../../docs/README.md](../../docs/README.md)
3. 目標 module 的 AGENTS/README

## ARCHITECTURE

modules 層以 bounded-context 為主軸：

- 每個 context 透過 index.ts 提供公開能力
- 內部遵循 interfaces -> application -> domain <- infrastructure
- 跨 context 協作透過 API boundary 或事件契約

## PROJECT STRUCTURE

| Module | Overview | Agent entry | Public boundary |
|---|---|---|---|
| ai | [ai/README.md](ai/README.md) | [ai/AGENTS.md](ai/AGENTS.md) | [ai/index.ts](ai/index.ts) |
| analytics | [analytics/README.md](analytics/README.md) | [analytics/AGENTS.md](analytics/AGENTS.md) | [analytics/index.ts](analytics/index.ts) |
| billing | [billing/README.md](billing/README.md) | [billing/AGENTS.md](billing/AGENTS.md) | [billing/index.ts](billing/index.ts) |
| iam | [iam/README.md](iam/README.md) | [iam/AGENTS.md](iam/AGENTS.md) | [iam/index.ts](iam/index.ts) |
| notebooklm | [notebooklm/README.md](notebooklm/README.md) | [notebooklm/AGENTS.md](notebooklm/AGENTS.md) | [notebooklm/index.ts](notebooklm/index.ts) |
| notion | [notion/README.md](notion/README.md) | [notion/AGENTS.md](notion/AGENTS.md) | [notion/index.ts](notion/index.ts) |
| platform | [platform/README.md](platform/README.md) | [platform/AGENTS.md](platform/AGENTS.md) | [platform/index.ts](platform/index.ts) |
| template | [template/README.md](template/README.md) | [template/AGENTS.md](template/AGENTS.md) | [template/index.ts](template/index.ts) |
| workspace | [workspace/README.md](workspace/README.md) | [workspace/AGENTS.md](workspace/AGENTS.md) | [workspace/index.ts](workspace/index.ts) |

## DEVELOPMENT RULES

- MUST confirm owning context before implementation.
- MUST expose cross-module collaboration only through module index.ts.
- MUST keep use-case orchestration in application layer and invariants in domain layer.
- MUST validate external input at interface boundary.

## AI INTEGRATION

AI 代理在 modules 層執行時，先對齊 docs 的戰略術語與所有權，再落地程式碼。
若術語缺失或衝突，先補文件權威再修改實作。

## DOCUMENTATION

- Routing rules: [AGENTS.md](AGENTS.md)
- src overview: [../README.md](../README.md)
- strategic authority: [../../docs/README.md](../../docs/README.md)
- template baseline: [template/README.md](template/README.md)

## USABILITY

- 新開發者可在 5 分鐘內找到目標 context。
- 可在 3 分鐘內透過 module table 定位公開邊界與對應規則檔。
