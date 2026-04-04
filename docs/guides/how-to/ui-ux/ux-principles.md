# UX 原則與互動規範

> **說明文件類型**：本文件說明 Xuanwu App 的使用者體驗設計哲學，定義互動模式、反饋機制與可近用性標準。
> 設計決策均與 Diátaxis 的「說明」象限對應 — 著重「為什麼」而非「如何做」。

---

## 1. 核心 UX 原則

### 1.1 UX1 — 操作可見（System Visibility）

> _使用者在任何時刻都知道系統正在做什麼。_

**來源**：Don Norman《The Design of Everyday Things》— 回饋原則。

**實作規範**：
- 所有非同步操作（上傳、查詢、刪除）必須有 loading 狀態指示。
- loading 狀態使用 **spinner + 文字** 雙重提示（例如「上傳中...」），不只有 spinner。
- 後台處理完成後（例如文件解析），以 **toast 通知** 明確告知結果。
- 即時變動的資料（例如文件 `status`）盡量使用 **Firestore `onSnapshot`** 讓狀態自動更新，而非需要使用者手動刷新。

### 1.2 UX2 — 降低認知負擔（Minimize Cognitive Load）

> _核心操作集中在一個頁面完成，不強迫使用者在多頁面間跳轉。_

**來源**：Steve Krug《Don't Make Me Think》— 最少點擊數。

**實作規範**：
- 每個主功能頁面（例如 `/wiki/documents`）自我完備 — 上傳、列表、操作三位一體。
- 側邊欄導覽項目最多顯示 **7 個頂層項目**（米勒定律：工作記憶限制）。
- 次要操作（例如快捷建立）使用 **hover 顯示** 的次要元素，不佔主要視覺空間。

### 1.3 UX3 — 錯誤可修復（Error Recovery）

> _出錯時顯示原因與建議的下一步行動。_

**來源**：Don Norman《The Design of Everyday Things》— 錯誤設計原則。

**實作規範**：
- 所有錯誤 toast 包含 **原因 + 建議行動**（例如「上傳失敗，請確認網路連線後重試」）。
- 格式驗證錯誤在使用者動作當下即時顯示，不等待 submit。
- 禁用按鈕（disabled）必須搭配 **tooltip 說明不可用原因**，不可靜默。

### 1.4 UX4 — 資料全覽預設（Default to Overview）

> _預設顯示 account 全覽，不因工作區切換讓資料「消失」。_

**來源**：Lean UX — 從使用者痛點出發的設計。

**實作規範**：
- 所有資料列表預設顯示 **account 範圍**，不以 workspace 為預設篩選。
- workspace 篩選為選擇性操作，透過 URL 參數（`?workspaceId=<id>`）觸發。
- 篩選啟動時，頁面需顯示明確的篩選提示（例如「workspace: {id} ×」）。

### 1.5 UX5 — 鍵盤可近用性（Keyboard Accessibility）

> _所有互動操作均可由鍵盤完整操作，不依賴滑鼠。_

**來源**：WCAG 2.1 AA 標準。

**實作規範**：
- 所有可互動元素（按鈕、連結、輸入框）可 Tab 鍵聚焦。
- Dropdown / Popover 支援 ↑↓ 導覽與 Enter 觸發、Esc 關閉。
- 焦點管理：開啟 Modal/Dialog 後焦點移入；關閉後焦點回到觸發元素。
- 焦點環（focus ring）在所有互動元素上清晰可見。

### 1.6 UX6 — 一致性（Consistency）

> _相同功能在全平台使用相同元件與文案模式。_

**來源**：Jakob Nielsen《10 Usability Heuristics》— Consistency and Standards。

**實作規範**：
- 統一使用 shadcn/ui 元件庫，不自行實作已有的基礎元件。
- 操作文案統一：「建立」（不混用「新增」和「新建」）、「刪除」（不混用「移除」）。
- 狀態圖示統一：`✓ ready`、`⏳ processing`、`✗ error`。

---

## 2. 互動模式規範

### 2.1 Toast 通知規則

Toast 是 Xuanwu App 的主要反饋機制，使用 **Sonner** 函式庫。

| 情境 | Toast 類型 | 顯示時間 |
|---|---|---|
| 操作成功（建立、儲存、觸發） | `success` | 3 秒自動消失 |
| 操作失敗（網路、驗證、權限） | `error` | 5 秒（或手動關閉） |
| 背景處理中（可能需要等待） | `info` | 4 秒自動消失 |
| 危險操作前的確認 | 不用 toast，用 Dialog | — |

**格式規範**：
```
成功：「已{動作} {對象}」        例：「已建立 工作區 Marketing」
失敗：「{動作}失敗：{原因}」     例：「上傳失敗：格式不支援」
處理中：「{動作}中，請稍候…」   例：「重整中，請稍候…」
```

**實作位置**：`<Toaster />` 已掛載於全域 Provider。

### 2.2 Loading 狀態規範

| 情境 | Loading 模式 |
|---|---|
| 頁面初始載入 | Skeleton（骨架屏） — 整頁占位符 |
| 列表資料載入 | Skeleton rows — 每列占位符 |
| 按鈕觸發的操作 | Inline spinner + 文字 + disabled |
| 單列操作（不影響其他列） | 僅該列顯示 spinner，其他列保持互動 |
| 全頁阻斷操作 | 避免使用；若必要，使用半透明 overlay |

