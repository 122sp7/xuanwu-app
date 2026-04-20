# ADR 0001 — notebooklm `document` 重命名為 `source`

## Status

Accepted

## Date

2025-02-11

## Context

`src/modules/notebooklm/subdomains/document/` 是 notebooklm 的核心 subdomain，負責上傳來源文件、追蹤解析狀態、持有 DocumentSnapshot。

問題：**`document` 這個名稱在系統中存在嚴重衝突：**

1. **notion 層級衝突**：notion 模組的核心語言是 `KnowledgeArtifact`、`page`、`block`；其中 `page` 在 Notion 產品中就是「document」的直覺對應，造成語意混淆。
2. **ubiquitous language 違規**：`docs/structure/domain/subdomains.md` 明確定義 notebooklm 的 baseline subdomain 為 `source`，不是 `document`。
3. **published language token 衝突**：跨模組通訊時 `document` 這個 token 會讓接收方不知道指的是 notebooklm 來源文件、notion 知識頁面、還是 Firestore document。

對應的 `Document` entity、`DocumentSnapshot`、Firestore collection path 都以「document」命名，造成全域命名污染。

## Decision

### 重命名對照表

| 現有名稱 | 新名稱 |
|---|---|
| `subdomains/document/` | `subdomains/source/` |
| `Document` entity | `Source` entity |
| `DocumentId` | `SourceId` |
| `DocumentSnapshot` | `SourceSnapshot` |
| `DocumentRepository` | `SourceRepository` |
| `FirestoreDocumentRepository` | `FirestoreSourceRepository` |
| Firestore collection: `documents/` | `sources/` （或保持舊 collection 並 alias） |
| `parsedPageCount`, `parsedChunkCount` 等 snapshot fields | 保持欄位名稱，僅重命名型別容器 |

### 遷移策略（Strangler Pattern）

1. 新建 `subdomains/source/` 目錄結構。
2. 在新目錄建立 `Source` entity 與 `SourceRepository`，完整複製現有業務規則。
3. 更新 `notebooklm/index.ts` 的 public surface 改暴露 `Source` 相關類型。
4. 遷移 `src/app/` 中所有對 notebooklm document 的消費端改用新名稱。
5. 確認 Firestore Security Rules 更新（若 collection 重命名）。
6. 移除舊 `subdomains/document/` 目錄。

### Firestore Collection 決策

保留 Firestore 實際 collection path（`notebooklm/notebooks/{notebookId}/documents/{documentId}`）避免資料遷移成本，在 infrastructure adapter 層做名稱映射：

```typescript
// FirestoreSourceRepository — 使用 Firestore 舊路徑，但 TypeScript 介面是 Source
const col = db.collection(`notebooklm/notebooks/${notebookId}/documents`);
```

## Consequences

**正面：** 消除跨模組語言衝突；`source` 語意清晰（來源文件 = 可 grounding 的輸入）。  
**負面：** 需要大量重命名 PR，會觸發 TypeScript compiler 錯誤直到完成。  
**中性：** 如果選擇 Firestore collection 重命名，需要資料遷移腳本。目前建議在 adapter 做映射以避免遷移成本。

## References

- `docs/structure/domain/subdomains.md` — notebooklm baseline: `source` subdomain
- `docs/structure/domain/ubiquitous-language.md` — published language token 規則
- `src/modules/notebooklm/subdomains/document/` — 待遷移目錄
- `fn/src/infrastructure/persistence/firestore/document_repository.py` — fn/ 側的對應
