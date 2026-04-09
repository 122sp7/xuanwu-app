# AGENT.md — platform/identity

> **強制開發規範**
> 本子域開發沿用 `modules/platform/AGENT.md` 的 Serena 與技能規範。
>
> ```
> serena
> #use skill serena-mcp
> #use skill alistair-cockburn
> #use skill context7
> ```
>
> 若工作觸及 driving adapters 或 web UI，再依 root AGENT 額外啟用 `shadcn` 與 `next-devtools-mcp`。

## 子域定位

`identity` 擁有 `AuthenticatedSubject` 與 `IdentitySignal` 的入口語言，負責把驗證完成、刷新、失效等事實轉成 platform 可消費的主體起始資料。

## 優先術語

- `AuthenticatedSubject`
- `IdentitySignal`
- `SubjectScope`

## 允許的修改

- 細化身份訊號的事實類型
- 細化主體進入平台時的最小可信欄位
- 細化事件匯入到 `SubjectDirectory` 的責任邊界

## 禁止的修改

- 在此子域定義 `AccountProfile`
- 在此子域定義 `PermissionDecision`
- 在此子域定義 `RoleAssignment`

## 同步更新規則

- 語言或事件類型變更時，同步更新本 README、`modules/platform/ubiquitous-language.md` 與 `modules/platform/domain-events.md`
- 若上下游關係改變，同步更新 `modules/platform/subdomains.md` 與 `modules/platform/context-map.md`
