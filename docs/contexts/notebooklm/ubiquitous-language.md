# NotebookLM

本文件整理 notebooklm 主域在跨子域協作時必須共用的語言。全域術語入口見 [../../ubiquitous-language.md](../../ubiquitous-language.md)；本文件只定義 notebooklm 主域層級需要統一的名稱，不取代更細的子域術語文件。

## Scope

notebooklm 是四個主域之一，也是 Supporting Domain，負責 AI 對話、來源追蹤、Notebook 管理、輕量筆記、摘要與 synthesis。它的語言必須能描述推理過程與衍生產物，同時維持對 upstream 知識來源的引用邊界。

## Canonical Terms

| Term | Definition | Usage |
|---|---|---|
| Notebook | 聚合 conversation、source、note 與 synthesis 的工作單位 | 指 AI 工作空間與推理容器 |
| Conversation | Notebook 內的對話執行邊界 | 指 thread 與 message 的生命週期 |
| Message | Conversation 中的一則輸入或輸出 | 指具時間順序的單一對話項 |
| Source | 被 notebooklm 引用來推理或摘要的來源材料 | 指文件、知識內容或其他可引用材料 |
| Citation | 從 Message 或 Synthesis 指回 Source 的引用關係 | 指可追溯性與出處證據 |
| Synthesis | 由多個 Source 綜合生成的產物 | 指摘要、洞察、整合回答等輸出 |
| Note | 與 Notebook 關聯的輕量記錄或洞察摘記 | 指非正典知識頁面、但可持續引用的筆記 |
| Prompt | 驅動模型行為的指令輸入 | 指對 conversation 或 synthesis 的推理約束 |
| Version Snapshot | Conversation 或 Notebook 某一時點的不可變快照 | 指歷史追溯與版本保留 |

## Language Rules

- 使用 Conversation，不使用 Chat 作為正典語彙。
- 使用 Source 表示可被引用與推理的材料；若語意只是檔案儲存，不自動等同於 Source。
- 使用 Synthesis 表示多來源整合輸出；若只是單一內容的正式知識頁面，應改由 notion 語言承接。
- 使用 Note 表示 notebooklm 內的輕量摘記；若已進入正式知識生命週期，應改由 notion 處理。
- 使用 Citation 表示可追溯出處，不以含糊的 reference 取代。

## Avoid

| Avoid | Use Instead | Reason |
|---|---|---|
| Chat | Conversation | 需保持 notebooklm 對話邊界語彙一致 |
| File | Source | 若材料已進入推理語意，應改用 source |
| Summary | Synthesis | synthesis 更能表達多來源整合與推理過程 |
| Page | Note 或 Knowledge Page | 需先區分 notebooklm 筆記與 notion 正典內容 |