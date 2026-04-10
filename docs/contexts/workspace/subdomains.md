# Workspace

本文件依 Context7 參考 DDD / Hexagonal 模組邊界與責任分離原則整理。以下缺口子域依本次任務前提，視為目前專案尚未落地但主域設計上應補齊的子域。

## Current Subdomains

| Subdomain | Role |
|---|---|
| audit | 工作區操作稽核與證據追蹤 |
| feed | 工作區活動摘要與事件流呈現 |
| scheduling | 工作區排程、時序與提醒協調 |
| workflow | 工作區流程編排與執行治理 |

## Missing Gap Subdomains

| Proposed Subdomain | Why Needed | Gap If Missing |
|---|---|---|
| lifecycle | 承接 workspace 建立、封存、還原、移轉與狀態生命週期 | 主容器生命週期沒有正典邊界，容易散落到 workflow 或 platform |
| membership | 承接 workspace 範疇下的邀請、參與關係、角色與席位 | organization 與 workspace 參與關係會被混用，授權邊界變得模糊 |
| sharing | 承接分享連結、外部協作者與公開可見性 | 對外共享與內部協作沒有獨立模型，內容外發會失去清楚邊界 |
| presence | 承接即時在線狀態、共同編輯存在感與協作游標 | 即時協作能力只能附著在 UI 或其他子域，缺少可持續演化的本地語言 |

## Recommended Order

1. lifecycle
2. membership
3. sharing
4. presence