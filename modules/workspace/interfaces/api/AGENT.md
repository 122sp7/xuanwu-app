# API Interface Agent Guide

## 目標
`api/` 是 **HTTP / Next.js App Router 驅動層**，負責將外部請求（REST / HTTP）轉換為 **Input Port 呼叫**。

## 能放的內容
- Route Handlers / API Endpoint（Next.js App Router / API Route）
- HTTP Request → DTO 轉換
- 驗證請求（Request validation）
- 呼叫 Application Input Ports（Use Case）
- 將結果轉換為 HTTP Response / JSON
- HTTP Error Handling（非業務邏輯錯誤）

## 不能放的內容
- 核心業務邏輯（Domain / Application 流程）
- 直接呼叫 Repository / Database / Genkit
- UI 元件、React hooks
- State 管理或 UI 格式化（純 API 層不處理）

## 依賴原則