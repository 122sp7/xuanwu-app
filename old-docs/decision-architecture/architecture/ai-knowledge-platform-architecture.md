# 「Notion × Wiki × NotebookLM」融合架構學術指南

AI 知識系統與產品架構設計方法論（完整強化版）

---

## 一、研究背景：現代知識系統的三種典範

當代知識管理與文件系統，大致可分為三種代表性工具與架構思想：Notion、Wikipedia（Wiki 系統代表）、NotebookLM。這三者分別代表三種不同的知識系統設計哲學：

| 系統 | 核心模型 | 強項 |
| --- | --- | --- |
| Notion | Block + Database | UI / UX / 工作管理 |
| Wiki | Page + Link Graph | 知識結構 / 關聯 |
| NotebookLM | Document + Embedding | AI / RAG / 推理 |

產品級知識平台的發展方向不是選其中一個，而是三者融合。

---

## 二、Notion 核心功能完整解析

Notion 是以 Block Editor + Database System 為核心的工作空間平台，其設計哲學是「讓內容好整理、好使用」。

### 2.1 Block 系統（核心內容單元）

Notion 的最小單位是 Block，每個 Block 可獨立拖曳、轉換類型，並支援巢狀結構。

| Block 類型 | 說明 | 對應用途 |
| --- | --- | --- |
| Text / Heading | 純文字、H1 / H2 / H3 標題 | 文件撰寫 |
| Toggle | 可折疊的內容區塊 | FAQ / 摘要 |
| Callout | 強調提示框（含 emoji icon） | 警告 / 提示 |
| Code Block | 多語言語法高亮程式碼區塊 | 技術文件 |
| Quote | 引用樣式區塊 | 引言 / 備注 |
| Divider | 水平分隔線 | 版面分隔 |
| Table | 簡易表格（非 Database） | 靜態對比 |
| Image / Video / File | 媒體嵌入與檔案附件 | 富媒體內容 |
| Embed | 外部服務嵌入（Figma / YouTube / Map） | 整合外部工具 |
| Synced Block | 跨頁面同步區塊（修改一處全更新） | 共用內容模組 |
| Column Layout | 多欄排版（左右並排內容） | 版面設計 |
| Breadcrumb | 自動顯示頁面路徑麵包屑 | 導覽 |
| Table of Contents | 自動從 Heading 生成目錄 | 長文件導航 |

### 2.2 Database 系統（結構化資料核心）

Notion Database 是其最強大的功能，支援多種視圖與豐富的 Property 類型，本質是 NoSQL + 試算表的融合。

#### Database 視圖類型

| 視圖類型 | 說明 | 適用場景 |
| --- | --- | --- |
| Table View | 試算表式橫列縱欄顯示 | 資料總覽 / CRM |
| Board View | Kanban 看板（以 Select property 分欄） | 專案管理 / 工作流 |
| Gallery View | 卡片式圖片陳列 | 作品集 / 產品型錄 |
| List View | 簡潔清單（顯示標題 + 少量欄位） | 任務清單 / 閱讀清單 |
| Calendar View | 以日期 property 排列的月曆 | 排程 / 內容日曆 |
| Timeline View | 甘特圖式時間軸 | 專案時程規劃 |

#### Database Property 類型

| Property 類型 | 說明 |
| --- | --- |
| Text | 短文字或長文字輸入 |
| Number | 數字（支援格式化：貨幣、百分比、進度條） |
| Select | 單選下拉選單（含顏色標記） |
| Multi-select | 多選標籤 |
| Date | 日期 / 日期範圍 / 含提醒 |
| Checkbox | 完成狀態切換 |
| URL / Email / Phone | 格式化超連結輸入 |
| Person | 指定工作區成員 |
| Files & Media | 附件上傳 |
| Relation | 跨 Database 關聯（外鍵概念） |
| Rollup | 彙整 Relation 資料（sum / count / avg） |
| Formula | 自定義計算公式（引用其他 property） |
| Created time / Last edited time | 自動時間戳 |
| Created by / Last edited by | 自動記錄操作者 |
| ID | 自動遞增唯一識別碼 |
| Status | 工作流狀態（Not started / In progress / Done） |
| Button | 一鍵觸發動作（自動化 Action） |
| AI Property | 自動 AI 摘要 / 填寫（Notion AI 功能） |

