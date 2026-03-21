# ADR 001: 企業文件解析策略選擇

## 狀態 (Status)
**Accepted (已採納)**

## 背景 (Context)
企業知識庫（Enterprise Knowledge Base）的核心價值在於數據的準確度。我們需要處理包含以下特徵的複雜文件：
1.  **多欄位佈局**（如論文、新聞稿）。
2.  **嵌入式表格**（如財務報表、規格表）。
3.  **非結構化內容**（如手寫簽名或掃描件）。

傳統的開源 Node.js/Python 庫（如 `pdf-parse`, `PyPDF2`）僅能提取純文字流，會導致表格數據亂序，嚴重影響後續向量搜尋（Vector Search）與 RAG 的回答品質。

## 決策 (Decision)
我們決定採用 **Google Cloud Document AI (Layout Parser)** 作為核心解析引擎，並運行於 **Firebase Functions (Python)** 環境中。

### 選擇理由：
* **佈局感知 (Layout Awareness)：** 能夠識別標題、段落、清單與表格，並保持其邏輯結構。
* **表格提取：** 能將 PDF 中的表格完整轉化為結構化數據（JSON/Markdown），這對企業數據分析至關重要。
* **OCR 整合：** 內建強大的 OCR 引擎，支援掃描檔與低畫質文件。
* **原生整合：** 作為 Google Cloud 生態系，與 Firebase Storage 和 Firestore 的權限連動最為順暢。

## 方案對比 (Alternatives Considered)

| 方案 | 優點 | 缺點 | 結論 |
| :--- | :--- | :--- | :--- |
| **LangChain (PyPDF)** | 免費、開源、本地運行。 | 無法處理表格，對掃描檔無效。 | 僅適合純文字簡單文件。 |
| **Amazon Textract** | 功能強大，表格處理佳。 | 跨雲傳輸增加延遲與複雜度。 | 若非 AWS 環境則不考慮。 |
| **Document AI** | **表格處理最強，支援中文優化。** | **需按頁付費。** | **最符合企業級精準度需求。** |

## 後果 (Consequences)

### 正面影響 (Pros)：
1.  **高精準度：** 存入 Firestore 的文字具備結構化標記，大幅提升 RAG 回答的正確率。
2.  **簡化開發：** 減少了手寫正則表達式（Regex）或複雜清洗邏輯的需求。
3.  **擴展性：** Firebase Functions 可根據文件量自動擴展解析能力。

### 負面影響 (Cons)：
1.  **營運成本：** 每解析一頁文件都會產生費用（需監控使用量）。
2.  **冷啟動延遲：** Python Runtime 載入 Google SDK 較慢，上傳後可能需等待數秒才可搜尋。

---

## 相關參考 (References)
* [Google Cloud Document AI Documentation](https://cloud.google.com/document-ai/docs)
* [Firebase Firestore Vector Search Extension](https://firebase.google.com/docs/firestore/vector-search)

---
