# Bounded Contexts

## 定案主域 (Canonical Bounded Contexts)

Xuanwu 的最終定案架構由以下 **4 個主域**組成，每個主域包含多個子域。

| 主域 | 模組路徑 | 分類 | 核心職責 | 詳細文件 |
|---|---|---|---|---|
| `workspace` | `modules/workspace/` | Generic | 協作容器、工作區生命週期、`workspaceId` 範疇錨點 | [`docs/contexts/workspace/`](contexts/workspace/README.md) |
| `platform` | `modules/platform/` | Generic | 平台治理——主體、身份、政策、商業、通知、稽核等 23 個子域 | [`docs/contexts/platform/`](contexts/platform/README.md) |
| `notion` | `modules/notion/` | Core | 知識內容生命週期——頁面、文章、資料庫、協作等 12 個子域 | [`docs/contexts/notion/`](contexts/notion/README.md) |
| `notebooklm` | `modules/notebooklm/` | Supporting | AI 對話與合成——Thread、RAG 生成、摘要等 7 個子域 | [`docs/contexts/notebooklm/`](contexts/notebooklm/README.md) |

## 子域清單 (Subdomain Inventory)

### workspace — 協作容器

| 子域 | 核心職責 |
|---|---|
| `audit` | 工作區操作稽核軌跡 |
| `feed` | 活動摘要與動態 |
| `scheduling` | 排程與時間管理 |
| `workflow` | 工作區流程自動化 |

### platform — 平台治理

| 子域 | 核心職責 |
|---|---|
| `identity` | 已驗證主體與身份信號 |
| `account` | 帳號聚合根與生命週期 |
| `account-profile` | 主體屬性、偏好與治理 |
| `organization` | 組織、成員與角色邊界 |
| `access-control` | 主體現在能做什麼 |
| `security-policy` | 安全規則定義與發佈 |
| `platform-config` | 設定輪廓管理 |
| `feature-flag` | 功能開關策略 |
| `onboarding` | 新主體初始設定引導 |
| `compliance` | 資料保留與法規執行 |
| `billing` | 計費狀態與財務證據 |
| `subscription` | 方案、權益與配額 |
| `referral` | 推薦關係與獎勵追蹤 |
| `integration` | 外部系統協作邊界 |
| `workflow` | 事實轉可執行流程 |
| `notification` | 通知路由與發送 |
| `background-job` | 排程任務提交與監控 |
| `content` | 內容資產管理與發布 |
| `search` | 跨域搜尋路由與執行 |
| `audit-log` | 永久稽核追蹤 |
| `observability` | 健康量測、追蹤與告警 |
| `analytics` | 使用行為量測與分析 |
| `support` | 客服工單與支援知識 |

### notion — 知識內容

| 子域 | 核心職責 | 前身模組 |
|---|---|---|
| `knowledge` | 頁面建立、組織、版本化與交付 | `modules/knowledge/` |
| `authoring` | 知識庫文章建立、驗證與分類 | `modules/knowledge-base/` |
| `collaboration` | 協作留言、細粒度權限與版本快照 | `modules/knowledge-collaboration/` |
| `database` | 結構化資料多視圖管理 | `modules/knowledge-database/` |
| `ai` | AI 輔助頁面生成與摘要整合 | — |
| `analytics` | 知識使用行為量測 | — |
| `attachments` | 附件與媒體關聯儲存 | — |
| `automation` | 知識事件觸發自動化動作 | — |
| `integration` | 知識與外部系統雙向整合 | — |
| `notes` | 個人輕量筆記與正式知識協作 | — |
| `templates` | 頁面範本管理與套用 | — |
| `versioning` | 全域版本快照策略管理 | — |

### notebooklm — AI 對話與合成

| 子域 | 核心職責 |
|---|---|
| `ai` | AI 模型調用與提示工程 |
| `conversation` | 對話 Thread 與 Message 生命週期 |
| `note` | 輕量筆記與知識連結 |
| `notebook` | Notebook 組合與管理 |
| `source` | 來源文件追蹤與引用 |
| `synthesis` | RAG 合成、摘要與洞察生成 |
| `versioning` | 對話版本與快照策略 |

## 邊界規則 (Boundary Rules)

1. 任何跨主域存取**只能**透過目標主域的 `api/` 公開邊界。
2. 跨主域通訊使用已發布契約（published language）或領域事件（domain events）。
3. 主域或子域的所有權變更必須先在本文件反映，再進行實作。
4. 前身獨立模組（`knowledge`, `knowledge-base`, `knowledge-collaboration`, `knowledge-database`）已計畫合并進 `notion` 子域；在合并完成前維持過渡共存。

