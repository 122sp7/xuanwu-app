# organization — platform subdomain

`organization` 是 platform blueprint 中負責群組邊界與角色指派語言的子域。它把上游的組織或團隊事實整理成 `MembershipBoundary` 與 `RoleAssignment`，供授權、工作流與稽核判斷使用。

## 核心責任

- 維持 `MembershipBoundary` 的邊界語言
- 維持 `RoleAssignment` 的角色指派語意
- 把組織事實轉成平台可消費的治理輸入

## 主要語言

- `MembershipBoundary`
- `RoleAssignment`
- `SubjectScope`

## Port 焦點

- `PlatformEventIngressPort`
- `SubjectDirectory`

## 與其他子域關係

- 下游主要服務 `permission`、`workflow`、`audit`
- 它與 `account` 一起構成主體邊界語言，但不處理帳戶偏好

## 不擁有的責任

- 不直接產出 `PermissionDecision`
- 不定義 `SubjectPreference`
- 不處理方案權益或通知交付
