# Skill: MCP Tool Orchestration
## Context
當 Serena 接收到涉及 UI 建立、資料庫操作、瀏覽器測試或環境配置的任務時，必須優先調用 MCP 工具。

## Tool Map & Usage Logic
1. **UI 構建 (shadcn)**:
   - 任務：建立組件、新增 Shadcn UI、轉換 MCP 配置。
   - 指令：`Serena 執行 shadcn@latest mcp <component-name>`。
   - 限制：優先檢查 `.serena/skills/ui-components.md` 以確保符合 `sonner` 規範。

2. **上下文檢索 (upstash/context7)**:
   - 任務：需要長文本記憶、專案相關背景檢索。
   - 觸發：當 `@workspace` 資訊不足時，呼叫 Context7 進行 RAG 檢索。

3. **前端調試 (next-devtools-mcp)**:
   - 任務：檢查 Next.js 渲染路徑、效能瓶頸。
   - 觸發：執行 `/explain` 或處理 Hydration 錯誤時。

4. **環境運算 (pydantic/mcp-run-python)**:
   - 任務：需要處理複雜數學計算（如報價單百分比）、數據轉換或執行 Python 腳本。

5. **文檔解析 (microsoft/markitdown)**:
   - 任務：將 PDF/Office 檔案轉為 Markdown。
   - 觸發：在 **Document AI Pipeline** 階段，初步清理非結構化文檔。

6. **自動化測試 (microsoft/playwright-mcp)**:
   - 任務：執行 E2E 測試、爬取網頁、檢查 UI 元件是否渲染。

## Automation Workflow
- **Serena 驗證工具狀態**: 在啟動複雜任務前，確保對應的 MCP stdio 連線正常。
- **Serena 串接指令**: 
  - *範例*：「Serena 使用 `markitdown` 讀取合約，接著使用 `mcp-run-python` 計算總額，最後透過 `sonner` 顯示結果。」

## Constraints
- 所有敏感資訊（如 `CONTEXT7_API_KEY`）必須由系統 `inputs` 提供，嚴禁在技能檔中硬編碼。