### 2.3 Page 系統與導覽架構

| 功能 | 說明 |
| --- | --- |
| Page Tree（側邊欄） | 層階樹狀頁面結構，支援無限巢狀 |
| Breadcrumb | 頁面路徑顯示，支援快速跳轉 |
| Page Icon & Cover | 頁面圖示（emoji / 自訂圖片）與封面圖 |
| Sub-page | 頁面內建立子頁面（Block 形式嵌入） |
| Page Link / Mention | @mention 連結其他頁面（非雙向連結） |
| Favorites | 常用頁面加入收藏 |
| Backlinks | 顯示哪些頁面連結到此頁（弱版 Graph） |
| Page Lock | 鎖定頁面防止意外編輯 |

### 2.4 協作功能

| 功能 | 說明 |
| --- | --- |
| Real-time Collaboration | 多人同時編輯（即時同步） |
| Comment & Discussion | Block 層級留言與討論串 |
| Mention (@) | 提及成員觸發通知 |
| Page History | 頁面版本歷程（30 天 / 無限，依方案） |
| Permission System | 頁面層級權限（Full access / Can edit / Can comment / Can view） |
| Guest Access | 邀請外部用戶單頁存取 |
| Share to Web | 公開發布頁面為網頁 |
| Export | 匯出為 PDF / Markdown / HTML / CSV |

### 2.5 自動化與整合

| 功能 | 說明 |
| --- | --- |
| Notion AI | 內建 AI 寫作助手（摘要 / 翻譯 / 改寫 / Q&A） |
| Automation | Database 觸發自動化（當狀態改變時發通知 / 修改欄位） |
| API | 開放 REST API 供外部系統整合 |
| Webhook | 事件觸發 Webhook（搭配 Zapier / Make） |
| Template | 頁面與 Database 模板系統 |
| Import | 從 Confluence / Evernote / Markdown / CSV 匯入 |

---

## 三、Wiki 核心功能完整解析

Wiki 系統（以 Wikipedia / Confluence / MediaWiki 為代表）的本質是 Knowledge Graph，設計哲學是「讓知識彼此連結」。

### 3.1 頁面系統（Page = Graph Node）

| 功能 | 說明 |
| --- | --- |
| Page CRUD | 頁面建立 / 讀取 / 更新 / 刪除 |
| Namespace | 命名空間分類（Talk: / User: / Category: / File:） |
| Redirect | 重定向頁面（別名統一導向主條目） |
| Disambiguation | 消歧義頁面（同名詞條分流） |
| Stub | 不完整頁面標記（待補全提示） |
| Featured Article | 優質條目標記系統 |
| Page Protection | 頁面保護（防止匿名 / 新手 / 所有人編輯） |
| Transclusion | 跨頁面內容嵌入（Template 系統核心機制） |

### 3.2 連結與圖譜系統（Graph Model 核心）

| 功能 | 說明 | 技術意義 |
| --- | --- | --- |
| Internal Link | `[[頁面名稱]]` 雙方括號語法建立連結 | Knowledge Graph Edge |
| Backlinks | 自動追蹤「哪些頁面連結到此頁」 | 入度（In-degree）計算 |
| Redirect Link | 別名連結（同義詞指向正式頁面） | Entity Normalization |
| External Link | 引用外部網站 URL | 外部知識引用 |
| Interwiki Link | 跨 Wiki 站點連結（跨語言 / 跨站） | Federation |
| Category Link | 頁面隸屬分類（可多重分類） | Taxonomic Edge |
| Link Graph | 全站頁面連結視覺化圖譜 | Knowledge Map |
| Dead Link Detection | 偵測失效連結（紅色顯示） | Graph 完整性維護 |

### 3.3 版本控制系統（Version Control）

Wiki 的版本控制是其核心能力，每次編輯均自動快照，支援完整的比對與回溯。

| 功能 | 說明 |
| --- | --- |
| Edit History | 每次編輯自動記錄版本（含時間 / 作者 / 摘要） |
| Diff View | 逐行比對任意兩版本差異（增刪標色顯示） |
| Rollback | 一鍵回溯到任意歷史版本 |
| Blame（Annotate） | 每一行內容對應到最後一次修改的作者與版本 |
| Edit Summary | 每次提交附帶編輯說明（類似 Git commit message） |
| Minor Edit Flag | 標記為小修改（拼字更正 / 格式調整） |
| Pending Changes | 新手編輯需審核後才公開顯示 |
| Page Move History | 頁面重命名歷程追蹤（自動建立重定向） |

