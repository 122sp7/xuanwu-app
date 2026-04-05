# Ubiquitous Language — knowledge-collaboration

---

## 核心術語

| 術語 | 定義 | 禁止混用 |
|---|---|---|
| **Comment**（留言） | 針對特定內容（Page/Article）的線程式留言或回覆 | Note, Message, Reply（Reply 是 Comment 的子集，不另外命名） |
| **Thread**（討論串） | 一個 root Comment 與其所有 Reply 組成的討論串 | Conversation, Discussion |
| **Permission**（權限） | 特定使用者或團隊對特定內容的存取授權記錄 | Role, Access, Right |
| **PermissionLevel**（權限級別） | `view` / `comment` / `edit` / `full` — 由低到高 | ReadOnly, Write, Admin |
| **Version**（版本快照） | 內容在某一時間點的完整 Block 快照 | Snapshot, Revision, Backup |
| **NamedVersion**（具名版本） | 附帶人工可讀標籤的版本，不被自動保留策略刪除 | Milestone, Tag |
| **contentId**（內容 ID） | 跨 BC 引用的 opaque ID，可為 pageId 或 articleId | ResourceId |
| **PageLock**（頁面鎖定） | 防止並發編輯的暫時性鎖定，有過期時間 | Lock, Mutex |

---

## 邊界詞彙對照

| 術語 | 此 BC 的含義 | 其他 BC 中的對應 |
|---|---|---|
| `Version` | Block 快照版本（點在時間線上的記錄） | `knowledge-base` 的 `version` number（樂觀鎖） |
| `Permission` | 存取授權記錄（誰可以對內容做什麼） | `workspace` 的 Membership（工作區成員身份） |
| `contentId` | 任意知識內容的 opaque ID（page/article/db） | `knowledge` 的 `pageId`、`knowledge-base` 的 `articleId` |

---

## 事件語言

| 事件 | 語意 |
|---|---|
| `knowledge-collaboration.comment_created` | 使用者在某內容上留下留言 |
| `knowledge-collaboration.comment_resolved` | 留言討論串被標記為已解決 |
| `knowledge-collaboration.permission_granted` | 使用者被授予某內容的存取權限 |
| `knowledge-collaboration.permission_revoked` | 使用者的存取權限被移除 |
| `knowledge-collaboration.version_created` | 系統或使用者建立了內容的版本快照 |
| `knowledge-collaboration.version_restored` | 內容被還原到特定版本 |
| `knowledge-collaboration.page_locked` | 內容被鎖定，防止並發編輯 |
