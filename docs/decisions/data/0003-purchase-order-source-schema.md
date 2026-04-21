# ADR 0003 — Purchase Order Source Schema（Firestore + Pydantic）

## Status

Proposed

## Date

2025-07-14

## Context

[ADR ai/0005](../ai/0005-sap-po-structured-extraction-strategy.md) 決定採用 Gemini multimodal PDF 提取 SAP PO 結構化資料。提取結果需要：

1. **持久化**：以 Firestore 文件儲存 PO 提取結果（與 `notebooklm/source` 連結）
2. **可查詢**：支援按工程分類（WorkCategory）、金額範圍、交貨日期查詢
3. **可追溯**：Line Item 必須能回溯至原始 PDF 頁碼和 Gemini extraction confidence
4. **與現行 source schema 相容**：需與 `notebooklm/source` Firestore schema 整合，不替換現有機制

### 現行 Firestore Source Schema（notebooklm context）

根據現有程式碼（`fn/src/infrastructure/persistence/firestore/`），source 文件已有：
- `parsed.*`：Document AI 解析結果（`chunk_count`, `entity_count`, `page_count`）
- `rag.*`：向量化狀態（`status`, `chunk_count`, `vector_count`）
- `status`：處理狀態（pending / processing / done / error）

**缺口**：無 PO-specific structured extraction 欄位；無 line item 子集合；無財務摘要。

### 驗證文件（PO #4510250181）資料規模

- 54 個 line items（品項）
- 9 個 work categories（工程大類）
- 每個 line item：~8 個欄位 + 1 個描述字串
- 採購條款：~5 頁純文字

## Decision

### 1. Firestore Collection Structure

```
notebooklm_sources/{sourceId}
  ├─ [現有欄位保留不變]
  ├─ structured_type: "purchase_order" | null   ← 新增：文件類型路由
  └─ po_extraction_ref: string | null           ← 新增：指向 po_extractions 集合

po_extractions/{sourceId}                       ← 新增集合（sourceId 與 source 對應）
  ├─ po_number: string                          "4510250181"
  ├─ po_date: string                            "2025-02-11"
  ├─ version: string                            "0"
  ├─ buyer_name: string
  ├─ buyer_tax_id: string
  ├─ vendor_name: string
  ├─ vendor_id: string
  ├─ project_name: string                       "配電盤SCADA工程"
  ├─ cost_ref: string                           "6591401"
  ├─ delivery_date: string                      "2025-04-30"
  ├─ payment_terms: string
  ├─ subtotal_excl_tax: number                  81500000
  ├─ tax_amount: number                         4075001
  ├─ total_incl_tax: number                     85575001
  ├─ tax_rate: number                           0.05
  ├─ terms_text: string                         [採購條款全文]
  ├─ extraction_model: string                   "gemini-2.5-flash"
  ├─ extraction_confidence: number              0.0 ~ 1.0
  ├─ extracted_at: timestamp
  └─ line_items: array<LineItemDocument>        ← 內嵌陣列（54 items < Firestore 1MB limit）

po_extraction_categories/{sourceId}/categories/{categoryCode}
  ├─ code: string                               "（一）"、"（壹）" 等
  ├─ name: string                               "SCADA站內工程"
  ├─ subtotal: number
  └─ item_nos: array<number>
```

### 2. LineItemDocument（內嵌於 po_extractions）

```typescript
interface LineItemDocument {
  item_no: number;          // 10, 20, 30 ... 540
  part_no: string;          // "3RDTW5BD"
  description: string;      // 工程描述文字
  quantity: number;
  unit: string;             // "SET"
  unit_price: number;       // TWD
  discount: number;         // 折扣金額（負值）
  subtotal: number;         // 小計 TWD
  delivery_date: string;    // "2025-04-30"
  work_category_code: string; // "（一）" 等
}
```

**選擇內嵌陣列（vs. 子集合）的原因**：
- 54 個 line items × ~200 bytes/item ≈ 10KB，遠低於 Firestore 1MB 文件限制
- 整個 PO 需要原子性讀取（計算 category subtotal 需要全部 items）
- 子集合需要 N 次讀取，增加延遲和成本

### 3. Pydantic Schema（fn/ Python 層）