### 3.4 分類與標籤系統（Taxonomy Layer）

| 功能 | 說明 |
| --- | --- |
| Category System | 樹狀分類系統（Category 可繼承 / 巢狀） |
| Category Intersection | 多分類交集查詢（找同屬 A 且屬 B 的頁面） |
| Category Tree | 分類層級視覺化（根分類 → 子分類 → 頁面） |
| Template Tags | Template 作為語意標記（如 `{{Unreferenced}}` `{{Stub}}`） |
| Wikidata Integration | 連接結構化知識庫（Q-number 實體對齊） |

### 3.5 編輯與協作系統

| 功能 | 說明 |
| --- | --- |
| Wikitext / Markup | Wiki 專屬標記語法（`== 標題 ==` / `[[ ]]` 連結 / `{{ }}` Template） |
| Visual Editor | WYSIWYG 視覺化編輯器（無需學習 Wikitext） |
| Talk Page | 每個條目附帶討論頁（編輯協商空間） |
| User Page | 編輯者個人頁面（貢獻記錄 / 自我介紹） |
| Watchlist | 追蹤關注頁面的最新修改通知 |
| Edit Conflict Detection | 多人同時編輯時的衝突偵測與合併提示 |
| Rollback Permission | 快速回退惡意編輯（巡查員權限） |
| Patrol System | 新編輯標記「待審」，巡查員審核後標記通過 |

### 3.6 搜尋與導覽系統

| 功能 | 說明 |
| --- | --- |
| Full-text Search | 全文搜尋（含拼字糾正 / 近似詞匹配） |
| Prefix Search | 即時搜尋建議（輸入前綴自動補全） |
| Search by Category | 依分類篩選搜尋結果 |
| Special Pages | 系統自動生成的特殊頁面（孤立頁 / 死連結 / 最多連結頁） |
| Random Article | 隨機跳轉條目（知識探索功能） |
| What Links Here | 查詢哪些頁面連結到指定頁面（Backlink 探索） |
| Related Changes | 追蹤某頁面所有連結頁面的最新修改 |

### 3.7 Template 系統（知識模組化）

Template 是 Wiki 的代碼模組化機制，相當於 Wiki 的「元件系統」。

| 功能 | 說明 |
| --- | --- |
| Infobox Template | 右側資訊框（人物 / 地點 / 電影等結構化屬性） |
| Navigation Template | 底部導覽區塊（同系列條目快速跳轉） |
| Citation Template | 標準化引用格式（書籍 / 網站 / 期刊 cite 模板） |
| Warning Template | 條目品質警告標記（`{{POV}}` `{{Cleanup}}` 等） |
| Parameterized Template | 支援傳入參數的動態 Template（`{{{1}}}` 佔位符） |
| Transclusion | Template 內容直接嵌入目標頁面（非複製） |

---

## 四、Wiki 與 Notion 的本質差異（資料模型層）

### 4.1 Wiki：Graph Model（知識圖）

Wiki 系統本質資料模型：

```text
Page = Node
Link = Edge
→ Knowledge Graph
```

資料結構：pages / links / versions / categories / templates

特徵：
- 強調「知識與知識之間的關係」
- 非階層式，可形成網狀結構
- 雙向連結（Backlinks 自動維護）
- 適合知識庫、技術文件、研究資料

### 4.2 Notion：Block + Tree Model（內容結構）

Notion 資料模型：

```text
Page
 └── Blocks
     ├── Text
     ├── Heading
     ├── Table
     ├── Toggle
     └── Image
```

資料結構：pages / blocks / databases / properties / automations

特徵：
- 強調排版、資料表、UI 操作
- Relation property（單向 / 雙向）+ @mention（弱連結）
- 適合專案管理、文件、筆記、CRM

### 4.3 核心哲學差異對比

