# ui-markdown

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)

## Package / Directory Index

- `index.tsx`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Markdown 渲染元件（react-markdown + remark-gfm）。

## 公開 API

```tsx
import { MarkdownRenderer, type MarkdownRendererProps } from '@ui-markdown'

<MarkdownRenderer markdown={text} className="my-prose-class" />
```

## 使用規則

- 預設維持安全渲染（不開 raw HTML）。
- GFM（表格、任務列表、刪除線）透過 `remark-gfm` 啟用。

## Context7 官方基線

- 文件：`/remarkjs/react-markdown`、`/remarkjs/remark-gfm`
