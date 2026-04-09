# CLI Interface Agent Guide

## 目標
`cli/` 是 **命令行驅動層**，將命令參數轉換為 **Input Port 呼叫**，供系統內部或 Cron Job 使用。

## 能放的內容
- CLI 命令解析（yargs / commander / Oclif）
- 參數轉成 DTO
- 呼叫 Application Input Ports（Use Case）
- 顯示命令結果（console.log / stdout）
- 簡單錯誤訊息處理（非業務邏輯）

## 不能放的內容
- Domain / Application 流程邏輯
- Repository / Database / Genkit 直接操作
- UI 元件或 React Hook
- 複雜的資料格式化或業務計算

## 依賴原則