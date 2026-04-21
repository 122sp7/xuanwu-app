# ADR 0005 — PurchaseOrder Source Domain Model（notebooklm bounded context）

## Status

Proposed

## Date

2025-07-14

## Context

### 業務場景

系統必須能夠處理工程採購訂單（Purchase Order, PO）作為 notebooklm 的知識來源（Source）。典型文件如 ABB Ltd. PO #4510250181（配電盤 SCADA 工程，含稅 NTD 85,575,001，54 個品項，9 個工程大類）。

使用者期望能夠：
- 「SCADA 站內工程的總金額是多少？」→ 需要 WorkCategory aggregation
- 「RTU 機櫃的規格是什麼？」→ 需要 line item semantic search
- 「交貨日期是什麼？付款條件？」→ 需要 PO header extraction
- 「防火填塞的工程描述是什麼？」→ 需要 line item description retrieval

### 現行 notebooklm Source 模型的限制

現有 `notebooklm/source` subdomain 將所有 Source 視為同質的「文件 + RAG chunks」：
- `IngestionSourceSnapshot`（見 `src/modules/notebooklm/subdomains/source/domain/entities/IngestionSource.ts`）提供：
  - `parsedPageCount`, `parsedChunkCount`, `parsedEntityCount`
  - `ragChunkCount`, `ragVectorCount`, `ragStatus`
- **缺口**：無法表達「這個 source 是 PurchaseOrder，有 54 個 line items」
- 現有 synthesis 流程：純 RAG → 無法做 WorkCategory 加總（aggregation）

### Ubiquitous Language 確認

依 [ubiquitous-language.md](../../structure/domain/ubiquitous-language.md)：
- `notebooklm` bounded context 擁有：Notebook, Ingestion, Retrieval, Grounding, **Synthesis**, Evaluation
- Source 屬於 `source` subdomain（前身為 `document`，已在 domain/0001 正式更名）
- `PurchaseOrder` 不在現有詞彙表中 → **需要在本 ADR 中引入新術語**

### Naming Review（Rule 3 合規）

| 術語 | 歸屬 | 理由 |
|---|---|---|
| `PurchaseOrder` | notebooklm/source | PO 是一種 Source 類型，notebooklm 擁有 Source lifecycle |
| `LineItem` | notebooklm/source (local VO) | Line item 是 PO 的組成部分，與其他 bounded context 無交集 |
| `WorkCategory` | notebooklm/source (local VO) | 工程分類是 PO-specific 概念，不是跨域概念 |
| `StructuredSourceType` | notebooklm/source | 表達 source 的語意類型，用於 synthesis routing |

## Decision

### 1. StructuredSourceType — Source 類型辨識

在 `notebooklm/subdomains/source/domain` 引入 `StructuredSourceType` value object：

```typescript
// src/modules/notebooklm/subdomains/source/domain/value-objects/StructuredSourceType.ts
import { z } from 'zod';

export const StructuredSourceTypeSchema = z.enum([
  'unstructured',      // 一般文件（現有預設）
  'purchase_order',    // 採購訂單（SAP PO）
  'invoice',           // 發票（future）
  'contract',          // 合約（future）
  'specification',     // 技術規格書（future）
]).brand('StructuredSourceType');

export type StructuredSourceType = z.infer<typeof StructuredSourceTypeSchema>;
```

### 2. PurchaseOrderSummary — Source Aggregate 的擴展屬性

在 `Source` aggregate 新增可選的結構化摘要欄位（不替換現有 RAG 欄位）：

