# Platform Module

> **account / organization 子域已遷入 `src/modules/iam/`**。在 `src/modules/platform/` 中**不得**重建這些子域。

## 子域清單

| 子域 | 狀態 | 說明 |
|---|---|---|
| `background-job` | ✅ 完成 | 背景工作排程（BackgroundJob / JobDocument / JobChunk）|
| `cache` | ✅ 完成 | 鍵值快取、TTL 設定 |
| `file-storage` | ✅ 完成 | 上傳、下載、檔案生命週期 |
| `notification` | ✅ 完成 | 通知發送 |
| `platform-config` | ✅ 完成 | 平台設定 |
| `search` | ✅ 完成 | 跨域搜尋 |

**已遷移（不在 platform）：**

| 子域 | 遷移目標 |
|---|---|
| `account` | `src/modules/iam/subdomains/account/` |
| `organization` | `src/modules/iam/subdomains/organization/` |

---

## 目錄結構

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
    notification/
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

Platform 是 T1 operational support，依賴方向固定：

```
iam     → platform
billing → platform (entitlement governance)
platform → workspace
(platform 也被 notion, notebooklm 以 Service API 形式消費)
```

Platform 不可依賴下游模組（workspace、notion、notebooklm、analytics）。

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
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
