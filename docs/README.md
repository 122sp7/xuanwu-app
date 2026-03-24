# Xuanwu App — 文件目錄

本目錄收斂 Xuanwu App 的所有技術文件、設計文件、操作手冊與架構決策記錄。

目前 `docs/` 根目錄僅保留總索引；高階架構、實作指南與配圖已分流到對應子目錄，避免文件散落在根層。

如需由程式或工具集中取用文件與圖表路徑，請使用 [index.js](./index.js)。

---

## 📚 文件地圖

| 目錄 | 說明 | 適合讀者 |
|---|---|---|
| [decision-architecture/](./decision-architecture/) | 🏗 系統設計與架構決策（ADR、Architecture、Design） | 架構師、Tech Lead |
| [development-reference/](./development-reference/) | 💻 開發指南與技術參考（Development、Reference、Specification、Namespace） | 工程師、PM |
| [diagrams-events-explanations/](./diagrams-events-explanations/) | 🗺 圖表、事件流、原理說明（Diagrams、Event、Explanation） | 架構師、工程師 |
| [how-to-user/](./how-to-user/) | 📖 操作教學與使用者導向文件（How-to、UI/UX、User Manual） | 使用者、工程師、設計師 |

---

## 🗂 核心入口

| 主題 | 文件 | 歸類原因 |
|---|---|---|
| 產品與系統高階架構 | [ai-knowledge-platform-architecture.md](./decision-architecture/architecture/ai-knowledge-platform-architecture.md) | 屬於架構視角的設計說明，放在 `decision-architecture/architecture/` |
| 模組落地與實作邊界 | [modules-implementation-guide.md](./development-reference/development/modules-implementation-guide.md) | 屬於工程落地指南，放在 `development-reference/development/` |
| AI 知識平台配圖 | [ai-knowledge-platform-architecture.png](./diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png) | 屬於架構圖資產，放在 `diagrams-events-explanations/diagrams/` |

### 建議閱讀順序

1. 先讀 [ai-knowledge-platform-architecture.md](./decision-architecture/architecture/ai-knowledge-platform-architecture.md) 了解概念架構
2. 再看 [ai-knowledge-platform-architecture.png](./diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png) 對照視覺化配圖
3. 最後讀 [modules-implementation-guide.md](./development-reference/development/modules-implementation-guide.md) 了解如何在 repository 內落地

---

## 🚀 我是新人，從哪裡開始？

1. **了解產品**：[系統全局規格](./development-reference/specification/system-overview.md)
2. **了解架構**：[agents/knowledge-base.md](../agents/knowledge-base.md) — MDDD 模組架構
3. **了解 UI**：[UI/UX 資訊架構](./how-to-user/ui-ux/information-architecture.md)
4. **開始開發**：[開發流程](./development-reference/development/development-process.md)

---

## 📝 文件組織原則（Diátaxis）

本文件集遵循 **Diátaxis 框架**的四象限分類：

| 類型 | 問的問題 | 對應目錄 |
|---|---|---|
| **Tutorial（學習導向）** | 「如何學習？」 | `how-to-user/how-to/`、`how-to-user/user-manual/` |
| **How-to Guide（操作導向）** | 「如何完成 X？」 | `how-to-user/how-to/` |
| **Reference（資訊導向）** | 「X 是什麼？規格是什麼？」 | `development-reference/reference/`、`development-reference/specification/`、`how-to-user/ui-ux/` |
| **Explanation（理解導向）** | 「為什麼這樣設計？」 | `diagrams-events-explanations/explanation/`、`decision-architecture/adr/` |
