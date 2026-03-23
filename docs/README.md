# Xuanwu App — 文件目錄

本目錄收斂 Xuanwu App 的所有技術文件、設計文件、操作手冊與架構決策記錄。

---

## 📚 文件地圖

| 目錄 | 說明 | 適合讀者 |
|---|---|---|
| [knowledge-base/](./knowledge-base/README.md) | 🏠 **企業知識庫首頁**（從這裡開始） | 所有人 |
| [ui-ux/](./ui-ux/README.md) | 🎨 UI/UX 設計文件：設計系統、線框圖、元件規範 | 設計師、前端工程師 |
| [development/](./development/README.md) | 💻 開發指南：流程、分支策略、程式碼風格 | 工程師 |
| [specification/](./specification/README.md) | 📋 規格與契約：系統規格、功能規格 | PM、工程師 |
| [user-manual/](./user-manual/README.md) | 📖 使用手冊：使用者指南、管理員指南 | 使用者、管理員 |
| [wiki-beta/](./wiki-beta/) | 🧪 Wiki-Beta 功能文件 | 工程師、設計師 |
| [diagrams/](./diagrams/README.md) | 🗺 架構圖索引（Mermaid） | 架構師、工程師 |
| [adr/](./adr/) | 🔍 架構決策記錄（ADR） | 架構師、Tech Lead |
| [reference/](./reference/) | 📚 開發契約與 AI 工作流程參考 | 工程師 |
| [how-to/](./how-to/) | 🛠 操作指南（How-to Guides） | 工程師 |
| [explanation/](./explanation/) | 💡 說明性文件（Explanation） | 工程師 |
| [architecture/](./architecture/) | 🏗 架構說明文件 | 架構師 |

---

## 🚀 我是新人，從哪裡開始？

1. **了解產品**：[系統全局規格](./specification/system-overview.md)
2. **了解架構**：[agents/knowledge-base.md](../agents/knowledge-base.md) — MDDD 模組架構
3. **了解 UI**：[UI/UX 資訊架構](./ui-ux/information-architecture.md)
4. **開始開發**：[開發流程](./development/development-process.md)

---

## 📝 文件組織原則（Diátaxis）

本文件集遵循 **Diátaxis 框架**的四象限分類：

| 類型 | 問的問題 | 對應目錄 |
|---|---|---|
| **Tutorial（學習導向）** | 「如何學習？」 | `how-to/`、`user-manual/` |
| **How-to Guide（操作導向）** | 「如何完成 X？」 | `how-to/` |
| **Reference（資訊導向）** | 「X 是什麼？規格是什麼？」 | `reference/`、`specification/`、`ui-ux/` |
| **Explanation（理解導向）** | 「為什麼這樣設計？」 | `explanation/`、`adr/` |
