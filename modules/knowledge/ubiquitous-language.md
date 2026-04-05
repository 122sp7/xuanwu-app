# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 頁面 | Page | 個人或團隊筆記頁面，含 title、parentPageId、blockIds | `domain/entities/content-page.entity.ts` |
| 區塊 | Block | 頁面內的原子內容單位（type、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| todo \| ...` | `domain/value-objects/block-content.ts` |
| 頁面狀態 | PageStatus | `active \| archived` | `domain/entities/content-page.entity.ts` |
| 頁面樹 | PageTree | 以 parentPageId 組成的頁面層級結構 | — |

## 禁止替換術語

| 正確（此 BC） | 禁止 | 備註 |
|------|------|------|
| `Page` | Document、Note | — |
| `Block` | Node、Element、Item | — |

## 跨 BC 術語邊界

| 術語 | 正確 BC |
|------|---------|
| `Article` | `knowledge-base` |
| `Category` | `knowledge-base` |
| `Comment` | `knowledge-collaboration` |
| `Version` | `knowledge-collaboration` |
| `Permission` | `knowledge-collaboration` |
| `Database` | `knowledge-database` |
| `Record` | `knowledge-database` |
| `View` | `knowledge-database` |
