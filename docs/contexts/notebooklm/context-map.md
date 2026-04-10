# NotebookLM

本文件描述 notebooklm 主域與其餘三個主域的協作關係。全域主域地圖見 [../../context-map.md](../../context-map.md)；本文件只關注 notebooklm 主域視角下的上下游與衍生產物邊界。

## Role

notebooklm 是 Supporting Domain，負責 AI 對話、來源追蹤、Notebook 管理與 synthesis。它不擁有正典知識頁面的生命週期，也不擁有身份與工作區治理；它的主要責任是把來源材料轉化為可追溯、可對話、可綜合的衍生產物。

## Cross-Domain Map

| Related Domain | Relationship | Published Language | Boundary Rule |
|---|---|---|---|
| workspace | Upstream Supplier | workspaceId、member references、collaboration scope | notebooklm 在 workspace 範疇內運作，但不擁有 workspace 容器生命週期 |
| platform | Upstream Supplier | actor identity、organization context、access decisions、policy signals、quota constraints | notebooklm 消費平台治理結果，但不重建身份、授權或商業模型 |
| notion | Upstream / Peer Supplier | knowledge references、attachment references、structured content references | notebooklm 消費 notion 知識內容作為 source，但 notion 仍是正典內容來源 |

## Intra-Domain Collaboration

- notebook 是主工作單位，承載 conversation、source、note 與 synthesis 關係。
- conversation 管理對話流程與 message 順序。
- source 管理被引用材料及其可追溯性；ai 與 synthesis 在此基礎上產生輸出。
- note 保存輕量洞察；versioning 保存 notebook 與 conversation 的歷史狀態。

## Anti-Corruption Rules

- 來自 notion 的 Knowledge Page、Article、Database 在 notebooklm 中只能以 source references 或 content references 形式存在，不改寫內容所有權。
- 來自 workspace 的 workspaceId 與 member references 只作為作用範疇與參與資訊，不重建 workspace 模型。
- 來自 platform 的 Actor、Organization、Access Control、Subscription 保持上游治理語意，不在 notebooklm 中重新定義。