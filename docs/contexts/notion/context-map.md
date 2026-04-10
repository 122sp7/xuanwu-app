# Notion

本文件描述 notion 主域與其餘三個主域的協作關係。全域主域地圖見 [../../context-map.md](../../context-map.md)；本文件只關注 notion 主域視角下的上下游與內容所有權。

## Role

notion 是核心知識內容主域。它擁有知識內容的建立、結構化、協作、模板化、版本化與事件驅動演化語意。其他主域可以提供範疇、治理或推理能力，但不取代 notion 對知識內容生命週期的所有權。

## Cross-Domain Map

| Related Domain | Relationship | Published Language | Boundary Rule |
|---|---|---|---|
| workspace | Upstream Supplier | workspaceId、member references、workspace scope | notion 在 workspace 範疇內運作知識內容，但不擁有 workspace 容器生命週期 |
| platform | Upstream Supplier | actor identity、organization context、access decisions、policy signals、subscription constraints | notion 消費平台治理結果，但不重建身份、組織或商業模型 |
| notebooklm | Peer / Supporting Collaborator | knowledge references、source references、synthesis outputs、note references | notion 提供知識內容作為來源；notebooklm 可回傳衍生洞察，但正典知識狀態仍屬 notion |

## Intra-Domain Collaboration

- knowledge 負責正典頁面生命週期，是 notion 主域的中心內容語意。
- authoring、collaboration、database 分別處理撰寫流程、協作討論與結構化資料視角。
- ai、automation、templates、versioning 支撐知識內容的生成、規則化演化與版本治理。
- attachments、integration、notes、analytics 提供內容延伸、外部整合、輕量記錄與量測能力。

## Anti-Corruption Rules

- 來自 workspace 的 workspaceId 與 member references 只作為範疇與參與資訊，不改寫 notion 內容語意。
- 來自 platform 的 Actor、Organization、Access Control 保留其上游治理語意，不在 notion 內重新定義。
- 來自 notebooklm 的 synthesis、conversation、source 只能以 published language 接入；若要成為正典知識，必須經過 notion 的內容語言重新吸收。