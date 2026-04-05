# Context Map — notification

## 上游（依賴）

### 所有業務 BC → notification（Published Language）

`notification` 訂閱各 BC 的業務事件，轉換為使用者通知。不直接依賴任何 BC 的 api。

---

## 下游（被依賴）

`notification` 不被其他 BC 依賴（通知是終端輸出，無下游）。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → notification | workspace | notification | Published Language (Events) |
| workspace-flow → notification | workspace-flow | notification | Published Language (Events) |
| 其他 BC → notification | 各 BC | notification | Published Language (Events) |
