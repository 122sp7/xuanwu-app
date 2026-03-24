# 設計系統（Design System）

> **參考文件類型**：此文件是 Xuanwu App 的設計語言規範，定義色彩、字型、間距、圖示等基礎設計代碼（Design Tokens）。
> 技術實作以 Tailwind CSS v4 + shadcn/ui 為基準。

---

## 1. 設計哲學

Xuanwu App 的設計語言依循三個核心原則：

| 原則 | 說明 |
|---|---|
| **功能優先** | 每個設計決策服務於使用者完成特定任務，不追求裝飾性 |
| **系統一致** | 相同情境使用相同元件，減少使用者的學習成本 |
| **資訊密度平衡** | 在資訊豐富（enterprise）與認知負荷（簡潔）之間取得平衡 |

---

## 2. 色彩系統

### 2.1 語義色彩（Semantic Colors）

語義色彩基於 shadcn/ui 的 CSS 變數系統，使用時請優先選用語義名稱，不直接使用 HEX 值。

| 代碼 | CSS 變數 | 用途說明 |
|---|---|---|
| **background** | `--background` | 頁面底色 |
| **foreground** | `--foreground` | 主要文字色 |
| **card** | `--card` | 卡片底色 |
| **card-foreground** | `--card-foreground` | 卡片文字色 |
| **popover** | `--popover` | 彈出層底色 |
| **primary** | `--primary` | 主要操作色（按鈕、連結） |
| **primary-foreground** | `--primary-foreground` | 主要操作色上的文字 |
| **secondary** | `--secondary` | 次要操作色 |
| **muted** | `--muted` | 弱化背景色（placeholder、禁用） |
| **muted-foreground** | `--muted-foreground` | 弱化文字（次要說明文字） |
| **accent** | `--accent` | 強調色（hover 狀態） |
| **destructive** | `--destructive` | 危險操作色（刪除、錯誤） |
| **border** | `--border` | 邊框色 |
| **input** | `--input` | 輸入框邊框色 |
| **ring** | `--ring` | 焦點環色（鍵盤導覽） |

### 2.2 狀態色彩

用於文件狀態、流程狀態等情境的語義指示：

| 狀態 | 顏色建議 | Tailwind Class | 說明 |
|---|---|---|---|
| 成功 / Ready | 綠色 | `text-green-600` / `bg-green-50` | 操作完成、狀態正常 |
| 處理中 | 藍色/琥珀色 | `text-blue-600` / `text-amber-600` | 背景處理中 |
| 警告 | 黃色 | `text-yellow-600` / `bg-yellow-50` | 需注意但不影響使用 |
| 錯誤 | 紅色 | `text-red-600` / `bg-red-50` | 操作失敗、系統錯誤 |
| 禁用 | 灰色 | `text-muted-foreground` | 功能不可用 |

> **可近用性規則**：狀態不可只依賴顏色區分，必須同時提供文字標籤（例如 `✓ ready`、`⏳ processing`、`✗ error`）。

---

## 3. 字型系統

### 3.1 字型層次

| 層次 | Tailwind Class | 用途 |
|---|---|---|
| 頁面標題（H1） | `text-2xl font-bold` 或 `text-3xl font-bold` | 頁面主標題 |
| 區塊標題（H2） | `text-xl font-semibold` | 卡片標題、主要區塊標題 |
| 子標題（H3） | `text-base font-semibold` | 次要標題、欄位群組標題 |
| 正文 | `text-sm` | 一般內容文字 |
| 說明文字 | `text-sm text-muted-foreground` | 輔助說明、placeholder |
| 微文字 | `text-xs text-muted-foreground` | 時間戳記、狀態標籤 |

### 3.2 字型族

- **主字型**：系統字型（`font-sans`）— `system-ui`, `Arial`, `sans-serif`
- **程式碼字型**：`font-mono` — `ui-monospace`, `Consolas`, `monospace`

---

## 4. 間距與版型

### 4.1 間距比例

遵循 Tailwind CSS 4 的 4px 基準間距系統：

| 代碼 | px | 用途 |
|---|---|---|
| `space-1` | 4px | 圖示與文字之間 |
| `space-2` | 8px | 行內元素間距 |
| `space-3` | 12px | 緊湊型元件內距 |
| `space-4` | 16px | 標準元件內距（按鈕、輸入框） |
| `space-6` | 24px | 區塊間距 |
| `space-8` | 32px | 頁面區段間距 |
| `space-12` | 48px | 大型區塊間距 |

