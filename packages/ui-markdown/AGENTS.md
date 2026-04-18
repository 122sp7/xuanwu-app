# ui-markdown — Agent Rules

此套件提供 **Markdown 渲染組件**，將 Markdown 字串轉換為格式化 HTML 輸出。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Markdown → HTML 渲染 | `MarkdownRenderer` React 組件 |
| Markdown 樣式設定 | 渲染組件的 Tailwind typography 主題 |
| Syntax highlight 設定 | 程式碼區塊 highlight 設定（shiki / prism） |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| Markdown 內容業務處理 | `src/modules/<context>/application/` |
| 富文字**編輯**功能 | `packages/ui-editor/` |
| AI 生成內容的後處理 | `src/modules/notebooklm/` 或 `src/modules/ai/` |

---

## 嚴禁

- 不得在組件內改變 Markdown 內容（sanitize 除外）
- 不得 import `src/modules/*`
- 若需要 sanitize，使用安全 library（如 `dompurify`），不得 bypass

## Alias

```ts
import { MarkdownRenderer } from '@ui-markdown'
```
