# Wiki-Beta 使用手冊

## 1. 適用對象

- 產品使用者
- 內部測試與運維人員

## 2. 快速開始

### 2.1 進入 Wiki-Beta

- 從左側 App Rail 點選 Wiki Beta
- 進入 Documents、RAG Query、RAG Reindex 任一頁面

### 2.2 上傳文件

在 Documents 頁面：

1. 將檔案拖入 Upload 區塊，或點擊選檔
2. 確認檔案格式為 pdf/tiff/png/jpeg
3. 點選 上傳並啟動解析
4. 等待背景流程完成

### 2.3 查看文件

- Documents 頁預設顯示目前 account 的所有 workspace 文件
- 若要看特定工作區，可帶 workspaceId 參數進入

### 2.4 觸發重整

在 Documents 或 RAG Reindex 頁面：

1. 找到目標文件
2. 點選 手動重整
3. 等待狀態更新

### 2.5 查詢 RAG

在 RAG Query 頁面：

1. 輸入問題
2. 設定 top_k（可留預設）
3. 送出查詢
4. 查看 Answer 與 Citations

## 3. 與 /dev-tools 對齊能力

Wiki-Beta 已對齊能力：

- 拖曳上傳
- account 全覽 documents
- workspace 篩選 documents
- RAG 重整
- 狀態與摘要顯示

可能與 /dev-tools 不同之處：

- /dev-tools 偏工程診斷視角
- /wiki-beta 偏產品操作視角

## 4. 常見問題

### Q1 為什麼看不到剛上傳的文件？

- 確認目前 account 是否正確
- 確認文件仍在 processing
- 若使用 workspace 篩選，先清除篩選改看全覽

### Q2 為什麼無法上傳？

- 檢查檔案格式
- 檢查是否有 active account
- 檢查 Storage 權限與網路狀態

### Q3 為什麼 RAG Query 沒有引用？

- 文件可能尚未完成 embedding
- 問題語意與現有文件不匹配
- 可先對文件做手動重整再查詢

## 5. 操作建議

- 日常先在 Documents 觀察 parse/rag 狀態
- 重要文件先重整再進行查詢
- 若要做跨工作區檢查，使用 account 全覽模式

## 6. 權限與資料範圍

- 所有資料以 account 範圍管理
- workspace 是同帳號下的視角，不是跨帳號資料來源
- Namespace 屬背景能力，不提供獨立 UI 入口
