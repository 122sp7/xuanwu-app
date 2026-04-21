# ui-editor — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/ui-editor/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **富文字編輯器的封裝層**：TipTap wrapper、editor 設定、extensions。

---

## Route Here

| 類型 | 說明 |
|---|---|
| TipTap Editor 組件 | `RichTextEditor`、`ReadOnlyEditor` 等 React 組件 |
| TipTap extension 設定 | 共用 extension 清單、toolbar 設定 |
| Editor 型別 | `EditorContent`、`EditorState` 等共用型別 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 文件內容業務邏輯 | `src/modules/notion/` |
| AI 寫作輔助邏輯 | `src/modules/ai/` |
| Markdown 純渲染（非編輯） | `packages/ui-markdown/` |

---

## 嚴禁

```ts
// ❌ 在 editor 套件加業務儲存邏輯
onUpdate({ editor }) { saveDocument(editor.getJSON()) }

// ✅ 透過 props 回調交給模組處理
<RichTextEditor onChange={(content) => props.onContentChange(content)} />
```

- 不得在此套件 import `src/modules/*`
- 不得包含 Firestore 讀寫操作

## Alias

```ts
import { RichTextEditor } from '@ui-editor'
```
