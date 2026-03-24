# UI/UX 設計文件索引

本目錄收斂 Xuanwu App 的使用者介面設計與使用者體驗規格。

---

## 文件地圖

| 文件 | 類型 | 說明 |
|---|---|---|
| [design-system.md](./design-system.md) | 參考 | 設計語言：色彩、字型、間距、圖示 |
| [ux-principles.md](./ux-principles.md) | 說明 | UX 原則、互動規則、可近用性標準 |
| [information-architecture.md](./information-architecture.md) | 參考 | 資訊架構：全站導覽、路由地圖、IA 圖 |
| [wireframes.md](./wireframes.md) | 參考 | 各主要功能區域的線框圖與畫面說明 |
| [component-patterns.md](./component-patterns.md) | 參考 | UI 元件使用規範與組合模式 |

---

## 設計目標總覽

| 代號 | 目標 | 依據原則 |
|---|---|---|
| UX1 | **操作可見**：使用者隨時知道系統在做什麼 | The Design of Everyday Things — 回饋原則 |
| UX2 | **降低認知負擔**：核心操作集中在一頁完成 | Don't Make Me Think — 最少點擊數 |
| UX3 | **錯誤可修復**：出錯時顯示原因與建議行動 | The Design of Everyday Things — 錯誤設計 |
| UX4 | **資料不遺失的預設視角**：預設 account 全覽 | Lean UX — 用戶痛點驅動 |
| UX5 | **可近用性**：所有互動可由鍵盤完整操作 | WCAG 2.1 AA |
| UX6 | **一致性**：相同功能在全平台使用相同模式 | Nielsen's 10 Heuristics — 一致性 |

---

## 產品願景

Xuanwu App 是一個**知識管理與 AI 輔助的工作區平台**，融合 Notion-style 的頁面編輯體驗與企業級 RAG（Retrieval-Augmented Generation）知識查詢能力。

### 核心使用流程

```
登入 → 選擇 Account → 進入工作區 → 建立 / 管理內容 → AI 知識查詢
```

### 平台定位

- **個人使用者**：個人知識管理、日記、任務追蹤
- **組織使用者**：多工作區協作、文件上傳、AI 問答、排程管理
- **系統管理員**：成員管理、權限控制、稽核追蹤

---

## 讀者指引

| 我是… | 建議先讀 |
|---|---|
| UI 設計師 | [design-system.md](./design-system.md) → [wireframes.md](./wireframes.md) |
| 前端工程師 | [component-patterns.md](./component-patterns.md) → [information-architecture.md](./information-architecture.md) |
| 產品經理 | [ux-principles.md](./ux-principles.md) → [information-architecture.md](./information-architecture.md) |
| QA 工程師 | [wireframes.md](./wireframes.md) → [ux-principles.md](./ux-principles.md)（互動規則、驗收條件） |

---

## 相關文件連結

- [系統架構圖索引](../diagrams/README.md)
- [Wiki-Beta UI/UX 設計規格](../wiki-beta/wiki-beta-ui-ux-spec.md)
- [Wiki-Beta Pages / Libraries 設計規格](../wiki-beta/wiki-beta-pages-libraries-design-spec.md)
- [開發指南](../development/README.md)
