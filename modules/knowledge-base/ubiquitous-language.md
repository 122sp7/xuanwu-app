# Ubiquitous Language — knowledge-base

> 此 BC 的通用語言定義，確保 domain / application / UI 使用一致術語。

---

## 核心術語

| 術語 | 定義 | 禁止使用的錯誤術語 |
|---|---|---|
| **Article**（文章） | 組織級公開知識文章、SOP 或 Wiki 頁面，具備版本與驗證機制 | Document, KnowledgePage, WikiPage |
| **Category**（分類） | 文章的層級分類容器（樹狀結構，最多 5 層） | Folder, Namespace, Group |
| **ArticleStatus**（文章狀態） | `draft` / `published` / `archived` 三態 | Active, Live, Deleted |
| **VerificationState**（驗證狀態） | `verified` / `needs_review` / `unverified` — 知識準確性狀態 | Approved, Checked, Valid |
| **ArticleOwner**（文章負責人） | 負責維護特定文章內容準確性的使用者 | Author, Creator, Editor |
| **Backlink**（反向連結） | 引用此 Article 的其他 Article — `[[Article Title]]` wikilink 語法 | Reference, Link, Mention |
| **Tag**（標籤） | 文章的關鍵詞分類標籤，用於過濾與搜尋 | Label, Keyword, Topic |
| **Wikilink**（Wiki 連結） | `[[Article Title]]` 格式的內部文章引用語法 | Link, Anchor, Mention |
| **Promote**（提升） | 將 `knowledge` BC 的 Page 轉換為此 BC 的 Article — 跨 BC 協議 | Convert, Transform, Import |

---

## 邊界詞彙對照表

| 術語 | 此 BC 的含義 | 其他 BC 中的對應 |
|---|---|---|
| `Article` | 組織知識文章 | `knowledge` 的 `Page`（個人筆記） |
| `Category` | 文章分類目錄 | `workspace` 的 Collection / Folder |
| `VerificationState` | knowledge-base 文章的驗證狀態 | `knowledge-collaboration` 的 `Version`（歷史版本） |
| `content` | Article 的主體文字（Markdown/rich-text） | `knowledge` Block 的 content field |

---

## 事件語言

| 事件名稱 | 語意 |
|---|---|
| `knowledge-base.article_created` | 使用者建立了一篇新文章（狀態為 draft） |
| `knowledge-base.article_published` | 文章從 draft 轉為公開 published |
| `knowledge-base.article_archived` | 文章被封存，不再對外顯示 |
| `knowledge-base.article_verified` | 知識管理員驗證了文章內容的準確性 |
| `knowledge-base.article_review_requested` | 文章被標記為需要重新複核（verificationState = needs_review） |
| `knowledge-base.category_created` | 新分類目錄被建立 |
| `knowledge-base.category_moved` | 分類被移動到新的父分類下 |
