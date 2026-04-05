---
name: playwright-mcp-testing
description: >
  瀏覽器自動化測試與 UI 缺陷偵測技能。凡涉及以下任何行為時自動觸發：
  模擬用戶操作（點擊、填表、導航）、UI 功能缺口驗證、截圖比對、
  元素狀態檢查、表單送出流程、歡迎／登入流程、Console 錯誤偵測、
  API 返回值驗證。搭配 playwright-mcp、next-devtools-mcp、shadcn-mcp、
  context7、serena-mcp、markitdown-mcp 完整生態系執行閉環。
user-invocable: true
argument-hint: "<url-or-route> <user-flow-description>"
---

# Playwright MCP Testing (完整版)

## 定位

此技能是 Xuanwu App 的 **瀏覽器測試執行層**（Browser Test Execution Layer）。

負責範圍：
- 模擬真實用戶操作並觀察 UI 反應
- 找出功能缺口（missing features）與反直覺設計（anti-intuitive UX）
- 驗證表單送出、按鈕狀態、錯誤訊息、成功反饋
- 截圖存證讓 AI 和人類雙方都能「看見」測試結果
- 結合 Next.js 運行時診斷取得 Console 錯誤、路由資訊、Server Action 追蹤

---

## MCP 工具生態系統與用途

| MCP 工具 | 用途 | 何時調用 |
|---------|------|---------|
| `playwright-mcp` (`mcp_playwright-mc_*`) | 瀏覽器快照、點擊、填表、導航 | 主要執行层 — 凡涉及 UI 操作 |
| `io.github.vercel/next-devtools-mcp` (`mcp_io_github_ver_*`) | Next.js 路由、Console 錯誤、Server Action ID、頁面元數據 | 診斷 Next.js 特定問題 |
| `shadcn-mcp` (`mcp_shadcn_*`) | 查詢 shadcn/ui 元件用法、確認正確 import 路徑 | 需確認元件行為或找可用元件 |
| `context7-mcp` (`mcp_context7_*`) | 查詢 Playwright API、React API、Next.js API 最新文件 | 任何 API 不確定時，99.99% 準確率要求 |
| `oraios/serena-mcp` (`mcp_oraios_serena_*`) | 讀取 repo 記憶、符號搜尋、找 Server Actions | 需要查找 source code 或更新 memory |
| `markitdown-mcp` (`mcp_markitdown_*`) | 將截圖或 HTML 轉換為 Markdown 測試報告 | 需要輸出測試報告或文件化證據 |
| `mcp_io_github_ver_browser_eval` | 後備 browser eval（playwright-mcp 不可用時） | playwright-mcp 工具失效時的備援 |

---

## 工具優先順序（Priority）

```
playwright-mcp > mcp_io_github_ver_browser_eval（備援）
```

**關鍵原則**：`playwright-mcp` 工具永遠優先。若返回 `"Target page, context or browser has been closed"` 需立即切換備援方案（見下方「備援流程」章節）。

---

## 標準工作流程

### 1. 啟動前確認

```
[ ] Dev server 運行中（localhost:3000）
[ ] playwright-mcp 工具可用（mcp_playwright-mc_browser_snapshot 測試）
[ ] 確認測試目標 URL 與用戶流程
[ ] 確認測試帳號（dev demo: test@demo.com）
```

### 2. 取得 Accessibility Snapshot

**永遠先 snapshot，再行動**：

```
# 1. 取得頁面可訪問性快照（包含所有元素 ref）
mcp_playwright-mc_browser_snapshot: {}

# 2. 從 snapshot 找到目標元素的 ref（格式：e.g. "ref-123"）
# 3. 用 ref 進行 click / fill / select_option

# 正確示例：
mcp_playwright-mc_browser_click: { ref: "ref-123", element: "新增文章按鈕" }
mcp_playwright-mc_browser_fill: { ref: "ref-456", value: "文章標題內容" }
```

### 3. 表單操作流程

```
1. snapshot → 找到表單元素 refs
2. fill 逐一填入欄位（title、content、tags 等）
3. snapshot → 確認填入正確（欄位 value 反映即時狀態）
4. click 提交按鈕
5. wait_for → 等待成功/失敗狀態
6. snapshot → 確認最終 UI 狀態
7. screenshot → 截圖存證
```

### 4. 截圖存證流程

```
# 取得截圖 base64 內容
mcp_playwright-mc_browser_take_screenshot: {}

# PowerShell 儲存（Windows 環境）
$json = Get-Content "<content.json path>" | ConvertFrom-Json
$bytes = [Convert]::FromBase64String($json.result.content[0].data)
[System.IO.File]::WriteAllBytes("C:\Temp\ss_<name>.png", $bytes)

# 或自動儲存至 scratchpad
```

### 5. Console 錯誤收集

```
# 驗證是否有 Console 錯誤
mcp_playwright-mc_browser_console_messages: {}

# 或透過 next-devtools-mcp
mcp_io_github_ver_nextjs_call: { port: 3000, toolName: "get_errors" }
```

---

## Xuanwu App 特定操作模式

### A. 帳號切換（Personal → Organization）

> **重要**：Radix UI DropdownMenu 需要 `PointerEvent('pointerdown')` 才能觸發開啟。

```js
// 1. 取得 snapshot，找到帳號切換按鈕 ref
// 2. click 按鈕（觸發 PointerDown）
// 3. snapshot → 確認 [role=menu] 出現
// 4. click org 選項（[role=menuitem]）
// 5. 驗證：localStorage['xuanwu_last_active_account'] = orgId
```

```
// 備援：evaluate 方式（playwright-mcp 不可用時）
mcp_io_github_ver_browser_eval evaluate:
  document.querySelector('button[aria-label="切換帳號情境"]')
    ?.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true,isPrimary:true}))
// 點選 org([role=menuitem][1].click())
```

