# 「Notion × Wiki × NotebookLM」融合架構學術指南

AI 知識系統與產品架構設計方法論

## 一、研究背景：現代知識系統的三種典範

當代知識管理與文件系統，大致可分為三種代表性工具與架構思想：

- Notion
- Wikipedia（Wiki 系統代表）
- NotebookLM

這三者分別代表三種不同的知識系統設計哲學：

| 系統 | 核心模型 | 強項 |
| --- | --- | --- |
| Notion | Block + Database | UI / UX / 工作管理 |
| Wiki | Page + Link Graph | 知識結構 / 關聯 |
| NotebookLM | Document + Embedding | AI / RAG / 推理 |

產品級知識平台的發展方向不是選其中一個，而是三者融合。

## 二、Wiki 與 Notion 的本質差異（資料模型層）

### 1) Wiki：Graph Model（知識圖）

Wiki 系統（如 Wikipedia）本質資料模型：

```text
Page = Node
Link = Edge
```

形成：

```text
Knowledge Graph
```

資料結構：

- pages
- links
- versions

特徵：

- 強調「知識與知識之間的關係」
- 非階層式
- 可形成網狀結構
- 適合知識庫、技術文件、研究資料

Wiki 本質是 Graph Database 思維。

可表示為：

```text
Graph = (Nodes, Edges)
```

### 2) Notion：Block + Tree Model（內容結構）

Notion 資料模型：

```text
Page
 └── Blocks
     ├── Text
     ├── Heading
     ├── Table
     ├── Toggle
     ├── Image
```

資料結構：

- pages
- blocks
- databases

其本質為：

```text
Tree Structure + Structured Database
```

特徵：

- 強調排版
- 強調資料表
- 強調 UI 操作
- 強調工作管理
- 適合專案管理、文件、筆記、CRM

Notion 本質是 Block Editor + Database System。

## 三、兩種系統的哲學差異（重要）

| 面向 | Wiki | Notion |
| --- | --- | --- |
| 核心 | 知識關聯 | 工作與內容 |
| 資料模型 | Graph | Tree + Database |
| 單位 | Page | Page + Block |
| 關聯 | Page Link | Relation Database |
| 強項 | 知識網絡 | UX / UI |
| 用途 | 知識庫 | 工作空間 |
| 思維 | Knowledge Graph | Structured Workspace |

關鍵一句話差異：

- Wiki：讓知識彼此連結
- Notion：讓內容好整理、好使用

## 四、NotebookLM 的角色（AI 層）

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

NotebookLM 本質不是筆記工具，而是：

```text
AI Knowledge Reasoning System
```

它解決的是：

- 文件理解
- 問答
- 摘要
- 推理
- 跨文件分析

## 五、Query Understanding Layer（查詢理解層）

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

## 六、AI Memory Layer（三層記憶架構）

NotebookLM 的「記憶」不僅僅是 Embedding（語意向量），而是由三種記憶類型組成：

```text
AI Memory Layer
├── 1. Semantic Memory（語意記憶）
│       → Embedding / Vector Database
├── 2. Episodic Memory（互動記憶）
│       → User Interaction History / Sessions
└── 3. Working Memory（上下文記憶）
        → Current Chat Context Window
```

### 1) Semantic Memory（語意記憶）

```text
Document Chunks
    ↓
Embedding Model
    ↓
Vector Database（Semantic Memory Store）
```

- 靜態知識庫
- 長期持久化
- 代表：Pinecone / Firestore Vector / pgvector

### 2) Episodic Memory（互動記憶）

```text
User Interactions
    ↓
Session Logs / History Store
    ↓
Personalized Context（Episodic Memory Store）
```

- 使用者歷史行為記錄
- 跨 session 學習
- 代表：Redis / Firestore sessions collection

### 3) Working Memory（上下文記憶）

```text
Current Chat Turn
    ↓
Context Window（token budget）
    ↓
LLM Prompt Assembly（Working Memory）
```

- 短暫、當前對話上下文
- Token 受限（LLM context window 大小）
- 代表：in-memory conversation buffer

### 三層記憶對比

| 記憶類型 | 範圍 | 持久性 | 技術實作 |
| --- | --- | --- | --- |
| Semantic Memory | 知識庫 | 長期 | Vector DB |
| Episodic Memory | 使用者歷史 | 中期 | Session Store |
| Working Memory | 當前對話 | 短期 | Context Buffer |

