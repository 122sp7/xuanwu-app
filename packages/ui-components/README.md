# ui-components

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


業務無關的自訂 UI 元件（wrap、design-system 擴充）。

## 公開 API

```ts
import {
  PageSection,
  type PageSectionProps,

  EmptyState,
  type EmptyStateProps,
} from '@ui-components'
```

## 使用規則

| 規則 | 說明 |
|---|---|
| **唯一放置自訂 UI 元件的位置** | 任何 wrap / 設計系統擴充都放此層 |
| **禁止含業務邏輯** | 業務語意放 `src/modules/*/interfaces/` |
| **不 import `src/modules/`** | UI 元件不得感知 domain |

## 判斷：放這裡 vs ui-shadcn

| 情況 | 放哪裡 |
|---|---|
| shadcn 官方組件（Button, Card, Input…） | `@ui-shadcn`（CLI 管理，不手改） |
| 對官方組件的 wrap / 業務語意層 | `@ui-components` |
| 跨 module 共用但無業務語意的 layout 元件 | `@ui-components` |
