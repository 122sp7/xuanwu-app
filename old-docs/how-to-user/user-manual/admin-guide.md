# 管理員指南（Admin Guide）

> **目標讀者**：組織管理員（Admin Role）與系統維運人員
> **目標**：說明成員管理、權限設定、系統監控與維運操作。

---

## 快速參考

| 我想要… | 路徑 | 角色需求 |
|---|---|---|
| 管理組織成員 | `/organization/members` | Admin |
| 管理團隊 | `/organization/teams` | Admin |
| 設定權限 | `/organization/permissions` | Admin |
| 管理工作區 | `/organization/workspaces` | Admin |
| 查看稽核記錄 | `/organization/audit` | Admin |
| 設定排程 | `/organization/schedule` | Admin |
| 每日摘要 | `/organization/daily` | Admin / Member |
| 手動觸發 RAG 重整 | `/wiki-beta/rag-reindex` | Member+ |

---

## 1. 組織管理

### 1.1 建立組織

1. 點選 App Rail 左側 **`+`** 圖示。
2. 選擇 **「建立組織」**。
3. 輸入組織名稱。
4. 點選 **「建立組織」**。
5. ✅ 組織建立成功，帳號類型變更為 `organization`。

> **注意**：組織一旦建立後，帳號類型固定為組織帳號，不可切換回個人帳號。

### 1.2 查看組織資訊

1. 點選 App Rail 的 **`Users`（使用者）** 圖示，進入 `/organization`。
2. 側邊欄顯示組織管理功能：成員、團隊、權限、工作區、排程、每日、稽核。

---

## 2. 成員管理

### 2.1 邀請成員

1. 進入 `/organization/members`。
2. 點選 **「邀請成員」** 按鈕。
3. 輸入成員的 Email，選擇角色。
4. 點選 **「發送邀請」**。
5. ✅ 被邀請者收到邀請通知後，可加入組織。

### 2.2 角色說明

| 角色 | 說明 | 可執行操作 |
|---|---|---|
| `owner` | 組織擁有者 | 所有操作，包含刪除組織 |
| `admin` | 管理員 | 成員管理、工作區管理、稽核查看 |
| `member` | 一般成員 | 讀寫工作區資源、文件上傳 |
| `viewer` | 唯讀成員 | 僅查看，不可修改 |

> 完整權限矩陣見 [`PERMISSIONS.md`](../../../PERMISSIONS.md)。

### 2.3 調整成員角色

1. 在成員列表找到目標成員。
2. 點選成員右側 **`...`（更多）** 圖示。
3. 選擇 **「調整角色」**。
4. 選擇新角色後確認。

### 2.4 移除成員

1. 找到目標成員，點選 **`...`** → **「移除成員」**。
2. 在確認對話框點選 **「確認移除」**。
3. ✅ 成員移除後，其工作區存取權限立即撤銷。

---

## 3. 團隊管理

### 3.1 建立團隊

1. 進入 `/organization/teams`。
2. 點選 **「建立團隊」**。
3. 輸入團隊名稱（例如「工程師」、「設計師」）。
4. 將成員加入團隊。

### 3.2 團隊用途

- 批次設定工作區存取權限（以團隊為單位）。
- 組織成員分群，方便管理通知與排程。

---

## 4. 工作區管理

### 4.1 查看所有工作區

進入 `/organization/workspaces`，顯示組織下所有工作區的列表。

**顯示欄位**：
- 工作區名稱
- 成員數量
- 建立時間
- 最後活動時間

### 4.2 刪除工作區

1. 找到目標工作區，點選 **「刪除工作區」**。
2. 在確認對話框輸入工作區名稱確認。
3. ✅ **注意**：刪除後工作區下的資源（Pages、Documents 等）將無法恢復。

---

## 5. 稽核記錄

### 5.1 查看稽核記錄

進入 `/organization/audit`，顯示組織內所有關鍵操作的記錄。

**記錄項目包括**：
- 成員邀請 / 移除
- 角色調整
- 工作區建立 / 刪除
- 關鍵資源操作（文件刪除等）

### 5.2 記錄欄位說明

