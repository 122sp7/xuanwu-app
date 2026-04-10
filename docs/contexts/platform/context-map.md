# Platform

本文件描述 platform 主域與其餘三個主域的協作關係。全域主域地圖見 [../../context-map.md](../../context-map.md)；本文件只關注 platform 主域視角下的上下游與治理輸出。

## Role

platform 是跨切面治理主域。它向其他主域提供身份、組織、授權、政策、商業、通知、搜尋與觀測能力，同時消費其他主域釋出的事件以支撐 audit-log、analytics、support 等橫切能力。

## Cross-Domain Map

| Related Domain | Relationship | Published Language | Boundary Rule |
|---|---|---|---|
| workspace | Downstream Customer | actor identity、organization context、access decisions、notification routing | platform 提供治理能力，但不接管 workspace 容器生命週期 |
| notion | Downstream Customer | actor identity、organization context、policy signals、subscription constraints | platform 提供治理與商業能力，但不接管知識內容生命週期 |
| notebooklm | Downstream Customer | actor identity、organization context、policy signals、quota and entitlement constraints | platform 提供治理與配額能力，但不接管 notebook 與 synthesis 正典狀態 |

## Intra-Domain Collaboration

- identity、account、account-profile、organization 形成主體與名錄基礎。
- access-control、security-policy、platform-config、feature-flag 組成治理與風險控制層。
- billing、subscription、referral 處理商業權益與財務事實。
- workflow、notification、background-job、integration 提供平台級協調與投遞能力。
- content、search、audit-log、observability、analytics、support 提供橫切營運與診斷能力。

## Anti-Corruption Rules

- 其他主域傳入 platform 的事件必須維持來源主域語意，不得被 platform 重新命名成其內部正典模型。
- platform 不直接吸收 workspace 的容器語言，也不吸收 notion 的知識語言或 notebooklm 的對話語言。
- 跨主域協作時，platform 提供治理信號與決策，不直接持有其他主域的正典內容狀態。