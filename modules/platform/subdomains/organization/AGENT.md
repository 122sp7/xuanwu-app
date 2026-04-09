# AGENT.md — platform/organization

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

`organization` 擁有 `MembershipBoundary` 與 `RoleAssignment` 的語言邊界，負責把群組與角色事實轉成 platform 可以消費的治理輸入。

## 優先術語

- `MembershipBoundary`
- `RoleAssignment`
- `SubjectScope`

## 允許的修改

- 細化成員邊界與角色指派語言
- 細化從組織事實到平台邊界語言的映射規則
- 細化 `SubjectDirectory` 在群組語言上的責任

## 禁止的修改

- 在此子域定義 `PermissionDecision`
- 在此子域定義 `SubjectPreference`
- 在此子域定義 `Entitlement`

## 同步更新規則

- 語言變更時，同步更新本 README 與 `modules/platform/ubiquitous-language.md`
- 若上下游治理關係改變，同步更新 `modules/platform/context-map.md` 與 `modules/platform/subdomains.md`
