# Xuanwu App — Documentation Root

> 文件根索引。從這裡開始找到所有架構、開發規範、工作流、圖表與說明文件。

## 文件閱讀順序

1. **本頁（docs/README.md）** — 整體索引與路由
2. [development-reference/specification/system-overview.md](development-reference/specification/system-overview.md) — 系統整體概觀
3. [agents/knowledge-base.md](../agents/knowledge-base.md) — MDDD 架構與模組邊界（含 package aliases）
4. [development-reference/reference/development-contracts/overview.md](development-reference/reference/development-contracts/overview.md) — 開發合約總覽
5. 最近相關子資料夾的 README
6. 具體合約、指南或架構頁
7. 僅在定位高階文件後才讀 ADR 或圖表

---

## 目錄結構

```text
docs/
├── README.md                                        ← 本頁（根索引）
│
├── decision-architecture/                           ← 決策 & 架構
│   ├── architecture/                                ← 模組架構規格
│   │   ├── README.md
│   │   └── ai-knowledge-platform-architecture.md
│   └── adr/                                         ← Architecture Decision Records
│       └── README.md
│
├── development-reference/                           ← 開發參考資料
│   ├── development/                                 ← 實作指南
│   │   ├── README.md
│   │   └── modules-implementation-guide.md
│   ├── reference/                                   ← 參考文件
│   │   ├── README.md
│   │   ├── ai/                                      ← AI 工作流 & Copilot 樣板
│   │   │   ├── customizations-index.md
│   │   │   ├── implementation-plan-template.md
│   │   │   └── handoff-matrix.md
│   │   └── development-contracts/                   ← 開發合約
│   │       ├── overview.md
│   │       ├── audit-contract.md
│   │       ├── namespace-contract.md
│   │       ├── parser-contract.md
│   │       └── rag-ingestion-contract.md
│   └── specification/                               ← 功能規格
│       ├── system-overview.md
│       └── <feature-name>/                          ← 每個功能一個子目錄
│           ├── design.md
│           ├── implementation.md
│           ├── decisions.md
│           └── future-work.md
│
├── diagrams-events-explanations/                    ← 圖表 & 說明
│   ├── diagrams/                                    ← 架構配圖
│   │   └── README.md
│   └── explanation/                                 ← 深度說明文件
│       ├── README.md
│       └── development-contract-governance.md
│
└── how-to-user/                                     ← 使用者操作指南
    ├── README.md
    └── how-to/
        └── start-feature-delivery.md
```

---

## 主題路由

| 需要找的內容 | 路徑 |
|-------------|------|
| 貢獻/審查規範 | [AGENTS.md](../AGENTS.md), [CONTRIBUTING.md](../CONTRIBUTING.md) |
| 架構與模組邊界 | [agents/knowledge-base.md](../agents/knowledge-base.md), [decision-architecture/architecture/](decision-architecture/architecture/) |
| ADR（架構決策記錄） | [decision-architecture/adr/](decision-architecture/adr/) |
| 開發工作流與實作規則 | [development-reference/development/](development-reference/development/), [development-reference/reference/](development-reference/reference/) |
| 合約治理 | [development-reference/reference/development-contracts/overview.md](development-reference/reference/development-contracts/overview.md) |
| AI 工作流 & Copilot 自訂 | [development-reference/reference/ai/customizations-index.md](development-reference/reference/ai/customizations-index.md), [how-to-user/how-to/](how-to-user/how-to/) |
| 圖表 & 解說 | [diagrams-events-explanations/diagrams/](diagrams-events-explanations/diagrams/), [diagrams-events-explanations/explanation/](diagrams-events-explanations/explanation/) |
| 功能規格 | [development-reference/specification/](development-reference/specification/) |

---

## 文件層次

| 層次 | 文件 |
|------|------|
| **高層** | docs/README.md, development-reference/specification/system-overview.md, agents/knowledge-base.md |
| **中層** | 各資料夾 README, 開發指南, 合約索引, how-to 指南 |
| **低層** | ADR, 詳細圖表, 深度技術說明 |

優先使用最小可用層次。

---

## 新增或修改文件規則

1. 每個主題只保留一個正文文件（避免重複）。
2. 在文件頂部加入簡短摘要。
3. 以清楚的標題分割段落，便於 AI 分塊檢索。
4. 更新最近的 README 索引。
5. 若路由或邊界改變，同步更新本頁與 [agents/knowledge-base.md](../agents/knowledge-base.md)。
