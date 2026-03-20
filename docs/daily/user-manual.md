---
title: Daily user manual
description: User manual for Workspace Daily and Organization Daily, explaining current availability and the target usage model.
---

# Daily 功能使用手冊

> **文件版本**：v1.0.0
> **最後更新**：2026-03-20
> **目標讀者**：工作區擁有者、組織管理員、組織成員

---

## 先看目前可用與規劃中

Daily 目前處於 **基線已上線、完整產品待擴充** 的狀態。

| 能力 | 目前狀態 | 說明 |
| --- | --- | --- |
| Workspace Daily authored feed | 已可用 | 在工作區分頁查看與發布 canonical Daily 條目 |
| Organization Daily 聚合所有 Workspace Daily feed | 已可用 | 在組織頁面查看所有名下 workspace 的 canonical Daily feed |
| Digest baseline 相容對照 | 已可用 | 保留既有通知摘要，供遷移期間對照使用 |
| Workspace 主動發布 Daily 內容 | 已可用（最小切片） | 目前可發布 `update / blocker / ask / milestone / signal / story / highlight` 條目 |
| Story / Highlight / Reaction / Bookmark | 規劃中 | 文件已定義方向，功能尚未上線 |
| Daily 升格為 task / knowledge / schedule | 規劃中 | 文件已定義流程，功能尚未上線 |

因此，本手冊會同時說明：

1. **現在怎麼用**
2. **未來完整 Daily 會怎麼用**

---

## 1. Daily 是什麼

### 1.1 Workspace Daily

Workspace Daily 像是每個工作區的 Instagram 個人帳號，但面向是工作協作：

- 呈現這個工作區今天最重要的更新
- 讓其他人快速知道進度、風險、需求與成果
- 把「今天值得被看見的內容」集中成一個 feed

### 1.2 Organization Daily

Organization Daily 是組織層級的 Daily 聚合頁：

- 顯示組織名下所有 Workspace Daily
- 幫助組織快速看見哪個 workspace 正在推進、卡住、需要協助
- 後續會成為跨 workspace 協調與經營的主要入口

一句話記住：

> **Workspace Daily 看單點；Organization Daily 看全局。**

---

## 2. 目前怎麼使用 Workspace Daily

### 進入方式

1. 登入後切換到目標工作區
2. 進入工作區詳細頁面
3. 點擊 **「Daily」** 分頁

### 目前畫面會看到什麼

Workspace Daily 現在提供的是**canonical Daily feed + digest 對照**：

- **Canonical entries**：今天已發布的 Daily 條目
- **Composer**：可直接發布更新、阻塞、協作需求等條目
- **Digest unread**：既有通知摘要中尚未讀取的項目數
- **Digest baseline**：保留通知清單供遷移期間對照

### 適合理解為什麼

目前這個頁面適合回答：

- 今天這個 workspace 有沒有新動態？
- 有哪些通知還沒處理？
- 最新訊號大概是什麼？

它目前已經支援**最小發佈型 feed**，但仍**不是完整 Daily 產品**，所以尚不提供互動、收藏、升格與完整排序能力。

---

## 3. 目前怎麼使用 Organization Daily

### 進入方式

1. 登入後切換到組織帳戶
2. 從側邊欄進入 **「每日」**
3. 開啟 `/organization/daily`

### 目前畫面會看到什麼

Organization Daily 目前顯示：

- 組織層級 canonical Daily feed
- 每條 feed 的標題、類型、來源 workspace、發布時間
- freshness-only 的排序原因
- 既有 digest baseline 對照區塊

### 目前適合拿來做什麼

- 快速查看今天組織範圍內是否有值得注意的事件
- 看到來自所有名下 workspace 的當日摘要
- 作為 schedule、task、knowledge 後續協作的起點

### 目前還做不到什麼

- 依 workspace 分組篩選
- 按風險 / 緊急程度排序
- 針對某條 Daily 做 acknowledgement / 收藏 / 推進
- 把 Daily 一鍵升格成 task 或 knowledge

---

## 4. 未來完整 Daily 的使用方式

