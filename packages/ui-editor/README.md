# ui-editor

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


TipTap 3 富文本編輯器封裝。提供 `RichTextEditor`（可編輯）與 `ReadOnlyEditor`（唯讀）兩個 React 元件。

## 套件結構

```
packages/ui-editor/
  index.ts    ← RichTextEditor + ReadOnlyEditor
  AGENTS.md
```

## 公開 API

```ts
import {
  RichTextEditor,
  type RichTextEditorProps,

  ReadOnlyEditor,
  type ReadOnlyEditorProps,
} from '@ui-editor'
```

## 使用範例

```tsx
'use client'

import { RichTextEditor, ReadOnlyEditor } from '@ui-editor'

// 可編輯
<RichTextEditor
  value={html}
  onChange={setHtml}
  placeholder="Start writing…"
/>

// 唯讀
<ReadOnlyEditor value={html} />
```

## 啟用的 TipTap 擴充

| 擴充 | 功能 |
|---|---|
| `@tiptap/starter-kit` | 段落、標題、列表、粗體、斜體、刪除線、程式碼等 |
| `@tiptap/extension-link` | 超連結（`openOnClick: false`） |
| `@tiptap/extension-underline` | 底線 |
| `@tiptap/extension-text-style` | 文字樣式容器 |
| `@tiptap/extension-color` | 文字色彩 |
| `@tiptap/extension-typography` | 智慧引號、Em dash 等排版轉換 |
| `@tiptap/extension-placeholder` | 佔位提示（僅 RichTextEditor） |

## 注意事項

- `immediatelyRender: false` — 避免 Next.js SSR hydration mismatch。
- 父元件需要 `'use client'` directive（RichTextEditor 使用 React hooks）。
- HTML 資料格式：TipTap 以 HTML string 輸入/輸出。

## Context7 官方基線

- 文件：`/ueberdosis/tiptap-docs`
- `useEditor` + `EditorContent` 是 React 整合方式。
- Next.js 下必須設定 `immediatelyRender: false`。
