# Bounded Context — platform

本文件定義 `platform` 這份本地藍圖的邊界。它的目的是把平台層的共享治理能力描述清楚，避免把主體、權限、配置、訂閱、整合、工作流、通知、稽核與可觀測性揉成一團。

## Context Purpose

platform blueprint 關心的是平台基礎能力如何以 hexagonal architecture 運作，而不是任何單一產品功能如何呈現。它負責回答的核心問題是：

- 誰可以做什麼
- 能力何時可用或不可用
- 事件如何流向外部世界
- 重要決策與 side effects 如何被追蹤與觀測

## 這個邊界包含什麼

platform 內部包含以下類型的責任：

- 主體邊界：identity、account、organization
- 治理決策：permission、config、subscription
- 執行協調：workflow、integration、notification
- 記錄與診斷：audit、observability

這些能力都以 ports and adapters 為基本切分原則。

## 這個邊界刻意不包含什麼

以下問題不應被 platform 直接擁有：

- 產品內容本身的建立、編排與發布
- 檢索排序、知識推理或內容相關性決策
- 文件攝入、轉換、切片等內容處理流程
- adapter-specific 的 UI 呈現與前端狀態管理

也就是說，platform 不是產品特色本身，而是讓產品特色能以一致規則運作的基礎層。

## 邊界內部的六邊形分工

### Domain

- 聚合、值物件、領域服務與事件語言
- 不依賴資料庫、HTTP、message bus、scheduler、telemetry SDK

### Application

- use case handlers / request processors
- 協調 aggregates、repositories 與 event publisher ports

### Ports

- `input ports`：描述進入平台的請求語言
- `output ports`：描述離開平台的依賴語言

### Adapters

- `driving adapters`：API、CLI、scheduler、queue consumer、webhook receiver
- `driven adapters`：database repository、event publisher、HTTP client、notification sender、metrics exporter

### Subdomains

- 子域用來切分語言與責任焦點，不用來繞過 ports/adapters

## 邊界規則

- 子域之間共享的是穩定語言與事件，不是彼此的 adapter 實作
- application 只能透過 output ports 對外互動
- domain event 的 schema 由 domain 擁有，transport format 由 adapter 負責
- capability enablement 必須同時受 policy 與 subscription 約束

## 本地結構規則

這份藍圖預期 platform 以 `domain/`, `application/`, `ports/`, `adapters/`, `subdomains/`, `docs/` 六個主要結構面成長。若未來實作改動此結構，必須同步更新本文件與 `README.md`。

## 邊界測試問題

若一段新設計無法清楚回答以下任一問題，表示邊界仍不夠清楚：

1. 它是平台規則、應用協調，還是 adapter 細節？
2. 它屬於哪個平台子域？
3. 它是否需要新 port，還是既有 port 的新實作？
4. 它會改變 published language 嗎？
