# config — platform subdomain

`config` 是 platform blueprint 中負責配置輪廓與能力開關的子域。它讓平台可以在不改寫核心政策的前提下，透過 `ConfigurationProfile` 與 `CapabilityToggle` 控制能力如何被啟用與組裝。

## 核心責任

- 維持 `ConfigurationProfile` 的配置語言
- 維持 `ConfigurationProfileRef` 與 `CapabilityToggle` 的套用邏輯
- 提供被 `permission`、`workflow`、`integration` 等子域讀取的設定視圖

## 主要語言

- `ConfigurationProfile`
- `ConfigurationProfileRef`
- `CapabilityToggle`

## Port 焦點

- `PlatformCommandPort`
- `ConfigurationProfileStore`

## 與其他子域關係

- 上游主要受 `subscription` 約束
- 下游主要服務 `permission`、`workflow`、`integration`、`notification`、`observability`

## 不擁有的責任

- 不定義方案權益真相
- 不直接執行外部交付
- 不直接產出授權決策
