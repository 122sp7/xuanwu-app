# Platform Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/platform/` 正在從 `modules/platform/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。
>
> **account / organization 子域已遷入 `modules/iam/`**。在 `src/modules/platform/` 中**不得**重建這些子域。

**蒸餾狀態：** ✅ 完成（platform 子域已蒸餾至 `src/modules/platform/`）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `background-job` | `modules/platform/subdomains/background-job/` | ✅ 已蒸餾 | 背景工作排程 |
| `cache` | 新增（快取管理）| ✅ 已蒸餾 | 鍵值快取、TTL 設定 |
| `file-storage` | 新增（檔案儲存服務）| ✅ 已蒸餾 | 上傳、下載、檔案生命週期 |
| `notification` | `modules/platform/subdomains/notification/` | ✅ 已蒸餾 | 通知發送 |
| `platform-config` | `modules/platform/subdomains/platform-config/` | ✅ 已蒸餾 | 平台設定 |
| `search` | `modules/platform/subdomains/search/` | ✅ 已蒸餾 | 跨域搜尋 |

**已遷移（不在 platform）：**

| 子域 | 遷移目標 |
|---|---|
| `account` | `modules/iam/subdomains/account/` |
| `organization` | `modules/iam/subdomains/organization/` |

---

## 預期目錄結構（蒸餾後）

```
src/modules/platform/
  index.ts
  README.md
  AGENT.md
  orchestration/
    PlatformFacade.ts
  shared/
    domain/index.ts
    events/index.ts             ← Platform Published Language Events
    types/index.ts
  subdomains/
    notification/               ← 優先蒸餾
      domain/
      application/
      adapters/outbound/
    background-job/
      domain/                   ← BackgroundJob / JobDocument / JobChunk
      application/
      adapters/outbound/
    cache/
    file-storage/
    platform-config/
    search/
```

---

## 依賴方向

Platform 是治理上游，方向固定：

```
platform → workspace → notion → notebooklm
platform → notion
platform → notebooklm
```

Platform 不可依賴下游模組。

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 在 `src/modules/platform/` 重建 account / org 子域 | 已遷入 iam |
| 使用 `Ingestion*` 命名 | 已語意化為 BackgroundJob / JobDocument / JobChunk |
| platform 依賴 workspace / notion / notebooklm | 違反上游依賴方向 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/platform/](../../../modules/platform/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