| 面向 | Wiki | Notion |
| --- | --- | --- |
| 核心 | 知識關聯 | 工作與內容 |
| 資料模型 | Graph | Tree + Database |
| 單位 | Page | Page + Block |
| 關聯 | Page Link（圖邊） | Relation Database（外鍵） |
| 連結方向 | 雙向（Backlink 追蹤） | 單向 / 雙向（需設定） |
| 版本控制 | 原生 Diff / Rollback | History（依方案） |
| 分類 | Category Tree（圖節點） | Tag / Filter（屬性） |
| Template | Transclusion 嵌入 | Template 頁面（複製） |
| 協作模式 | 開放編輯 + 審核制度 | 權限管理 + 即時協作 |
| 搜尋 | 全文 + Backlink + 分類 | 全文 + Database Filter |
| 強項 | 知識網絡 | UX / UI / 工作流 |
| 用途 | 知識庫 | 工作空間 |
| 思維 | Knowledge Graph | Structured Workspace |

關鍵一句話差異：
- **Wiki**：讓知識彼此連結
- **Notion**：讓內容好整理、好使用

---

## 五、NotebookLM 的角色（AI 層）

NotebookLM 代表第三種系統：AI 知識系統模型（RAG）。

資料流程：

```text
Documents
   ↓
Chunking
   ↓
Embedding
   ↓
Vector Database
   ↓
Retrieval
   ↓
LLM
   ↓
Answer / Summary / Reasoning
```

這種架構稱為：Retrieval-Augmented Generation（RAG）。

NotebookLM 本質不是筆記工具，而是 `AI Knowledge Reasoning System`，解決：文件理解、問答、摘要、推理、跨文件分析。

---

## 六、Query Understanding Layer（查詢理解層）

在使用者輸入問題到 RAG 系統之間，存在一層「查詢理解層」，負責解析、拆解與轉化查詢意圖。

### Query Planner 架構

```text
User Input
    ↓
Query Understanding Layer
    ├── Intent Classification（意圖分類）
    ├── Query Decomposition（查詢拆解）
    ├── Query Rewriting（查詢改寫）
    ├── Hypothetical Document Embedding (HyDE)
    └── Sub-query Generation（子查詢生成）
    ↓
Retrieval Layer
```

### 核心功能

| 功能 | 說明 |
| --- | --- |
| Intent Classification | 分類：問答 / 摘要 / 比較 / 推理 |
| Query Decomposition | 複雜問題拆成多個子問題 |
| Query Rewriting | 改寫為更適合向量搜尋的語句 |
| HyDE | 先生成假設文件再做 embedding 搜尋 |
| Multi-step Planning | 規劃多步推理路徑 |

Query Understanding 是提升 RAG 精準度的關鍵前處理層。

---

## 七、AI Memory Layer（三層記憶架構）

NotebookLM 的「記憶」由三種記憶類型組成：

```text
AI Memory Layer
├── 1. Semantic Memory（語意記憶）
│       → Embedding / Vector Database
├── 2. Episodic Memory（互動記憶）
│       → User Interaction History / Sessions
└── 3. Working Memory（上下文記憶）
        → Current Chat Context Window
```

### 三層記憶對比

| 記憶類型 | 範圍 | 持久性 | 技術實作 |
| --- | --- | --- | --- |
| Semantic Memory | 知識庫 | 長期 | Vector DB（Pinecone / Firestore Vector） |
| Episodic Memory | 使用者歷史 | 中期 | Session Store（Firestore sessions） |
| Working Memory | 當前對話 | 短期 | Context Buffer（in-memory） |

完整 AI Memory 層 = 三層協同運作，而非僅有 Embedding。

---

## 八、Indexing Strategy Layer（索引策略層）

索引策略決定了 RAG 的搜尋能力上限。單一 Vector Search 不足以支撐複雜查詢。

### Hybrid Retrieval（多索引融合）

```text
User Query
    ↓
┌─────────────────────────────────┐
│       Hybrid Retrieval Layer     │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Dense   │  │   Sparse    │  │
│  │ Retrieval│  │  Retrieval  │  │
│  │(Vector)  │  │(BM25/TF-IDF)│  │
│  └────┬─────┘  └──────┬──────┘  │
│       └────────┬───────┘         │
│           ┌────┴──────┐          │
│           │  Reranker  │          │
│           └────────────┘          │
└─────────────────────────────────┘
    ↓
Top-K Results → LLM
```

