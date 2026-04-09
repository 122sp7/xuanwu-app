# Bounded Context — platform

本文件定義 `platform` 這份本地藍圖的邊界。platform 的任務是把平台級的主體、治理、商業限制、交付與診斷能力收斂成一套清楚的六邊形邊界，而不是讓這些能力散落成日後才補名的共享雜物間。

## Context Purpose

platform 這個 bounded context 負責回答五類問題：

- 誰是平台可治理的主體
- 主體在什麼條件下可以做什麼
- 哪些能力在當前方案、設定與安全政策下可用
- 平台如何把事實轉成流程、外部交付與通知
- 平台如何留下證據並暴露診斷訊號

## Canonical Capability Groups


### 主體與名錄

- `identity`
- `account`
- `account-profile`
- `organization`

### 治理與安全

- `access-control`
- `security-policy`
- `platform-config`
- `feature-flag`
- `onboarding`
- `compliance`

### 商業與權益

- `billing`
- `subscription`
- `referral`

### 流程與交付

- `integration`
- `workflow`
- `notification`
- `background-job`

### 內容與檢索

- `content`
- `search`

### 證據與診斷

- `audit-log`
- `observability`
- `analytics`
- `support`

## 邊界包含什麼

platform 包含：

- 可被 platform 主體語言描述的決策
- 可被 platform policy 語言描述的治理規則
- 可被 platform ports 表達的交付與持久化依賴
- 可被平台診斷與稽核需求追蹤的訊號

## 邊界刻意不包含什麼

- 產品內容本身的建立、編排與發布
- 檢索、推理、內容相關性或知識生成
- 任何 UI 呈現細節本身
- 以「暫時先開個資料夾」為名的未定義能力

## 六邊形分工

### Domain

- 聚合、值物件、domain services、domain events

### Application

- use case handlers、command/query orchestration、projection 組裝

### Ports

- input ports：命令、查詢、事件匯入入口
- output ports：repository、support store、gateway、sink

### Adapters / Infrastructure

- driving adapters：API、CLI、scheduler、webhook、consumer
- driven adapters：repository、event publisher、gateway、observability exporter

## Closed Inventory Boundary Rule

這個 bounded context 以 23 個子域作為封閉 inventory。任何新需求預設都應被視為既有子域的責任延伸，而不是新增第 24 個子域。只有在既有 23 個子域無法吸收時，才允許重新打開 inventory。

## 邊界測試問題

1. 這個變更屬於哪個既有子域
2. 它需要的是新語言、還是既有語言的細化
3. 它需要的是新 port、還是既有 port 的新 adapter
4. 它是否會破壞 closed inventory

若第 1 題答不出來，表示 platform 邊界尚未被正確理解。
