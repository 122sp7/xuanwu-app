# access-control — platform subdomain

`access-control` 是 platform blueprint 中承載 `permission` 語言的子域資料夾。它把 `AccessPolicy`、主體資料與資源描述整合成 `PermissionDecision`，決定某個動作在當前條件下是否被允許。

## 核心責任

- 維持 `AccessPolicy` 的政策語言
- 維持 `PermissionDecision` 的決策語言
- 把 `SubjectScope`、`AccountProfile`、`MembershipBoundary` 與 `ResourceDescriptor` 收斂成可執行的授權判斷

## 主要語言

- `PermissionDecision`
- `AccessPolicy`
- `ResourceDescriptor`

## Port 焦點

- `PlatformCommandPort`
- `PolicyCatalogRepository`

## 與其他子域關係

- 上游主要依賴 `account`、`organization`、`config`、`subscription`
- 下游主要服務 `workflow`、`integration`、`audit`

## 不擁有的責任

- 不擁有主體真相來源
- 不擁有計費或方案狀態
- 不直接執行通知或外部交付