| 欄位 | 說明 |
|---|---|
| **timestamp** | 操作時間 |
| **actor** | 執行操作的成員（Email） |
| **action** | 操作類型（例如 `member.invite`） |
| **target** | 操作對象（例如被邀請的成員 Email） |
| **result** | 操作結果（`success` / `failure`） |

### 5.3 記錄保留原則

- 稽核記錄為**不可變（immutable）**記錄，已提交的記錄不可修改或刪除。
- 記錄保留期限依系統配置，預設保留 90 天。

---

## 6. 排程管理

### 6.1 查看排程

進入 `/organization/schedule`，顯示組織的資源排程。

排程模組使用**雙向資源-請求配對**模型，適用於人員與任務的配對管理。

---

## 7. 知識庫維運

### 7.1 監控文件處理狀態

進入 `/wiki-beta/documents`，查看組織下所有文件的解析狀態：

- `⏳ processing`：正常，等待解析完成
- `✓ ready`：解析完成，可進行 RAG
- `✗ error`：解析失敗，需要介入

**批量檢查**：若多份文件顯示 `error`，可能是 py_fn Worker 服務異常，需排查。

### 7.2 手動觸發 RAG 重整

當 RAG 索引異常或文件更新後：

1. 進入 `/wiki-beta/rag-reindex`。
2. 找到目標文件（`status: ready`，`rag status: error` 或 `pending`）。
3. 點選 **「手動重整」**。
4. ✅ 觸發成功，`rag status` 更新。

**批量重整**：目前不支援批量重整，需逐一觸發。

---

## 8. 系統部署與維運

### 8.1 部署指令

```bash
# 部署所有 Firebase 資源
npm run deploy:firebase

# 僅部署 Python Cloud Functions
npm run deploy:functions:py-fn

# 僅部署 Firestore + Storage 規則
npm run deploy:rules
```

### 8.2 環境設定

系統依賴以下環境變數（於 Firebase App Hosting 或 `.env.local` 配置）：

| 變數 | 說明 |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase 客戶端 SDK 設定 |
| `GOOGLE_CLOUD_PROJECT` | GCP 專案 ID |
| `OPENAI_API_KEY` | OpenAI API Key（py_fn 使用） |
| `UPSTASH_VECTOR_*` | Upstash Vector 連線設定 |
| `UPSTASH_REDIS_*` | Upstash Redis 連線設定 |

> **安全提示**：不可將上述金鑰提交至版本控制系統。

### 8.3 監控與告警

- **Firebase Console**：查看 Cloud Functions 執行日誌、Firestore 讀寫統計。
- **Upstash Console**：查看 Vector / Redis 使用量與請求記錄。
- **Google Cloud Console**：查看 Document AI 請求記錄與費用。

### 8.4 Firestore Security Rules 維護

```bash
# 部署 Firestore Rules
firebase deploy --only firestore:rules

# 部署 Storage Rules
firebase deploy --only storage:rules
```

Rules 文件位置：
- `firestore.rules` — Firestore 安全規則
- `storage.rules` — Storage 安全規則

### 8.5 Firestore 索引管理

```bash
# 部署 Firestore Indexes
firebase deploy --only firestore:indexes
```

索引設定：`firestore.indexes.json`

---

## 9. 常見維運問題

### Q1：文件大量顯示 error 狀態？

**可能原因**：py_fn Worker 服務故障或 Document AI 配額超限。

**排查步驟**：
1. 檢查 Firebase Console → Functions → 查看最近的 error 日誌。
2. 確認 Google Cloud Document AI 配額未超限。
3. 若服務已恢復，手動重整 error 的文件。

### Q2：RAG Query 回應時間過長？

**可能原因**：Upstash Vector 或 Redis 連線異常，或 OpenAI API 限速。

**排查步驟**：
1. 確認 Upstash 服務狀態。
2. 確認 OpenAI API 配額。
3. 查看 py_fn callable 日誌。

### Q3：新成員無法登入？

**排查步驟**：
1. 確認成員是否已完成 Email 驗證。
2. 在 Firebase Console → Authentication 確認帳號狀態。
3. 確認成員有 Firestore 中的對應帳號記錄。
