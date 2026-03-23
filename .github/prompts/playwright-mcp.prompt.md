---
name: Playwright MCP Diagnostics
description: 使用 Playwright MCP 進行瀏覽器導覽、交互與診斷以確認問題及重現錯誤
agent: agent
tools:
 - playwright/*

argument-hint: 請描述你需要診斷的頁面或流程
---

此 prompt 讓 Copilot 使用 **Playwright MCP 伺服器** 控制瀏覽器以進行 *結構化交互、診斷與錯誤定位*。  
它支援導航頁面、檢查 DOM 或可訪問性樹、抓取控制台或網絡日誌、模擬用戶操作等。

## 🌐 初始化
在開始時執行：
```

use playwright init

```
初始化 Playwright MCP session 並建立與瀏覽器連線。

## 📍 頁面導航
導航至指定頁面：
```

use playwright navigate "請輸入目標 URL"

```
這讓 AI 控制瀏覽器打開指定網址。

## 🧩 檢查頁面結構與狀態
讀取可訪問性樹（Accessibility Tree）來分析頁面結構：
```

use playwright get_accessibility_tree

```
此工具可幫助確認重要元素是否存在與狀態是否正確。

## 🔍 控制台與網絡資訊
提取瀏覽器控制台日誌以診斷 Javascript 錯誤：
```

use playwright get_console_logs

```
讀取網絡請求以分析 API 呼叫或資源加載問題：
```

use playwright get_network_requests

```

## 🧪 元素查找與交互
模擬點擊指定元素：
```

use playwright click "text=元素識別文字"

```
向指定輸入欄位填入值：
```

use playwright fill_input "選擇器" with "測試值"

```
查找特定錯誤文字或狀態元素：
```

use playwright find_element "text=錯誤文字"

```

## 🛠️ 綜合診斷範例
例如，要重現登入失敗流程並檢查日誌：
```

use playwright navigate "[https://example.com/login](https://example.com/login)"
use playwright fill_input "#user" with "username"
use playwright fill_input "#pass" with "wrongpassword"
use playwright click "text=Login"
use playwright get_console_logs
use playwright find_element "text=Invalid credentials"
