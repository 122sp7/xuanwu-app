# Xuanwu App 文件入口

`docs/` 是 Xuanwu App 的文件總入口，負責路由到架構、開發參考、圖解說明與使用指南。

## 讀取原則

- 先讀總覽，再進子目錄。
- 先讀 High-level，再讀契約與細節。
- 主題若屬於 Copilot/agent/prompt/skill/workflow，優先讀 [.github/README.md](../.github/README.md)。

## 文件地圖

| 目錄 | 內容 | 主要讀者 |
| --- | --- | --- |
| [decision-architecture/](./decision-architecture/) | ADR、Architecture、Design | 架構師、Tech Lead |
| [development-reference/](./development-reference/) | Development、Reference、Specification、Namespace | 工程師、PM |
| [diagrams-events-explanations/](./diagrams-events-explanations/) | Diagrams、Event、Explanation | 架構師、工程師 |
| [how-to-user/](./how-to-user/) | How-to、UI/UX、User Manual | 使用者、工程師、設計師 |

## 建議閱讀順序

1. [../llms.txt](../llms.txt)
2. [README.md](./README.md)
3. 目標子目錄的 README
4. 對應契約或規格
5. ADR 與圖表補充

## 核心入口

| 主題 | 文件 |
| --- | --- |
| 系統高階架構 | [decision-architecture/architecture/ai-knowledge-platform-architecture.md](./decision-architecture/architecture/ai-knowledge-platform-architecture.md) |
| 模組實作邊界 | [development-reference/development/modules-implementation-guide.md](./development-reference/development/modules-implementation-guide.md) |
| 架構視覺圖 | [diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png](./diagrams-events-explanations/diagrams/ai-knowledge-platform-architecture.png) |
| 系統全局規格 | [development-reference/specification/system-overview.md](./development-reference/specification/system-overview.md) |

## Diataxis 對位

| 類型 | 問題 | 主要位置 |
| --- | --- | --- |
| Tutorial | 如何學習 | `how-to-user/how-to/`, `how-to-user/user-manual/` |
| How-to | 如何完成特定任務 | `how-to-user/how-to/` |
| Reference | 規格與定義是什麼 | `development-reference/reference/`, `development-reference/specification/`, `how-to-user/ui-ux/` |
| Explanation | 為什麼這樣設計 | `diagrams-events-explanations/explanation/`, `decision-architecture/adr/` |

## 維護規則

新增、搬移、刪除文件時，請在同一個變更內同步更新：

1. 最近的 README 索引
2. [../llms.txt](../llms.txt)（若路由改變）
3. [README.md](./README.md)（若總入口改變）
4. 文件的主題、關鍵字與分層資訊
