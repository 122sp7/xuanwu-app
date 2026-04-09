# Subdomains

## 定案主域分類 (Canonical Domain Classification)

Xuanwu 最終定案的 4 個主域按 DDD 戰略分類如下：

| 分類 | 主域 | 說明 |
|---|---|---|
| **Core Domain** | `notion` | 競爭差異化核心——知識內容生命週期是平台的主要價值 |
| **Supporting Subdomain** | `notebooklm` | 支援核心的 AI 對話、RAG 合成與摘要能力 |
| **Generic Subdomain** | `workspace` | 非差異化但必要——協作容器與工作區範疇 |
| **Generic Subdomain** | `platform` | 跨切面平台基礎設施——身份、計費、通知、政策等 |

## 子域完整分類

### Core Domain

| 主域 | 子域 | 子域職責 |
|---|---|---|
| `notion` | `knowledge` | 頁面生命週期（前身：`modules/knowledge/`） |
| `notion` | `authoring` | 知識庫文章管理（前身：`modules/knowledge-base/`） |
| `notion` | `collaboration` | 協作與版本（前身：`modules/knowledge-collaboration/`） |
| `notion` | `database` | 結構化資料視圖（前身：`modules/knowledge-database/`） |
| `notion` | `ai` | AI 輔助整合 |
| `notion` | `analytics` | 知識行為量測 |
| `notion` | `attachments` | 附件與媒體 |
| `notion` | `automation` | 事件驅動自動化 |
| `notion` | `integration` | 外部系統整合 |
| `notion` | `notes` | 個人輕量筆記 |
| `notion` | `templates` | 頁面範本管理 |
| `notion` | `versioning` | 版本快照策略 |

### Supporting Subdomain

| 主域 | 子域 | 子域職責 |
|---|---|---|
| `notebooklm` | `ai` | AI 模型調用 |
| `notebooklm` | `conversation` | Thread / Message 生命週期 |
| `notebooklm` | `note` | 輕量筆記連結 |
| `notebooklm` | `notebook` | Notebook 組合管理 |
| `notebooklm` | `source` | 來源追蹤與引用 |
| `notebooklm` | `synthesis` | RAG 合成與摘要 |
| `notebooklm` | `versioning` | 對話版本策略 |

### Generic Subdomain — workspace

| 子域 | 職責 |
|---|---|
| `audit` | 工作區稽核軌跡 |
| `feed` | 活動摘要動態 |
| `scheduling` | 排程管理 |
| `workflow` | 流程自動化 |

### Generic Subdomain — platform

包含 23 個子域，詳見 [`modules/platform/docs/subdomains.md`](../modules/platform/docs/subdomains.md)。

主要群組：**主體與名錄**（identity, account, account-profile, organization）、**治理與安全**（access-control, security-policy, platform-config, feature-flag, onboarding, compliance）、**商業與權益**（billing, subscription, referral）、**流程與傳遞**（workflow, notification, integration, background-job）、**內容與搜尋**（content, search）、**稽核與診斷**（audit-log, observability, analytics, support）。

## 映射規則 (Mapping Rules)

1. 每個子域映射到唯一一個主域——所有權是唯一的。
2. 子域重新分類需要同時更新 `bounded-contexts.md`、`context-map.md` 與相關 ADR。
3. 主域清單**定案封閉**——新增主域需要修改本文件並獲得架構審查。