### B. 工作區選擇

> 許多頁面需要 `activeWorkspaceId` 才能啟用 CTA（如「新增文章」）。

```
流程：
1. 導航到 /workspace
2. 點擊某個工作區（snapshot → 找 workspace 卡片 ref → click）
3. 確認 appState.activeWorkspaceId 非空
4. 再導航到目標頁面
```

### C. SPA 內頁導航（避免全頁重載）

> 全頁重載（navigate/goto）會導致 React 重新初始化並重置 activeAccount。

```
✅ 正確方式：
- 使用 snapshot 找到 Link 的 ref → click
- 使用麵包屑連結（breadcrumb a[href="/target"]）的 ref → click

❌ 避免：
- mcp_playwright-mc_browser_navigate 到新頁面（會重置狀態）
- evaluate window.location.href = '...'
```

---

## 備援流程（playwright-mcp 失效時）

若 `mcp_playwright-mc_browser_snapshot` 返回 `"Target page, context or browser has been closed"`：

```
1. 使用 mcp_io_github_ver_browser_eval action:"navigate" 導航到目標 URL
2. 使用 mcp_io_github_ver_browser_eval action:"evaluate" 執行 JavaScript
3. 使用 mcp_io_github_ver_browser_eval action:"screenshot" 截圖
4. 使用 mcp_io_github_ver_browser_eval action:"fill_form" 填表（需 name 和 type）
```

### evaluate 限制（重要）

```
❌ 不可序列化的 evaluate（會失敗）：
- 包含 new Event()、new PointerEvent() 的表達式
- 包含 for loop 的表達式
- 包含 Array.from() + map 的複雜鏈

✅ 可序列化的 evaluate（單一表達式）：
- document.querySelector('...').getAttribute('href')
- document.querySelectorAll('button')[3].textContent
- localStorage.getItem('key')
- el.click()（單一 DOM 操作）
```

---

## 缺口偵測檢查清單（UI Gap Detective）

執行每個頁面時，逐一確認：

| 項目 | 檢查方式 | 缺口徵兆 |
|------|---------|---------|
| 主要 CTA 明顯可見 | 截圖 + 視覺判斷 | 無「新增/建立」按鈕 |
| CTA 是否 enabled | snapshot `disabled` 屬性 | 按鈕存在但 disabled，缺少說明 |
| 空狀態有引導 | snapshot empty state | 畫面空白無任何指引 |
| 表單有 validation feedback | 故意送空表單 | 無錯誤提示 |
| 成功操作有反饋 | 執行 CRUD 後 snapshot | 無 toast / 無列表更新 |
| 如何「離開」此頁有出口 | 找 back/breadcrumb | 頁面死胡同（dead end） |
| 載入中有 skeleton/spinner | 慢速觀察 | 白屏 loading |
| Console 無錯誤 | console_messages | 紅字錯誤 |

---

## 測試報告格式（Evidence Block）

每次測試結束輸出以下格式：

```markdown
## 測試結果：<頁面/功能名稱>

**URL**: /target-path  
**狀態**: ✅ 通過 / ❌ 失敗 / ⚠️ 部分通過

### 操作記錄
1. [截圖 ss_N.png] 描述操作
2. [快照] 確認 ref 位置
3. 填入欄位 → 提交
4. 驗證結果

### 發現的缺口
- ❌ <缺口描述>：<影響說明>（建議修復優先級：高/中/低）

### Console 錯誤
- 無 / <錯誤列表>

### 建議修復
- [ ] <修復建議>
```

---

## 搭配工具調用時機

### 需要查 shadcn 元件

```
1. mcp_shadcn_list_items_in_registries → 確認元件名稱
2. mcp_shadcn_view_items_in_registries → 取得使用示例
3. 如有疑義，mcp_context7_resolve-library-id "shadcn/ui" → get-library-docs
```

### 需要查 Playwright API

```
1. mcp_context7_resolve-library-id "playwright"
2. mcp_context7_get-library-docs id=<resolved> topic="browser actions"
```

### 需要找 Server Action

```
1. mcp_io_github_ver_nextjs_call port:3000 toolName:"get_server_action_by_id"
2. 或 mcp_oraios_serena_find_symbol name_path_pattern="*Action*" include_body=true
```

### 需要找元件源碼

```
1. mcp_oraios_serena_find_symbol name_path_pattern="ArticleDialog" include_body=false
2. 確認 props 後 include_body=true 讀取細節
```

### 需要寫測試報告

```
1. 截圖後用 mcp_markitdown_convert_to_markdown 轉換
2. 整合到 scratchpad/<task>-test-report-YYYY-MM-DD.md
```

---

## 反模式（Anti-Patterns）

```
❌ 不驗證就假設功能可用
❌ 先 fill 再找 ref（應先 snapshot 找 ref）
❌ 全頁重載導航（破壞 React 狀態）
❌ 只截圖不檢查 Console 錯誤
❌ 對複雜表達式使用 evaluate（應拆分）
❌ 跳過 wait_for 直接 snapshot（競態條件）
❌ 無 workspaceId 就嘗試建立資源（必定 disabled）
```

---

## Xuanwu App 關鍵 localStorage 對照

| Key | 說明 |
|-----|------|
| `xuanwu_dev_demo_session_v1` | Dev demo 用戶 session（`{id, name, email}`） |
| `xuanwu_last_active_account` | 當前活躍帳號 ID（Personal: `dev-demo-user`，Org: Firebase ID） |

---

## 技能觸發標籤

Tags: #use skill playwright-mcp-testing
#use skill context7
#use skill next-devtools-mcp
#use skill shadcn
#use skill serena-mcp