### 4.1 Workspace 擁有者：像經營帳號一樣經營 Daily

目前 Workspace Daily 已支援最小可用的主動發布條目，後續完整版本會再補齊 ranking / interaction / promotion。建議日常操作如下：

1. 早上發布今日目標或重點進度
2. 遇到阻塞時發布 `blocker` 或 `ask`
3. 達成成果時發布 `milestone`
4. 將可重複利用的內容升格為 knowledge 或 highlight

建議把 Daily 當成「工作區的今日門面」，而不是臨時聊天區。

### 4.2 組織管理員：把 Organization Daily 當成跨 Workspace 經營台

未來 Organization Daily 的典型使用方式：

1. 先看最上方高優先條目
2. 找出哪個 workspace 需要支援
3. 對高風險 / 高影響條目做 acknowledgement 或轉派
4. 將重要 Daily 升格成 task、schedule、knowledge 或 audit follow-up

這裡的目標不是把所有內容看完，而是看見**現在最值得處理的事情**。

---

## 5. 從 Instagram 借來的使用觀念

Daily 的設計有參考 Instagram，但用途不同。

| Instagram 觀念 | 在 Daily 的意思 |
| --- | --- |
| 個人帳號 | 單一 Workspace 的持續敘事面 |
| Feed | 今天最值得看見的內容流 |
| Story | 24 小時有效的短期提醒或訊號 |
| Highlight | 值得長期保留的重要 Daily 條目 |
| Interaction | 已讀、確認、收藏、回應等可追蹤行為 |

### 重要差異

Instagram 追求停留時間；Daily 追求的是：

- 更快理解狀態
- 更快發現風險
- 更快找到協作機會
- 更快把短期訊號轉成可執行事項

---

## 6. 建議使用習慣

### Workspace 端

- 每天至少更新一次工作區關鍵狀態
- 阻塞不要只說「卡住」，要描述需要什麼支援
- 里程碑完成時補上成果與下一步
- 值得長期保存的內容不要只留在 Daily

### Organization 端

- 每天固定查看一次 Organization Daily
- 先處理 blocker / ask 類型內容
- 留意哪些 workspace 太久沒有更新
- 對值得追蹤的條目做後續轉派或升格

---

## 7. 常見問題

### Q：Organization Daily 和 Workspace Daily 的差別是什麼？

**A**：Workspace Daily 是單一工作區的今日 feed；Organization Daily 是所有名下 workspace 的聚合視圖。

### Q：現在可以像發 Instagram 一樣發布 Daily 嗎？

**A**：可以，但目前是最小切片。你已經可以在 Workspace Daily 發布 canonical Daily 條目；尚未完成的是 reaction、bookmark、acknowledgement、promotion 與完整 ranking。

### Q：Organization Daily 會顯示其他組織的內容嗎？

**A**：不會。Organization Daily 只應聚合同一組織名下的 workspace Daily。

### Q：Daily 會取代 wiki 或 knowledge 嗎？

**A**：不會。Daily 處理的是今天的可見性；wiki / knowledge 處理的是長期沉澱。值得長期保留的 Daily 應該被升格，而不是永久停留在 feed 中。

### Q：為什麼要參考 Instagram？

**A**：不是為了做社群產品，而是因為 Instagram 很擅長把「身份、內容、互動、排序」組合成高可見性的 feed。Daily 需要抽取這些價值，轉用在工作協作與組織經營上。

---

## 8. 相關頁面與文件

| 資源 | 路徑 | 用途 |
| --- | --- | --- |
| Organization Daily 頁面 | `/organization/daily` | 查看所有名下 workspace 的 canonical Daily feed 與 digest 對照 |
| Workspace Daily 分頁 | `/workspace/{id}` → Daily | 查看並發布單一 workspace 的 Daily 條目 |
| 架構規範 | `docs/architecture/daily.md` | 理解設計與 Instagram 價值抽取 |
| 開發契約 | `docs/reference/development-contracts/daily-contract.md` | 理解資料與邊界契約 |
| 開發指南 | `docs/daily/development-guide.md` | 未來實作時使用 |
