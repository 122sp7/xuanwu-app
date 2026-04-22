# feed

## PURPOSE

feed 子域提供工作區每日動態貼文能力，支援文字與圖片內容。
它是工作區活動流入口，未來可整合任務完成與出勤記錄訊號。

## GETTING STARTED

進入 feed 子域前先讀：

1. [../task-formation/README.md](../task-formation/README.md)
2. [../../README.md](../../README.md)
3. [../../AGENTS.md](../../AGENTS.md)

## ARCHITECTURE

feed 目前以貼文聚合根與查詢為核心：

- domain：FeedPost 與貼文語義
- application：建立與列表用例
- outbound：Firestore repository
- inbound/UI：server actions 與每日動態視圖

## PROJECT STRUCTURE

- domain：貼文模型與型別
- application：CreateFeedPostUseCase、ListFeedPostsUseCase
- adapters/outbound：FirestoreFeedRepository
- adapters/inbound：feed-actions 與 UI entry

## DEVELOPMENT RULES

- MUST keep feed domain independent from Firebase SDK.
- MUST keep cross-subdomain access through workspace module boundary.
- MUST keep dateKey query contract stable for daily feed retrieval.
- MUST route storage ownership-sensitive uploads through platform FileAPI.

## AI INTEGRATION

feed 目前不擁有 AI orchestration 核心能力。
若加入 AI 摘要或推薦能力，需透過 workspace/platform 邊界接入，避免語言污染。

## DOCUMENTATION

- Parent context: [../../README.md](../../README.md)
- Parent rules: [../../AGENTS.md](../../AGENTS.md)
- Strategic authority: [../../../../../docs/README.md](../../../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內定位 feed 的主要資料流。
- 可在 3 分鐘內判斷修改應落在 domain/application/adapters 哪一層。
