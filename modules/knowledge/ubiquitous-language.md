# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 頁面 | Page | 個人或團隊筆記頁面，含 title、parentPageId、blockIds | `domain/entities/content-page.entity.ts` |
| 區塊 | Block | 頁面內的原子內容單位（type、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| heading-3 \| image \| code \| bullet-list \| numbered-list \| divider \| quote` | `domain/value-objects/block-content.ts` |
| 頁面狀態 | PageStatus | `active \| archived` | `domain/entities/content-page.entity.ts` |
| 核准狀態 | ApprovalState | `pending \| approved`，用於 ingestion / approve 流程 | `domain/entities/content-page.entity.ts` |
| 驗證狀態 | PageVerificationState | `verified \| needs_review`，目前用於 wiki 型頁面 | `domain/entities/content-page.entity.ts` |
| 頁面擁有者 | PageOwner | `ownerId`，目前仍掛在 Page 上 | `domain/entities/content-page.entity.ts` |
| 頁面樹 | PageTree | 以 parentPageId 組成的頁面層級結構 | — |
| 知識集合 | KnowledgeCollection | 暫留在本模組的頁面集合空間，可為 `database` 或 `wiki` | `domain/entities/knowledge-collection.entity.ts` |

## 禁止替換術語

| 正確（此 BC） | 禁止 | 備註 |
|------|------|------|
| `Page` | Document、Note | — |
| `Block` | Node、Element、Item | — |
| `KnowledgeCollection` | Database、Wiki（在跨 BC 討論中） | 在本 BC 內是過渡術語 |

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

## 術語補充

- `Page` 與 `Article` 不能混用：前者是個人 / 工作區筆記頁，後者是組織知識文章
- `KnowledgeCollection` 不等於最終的 `Database` bounded context；它是目前 code 中尚未完全抽離的結構化空間
- `PageVerificationState` 雖然名稱靠近 wiki governance，但目前仍是 `knowledge` 內的 page metadata
