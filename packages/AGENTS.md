# packages — Agent Rules

## Immediate Index

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Infra subgroup: [infra/AGENTS.md](infra/AGENTS.md)

## Package Index

### infra
- `infra/` —  ([AGENTS.md](infra/AGENTS.md) / [README.md](infra/README.md))

### integration
- `integration-ai/` — AI 服務整合封裝；SDK 細節應留在這裡。 ([AGENTS.md](integration-ai/AGENTS.md) / [README.md](integration-ai/README.md))
- `integration-firebase/` — Firebase Client SDK 封裝；modules/app 不直接 import Firebase SDK。 ([AGENTS.md](integration-firebase/AGENTS.md) / [README.md](integration-firebase/README.md))
- `integration-queue/` — 佇列與訊息發布整合封裝。 ([AGENTS.md](integration-queue/AGENTS.md) / [README.md](integration-queue/README.md))

### ui
- `ui-components/` — 共享自訂 UI 元件層。 ([AGENTS.md](ui-components/AGENTS.md) / [README.md](ui-components/README.md))
- `ui-dnd/` — 拖放能力封裝；消費端需以 client component 使用。 ([AGENTS.md](ui-dnd/AGENTS.md) / [README.md](ui-dnd/README.md))
- `ui-editor/` — 富文本編輯器封裝。 ([AGENTS.md](ui-editor/AGENTS.md) / [README.md](ui-editor/README.md))
- `ui-markdown/` — Markdown 渲染封裝。 ([AGENTS.md](ui-markdown/AGENTS.md) / [README.md](ui-markdown/README.md))
- `ui-shadcn/` — shadcn/ui 官方輸出目錄；`ui/` 仍由 CLI 管理。 ([AGENTS.md](ui-shadcn/AGENTS.md) / [README.md](ui-shadcn/README.md))
- `ui-vis/` — vis.js family 圖形 / 時間軸封裝；以實際匯出為準。 ([AGENTS.md](ui-vis/AGENTS.md) / [README.md](ui-vis/README.md))
- `ui-visualization/` — Recharts 視覺化封裝。 ([AGENTS.md](ui-visualization/AGENTS.md) / [README.md](ui-visualization/README.md))

## Routing Rules

- 外部 SDK 封裝與共享 UI / infra 原語放在 `packages/`。
- 業務規則仍回到 `src/modules/<context>/`。
- 子套件清單以實際目錄為準，不再手動維護易漂移的省略表。

## Drift Guard

- `AGENTS.md` 管 nested index 與放置決策。
- `README.md` 管 packages 層總覽。