### 索引策略類型

| 索引類型 | 說明 | 適用場景 |
| --- | --- | --- |
| Dense（Vector） | 語意相似性搜尋 | 概念性問題 |
| Sparse（BM25） | 關鍵字精確匹配 | 術語 / 代碼搜尋 |
| Hybrid | Dense + Sparse 融合 | 通用場景 |
| Graph Index | 知識圖譜關係搜尋 | 推理 / 關聯查詢 |
| Hierarchical | 階層式索引（文件→段落→句子） | 長文件 |

### Reranker（重排序）

```text
Initial Retrieval Results (Top-50)
    ↓
Cross-Encoder Reranker
    ↓
Final Top-K (Top-5 / Top-10)
    ↓
LLM Context
```

Hybrid Retrieval + Reranker 是企業級 RAG 系統標準配置。

---

## 九、Graph-Augmented RAG（圖增強檢索）

Graph-Augmented RAG 將知識圖譜與向量搜尋融合，解決純 Vector Search 無法處理的多跳推理問題。

### 架構圖

```text
User Query
    ↓
┌──────────────────────────────────────┐
│         Graph-Augmented RAG           │
│                                        │
│  ┌──────────────┐  ┌───────────────┐  │
│  │ Vector Search │  │  Graph Search │  │
│  │  (Semantic)   │  │ (Relational)  │  │
│  └──────┬────────┘  └───────┬───────┘  │
│         └──────────┬────────┘          │
│              ┌─────┴──────┐            │
│              │  Fusion     │            │
│              │  & Ranking  │            │
│              └─────────────┘            │
└──────────────────────────────────────┘
    ↓
LLM（with graph context）
```

### 知識圖譜結構

```text
Entity Node：概念 / 實體 / 頁面
    ↓
Relation Edge：IS_A / PART_OF / RELATED_TO / CAUSES
    ↓
Knowledge Graph（可導航推理路徑）
```

### Graph vs. Vector 比較

| 面向 | Vector Search | Graph Search |
| --- | --- | --- |
| 搜尋基礎 | 語意相似度 | 實體關係路徑 |
| 強項 | 模糊語意匹配 | 精確關係推理 |
| 弱點 | 無關係推理 | 稀疏圖效果差 |
| 融合效果 | 互補，共同支撐複雜查詢 | ← |

Graph-Augmented RAG 是下一代知識系統的核心競爭力。

---

## 十、Multi-Document Reasoning（跨文件推理）

### Multi-hop Reasoning（多步推理）

```text
Complex Question
    ↓
Query Decomposition（拆解子問題）
    ↓
Sub-query 1 → Document A
Sub-query 2 → Document B
Sub-query 3 → Document C
    ↓
Evidence Aggregation（證據彙整）
    ↓
Multi-hop Reasoning（多步推理）
    ↓
Final Answer（綜合回答）
```

### 推理類型

| 推理類型 | 說明 |
| --- | --- |
| Bridge Reasoning | A → B → C 鏈式推理 |
| Comparison Reasoning | A vs. B 比較推理 |
| Compositional Reasoning | 組合多條件推理 |
| Temporal Reasoning | 時間序列推理 |

### 跨文件分析能力

```text
Document 1（技術文件）
Document 2（規格書）
Document 3（會議記錄）
    ↓
Cross-Document Analysis
    ├── 矛盾偵測（Contradiction Detection）
    ├── 知識補全（Knowledge Completion）
    └── 時間線整合（Timeline Synthesis）
    ↓
Unified Answer with Source Attribution
```

---

## 十一、Source Grounding / Citation System（引用系統）

AI 回答必須可追溯（Traceable）與可驗證（Verifiable），這是企業級 AI 系統的核心需求。

### Citation 架構

```text
LLM Answer
    ↓
Citation Extraction（引用萃取）
    ↓
Source Mapping（來源對應）
    ├── Document ID
    ├── Chunk ID
    ├── Page / Section
    └── Confidence Score
    ↓
Grounded Answer（可追溯回答）
```

### 引用輸出格式

```text
回答：「根據文件 A 第 3 節¹ 與文件 B 第 7 頁²，系統設計應採用...」

¹ 文件A - 系統規格書 v2.1, 第3節, 第12頁
² 文件B - 架構設計文件, 第7頁
```

