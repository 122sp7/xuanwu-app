# AGENT.md — platform/account

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

`account` 擁有 `AccountProfile` 與 `SubjectPreference` 的語言邊界，負責把主體事實整理成可被 permission、notification、audit 使用的治理視圖。

## 優先術語

- `AccountProfile`
- `SubjectPreference`
- `AuthenticatedSubject`

## 允許的修改

- 細化帳戶輪廓與偏好欄位語言
- 補充 `IdentitySignal` 到 `AccountProfile` 的映射規則
- 細化 `SubjectDirectory` 在此子域提供的查詢責任

## 禁止的修改

- 在此子域定義 `PermissionDecision`
- 在此子域定義 `MembershipBoundary`
- 在此子域直接發出 `NotificationDispatch`

## 同步更新規則

- 語言變更時，同步更新本 README 與 `modules/platform/ubiquitous-language.md`
- 若下游依賴或 port 焦點改變，同步更新 `modules/platform/subdomains.md` 與相關 root 文件
