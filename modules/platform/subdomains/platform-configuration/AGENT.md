# AGENT.md — platform/config

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

`config` 擁有 `ConfigurationProfile`、`ConfigurationProfileRef` 與 `CapabilityToggle` 的語言邊界，負責讓平台以可替換的配置方式運作，而不是把設定散落到各個 adapter。

## 優先術語

- `ConfigurationProfile`
- `ConfigurationProfileRef`
- `CapabilityToggle`

## 允許的修改

- 細化配置輪廓與能力開關的語言
- 細化配置套用與覆蓋規則
- 細化 `ConfigurationProfileStore` 的責任邊界

## 禁止的修改

- 在此子域定義 `Entitlement`
- 在此子域直接呼叫 `ExternalSystemGateway`
- 在此子域直接產出 `PermissionDecision`

## 同步更新規則

- 語言變更時，同步更新本 README 與 `modules/platform/ubiquitous-language.md`
- 若下游使用面改變，同步更新 `modules/platform/subdomains.md`、`modules/platform/application-services.md` 與 `modules/platform/repositories.md`
