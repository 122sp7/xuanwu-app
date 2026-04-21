# ADR 0005 — SAP PO 結構化提取策略：Gemini Multimodal PDF + Zod Schema

## Status

Proposed

## Date

2025-07-14

## Context

系統必須處理由 **SAP NetWeaver 750** 生成的工程採購訂單 PDF（如 PO #4510250181，配電盤 SCADA 工程，ABB Ltd.）。此類文件具有以下特徵：

### SAP PO PDF 結構特徵

| 特徵 | 說明 | 挑戰程度 |
|---|---|---|
| **無語意標記** | `IsAcroFormPresent: false`、`IsXFAPresent: false`，純視覺 layout | 高 |
| **多列品項 pattern** | 每個 line item = 4 row（主資料、折扣、小計、描述） | 高 |
| **混合內容類型** | 表格（品項）+ prose（條款）+ checkbox list（工安申報） | 中 |
| **繁體中文 + 技術術語** | RTU、FO box、SM-24C 光纖、電壓等級（161kV/22.8kV/4.16kV） | 中 |
| **低信心度表格解析** | Document AI Layout Parser 信心度 30-74%（平均 ~50%） | 高 |
| **多層工程分類** | 9 大類（（一）SCADA站內工程…（玖）利潤及雜費），每類多品項 | 中 |

### 現行 fn/ pipeline 的不足

現行 Document AI pipeline（Layout Parser `929c4719f45b1eee` + Form Parser `7318076ba71e0758`）：
- 提取頁面 layout 元素（文字區塊、表格、列表）
- **不具備** multi-row line item 合併能力（4 rows → 1 LineItem）
- **不具備** 工程分類 hierarchy 提取
- **不具備** 財務數字正規化（折扣、小計、含稅計算）
- **不具備** 針對特定文件類型的 domain schema 對應

### Context7 驗證結果（Genkit 官方文件）

1. **Gemini multimodal PDF 處理**（已驗證）：
   ```typescript
   const response = await ai.generate({
     model: googleAI.model('gemini-flash-latest'),
     prompt: [
       { text: 'Extract structured data' },
       { media: { contentType: 'application/pdf', url: 'gs://...' } },
     ],
   });
   ```

2. **Zod schema 結構化輸出**（已驗證）：
   ```typescript
   const response = await ai.generate({
     output: { schema: PurchaseOrderSchema },  // Zod schema
     prompt: [{ media: { contentType: 'application/pdf', url: gcsPdfUrl } }],
   });
   ```

3. **Genkit Flow 封裝**（已驗證）：可定義 `inputSchema` / `outputSchema` 的可追蹤 flow，整合進現有 fn/ Genkit 架構

## Decision

採用 **雙層提取策略**：

### Layer 1 — Document AI Layout Parser（保留，用於 pre-processing）

- 功能：提取全文 text、識別頁面分區（header / body / footer）、粗提取表格 bounding box
- 目的：為 Layer 2 提供分頁、分區輸入；不期待其精確解析 SAP 表格結構
- 觸發條件：所有進入 fn/ 的 PDF source

### Layer 2 — Gemini Multimodal PDF Extraction（新增，用於 SAP PO）

- 功能：理解多列品項語意、提取工程分類 hierarchy、正規化財務數字
- 實作：Genkit Flow + Zod schema（見 data/0003）
- 觸發條件：source 被分類為 `PurchaseOrder` 類型時激活（source type routing）
- 模型選擇：`gemini-2.5-flash`（速度與精度平衡；複雜表格可升級至 `gemini-2.5-pro`）

### Extraction Flow 設計（fn/ 層）

```python
# fn/src/application/flows/extract_purchase_order.py
async def extract_purchase_order(gcs_pdf_uri: str) -> PurchaseOrderExtraction:
    """
    Layer 1: Document AI Layout Parser → 分頁文字 + 頁面數
    Layer 2: Gemini PDF extraction → structured PurchaseOrder schema
    """
    # Step 1: Layout parse for page count + basic text
    layout_result = await document_ai_client.process(gcs_pdf_uri)
    
    # Step 2: Gemini structured extraction
    genkit_result = await genkit_flow.run('extractPurchaseOrder', {
        'pdfUri': gcs_pdf_uri,
        'pageCount': layout_result.page_count,
    })
    
    return PurchaseOrderExtraction(
        header=genkit_result.header,
        line_items=genkit_result.lineItems,
        work_categories=genkit_result.workCategories,
        financial_summary=genkit_result.financialSummary,
        terms_text=genkit_result.termsText,
    )
```

### Zod Schema（TypeScript side，供 Genkit Flow 使用）

