# ui-markdown

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