完整 AI Memory 層 = 三層協同運作，而非僅有 Embedding。

## 七、Indexing Strategy Layer（索引策略層）

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

## 八、Graph-Augmented RAG（圖增強檢索）

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

## 九、Multi-Document Reasoning（跨文件推理）

### Multi-hop Reasoning（多步推理）

多步推理要求系統能在多個文件之間進行知識整合與推理，而非僅檢索單一文件片段。

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

## 十、Source Grounding / Citation System（引用系統）

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

## 十一、Ingestion Pipeline（資料生命週期）

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
| Embedding Coverage | embedding 覆蓋率 |
| Index Latency | 完整 pipeline 耗時 |

## 十二、Tool / Agent Layer（工具調用層）

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

## 十三、Schema + Ontology Layer（知識語意層）

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

## 十四、三種系統的架構分層（非常重要）

可以把現代知識系統分成三層：

```text
┌──────────────────────┐
│        AI Layer       │  ← NotebookLM / RAG
├──────────────────────┤
│   Knowledge Graph     │  ← Wiki
├──────────────────────┤
│   Content / UI Layer  │  ← Notion
└──────────────────────┘
```

對應功能：

| 層 | 功能 |
| --- | --- |
| UI 層 | 編輯、排版、資料庫 |
| Graph 層 | 知識關聯 |
| AI 層 | 搜尋、問答、推理 |

真正的 AI 知識平台 = 三層架構。

## 十五、產品級架構模型（AI SaaS 最強形態）

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

## 十六、對應到技術架構（Firestore + Genkit + Next.js）

### 1) Firestore Schema（資料層）

```text
pages
blocks
databases
relations
page_links
embeddings
tags
comments
versions
```

Graph 關聯：

```text
page_links
  fromPageId
  toPageId
  type
```

RAG：

```text
embeddings
  pageId
  blockId
  vector
  content
```

### 2) Genkit Flow（AI 層）

AI Flow：

```text
User Question
    ↓
Search Embeddings
    ↓
Retrieve Blocks
    ↓
Build Context
    ↓
LLM
    ↓
Answer
    ↓
Auto Link Suggestion
```

AI 功能：

- Chat with Docs
- Auto Summary
- Auto Tag
- Auto Link
- Knowledge Graph Expansion

### 3) Next.js Parallel Routes（UI 層）

可以設計成：

```text
/workspace
    /@editor
    /@graph
    /@chat
    /@database
```

畫面：

```text
┌───────────────┬───────────────┐
│   Page Tree   │    Editor     │
├───────────────┼───────────────┤
│ KnowledgeGraph│     AI Chat   │
└───────────────┴───────────────┘
```

這就是：

```text
AI Knowledge Operating System
```

## 十七、最終學術級結論（產品架構觀點）

知識系統演化三階段：

| 時代 | 系統 | 架構 |
| --- | --- | --- |
| Web 1.0 | Wiki | Knowledge Graph |
| Web 2.0 | Notion | Block + Database |
| AI Era | NotebookLM | RAG + LLM |
| 未來 | Hybrid | Graph + Block + AI |

最重要的一句話（架構結論）：

```text
下一代知識平台架構：
Notion（UI / Block / Database）
        +
Wiki（Knowledge Graph）
        +
NotebookLM（RAG / AI）
        =
AI Knowledge Platform
```

也可以寫成工程公式：

```text
AI Knowledge System
= Editor
+ Database
+ Knowledge Graph
+ Vector Search
+ LLM
```

### 完整 AI 知識平台架構層次（完善版）

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
│               Page Links / Tags / Relations       │
├─────────────────────────────────────────────────┤
│           Content / Data Layer（內容層）            │
│         Block Editor / Database / Documents       │
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
| Semantic Memory | Vector embeddings + persistent vector database storage | AI Memory Layer |
| Episodic Memory | User interaction history + cross-session persistent store | AI Memory Layer |
| Working Memory | In-memory conversation buffer within LLM context window | AI Memory Layer |
| Ingestion pipeline | Parse → Embed → Index lifecycle | Ingestion Pipeline |
| Agent / tool layer | ReAct + tool registry | Tool / Agent Layer |
| Ontology / schema | Domain classes + relation types | Schema + Ontology Layer |

這就是現代 AI SaaS 文件 / 知識 / 協作 / AI 系統的完整理論架構。
