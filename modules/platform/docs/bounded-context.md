# Bounded Context — platform

本文件定義 `platform` 這份本地藍圖的邊界。platform 的任務，是把平台級的主體治理、政策規則、能力啟用、外部交付、稽核與可觀測性收斂成一個 **Hexagonal + DDD** 邊界，而不是把這些能力散落成沒有語言與責任的共享雜物間。

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

- 可被 platform 通用語言描述的聚合、值物件、規則與事件
- 可被 application layer 協調的 use cases、commands、queries 與 read models
- 可被 ports 表達的輸入契約與外部依賴契約
- 可被稽核與可觀測性需求追蹤的 published language

## 邊界刻意不包含什麼

- 產品內容本身的建立、編排與發布策略
- 檢索、推理、內容相關性或知識生成演算法
- 任何 UI 呈現細節本身
- 直接綁定 HTTP、queue、webhook、SDK、資料庫的 adapter 細節
- 以「暫時先開個資料夾」為名的未定義能力

## Hexagonal Layer Mapping

| Layer / concept | platform 位置 | 說明 |
|---|---|---|
| Public boundary | `api/` | 對外公開的 cross-module boundary；只做投影與 re-export |
| Driving adapters | `adapters/` | CLI、web、external ingress 等輸入端轉譯 |
| Application | `application/` | use case orchestration、command/query handling |
| Domain | `domain/` | 聚合、值物件、domain services、domain events |
| Input ports | `ports/input/` | 進入 application 的穩定契約 |
| Output ports | `ports/output/` | repository、store、gateway、sink 等依賴契約 |
| Driven adapters | `infrastructure/` | 對 output ports 的具體技術實作 |

## Layer Responsibilities

### Domain

- 擁有聚合、值物件、domain services、domain events
- 維持不變數與 published language
- 不直接理解 repository implementation、HTTP、DB、queue 或 SDK

### Application

- 實作 use case handlers 與 input port 語言
- 協調 aggregates、domain services 與 output ports
- 在持久化成功後拉取並發布 domain events

### Ports

- input ports：命令、查詢、事件匯入入口
- output ports：repositories、support stores、gateways、sinks
- 由 core/application 擁有，不以 `api/` 為型別真實來源

### Adapters / Infrastructure

- driving adapters：把 HTTP、CLI、scheduler、webhook、queue ingress 翻譯成 input port 語言
- driven adapters：把 repository、event publishing、notification、telemetry、external delivery 實作成具體技術方案

## Public Boundary Rule

- `api/` 是 platform 對其他模組的正式 public boundary
- `index.ts` 只作 aggregate export convenience，不應被當成邊界設計來源
- `ports/` 的契約來源在 `application/` 與 `domain/`，不是 `api/`

## Closed Inventory Boundary Rule

這個 bounded context 以 23 個子域作為封閉 inventory。任何新需求預設都應被視為既有子域的責任延伸，而不是新增第 24 個子域。只有在既有 23 個子域無法吸收時，才允許重新打開 inventory。

## 計畫吸收模組

以下四個現有獨立模組的能力**計畫在未來重構中合并進 platform**，成為對應子域的正式實作。在合并完成前，這些模組作為各自子域的前身實作繼續運作，platform blueprint 定義語言與 port 契約的規範形式。

| 獨立模組 | 目標子域 | 現有核心概念 | 合并備注 |
|---|---|---|---|
| `modules/identity/` | `identity` | `Identity`, `uid`, `TokenRefreshSignal`, `IdentityRepository`, `TokenRefreshRepository` | 提供 `AuthenticatedSubject` 與 `IdentitySignal` 的前身語意 |
| `modules/account/` | `account` + `account-profile` | `Account`, `AccountPolicy`, `AccountProfile`, `AccountRepository`, `AccountQueryRepository`, `AccountPolicyRepository` | `account` 承接帳號聚合根；`account-profile` 承接可治理輪廓屬性 |
| `modules/organization/` | `organization` | `Organization`, `MemberReference`, `Team`, `PartnerInvite`, `OrganizationRepository`, `OrgPolicyRepository` | 提供 `MembershipBoundary` 與 `RoleAssignment` 的前身語意 |
| `modules/notification/` | `notification` | `NotificationEntity`, `NotificationRepository`，conformist 消費者 | 提供 `NotificationDispatch` 與 `NotificationRoute` 的前身語意 |

**合并優先序：** `identity` → `account` → `organization` → `notification`（按語意依賴順序）

**合并後規則：**
- 獨立模組應設為 deprecated，並把 `api/index.ts` 指向 `modules/platform/api`
- Platform blueprint 的語言定義優先；若有術語歧異，以本文件與 `ubiquitous-language.md` 為準

## 邊界測試問題

1. 這個變更屬於哪個既有子域
2. 它需要的是新語言、既有語言的細化，還是新的 port contract
3. 它是 domain rule、application orchestration、adapter concern，還是 public boundary projection
4. 它是否會破壞 closed inventory 或 dependency direction
5. 若涉及 identity / account / organization / notification，是否與計畫吸收方向一致

若第 1 題答不出來，表示 platform 邊界尚未被正確理解。