### Grounding 驗證層

| 驗證項目 | 說明 |
| --- | --- |
| Faithfulness | 回答是否忠實於來源文件 |
| Relevance | 引用來源是否與問題相關 |
| Completeness | 是否涵蓋所有必要資訊 |
| Hallucination Detection | 偵測 LLM 幻覺輸出 |

Source Grounding 讓 AI 回答從「黑盒」變成「可審計系統」。

---

## 十二、Ingestion Pipeline（資料生命週期）

完整的資料生命週期管理，從原始文件到可查詢知識庫的完整流程。

### 完整 Ingestion Pipeline

```text
Raw Documents（原始資料）
    ↓
1. Parse（解析）
   ├── PDF / DOCX / HTML / Markdown
   ├── Table Extraction
   └── Image OCR
    ↓
2. Clean（清洗）
   ├── Remove noise / boilerplate
   ├── Normalize encoding
   └── Language detection
    ↓
3. Taxonomy（分類標記）
   ├── Auto-tagging
   ├── Category classification
   └── Metadata extraction
    ↓
4. Chunk（分塊）
   ├── Semantic chunking
   ├── Hierarchical chunking
   └── Overlap strategy
    ↓
5. Chunk Metadata（塊 metadata）
   ├── source_doc_id
   ├── section / heading path
   ├── page_number
   └── chunk_index
    ↓
6. Embedding（向量化）
   ├── Embedding model selection
   └── Batch embedding generation
    ↓
7. Firestore Writes（持久化）
   ├── Vector store
   ├── Metadata store
   └── Document registry
    ↓
8. Mark Ready（標記就緒）
   └── status: "indexed" → available for query
```

### 資料狀態機

```text
uploaded → parsing → chunking → embedding → indexed → stale → re-indexing
```

### Ingestion 品質指標

| 指標 | 說明 |
| --- | --- |
| Parse Success Rate | 文件成功解析率 |
| Chunk Quality Score | 分塊語意完整性 |
| Embedding Coverage | Embedding 覆蓋率 |
| Index Latency | 完整 Pipeline 耗時 |

---

## 十三、Tool / Agent Layer（工具調用層）

AI 系統從「回答問題」進化到「執行動作」，需要 Tool / Agent 層支撐。

### Agent 架構

```text
User Request
    ↓
Agent Orchestrator
    ↓
┌─────────────────────────────────────┐
│              Tool Registry           │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Search  │  │  Knowledge Graph │ │
│  │  Tool    │  │  Query Tool      │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Create  │  │   Summarize      │ │
│  │  Doc     │  │   Tool           │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Link    │  │   External API   │ │
│  │  Pages   │  │   Connector      │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
    ↓
Action Execution → Result → User
```

### 工具類型

| 工具類型 | 說明 | 對應功能 |
| --- | --- | --- |
| Retrieval Tool | 知識庫搜尋 | Vector + Graph Search |
| Creation Tool | 文件 / 頁面自動生成 | Auto-draft |
| Summarization Tool | 文件摘要 | Auto Summary |
| Linking Tool | 知識圖譜連結 | Auto Link |
| Classification Tool | 自動標記 / 分類 | Auto Tag |
| External Tool | 呼叫外部 API | 第三方整合 |

### ReAct / Chain-of-Thought 模式

```text
Thought: 使用者想了解 X，需要先查 Y 再推論 Z
Action: search_tool("Y")
Observation: [retrieved context]
Thought: 已取得 Y，現在推論 Z
Action: reasoning_tool("Z given Y")
Final Answer: [grounded answer with citations]
```

---

## 十四、Schema + Ontology Layer（知識語意層）

知識語意層定義「知識的意義」與「概念間的關係」，讓 AI 能理解領域語意而非僅做字串匹配。

### Ontology 結構

```text
Domain Ontology
    ├── Classes（類別）
    │       ├── Document
    │       ├── Person
    │       ├── Project
    │       └── Concept
    ├── Properties（屬性）
    │       ├── hasAuthor
    │       ├── createdAt
    │       └── relatedTo
    └── Relations（關係）
            ├── IS_A（繼承）
            ├── PART_OF（組成）
            ├── DEPENDS_ON（依賴）
            └── CONTRADICTS（矛盾）
```

