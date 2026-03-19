# ADR 002: RAG Upload Storage and Canonical Naming

## 狀態 (Status)
Accepted

## 背景 (Context)

企業級 RAG 若直接使用使用者原始檔名作為 Storage key 或 document primary identifier，通常會導致：

1. 重名覆蓋與碰撞。
2. rename 後 canonical reference 失效。
3. 特殊字元、語系與副檔名處理變得不穩定。
4. dedupe、retry、reprocess、archive 難以設計。

因此，上傳流程需要獨立定義 canonical naming 與 Storage path，而不是把它混在 schema 或 query 文件裡。

## 決策 (Decision)

採用以下固定規則：

1. `documentId` 由系統生成，是文件唯一 canonical identity。
2. `originalFilename` 僅作 display 與 audit，不作 primary key。
3. Firebase Storage path 必須 tenant-scoped。
4. raw file 固定採 `source{ext}` 命名，而非原始檔名。
5. derived outputs 使用固定子目錄，避免 ad hoc naming。

## 設計細節 (Design)

### 1. Canonical identifiers

#### `documentId`

`documentId` 必須是穩定、不可預測、系統生成的 ID，例如 UUID / ULID / ksuid 類型。

規則：

- 不得使用原始檔名作為 `documentId`
- 不得把 title、日期、slug 混入 canonical id
- 所有 chunks、feedback、cache、retry、reprocess 都必須關聯到 `documentId`

#### `originalFilename`

`originalFilename` 只用於：

- UI 顯示
- audit
- debug
- 下載時的 display name

不得用於：

- Storage primary key
- Firestore document id
- chunk identity

#### `title`

`title` 與 `originalFilename` 分離：

- `originalFilename`: 使用者上傳時的檔名
- `title`: product-facing 顯示名稱，可後續編輯

### 2. Storage path

建議 canonical path：

```text
organizations/{organizationId}/workspaces/{workspaceId}/documents/{documentId}/raw/source{ext}
```

例如：

```text
tenants/tnt_123/workspaces/ws_456/documents/doc_789/raw/source.pdf
```

設計原則：

1. `organizationId` 與 `workspaceId` 必須進入 path。
2. `documentId` 是該文件的 Storage root。
3. raw file 固定採 `source{ext}`。
4. bucket 內不得平鋪所有 document。

### 3. Derived outputs

衍生檔建議路徑：

```text
organizations/{organizationId}/workspaces/{workspaceId}/documents/{documentId}/derived/normalized.md
organizations/{organizationId}/workspaces/{workspaceId}/documents/{documentId}/derived/layout.json
organizations/{organizationId}/workspaces/{workspaceId}/documents/{documentId}/derived/preview.txt
```

若需版本化：

```text
organizations/{organizationId}/workspaces/{workspaceId}/documents/{documentId}/versions/{version}/raw/source{ext}
```

### 4. Upload ownership

Next.js 負責：

- 驗證 auth / session / workspace context
- 產生 `documentId`
- 上傳 raw file 到 Storage
- 建立初始 `documents` metadata

worker 不負責 browser-facing upload orchestration。

### 5. Naming summary

建議名稱：

- field: `documentId`
- field: `originalFilename`
- field: `title`
- field: `storageBucket`
- field: `storagePath`

避免名稱：

- `fileName` 同時表示 display name 與原始檔名
- `path` 這種模糊欄位名
- 以原始檔名作為 storage key

## Alternatives Considered

### 方案 A：直接用原始檔名當 Storage key

不採用。

原因：

- 易衝突、易覆蓋
- rename 會破壞 reference
- 不利於 retry 與 reprocess

### 方案 B：tenant / workspace 僅存在 Firestore，不進 Storage path

不採用。

原因：

- Storage 層失去隔離與巡檢能力
- 難以做清理、分桶、搬移與稽核

## 後果 (Consequences)

### 正面影響

1. Upload naming 穩定可重試。
2. 多租戶隔離從 binary storage 開始就成立。
3. 原始檔名與系統識別分離，後續資料治理更容易。

### 負面影響

1. 需要額外保存 `originalFilename` 與 `title`。
2. 使用者看到的檔名不再直接等於 storage key。

## Operational Notes

- Storage bucket 權限與路徑規則必須與 tenant / workspace 邊界一致。
- 若未來引入多 bucket 策略，仍不得改變 `documentId` 作為 canonical identity 的規則。