```typescript
// src/modules/notebooklm/subdomains/source/domain/entities/Source.ts（擴展）
export interface SourceSnapshot {
  // [現有欄位保留]
  id: SourceId;
  notebookId: NotebookId;
  status: SourceStatus;
  parsedPageCount?: number;
  parsedChunkCount?: number;
  ragStatus?: RagStatus;
  
  // 新增：結構化類型路由
  structuredType: StructuredSourceType;
  
  // 新增：PO 摘要（僅 structuredType === 'purchase_order' 時有值）
  purchaseOrderSummary?: PurchaseOrderSummarySnapshot;
}

export interface PurchaseOrderSummarySnapshot {
  poNumber: string;
  projectName: string;
  vendorName: string;
  deliveryDate: string;
  totalInclTax: number;
  lineItemCount: number;
  workCategoryCount: number;
  workCategories: WorkCategorySummary[];
}

export interface WorkCategorySummary {
  code: string;       // （一）〜（玖）
  name: string;       // "SCADA站內工程"
  subtotal: number;   // TWD
  itemCount: number;
}
```

### 3. PurchaseOrder — 獨立 Domain Entity（詳細查詢用）

當 synthesis 需要詳細品項資料時，使用獨立 entity：

```typescript
// src/modules/notebooklm/subdomains/source/domain/entities/PurchaseOrder.ts
import { z } from 'zod';

export const LineItemSchema = z.object({
  itemNo: z.number(),
  partNo: z.string(),
  description: z.string(),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z.number(),
  discount: z.number(),
  subtotal: z.number(),
  deliveryDate: z.string(),
  workCategoryCode: z.string(),
});

export const WorkCategorySchema = z.object({
  code: z.string(),
  name: z.string(),
  subtotal: z.number(),
  itemNos: z.array(z.number()),
});

export const PurchaseOrderSnapshotSchema = z.object({
  sourceId: z.string().uuid().brand('SourceId'),
  poNumber: z.string(),
  poDate: z.string(),
  buyerName: z.string(),
  buyerTaxId: z.string().optional(),
  vendorName: z.string(),
  vendorId: z.string().optional(),
  projectName: z.string(),
  costRef: z.string().optional(),
  deliveryDate: z.string(),
  paymentTerms: z.string(),
  lineItems: z.array(LineItemSchema),
  workCategories: z.array(WorkCategorySchema),
  subtotalExclTax: z.number(),
  taxAmount: z.number(),
  totalInclTax: z.number(),
  taxRate: z.number().default(0.05),
  termsAndConditions: z.string().optional(),
  extractedAt: z.string(),
  extractionModel: z.string(),
});

export type PurchaseOrderSnapshot = z.infer<typeof PurchaseOrderSnapshotSchema>;
```

### 4. Domain Service — PurchaseOrderSynthesisService

用於 synthesis 需要的 aggregation 邏輯（Domain Service，純業務規則）：

```typescript
// src/modules/notebooklm/subdomains/source/domain/services/PurchaseOrderSynthesisService.ts
export class PurchaseOrderSynthesisService {
  /**
   * 計算指定工程大類的小計
   * 例：「SCADA 站內工程的總金額」
   */
  calculateCategorySubtotal(
    po: PurchaseOrderSnapshot,
    categoryCode: string,
  ): number {
    const category = po.workCategories.find(c => c.code === categoryCode);
    return category?.subtotal ?? 0;
  }

  /**
   * 根據描述關鍵字找品項
   * 例：「RTU 機櫃」→ 返回相關 LineItem[]
   */
  findLineItemsByKeyword(
    po: PurchaseOrderSnapshot,
    keyword: string,
  ): LineItem[] {
    return po.lineItems.filter(item =>
      item.description.includes(keyword),
    );
  }

  /**
   * 產生財務摘要文字（供 synthesis grounding 使用）
   */
  generateFinancialSummary(po: PurchaseOrderSnapshot): string {
    const categories = po.workCategories
      .map(c => `  - ${c.name}：NTD ${c.subtotal.toLocaleString()}`)
      .join('\n');
    
    return `採購訂單 ${po.poNumber} 財務摘要：
工程名稱：${po.projectName}
賣方：${po.vendorName}
未稅金額：NTD ${po.subtotalExclTax.toLocaleString()}
含稅總計：NTD ${po.totalInclTax.toLocaleString()}
品項總數：${po.lineItems.length} 項
工程大類：
${categories}`;
  }
}
```

### 5. Source Aggregate 事件（Domain Events）