### Schema 層用途

| 用途 | 說明 |
| --- | --- |
| Entity Normalization | 統一同義詞 / 別名 |
| Relation Typing | 為圖譜邊定義語意類型 |
| Query Semantics | 理解查詢的業務語意 |
| Knowledge Validation | 驗證知識一致性 |

### Ontology 與 RAG 整合

```text
User Query（自然語言）
    ↓
Ontology Mapping（概念對齊）
    ↓
Enriched Query（附帶語意上下文）
    ↓
Graph + Vector Retrieval
    ↓
Semantically Grounded Answer
```

Schema + Ontology 層讓知識系統從「資料庫」進化為「知識庫」。

---

## 十五、三種系統的架構分層（非常重要）

```text
┌──────────────────────┐
│        AI Layer       │  ← NotebookLM / RAG
├──────────────────────┤
│   Knowledge Graph     │  ← Wiki
├──────────────────────┤
│   Content / UI Layer  │  ← Notion
└──────────────────────┘
```

| 層 | 功能 | 對應系統 |
| --- | --- | --- |
| AI Layer | 搜尋、問答、推理 | NotebookLM / RAG |
| Graph Layer | 知識關聯 | Wiki |
| Content / UI Layer | 編輯、排版、資料庫 | Notion |

真正的 AI 知識平台 = 三層架構。

---

## 十六、產品級架構模型（AI SaaS 最強形態）

Notion × Wiki × NotebookLM 融合架構：

```text
               ┌──────────────┐
                │      AI       │
                │  RAG / Chat   │
                └──────┬───────┘
                       │
            ┌──────────┴──────────┐
            │    Knowledge Graph   │
            │   Page Links / Tags  │
            └──────────┬──────────┘
                       │
                ┌──────┴──────┐
                │  Block Editor│
                │   Database   │
                └──────────────┘
```

### 知識系統演化三階段

| 時代 | 系統 | 架構 |
| --- | --- | --- |
| Web 1.0 | Wiki | Knowledge Graph |
| Web 2.0 | Notion | Block + Database |
| AI Era | NotebookLM | RAG + LLM |
| 未來 | Hybrid | Graph + Block + AI |

工程公式：

```text
AI Knowledge System
= Editor
+ Database
+ Knowledge Graph
+ Vector Search
+ LLM
```

---

## 十七、對應到技術架構（Firestore + Genkit + Next.js）

### 17.1 Firestore Schema（資料層）

| Collection | 說明 | 對應概念 |
| --- | --- | --- |
| pages | 頁面文件（含 Block 樹 + Graph Node） | Wiki Page / Notion Page |
| blocks | Block 內容單元 | Notion Block |
| databases | 結構化 Database 定義 | Notion Database |
| relations | 跨 Database Relation | Notion Relation Property |
| page_links | 頁面連結（fromPageId / toPageId / type） | Wiki Internal Link |
| embeddings | pageId / blockId / vector / content | NotebookLM Semantic Memory |
| tags | 多維標籤 | Wiki Category / Notion Tag |
| comments | Block 層級留言 | Notion Comment |
| versions | 頁面版本快照 | Wiki Revision History |
| sessions | 使用者互動歷程 | Episodic Memory |

Graph 關聯：

```text
page_links
  fromPageId
  toPageId
  type（IS_A / RELATED_TO / PART_OF）
```

RAG：

```text
embeddings
  pageId
  blockId
  vector
  content
  chunkIndex
  sectionPath
```

### 17.2 Genkit Flow（AI 層）

| Flow | 說明 |
| --- | --- |
| QueryPlannerFlow | Intent 分類 + Query 拆解 + HyDE |
| RetrievalFlow | Hybrid RAG（Dense + Sparse + Graph + Reranker） |
| IngestionFlow | Parse → Chunk → Embed → Index Pipeline |
| AgentOrchestratorFlow | ReAct 模式多工具調用 |
| CitationFlow | Answer + Source Mapping + Faithfulness Check |

AI 功能：

- Chat with Docs
- Auto Summary
- Auto Tag
- Auto Link
- Knowledge Graph Expansion

### 17.3 Next.js Parallel Routes（UI 層）

