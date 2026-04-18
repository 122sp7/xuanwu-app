# feed — Workspace Feed Subdomain

每日動態貼文子域。讓工作區成員每天以 IG 風格發布文字與照片動態，未來將擴展為今日任務完成與出勤記錄的整合入口。

## 領域概念

| 概念 | 說明 |
|---|---|
| `FeedPost` | 聚合根。代表一則動態（post / reply / repost）|
| `dateKey` | ISO 日期字串 `YYYY-MM-DD`，用於 Firestore 按日期查詢 |
| `photoUrls` | 附圖 URL 陣列（最多 9 張），指向 Storage 或外部圖片 |
| `FeedPostType` | `post`（一般貼文）· `reply`（回覆）· `repost`（轉貼）|

## 狀態

| 層 | 狀態 |
|---|---|
| Domain | ✅ FeedPost 聚合根（含 photoUrls、dateKey）|
| Application | ✅ CreateFeedPostUseCase、ListFeedPostsUseCase |
| Outbound adapter | ✅ FirestoreFeedRepository（含按日期查詢）|
| Inbound adapter | ✅ feed-actions.ts server actions |
| UI | ✅ WorkspaceDailySection — 每日動態 IG 風格貼文牆 |

## 資料結構（Firestore）

Collection: `feed_posts`

```
{
  id: string (UUID),
  accountId: string,
  workspaceId: string,
  authorAccountId: string,
  type: "post" | "reply" | "repost",
  content: string,
  dateKey: string,       // YYYY-MM-DD — 用於日期過濾索引
  photoUrls: string[],   // Storage URLs，0–9 張
  replyToPostId: string | null,
  repostOfPostId: string | null,
  likeCount: number,
  replyCount: number,
  repostCount: number,
  viewCount: number,
  bookmarkCount: number,
  shareCount: number,
  createdAtISO: string,
  updatedAtISO: string,
}
```

建議 Firestore 複合索引：`(accountId, workspaceId, dateKey)` 以優化每日動態查詢。

## 未來擴展

- 今日任務完成統計（接入 workspace/task 子域）
- 出勤記錄 check-in（接入 workspace/membership 子域）
- 照片實際上傳（整合 platform FileAPI，替換 URL 輸入）
- 點讚 / 回覆互動

## 邊界規則

- `domain/` 不依賴任何外部框架或 Firebase SDK。
- 跨模組消費者只能透過 `workspace/index.ts` 或 server actions 存取。
- 照片上傳涉及所有權與 tenant 隔離時，必須走 platform FileAPI，而非直接呼叫 Storage SDK。
