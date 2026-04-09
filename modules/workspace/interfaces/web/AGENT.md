# Web Interface Agent Guide

## 目標
`web/` 是 **UI 封裝層**，將前端 UI 元件與 Application Input Port 連接，支援 React / shadcn 組件。

## 能放的內容
- shadcn UI Components 封裝
- React Hooks 封裝（呼叫 Input Ports，管理 loading / error state）
- UI 狀態管理（非業務邏輯）
- Input Port 呼叫的簡單資料格式化（例如日期 / string → DTO）

## 不能放的內容
- 核心業務邏輯（Domain / Application）
- Repository / Database / Genkit 呼叫
- HTTP Route Handler（應該在 api/）
- CLI 命令解析（應該在 cli/）

## 依賴原則