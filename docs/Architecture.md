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

## 五、三種系統的架構分層（非常重要）

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

## 六、產品級架構模型（AI SaaS 最強形態）

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

## 七、對應到技術架構（Firestore + Genkit + Next.js）

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

## 八、最終學術級結論（產品架構觀點）

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

這就是現代 AI SaaS 文件 / 知識 / 協作 / AI 系統的完整理論架構。