### 4.2 版型結構

Xuanwu App 採用三欄式 Shell 版型：

```
+-------+------------------+----------------------------+
|  App  |   Secondary Nav   |       Main Content          |
|  Rail |  (Dashboard       |                             |
| (48px)|   Sidebar)        |    page.tsx 協調層          |
|       |   (240px)         |                             |
+-------+------------------+----------------------------+
```

| 欄位 | 寬度 | 說明 |
|---|---|---|
| App Rail | `w-12`（48px） | 最左側圖示導覽欄 |
| Secondary Nav | `w-60`（240px）| 次要側邊欄（可收合） |
| Main Content | `flex-1` | 頁面主要內容區 |

---

## 5. 圓角系統

| 元件類型 | Tailwind Class | 說明 |
|---|---|---|
| 小元件（badge、tag） | `rounded` | 4px |
| 標準元件（button、input） | `rounded-md` | 6px |
| 卡片、面板 | `rounded-lg` | 8px |
| 對話框、Sheet | `rounded-xl` | 12px |
| 圓形圖示 | `rounded-full` | 100% |

---

## 6. 圖示系統

所有圖示使用 **Lucide React** 圖示庫（`lucide-react`），保持圖示風格一致。

### 6.1 常用語義圖示

| 功能語義 | 圖示名稱 | 使用情境 |
|---|---|---|
| 工作區 | `Building2` | 工作區中心 App Rail 項目 |
| 知識庫 | `BookOpen` | Wiki-Beta App Rail 項目 |
| AI 對話 | `Bot` | AI Chat App Rail 項目 |
| 組織 | `Users` | 組織管理 |
| 設定 | `Settings` | 設定頁面 |
| 新增 | `Plus` | 快捷建立按鈕 |
| 收合 | `ChevronDown` / `ChevronRight` | 可折疊區塊 |
| 關閉側欄 | `PanelLeftClose` | 側邊欄收合 |
| 調整 | `SlidersHorizontal` | 自訂導覽 |

### 6.2 尺寸規範

```tsx
// 圖示標準尺寸
<Icon className="size-4" />     // 16px — 行內文字旁的小圖示
<Icon className="size-[18px]" /> // 18px — App Rail 圖示
<Icon className="size-5" />     // 20px — 按鈕內的圖示
<Icon className="size-6" />     // 24px — 卡片標題旁的圖示
```

---

## 7. 陰影與層級

| 層次 | Tailwind Class | 使用情境 |
|---|---|---|
| 無陰影 | （預設） | 一般卡片、列表 |
| 輕微陰影 | `shadow-sm` | 可互動的卡片、按鈕（hover） |
| 標準陰影 | `shadow` | 浮動工具列 |
| 深度陰影 | `shadow-md` | Dropdown、Popover |
| 對話框陰影 | `shadow-xl` | Modal、Dialog |

---

## 8. 動態與過渡

| 用途 | Tailwind Class | 說明 |
|---|---|---|
| 一般過渡 | `transition-colors` | 顏色切換（hover、focus） |
| 全屬性過渡 | `transition-all duration-150` | 展開/收合動畫 |
| 禁用動畫 | `motion-reduce:transition-none` | 尊重使用者偏好 |

---

## 9. 深色 / 淺色主題

系統支援亮色（light）與深色（dark）主題，依賴 CSS 變數切換。

- 主題切換由 `Header Controls` 中的主題切換器（`translation-switcher.tsx` 區域）控制。
- 所有色彩使用 CSS 語義變數，不使用硬編碼顏色值。
- 元件開發時，使用 `bg-background text-foreground` 而非 `bg-white text-black`。

---

## 10. 可近用性設計代碼

| 需求 | 實作方式 |
|---|---|
| 鍵盤焦點可見 | 使用 `ring` 色彩，確保焦點環清晰可見 |
| 色彩對比度 | 前景 / 背景最低對比 4.5:1（WCAG AA） |
| 螢幕閱讀器 | 所有圖示按鈕加 `aria-label`；Toast 使用 `role="alert"` |
| 狀態不依賴顏色 | 狀態標籤同時包含圖示與文字 |
| 禁用元件 | 使用 `aria-disabled` + `cursor-not-allowed`，並提供 tooltip 說明原因 |
