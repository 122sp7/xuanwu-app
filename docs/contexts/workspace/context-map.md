# Workspace

本文件描述 workspace 主域與其餘三個主域的協作關係。全域主域地圖見 [../../context-map.md](../../context-map.md)；本文件只關注 workspace 主域視角下的上下游與邊界。

## Role

workspace 是協作容器主域。它提供 workspaceId 範疇、工作區生命週期、活動流、稽核、排程與流程協作能力，但不擁有跨平台身份治理，也不擁有知識內容或 AI 對話產物的正典生命週期。

## Cross-Domain Map

| Related Domain | Relationship | Published Language | Boundary Rule |
|---|---|---|---|
| platform | Upstream Supplier | actor identity、organization context、access decisions、policy signals | workspace 消費平台治理結果，但不重建身份、組織或授權模型 |
| notion | Downstream / Peer Consumer | workspaceId、member references、workspace lifecycle facts | notion 在 workspace 範疇內運作知識內容，但知識內容生命週期仍屬 notion |
| notebooklm | Downstream / Peer Consumer | workspaceId、member references、collaboration scope | notebooklm 在 workspace 範疇內運作 notebook 與 conversation，但對話與 synthesis 生命週期仍屬 notebooklm |

## Intra-Domain Collaboration

- audit 接收工作區事實，負責證據保存與追蹤，不負責使用者導向排序與摘要。
- feed 以使用者視角投影活動，不作為正典狀態來源。
- scheduling 管理時間意圖與時序安排，不取代 workflow 的執行語意。
- workflow 管理可執行流程與步驟推進，必要時依賴 scheduling 提供時間條件。

## Anti-Corruption Rules

- 來自 platform 的 Actor、Organization、Access Control 必須保留其上游語意，不在 workspace 內重新定義。
- 來自 notion 的 Knowledge Page、Article、Database 只作為 workspace 內承載內容，不進入 workspace 的正典模型。
- 來自 notebooklm 的 Notebook、Conversation、Synthesis 只作為掛載在 workspace 範疇中的產物，不變成 workspace 自有模型。