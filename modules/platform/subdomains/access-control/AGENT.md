# AGENT.md — platform/access-control

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

`access-control` 這個資料夾目前承載 root 平台文件中 `permission` 子域的授權語言，擁有 `AccessPolicy`、`PermissionDecision` 與 `ResourceDescriptor` 的決策邊界。

## 優先術語

- `PermissionDecision`
- `AccessPolicy`
- `ResourceDescriptor`

## 允許的修改

- 細化授權判斷與政策語言
- 細化資源描述與主體上下文如何進入決策
- 細化 `PolicyCatalogRepository` 在此子域的依賴方式

## 禁止的修改

- 在此子域定義 `AuthenticatedSubject` 真相來源
- 在此子域定義 `BillingState`
- 在此子域直接派送通知或呼叫外部整合

## 同步更新規則

- 授權語言變更時，同步更新本 README、`modules/platform/ubiquitous-language.md` 與 `modules/platform/domain-services.md`
- 若子域名稱、責任或對外映射改變，同步更新 `modules/platform/subdomains.md` 與 `modules/platform/context-map.md`