```typescript
// packages/integration-ai/schemas/purchase-order.schema.ts
import { z } from 'genkit';

export const LineItemSchema = z.object({
  itemNo: z.number().describe('項次（步進 10）'),
  partNo: z.string().describe('料號（如 3RDTW5BD）'),
  description: z.string().describe('工程描述'),
  quantity: z.number(),
  unit: z.string().default('SET'),
  unitPrice: z.number().describe('單價 TWD'),
  discount: z.number().describe('折扣金額（負值）'),
  subtotal: z.number().describe('小計 TWD'),
  deliveryDate: z.string().describe('交貨日期 YYYY-MM-DD'),
  workCategoryCode: z.string().describe('所屬工程大類代碼'),
});

export const WorkCategorySchema = z.object({
  code: z.string().describe('（一）〜（玖）或 （壹）〜（玖）等'),
  name: z.string().describe('工程大類名稱'),
  subtotal: z.number().describe('該大類合計金額'),
  itemNos: z.array(z.number()).describe('包含的項次清單'),
});

export const PurchaseOrderSchema = z.object({
  poNumber: z.string(),
  poDate: z.string(),
  version: z.string().default('0'),
  buyerName: z.string(),
  buyerTaxId: z.string(),
  vendorName: z.string(),
  vendorId: z.string(),
  projectName: z.string(),
  costRef: z.string(),
  deliveryDate: z.string(),
  paymentTerms: z.string(),
  lineItems: z.array(LineItemSchema),
  workCategories: z.array(WorkCategorySchema),
  subtotalExcludingTax: z.number(),
  taxAmount: z.number(),
  totalIncludingTax: z.number(),
  taxRate: z.number().default(0.05),
  termsAndConditions: z.string().describe('採購條款全文'),
});
```

### Content Type Segmentation（新增規則）

SAP PO PDF 的三種內容區域必須分開處理：

| 區域 | 頁面 | 處理策略 |
|---|---|---|
| **品項表格** | P1-7（訂單主體） | Gemini structured extraction |
| **條款文字** | P8-12（採購條款） | Layout Parser text → prose chunk |
| **Checkbox 清單** | P7（工安申報） | Form Parser checkbox extraction |

## Consequences

### 正面

- Gemini 原生理解 SAP multi-row line item 語意，不需 custom row-grouping logic
- Zod schema 確保提取結果型別安全，符合 Mandatory Compliance Rule 4
- 雙層架構保留 Layout Parser 作為 fallback 和全文索引，維持現有 RAG pipeline
- content type routing 讓各區域使用最適合的解析策略

### 負面

- Gemini API 呼叫成本高於 Document AI（~10-20x per page）
- 單頁 PDF 限制：Gemini Flash 支援最多 300 頁 PDF（SAP PO 通常 < 20 頁，安全）
- 需要 GCS URI（`gs://`）作為 Gemini PDF 輸入；不能直接傳 binary buffer

### 中性

- 需為 fn/ 新增 Genkit JS 或保持 Python + Google Gen AI SDK（路徑擇一，見 Consequences）
- `fn/` 是 Python 層；Genkit 官方 JS SDK 整合需透過 Cloud Functions HTTP call 或 Python Vertex AI SDK 替代

### fn/ 技術約束

`fn/` 使用 Python，Genkit 官方 SDK 是 JavaScript/Go。解決方案：

**選項 A（推薦）**: Python `google-genai` SDK（`pip install google-genai`）直接呼叫 Gemini，搭配 Pydantic schema
```python
from google import genai
from pydantic import BaseModel

client = genai.Client()
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        types.Part.from_uri(file_uri=gcs_uri, mime_type='application/pdf'),
        'Extract purchase order as JSON per schema',
    ],
    config=types.GenerateContentConfig(
        response_mime_type='application/json',
        response_schema=PurchaseOrderPydanticModel,
    ),
)
```

**選項 B（備選）**: 建立獨立 Cloud Function（Node.js/TypeScript + Genkit），fn/ Python 透過 HTTP 呼叫

**決策**: 採用選項 A，保持 fn/ 語言統一性，降低運維複雜度。

## References

- Context7 驗證：`/websites/genkit_dev_js` → PDF Document Understanding with Gemini
- Context7 驗證：`/websites/cloud_google_document-ai` → Layout Parser + Form Parser capabilities
- PDF 驗證文件：`4510250181-AP8_v0-8150.PDF`（SAP NetWeaver 750, PO #4510250181）
- [data/0003-purchase-order-source-schema.md](../data/0003-purchase-order-source-schema.md)
- [domain/0005-purchase-order-source-domain-model.md](../domain/0005-purchase-order-source-domain-model.md)
- [fn/AGENTS.md](../../../fn/AGENTS.md)
- [docs/structure/contexts/notebooklm/README.md](../../structure/contexts/notebooklm/README.md)
