# Xuanwu App — 文件目錄

本目錄收斂 Xuanwu App 的所有技術文件、設計文件、操作手冊與架構決策記錄。

目前 `docs/` 根目錄僅保留總索引；高階架構、實作指南與配圖已分流到對應子目錄，避免文件散落在根層。

建議先從根入口與摘要頁開始，再下鑽到契約、規格與圖表，避免一開始就讀取低層細節。

---

## 📚 文件地圖

| 目錄 | 說明 | 適合讀者 |
|---|---|---|
| [decision-architecture/](./decision-architecture/) | 🏗 系統設計與架構決策（ADR、Architecture、Design） | 架構師、Tech Lead |
| [development-reference/](./development-reference/) | 💻 開發指南與技術參考（Development、Reference、Specification、Namespace） | 工程師、PM |
| [diagrams-events-explanations/](./diagrams-events-explanations/) | 🗺 圖表、事件流、原理說明（Diagrams、Event、Explanation） | 架構師、工程師 |
| [how-to-user/](./how-to-user/) | 📖 操作教學與使用者導向文件（How-to、UI/UX、User Manual） | 使用者、工程師、設計師 |

---

## 🤖 AI 優先入口

如果目標是讓 AI 快速定位正確文件，建議固定使用這個順序：

1. [../llms.txt](../llms.txt)
2. [README.md](./README.md)
3. 對應子目錄的 README，例如 [development-reference/development/README.md](./development-reference/development/README.md) 或 [development-reference/specification/README.md](./development-reference/specification/README.md)
4. 具體契約、規格、操作指南或架構文件
5. 補充圖表與 ADR

文件整理與維護規則請看 [how-to-user/how-to/ai/organize-docs-for-ai.md](./how-to-user/how-to/ai/organize-docs-for-ai.md)。

若主題是 Copilot customization、agent、prompt、skill、instruction 或 workflow wiring，請先跳到 [.github/README.md](../.github/README.md)，因為 `.github/` 才是這類資產的操作性來源；`docs/` 只負責索引、說明與治理。

---

## 🗂 核心入口

| 主題 | 文件 | 歸類原因 |
|---|---|---|
| 產品與系統高階架構 | [ai-knowledge-platform-architecture.md](./decision-architecture/architecture/ai-knowledge-platform-architecture.md) | 高階概念架構與分層說明 |
| 模組落地與實作邊界 | [modules-implementation-guide.md](./development-reference/development/modules-implementation-guide.md) | 把概念架構對位到 repository 內的實作位置 |
| 架構配圖 | [ai-knowledge-platform-architecture.png](./diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png) | 視覺化呈現高階概念架構 |

### 建議閱讀順序

1. 先讀 [ai-knowledge-platform-architecture.md](./decision-architecture/architecture/ai-knowledge-platform-architecture.md) 了解高階概念架構
2. 再看 [ai-knowledge-platform-architecture.png](./diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png) 對照配圖
3. 最後讀 [modules-implementation-guide.md](./development-reference/development/modules-implementation-guide.md) 了解如何在 repository 內落地

---

## 🧭 文件分層

為了讓 AI 先讀最少但最有用的內容，這個文件集採三層閱讀方式：

| 層級 | 內容 | 主要入口 |
|---|---|---|
| High | 快速總覽、主題路由、核心概念 | [README.md](./README.md)、[development-reference/specification/system-overview.md](./development-reference/specification/system-overview.md)、[../agents/knowledge-base.md](../agents/knowledge-base.md) |
| Mid | 流程、契約、實作規範、how-to | [development-reference/reference/development-contracts/overview.md](./development-reference/reference/development-contracts/overview.md)、各子目錄 README、相關 how-to 文件 |
| Low | ADR、詳細圖表、補充說明、原始細節 | [decision-architecture/adr/](./decision-architecture/adr/)、[diagrams-events-explanations/diagrams/README.md](./diagrams-events-explanations/diagrams/README.md) |

建議原則：先讀 High，再讀 Mid，最後才開 Low。

---

## 🏷 文件索引最小欄位

每個 README 型索引頁至少維持這四個欄位：

| 文件 | 主題 | 關鍵字 | 摘要 |
|---|---|---|---|
| `example.md` | runtime boundary | nextjs, worker, rag | 說明哪個 runtime 擁有哪段流程。 |

如果某一組文件數量較多，建議再加上 `類型`、`層級`、`狀態` 三個欄位，讓 AI 可先用 metadata 篩選再讀全文。

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

---

## 🔄 維護規則

新增、搬移或淘汰文件時，請在同一個變更內同步更新：

1. 最近的 README 索引
2. 若路由有變，更新 [../llms.txt](../llms.txt)
3. 若總入口受影響，更新 [README.md](./README.md)
4. 補上摘要、關鍵字與正確分層