```python
# fn/src/domain/entities/purchase_order.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class LineItem(BaseModel):
    item_no: int = Field(description="項次")
    part_no: str = Field(description="料號")
    description: str = Field(description="工程描述")
    quantity: float
    unit: str = "SET"
    unit_price: float = Field(description="單價 TWD")
    discount: float = Field(description="折扣（通常為負值）")
    subtotal: float = Field(description="小計 TWD")
    delivery_date: str = Field(description="交貨日期 YYYY-MM-DD")
    work_category_code: str = Field(description="所屬工程大類代碼")

class WorkCategory(BaseModel):
    code: str = Field(description="大類代碼，如（一）、（壹）")
    name: str = Field(description="工程大類名稱")
    subtotal: float
    item_nos: list[int]

class PurchaseOrderExtraction(BaseModel):
    po_number: str
    po_date: str
    version: str = "0"
    buyer_name: str
    buyer_tax_id: Optional[str] = None
    vendor_name: str
    vendor_id: Optional[str] = None
    project_name: str
    cost_ref: Optional[str] = None
    delivery_date: str
    payment_terms: str
    line_items: list[LineItem]
    work_categories: list[WorkCategory]
    subtotal_excl_tax: float
    tax_amount: float
    total_incl_tax: float
    tax_rate: float = 0.05
    terms_and_conditions: str = ""
```

### 4. Source Type Routing（fn/ pipeline 修改）

```python
# fn/src/application/use_cases/process_source.py
async def route_structured_extraction(source_id: str, gcs_uri: str, mime_type: str) -> None:
    """決定是否觸發 PO 結構化提取"""
    if mime_type == 'application/pdf':
        # Heuristic: SAP PO 文件通常有 "採購訂單" 或 "Purchase Order" 在第一頁
        first_page_text = await get_first_page_text(gcs_uri)
        if is_purchase_order(first_page_text):
            await extract_purchase_order_flow(source_id, gcs_uri)
            await update_source_structured_type(source_id, 'purchase_order')

def is_purchase_order(text: str) -> bool:
    keywords = ['採購訂單', 'Purchase Order', '買方', '賣方', '料號', '單價']
    return sum(1 for kw in keywords if kw in text) >= 3
```

### 5. Firestore Security Rules（新增）

```javascript
// firestore.rules 新增
match /po_extractions/{sourceId} {
  allow read: if isAuthenticated() && hasWorkspaceAccess(sourceId);
  allow write: if isCloudFunction();  // 只允許 fn/ 寫入
}

match /po_extraction_categories/{sourceId}/categories/{categoryCode} {
  allow read: if isAuthenticated() && hasWorkspaceAccess(sourceId);
  allow write: if isCloudFunction();
}
```

## Consequences

### 正面

- `po_extractions` 集合獨立於現有 `notebooklm_sources`，不破壞現行 schema（Mandatory Compliance Rule 5 相容）
- `structured_type` 欄位提供清晰的類型路由，未來可擴展至 `invoice`、`contract`、`spec_sheet` 等
- LineItem 內嵌設計使整個 PO 可以一次讀取，支援 synthesis 的 category aggregation 查詢
- Pydantic schema 與 Gemini structured output 對齊，實現 end-to-end 型別安全

### 負面

- `po_extractions` 是新集合，需更新 `firestore.indexes.json` 和 `firestore.rules`
- `is_purchase_order()` 啟發式函數可能有誤判；需 confidence threshold 和 fallback

### 中性

- `terms_and_conditions` 欄位可能超大（5 頁條款文字）；若超過 100KB 應移至 Cloud Storage
- 現有 `parsed.*` / `rag.*` 欄位仍用於 RAG chunking；`po_extractions` 是額外的結構化 overlay

## References

- [ai/0005-sap-po-structured-extraction-strategy.md](../ai/0005-sap-po-structured-extraction-strategy.md)
- [domain/0005-purchase-order-source-domain-model.md](../domain/0005-purchase-order-source-domain-model.md)
- [data/0002-upstash-vector-rag-storage.md](./0002-upstash-vector-rag-storage.md)
- PDF 驗證文件：PO #4510250181（ABB Ltd.，配電盤 SCADA 工程，TWD 85,575,001）
- Context7 驗證：`/websites/cloud_google_document-ai` → Firestore BigQuery integration
- Firestore data model design: [firestore-schema.instructions.md](../../../.github/instructions/firestore-schema.instructions.md)