```text
/workspace
    /@editor      → Block Editor（Notion Layer）
    /@graph       → Knowledge Graph View（Wiki Layer）
    /@chat        → AI Chat + RAG（NotebookLM Layer）
    /@database    → Database View（Notion Layer）
```

畫面佈局：

```text
┌───────────────┬───────────────┐
│   Page Tree   │    Editor     │
├───────────────┼───────────────┤
│ KnowledgeGraph│     AI Chat   │
└───────────────┴───────────────┘
```

這就是：`AI Knowledge Operating System`

---

## 十八、最終學術級結論（完整架構層次）

### 完整 AI 知識平台架構層次

```text
┌─────────────────────────────────────────────────┐
│                  User Interface                   │
│          （Block Editor / Chat / Graph View）      │
├─────────────────────────────────────────────────┤
│           Tool / Agent Layer（工具調用層）          │
│    Search / Create / Link / Summarize / External  │
├─────────────────────────────────────────────────┤
│        Query Understanding Layer（查詢理解層）      │
│    Intent / Decompose / Rewrite / Plan / HyDE     │
├──────────────────────┬──────────────────────────┤
│  Multi-Document      │   Source Grounding /      │
│  Reasoning（多步推理）│   Citation System（引用）  │
├──────────────────────┴──────────────────────────┤
│         Graph-Augmented RAG（圖增強檢索）          │
│          Vector Search + Graph Search + Reranker  │
├─────────────────────────────────────────────────┤
│         Indexing Strategy Layer（索引策略層）       │
│         Dense / Sparse / Graph / Hierarchical     │
├─────────────────────────────────────────────────┤
│              AI Memory Layer（記憶層）              │
│  Semantic Memory | Episodic Memory | Working Mem  │
├─────────────────────────────────────────────────┤
│           Ingestion Pipeline（資料生命週期）         │
│    Parse → Clean → Taxonomy → Chunk → Embed       │
│                → Persist → Mark Ready             │
├─────────────────────────────────────────────────┤
│       Schema + Ontology Layer（知識語意層）         │
│        Classes / Properties / Relations           │
├─────────────────────────────────────────────────┤
│         Knowledge Graph（知識圖譜層）               │
│     Page Links / Backlinks / Category / Template  │
│     Redirect / Namespace / Version Control        │
├─────────────────────────────────────────────────┤
│           Content / Data Layer（內容層）            │
│   Block Editor / Database / Views / Automation   │
│   Property Types / Collaboration / Template      │
└─────────────────────────────────────────────────┘
```

### 完整架構能力對照

| 能力 | 實現機制 | 層次 |
| --- | --- | --- |
| Query Planner | Intent classification + query decomposition | Query Understanding Layer |
| Multi-hop reasoning | Sub-query generation + evidence aggregation | Multi-Document Reasoning |
| Hybrid retrieval | Dense + Sparse + Reranker | Indexing Strategy Layer |
| Graph-augmented RAG | Vector + Graph fusion | Graph-Augmented RAG |
| Citation / grounding | Source mapping + faithfulness check | Citation System |
| Semantic Memory | Vector embeddings + persistent vector database | AI Memory Layer |
| Episodic Memory | User interaction history + cross-session store | AI Memory Layer |
| Working Memory | In-memory conversation buffer | AI Memory Layer |
| Ingestion pipeline | Parse → Embed → Index lifecycle | Ingestion Pipeline |
| Agent / tool layer | ReAct + tool registry | Tool / Agent Layer |
| Ontology / schema | Domain classes + relation types | Schema + Ontology Layer |
| Block Editor | Drag-drop / nested blocks / 13+ block types | Content / UI Layer |
| Database System | 6 views / 18+ property types / automation | Content / UI Layer |
| Knowledge Graph | Backlinks / redirects / category tree | Knowledge Graph Layer |
| Version Control | Diff / Rollback / Edit history / Blame | Knowledge Graph Layer |
| Template System | Transclusion / parameterized templates | Knowledge Graph Layer |

---

> 這就是現代 AI SaaS 文件 / 知識 / 協作 / AI 系統的完整理論架構。
>
> **下一代知識平台架構：**
> Notion（UI / Block / Database）+ Wiki（Knowledge Graph）+ NotebookLM（RAG / AI）= **AI Knowledge Platform**