```typescript
// src/modules/notebooklm/subdomains/source/domain/events/SourceStructuredExtractionCompleted.ts
export interface SourceStructuredExtractionCompleted {
  type: 'notebooklm.source.structured-extraction-completed';
  occurredAt: string;
  payload: {
    sourceId: string;
    notebookId: string;
    structuredType: 'purchase_order';
    poNumber: string;
    lineItemCount: number;
    workCategoryCount: number;
    totalInclTax: number;
  };
}
```

### 6. Ubiquitous Language 更新（補充至 notebooklm/docs/ubiquitous-language.md）

| Term | Meaning | Owned By |
|---|---|---|
| `StructuredSourceType` | Source 文件的語意類型（unstructured / purchase_order / invoice / contract） | notebooklm/source |
| `PurchaseOrder` | 採購訂單型別的 Source 結構，包含 header、line items、work categories、財務摘要 | notebooklm/source |
| `LineItem` | PurchaseOrder 內的單一工程品項（項次、料號、描述、數量、金額） | notebooklm/source (local) |
| `WorkCategory` | PurchaseOrder 的工程大類分組（代碼、名稱、大類小計） | notebooklm/source (local) |
| `PurchaseOrderSummary` | 嵌入 Source snapshot 的 PO 快速摘要（供 notebook 層顯示） | notebooklm/source |

## Consequences

### 正面

- `StructuredSourceType` 作為路由機制，讓 synthesis 可以選擇 aggregation vs. RAG 策略
- `PurchaseOrderSynthesisService` 封裝財務聚合邏輯於 domain 層，不外溢到 application 或 UI
- `SourceStructuredExtractionCompleted` domain event 可觸發後續 notebook-level 摘要更新
- `PurchaseOrderSnapshot` 用 Zod schema 確保 type safety（Mandatory Compliance Rule 4）

### 負面

- `Source` entity 增加 `structuredType` + `purchaseOrderSummary` 欄位，需相應更新 `FirestoreSourceRepository`
- `PurchaseOrder` entity 是新增，需測試 Zod schema 驗證（Rule 14）

### 中性

- `LineItem` 和 `WorkCategory` 僅在 notebooklm/source 內部使用，不暴露給其他 bounded context（Rule 3）
- `termsAndConditions` 是採購條款全文，長度可能超過 500KB；synthesis 時應只取前 2000 字元作為 grounding context

### 合規映射（20 Mandatory Rules）

| Rule | 對應 |
|---|---|
| Rule 2 (Bounded Context) | `PurchaseOrder` 歸 notebooklm；`billing` 不擁有財務計算 |
| Rule 3 (Ubiquitous Language) | 新術語已定義於本 ADR §6 |
| Rule 4 (Schema Validation) | Zod schema 用於 PO extraction 結果驗證 |
| Rule 6 (Aggregate Design) | Source aggregate 透過 `setStructuredType()` method 修改狀態 |
| Rule 12 (Hexagonal) | `PurchaseOrderSynthesisService` 純 domain，無外部依賴 |
| Rule 14 (Testability) | `generateFinancialSummary()`、`calculateCategorySubtotal()` 可純函數測試 |
| Rule 17 (YAGNI) | `invoice`、`contract` 型別宣告為 future，不預建實作 |

## References

- [ai/0005-sap-po-structured-extraction-strategy.md](../ai/0005-sap-po-structured-extraction-strategy.md)
- [data/0003-purchase-order-source-schema.md](../data/0003-purchase-order-source-schema.md)
- [domain/0001-notebooklm-document-to-source-rename.md](./0001-notebooklm-document-to-source-rename.md)
- PDF 驗證：`4510250181-AP8_v0-8150.PDF`（ABB PO #4510250181，配電盤 SCADA 工程）
- [docs/structure/domain/ubiquitous-language.md](../../structure/domain/ubiquitous-language.md)
- [src/modules/notebooklm/AGENTS.md](../../../src/modules/notebooklm/AGENTS.md)