### 2.3 空狀態設計

每個列表頁面須定義 **空狀態（Empty State）**，避免空白頁面讓使用者困惑。

| 場景 | 空狀態內容 |
|---|---|
| 無文件（Documents） | 說明文字 + 指向 Upload 卡的引導箭頭 |
| 無頁面（Pages） | 說明文字 + 「建立第一個頁面」按鈕 |
| 無查詢結果（RAG Query） | 說明文字 + 建議的下一步（確認文件已 indexed） |
| 無工作區 | 說明文字 + 「建立工作區」按鈕 |

**空狀態文案格式**：
```
「目前還沒有 {資源名稱}，{引導動作}。」
例：「目前還沒有文件，試著上傳第一份檔案。」
```

### 2.4 確認對話框規則

需要使用 Dialog 確認的操作：

| 操作類型 | 是否需要確認 |
|---|---|
| 刪除永久性資源 | ✅ 必須 |
| 批次刪除 | ✅ 必須 |
| 清除資料 | ✅ 必須 |
| 建立 | ❌ 不需要 |
| 儲存 | ❌ 不需要 |
| 觸發背景任務（例如 reindex） | ❌ 不需要（有 toast 反饋即可） |

---

## 3. 表單設計規範

### 3.1 輸入驗證時機

| 驗證類型 | 觸發時機 |
|---|---|
| 格式驗證（日期、Email） | blur（失去焦點時） |
| 必填欄位 | submit（提交時）；如果已 blur 過也可 blur 時顯示 |
| 即時搜尋 | change（每次輸入後，加 debounce） |
| 伺服器端驗證 | submit 後，以 toast 或 inline error 顯示 |

### 3.2 按鈕狀態

所有可提交的按鈕（Primary Button）遵循以下狀態：

```
idle → loading → success（toast） or error（toast）
```

- **idle**：正常可點擊狀態，顯示操作文字。
- **loading**：顯示 spinner + 操作進行中文字，按鈕 disabled。
- **success**：toast 顯示成功訊息，按鈕回到 idle（或 navigate）。
- **error**：toast 顯示錯誤訊息，按鈕回到 idle（允許重試）。

---

## 4. 導覽行為規範

### 4.1 側邊欄展開 / 收合

- **預設狀態**：展開。
- **收合觸發**：使用者點擊 `PanelLeftClose` 圖示，偏好存於 `localStorage`（key: `xuanwu:nav-preferences`）。
- **收合狀態**：僅顯示圖示，懸停（hover）顯示 Tooltip 提示完整名稱。

### 4.2 Active 狀態顯示

- 側邊欄以路由 prefix 判斷 active（`pathname.startsWith(href + "/")`）。
- Active 項目：背景色 `bg-accent`，文字加粗。

### 4.3 麵包屑（Breadcrumb）

目前未實作全站麵包屑；各功能區頁首有「返回」按鈕（例如「← 返回 Wiki Beta」）。

---

## 5. 可近用性完整清單

### 5.1 必要實作（WCAG 2.1 AA）

| 需求 | 實作細節 |
|---|---|
| 色彩對比 | 文字與背景對比 ≥ 4.5:1（一般文字）；≥ 3:1（大文字） |
| 鍵盤可操作 | 所有功能可不依賴滑鼠完成 |
| 螢幕閱讀器 | 圖示按鈕有 `aria-label`；狀態用 `aria-live` 或 `role="status"` |
| 焦點管理 | 開啟 Dialog/Popover 後焦點移入，關閉後焦點回到觸發元素 |
| 錯誤識別 | 錯誤訊息不僅依賴紅色，需有文字說明 |
| 選單鍵盤操作 | Arrow 鍵導覽、Enter 觸發、Esc 關閉 |

### 5.2 元件可近用性規格

| 元件 | 鍵盤行為 | ARIA 需求 |
|---|---|---|
| Drop Zone | Tab 聚焦；Enter/Space 觸發選檔 | `role="button"`, `aria-label` |
| Dropdown Menu | ↑↓ 導覽；Enter 選擇；Esc 關閉 | `role="menu"`, `role="menuitem"` |
| Dialog | Esc 關閉；焦點陷阱 | `role="dialog"`, `aria-labelledby` |
| Toast | 自動朗讀 | `role="alert"` 或 `aria-live="assertive"` |
| Table | Tab 導覽至互動元素 | `<table>` 語意標籤 |
| Badge / Status | — | 不可只用顏色；需有文字 |

---

## 6. 回應式設計規範

Xuanwu App 主要針對桌面（Desktop first），但核心頁面需支援平板與手機。

| 斷點 | Tailwind Prefix | 說明 |
|---|---|---|
| 手機 | （預設） | 單欄版型；隱藏 Secondary Nav |
| 平板 | `md:` | 可選性顯示 Secondary Nav |
| 桌面 | `lg:` | 完整三欄版型 |

**手機版規則**：
- App Rail 收合為底部導覽列（planned）。
- 資料列表改為卡片式呈現，取代桌面的表格。
- 複雜操作（例如上傳）維持可用，但版型調整為全寬。
