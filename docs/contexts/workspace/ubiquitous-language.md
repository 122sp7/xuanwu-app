# Workspace

本文件整理 workspace 主域在跨子域協作時必須共用的語言。全域術語入口見 [../../ubiquitous-language.md](../../ubiquitous-language.md)；本文件只定義 workspace 主域層級需要統一的名稱，不取代更細的模組內部術語文件。

## Scope

workspace 是四個主域之一，負責協作容器、工作區生命週期，以及 workspaceId 的範疇錨點。此主域內的語言必須能被 audit、feed、scheduling、workflow 四個子域一致理解。

## Canonical Terms

| Term | Definition | Usage |
|---|---|---|
| Workspace | 協作容器與主要範疇邊界 | 指稱承載成員、活動、排程與流程的容器 |
| WorkspaceId | 工作區唯一識別子 | 跨主域引用 workspace 範疇時使用 |
| Member | 工作區內的參與者 | 指 workspace 範疇的參與關係，不指平台身份本身 |
| Activity Feed | 面向使用者的活動流或摘要流 | 用於呈現重要事件、更新與回顧 |
| Audit Trail | 面向證據與追蹤的不可否認紀錄 | 用於稽核、追溯、合規與調查 |
| Schedule | 工作區內的時間安排、期限或提醒意圖 | 用於排程、提醒與時間協調 |
| Workflow | 工作區範疇內可執行的流程定義 | 用於自動化、狀態推進與步驟協調 |
| Execution | 某個 Workflow 的一次具體執行 | 用於追蹤流程狀態與結果 |

## Language Rules

- 使用 Workspace，不使用 Project、Space 或 Teamspace 作為同義詞。
- 使用 Member 指 workspace 參與關係；若要指平台層的身份，改用 Actor，並交由 platform 主域處理。
- 使用 Activity Feed 指面向使用者的事件呈現；使用 Audit Trail 指稽核與證據紀錄，不混用。
- 使用 Schedule 表示時間安排；使用 Workflow 表示可執行流程，兩者不可互相替代。
- 領域事件採用過去式命名，例如 WorkspaceCreated、WorkflowScheduled。

## Avoid

| Avoid | Use Instead | Reason |
|---|---|---|
| User | Member 或 Actor | 避免把 workspace 參與關係與平台身份混為一談 |
| Timeline | Activity Feed 或 Schedule | timeline 過度模糊，無法表示是活動流或時間安排 |
| Automation | Workflow | 若語意是可執行流程，應明確使用 workflow |
| Log | Audit Trail 或 Activity Feed | 需先界定是證據紀錄還是使用者活動流 |